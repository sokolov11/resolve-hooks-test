import unfetch from 'unfetch'
import { Context } from './context'
import { isAbsoluteUrl } from './utils'
import { assertLeadingSlash } from './assertions'
import { GenericError, HttpError } from './errors'
import determineOrigin from './determine_origin'

type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>

let cachedFetch: FetchFunction | null = null

const determineFetch = (): FetchFunction => {
  if (!cachedFetch) {
    cachedFetch = typeof fetch === 'function' ? fetch : unfetch
  }
  return cachedFetch
}

const getRootBasedUrl = (rootPath: string, path: string, origin?: string): string => {
  if (isAbsoluteUrl(path)) {
    return path
  }

  assertLeadingSlash(path, 'Path')

  return `${origin ?? ''}${rootPath ? `/${rootPath}` : ''}${path}`
}

type RequestOptions = {
  retryOnError: {
    errors: number[] | number
    attempts: number
  }
}

const insistentRequest = async (
  input: RequestInfo,
  init: RequestInit,
  options?: RequestOptions,
  attempt = 0
): Promise<Response> => {
  let response

  try {
    response = await determineFetch()(input, init)
  } catch (error) {
    throw new GenericError(error)
  }

  if (response.ok) {
    return response
  }

  const expectedErrors = options?.retryOnError?.errors

  if (expectedErrors) {
    const isErrorExpected =
      typeof expectedErrors === 'number'
        ? expectedErrors === response.status
        : expectedErrors.includes(response.status)
    const isMaxAttemptsReached = attempt >= (options?.retryOnError?.attempts ?? 0)

    if (isErrorExpected && !isMaxAttemptsReached) {
      return insistentRequest(input, init, options, attempt + 1)
    }
  }

  throw new HttpError({
    code: response.status,
    message: await response.text()
  })
}

const request = async (
  context: Context,
  url: string,
  body: object,
  options?: RequestOptions
): Promise<Response> => {
  const { origin, rootPath, jwtProvider } = context
  const rootBasedUrl = getRootBasedUrl(rootPath, url, determineOrigin(origin))
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  }

  if (init.headers) {
    const token = await jwtProvider?.get()
    if (token) {
      init.headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await insistentRequest(rootBasedUrl, init, options)

  if (jwtProvider && response.headers) {
    await jwtProvider.set(response.headers.get('x-jwt') ?? '')
  }

  return response
}

export type Command = {
  type: string
  aggregateId: string
  aggregateName: string
  payload?: object
}
export type CommandResult = unknown
export type CommandOptions = RequestOptions

export const execCommand = async (
  context: Context,
  command: Command,
  options?: CommandOptions
): Promise<CommandResult> => {
  const response = await request(context, '/api/commands', command, options)

  try {
    return await response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

type ReadModelQuery = {
  readModelName: string
  resolverName: string
  resolverArgs: object
}
type ReadModelQueryResult = {
  timestamp: number
  data: string
}
type ReadModelQueryOptions = RequestOptions

export const queryReadModel = async (
  context: Context,
  readModelQuery: ReadModelQuery,
  options?: ReadModelQueryOptions
): Promise<ReadModelQueryResult> => {
  const { readModelName, resolverName, resolverArgs } = readModelQuery

  const response = await request(
    context,
    `/api/query/${readModelName}/${resolverName}`,
    resolverArgs,
    options
  )

  const responseDate = response.headers.get('Date')

  if (!responseDate) {
    throw new HttpError(`"Date" header missed within response`)
  }

  try {
    return {
      timestamp: Number(responseDate),
      data: await response.text()
    }
  } catch (error) {
    throw new HttpError(error)
  }
}

export type API = {
  execCommand: (command: Command, options?: CommandOptions) => Promise<CommandResult>
  queryReadModel: (query: ReadModelQuery, options?: ReadModelQueryOptions) => Promise<ReadModelQueryResult>
  bindViewModel: unknown
}

export const getApiForContext = (context: Context): API => ({
  execCommand: (command, options?): Promise<CommandResult> => execCommand(context, command, options),
  queryReadModel: (query, options): Promise<ReadModelQueryResult> => queryReadModel(context, query, options),
  bindViewModel: null
})
