import url from 'url'
import { Context } from './context'
import { GenericError } from './errors'
import { doSubscribe, getSubscriptionKeys, doUnsubscribe } from './subscribe'
import { Request, RequestOptions, request } from './request'
import { assertNonEmptyString } from './assertions'
import { getRootBasedUrl } from './utils'

function determineCallback<T>(options: any, callback: any, fallback: T): T {
  if (typeof options === 'function') {
    return options
  }
  if (typeof callback === 'function') {
    return callback
  }
  return fallback
}
function isOptions<T>(arg: any): arg is T {
  return arg && typeof arg !== 'function'
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

export const command = (
  context: Context,
  cmd: Command,
  options?: CommandOptions | CommandCallback,
  callback?: CommandCallback
): Request<CommandResult> => {
  const actualOptions = isOptions<CommandOptions>(options) ? options : undefined
  const actualCallback = determineCallback<CommandCallback>(options, callback, (): void => {
    /* do nothing */
  })

  const asyncExec = async (): Promise<CommandResult> => {
    const response = await request(context, '/api/commands', cmd, actualOptions)

    try {
      return await response.json()
    } catch (error) {
      throw new GenericError(error)
    }
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

type ViewModelQuery = {
  name: string
  aggregateIds: string[] | '*'
  args: any
}
type ReadModelQuery = {
  name: string
  resolver: string
  args: object
}
type Query = ViewModelQuery | ReadModelQuery
const isReadModelQuery = (arg: any): arg is ReadModelQuery => arg && arg.resolverName

type QueryResult = {
  timestamp: number
  data: any
}
type QueryOptions = RequestOptions
type QueryCallback = (error: Error | null, result: QueryResult | null) => void

export const query = (
  context: Context,
  qr: Query,
  options?: QueryOptions,
  callback?: QueryCallback
): Request<QueryResult> => {
  const actualOptions = isOptions<QueryOptions>(options) ? options : undefined
  const actualCallback = determineCallback<QueryCallback>(options, callback, (): void => {
    /* do nothing */
  })

  let queryRequest

  if (isReadModelQuery(qr)) {
    const { name, resolver, args } = qr
    queryRequest = request(context, `/api/query/${name}/${resolver}`, args, actualOptions)
  } else {
    const { name, aggregateIds, args } = qr
    const ids = aggregateIds === '*' ? aggregateIds : aggregateIds.join(',')
    queryRequest = request(
      context,
      `/api/query/${name}/${ids}`,
      {
        args
      },
      actualOptions
    )
  }

  const asyncExec = async (): Promise<QueryResult> => {
    const response = await queryRequest

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
    promise: (): Promise<QueryResult> => promise
  }
}

export const subscribeTo = (
  context: Context,
  viewModelName: string,
  aggregateIds: Array<string> | '*',
  callback?: Function
): Promise<any> => {
  const subscribe = async (): Promise<any> => {
    const subscriptionKeys = getSubscriptionKeys(context, viewModelName, aggregateIds)
    console.debug(subscriptionKeys)

    if (typeof callback !== 'function') {
      return
    }

    await Promise.all(
      subscriptionKeys.map(({ aggregateId, eventType }) =>
        doSubscribe(
          context,
          {
            topicName: eventType,
            topicId: aggregateId
          },
          callback
        )
      )
    )
  }

  return subscribe()
}

export const unsubscribeFrom = (
  context: Context,
  viewModelName: string,
  aggregateIds: Array<string> | '*',
  callback?: Function
): Promise<any> => {
  const unsubscribe = async (): Promise<any> => {
    const subscriptionKeys = getSubscriptionKeys(context, viewModelName, aggregateIds)
    console.debug(subscriptionKeys)

    if (typeof callback !== 'function') {
      return
    }

    await Promise.all(
      subscriptionKeys.map(({ aggregateId, eventType }) =>
        doUnsubscribe(
          context,
          {
            topicName: eventType,
            topicId: aggregateId
          },
          callback
        )
      )
    )
  }

  return unsubscribe()
}

const getStaticAssetUrl = ({ rootPath, staticPath }: Context, fileName: string): string => {
  assertNonEmptyString(fileName)

  return getRootBasedUrl(rootPath, url.resolve(`${staticPath}/`, `./${fileName}`))
}

export type API = {
  command: (command: Command, options?: CommandOptions, callback?: CommandCallback) => Request<CommandResult>
  query: (query: Query, options?: QueryOptions, callback?: QueryCallback) => Request<QueryResult>
  getStaticAssetUrl: (fileName: string) => string
  subscribeTo: (
    viewModelName: string,
    aggregateIds: Array<string> | '*',
    callback?: Function
  ) => Promise<void>
}

export const getApi = (context: Context): API => ({
  command: (cmd, options?, callback?): Request<CommandResult> => command(context, cmd, options, callback),
  query: (qr, options, callback?): Request<QueryResult> => query(context, qr, options, callback),
  getStaticAssetUrl: (fileName: string): string => getStaticAssetUrl(context, fileName),
  subscribeTo: (viewModelName, aggregateIds, callback?): Promise<void> =>
    subscribeTo(context, viewModelName, aggregateIds, callback)
})
