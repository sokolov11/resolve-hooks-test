import unfetch from 'unfetch'
import { Context } from './context'
import { isAbsoluteUrl } from './utils'
import { assertLeadingSlash } from './assertions'
import { GenericError, HttpError } from './errors'
import determineOrigin from './determine_origin'

// TODO: temp
import { useViewModel, Callbacks } from './use_view_model'

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
    period: number
  }
  debug: boolean
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
      if (options?.debug) {
        console.warn(
          `Error code ${response.status} was expected. Attempting again #${attempt + 1}/${
            options?.retryOnError?.attempts
          }.`
        )
      }

      const period = options?.retryOnError?.period

      if (typeof period === 'number' && period > 0) {
        await new Promise(resolve => setTimeout(resolve, period))
      }
      return insistentRequest(input, init, options, attempt + 1)
    }
  }

  const error = new HttpError(response.status, await response.text())

  if (options?.debug) {
    console.error(error)
  }

  throw error
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

export type Request<T> = {
  promise: () => Promise<T>
}
export type Command = {
  type: string
  aggregateId: string
  aggregateName: string
  payload?: object
}
export type CommandResult = object
export type CommandCallback = (error: Error | null, result: CommandResult | null) => void
export type CommandOptions = RequestOptions

export const execCommand = (
  context: Context,
  command: Command,
  options?: CommandOptions,
  callback?: CommandCallback
): Request<CommandResult> => {
  const asyncExec = async (): Promise<CommandResult> => {
    const response = await request(context, '/api/commands', command, options)

    try {
      return await response.json()
    } catch (error) {
      throw new GenericError(error)
    }
  }

  const actualCallback =
    typeof callback === 'function'
      ? callback
      : (): void => {
          /* do nothing */
        }

  const promise = asyncExec()
    .then(result => {
      actualCallback(null, result)
      return result
    })
    .catch(error => {
      actualCallback(error, null)
      throw error
    })

  return {
    promise: (): Promise<CommandResult> => promise
  }
}

type ReadModelQuery = {
  readModelName: string
  resolverName: string
  resolverArgs: object
}
type ReadModelQueryResult = {
  timestamp: number
  data: any
}
type ReadModelQueryOptions = RequestOptions
type ReadModelQueryCallback = (error: Error | null, result: ReadModelQueryResult | null) => void

export const queryReadModel = (
  context: Context,
  readModelQuery: ReadModelQuery,
  options?: ReadModelQueryOptions,
  callback?: ReadModelQueryCallback
): Request<ReadModelQueryResult> => {
  const { readModelName, resolverName, resolverArgs } = readModelQuery

  const asyncExec = async (): Promise<ReadModelQueryResult> => {
    const response = await request(
      context,
      `/api/query/${readModelName}/${resolverName}`,
      resolverArgs,
      options
    )

    const responseDate = response.headers.get('Date')

    if (!responseDate) {
      throw new GenericError(`"Date" header missed within response`)
    }

    try {
      return {
        timestamp: Number(responseDate),
        data: await response.json()
      }
    } catch (error) {
      throw new GenericError(error)
    }
  }

  const actualCallback =
    typeof callback === 'function'
      ? callback
      : (): void => {
          /* do nothing */
        }

  const promise = asyncExec()
    .then(result => {
      actualCallback(null, result)
      return result
    })
    .catch(error => {
      actualCallback(error, null)
      throw error
    })

  return {
    promise: (): Promise<ReadModelQueryResult> => promise
  }
}

// TODO: temp
type ViewModelQuery = {
  viewModelName: string
  aggregateIds: Array<string> | '*'
  aggregateArgs: object
}
// TODO: temp
type ViewModelQueryOptions = {}

export type API = {
  execCommand: (
    command: Command,
    options?: CommandOptions,
    callback?: CommandCallback
  ) => Request<CommandResult>
  queryReadModel: (
    query: ReadModelQuery,
    options?: ReadModelQueryOptions,
    callback?: ReadModelQueryCallback
  ) => Request<ReadModelQueryResult>
  bindViewModel: (query: ViewModelQuery, callbacks: Callbacks, options?: ViewModelQueryOptions) => void
}

export const getApiForContext = (context: Context): API => ({
  execCommand: (command, options?, callback?): Request<CommandResult> =>
    execCommand(context, command, options, callback),
  queryReadModel: (query, options, callback?): Request<ReadModelQueryResult> =>
    queryReadModel(context, query, options, callback),
  bindViewModel: (query, callbacks, options?) =>
    useViewModel(query.viewModelName, query.aggregateIds, query.aggregateArgs, callbacks)
})
