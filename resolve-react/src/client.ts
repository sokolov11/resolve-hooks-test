import unfetch from 'unfetch'
import { assertLeadingSlash } from './assertions'
import { isAbsoluteUrl } from './utils'
import { Context } from './context'
import { GenericError, HttpError } from './errors'
import determineOrigin from './determine_origin'

const temporaryErrorHttpCodes: number[] = [
  408, // Request Timeout
  429, // Too Many Requests
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  507, // Insufficient Storage
  509, // Bandwidth Limit Exceeded
  521, // Web Server Is Down
  522, // Connection Timed Out
  523, // Origin Is Unreachable
  524 // A Timeout Occurred
]

const getRootBasedUrl = (rootPath: string, path: string, origin?: string): string => {
  if (isAbsoluteUrl(path)) {
    return path
  }

  assertLeadingSlash(path, 'Path')

  return `${origin ?? ''}${rootPath ? `/${rootPath}` : ''}${path}`
}

const doFetch = async (rootBasedUrl: string, options: RequestInit): Promise<Response> => {
  try {
    return fetch(rootBasedUrl, options)
  } catch (err) {
    return unfetch(rootBasedUrl, options)
  }
}

const request = async (context: Context, url: string, body: object): Promise<Response> => {
  const { origin, rootPath, jwtProvider } = context
  const rootBasedUrl = getRootBasedUrl(rootPath, url, origin)
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  }

  if (options.headers) {
    const token = await jwtProvider?.get()
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }
  }

  let response: Response

  try {
    response = await doFetch(rootBasedUrl, options)
  } catch (error) {
    throw new GenericError(error)
  }

  if (temporaryErrorHttpCodes.includes(response.status)) {
    throw new GenericError({
      code: response.status,
      message: await response.text()
    })
  }

  if (!response.ok) {
    throw new HttpError({
      code: response.status,
      message: await response.text()
    })
  }

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

export const sendCommand = async (context: Context, command: Command): Promise<CommandResult> => {
  const response = await request(context, '/api/commands', command)

  try {
    return await response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

interface ViewModelQuery {
  viewModelName: string
  aggregateIds: '*' | string[]
  aggregateArgs: unknown
}

type ViewModelState = {
  timestamp: number
  result: string // TODO: rename
}

export const loadViewModelState = async (
  context: Context,
  viewModelQuery: ViewModelQuery
): Promise<ViewModelState> => {
  const { viewModelName, aggregateIds, aggregateArgs } = viewModelQuery
  const queryAggregateIds = aggregateIds === '*' ? aggregateIds : aggregateIds.join(',')

  const response = await request(context, `/api/query/${viewModelName}/${queryAggregateIds}`, {
    aggregateArgs
  })

  const responseDate = response.headers.get('Date')

  if (!responseDate) {
    throw new HttpError(`"Date" header missed within response`)
  }

  try {
    return {
      timestamp: Number(responseDate),
      result: await response.text()
    }
  } catch (error) {
    throw new HttpError(error)
  }
}

interface ReadModelQuery {
  readModelName: string
  resolverName: string
  resolverArgs: unknown
}

type ReadModelState = {
  timestamp: number
  result: string // TODO: rename
}

export const loadReadModelState = async (
  context: Context,
  readModelQuery: ReadModelQuery
): Promise<ReadModelState> => {
  const { readModelName, resolverName, resolverArgs } = readModelQuery

  const response = await request(
    context,
    `/api/query/${readModelName}/${resolverName}`,
    resolverArgs as object
  )

  const responseDate = response.headers.get('Date')

  if (!responseDate) {
    throw new HttpError(`"Date" header missed within response`)
  }

  try {
    return {
      timestamp: Number(responseDate),
      result: await response.text()
    }
  } catch (error) {
    throw new HttpError(error)
  }
}

export interface SubscribeAdapterOptions {
  appId: string
  url: string
}

export const getSubscribeAdapterOptions = async (
  context: Context,
  adapterName: string
): Promise<SubscribeAdapterOptions> => {
  const { rootPath, origin: customOrigin } = context
  const origin = determineOrigin(customOrigin)

  const response = await request(context, '/api/subscribe', {
    origin,
    rootPath,
    adapterName
  })

  try {
    return await response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

interface APIClient {
  sendCommand: (command: Command) => Promise<unknown>
  loadViewModelState: (viewModelQuery: ViewModelQuery) => Promise<ViewModelState>
  loadReadModelState: (readModelQuery: ReadModelQuery) => Promise<ReadModelState>
  getSubscribeAdapterOptions: (adapterName: string) => Promise<object>
}

export const getApiForContext = (context: Context): APIClient => ({
  sendCommand: (command: Command): Promise<unknown> => sendCommand(context, command),
  loadViewModelState: (viewModelQuery: ViewModelQuery): Promise<ViewModelState> =>
    loadViewModelState(context, viewModelQuery),
  loadReadModelState: (readModelQuery: ReadModelQuery): Promise<ReadModelState> =>
    loadReadModelState(context, readModelQuery),
  getSubscribeAdapterOptions: (adapterName: string): Promise<object> =>
    getSubscribeAdapterOptions(context, adapterName)
})
