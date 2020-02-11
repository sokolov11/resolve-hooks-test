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

export type Command = {
  type: string
  aggregateId: string
  aggregateName: string
  payload?: object
}
export type CommandResult = object
export type CommandCallback = (error: Error | null, result: CommandResult | null) => void
export type CommandOptions = RequestOptions
const isCommandOptions = (arg: any): arg is CommandOptions => arg && typeof arg !== 'function'

export const command = (
  context: Context,
  cmd: Command,
  options?: CommandOptions | CommandCallback,
  callback?: CommandCallback
): Request<CommandResult> => {
  const actualOptions = isCommandOptions(options) ? options : undefined
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

export const query = (
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
  query: (
    query: ReadModelQuery,
    options?: ReadModelQueryOptions,
    callback?: ReadModelQueryCallback
  ) => Request<ReadModelQueryResult>
  getStaticAssetUrl: (fileName: string) => string
}

export const getApi = (context: Context): API => ({
  command: (cmd, options?, callback?): Request<CommandResult> => command(context, cmd, options, callback),
  query: (qr, options, callback?): Request<ReadModelQueryResult> => query(context, qr, options, callback),
  getStaticAssetUrl: (fileName: string): string => getStaticAssetUrl(context, fileName)
})
