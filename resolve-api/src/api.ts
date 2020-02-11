import { Context } from './context'
import { GenericError } from './errors'
import { doSubscribe, getSubscriptionKeys, doUnsubscribe } from './subscribe'
import { Request, RequestOptions, request } from './request'

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
}

export const getApiForContext = (context: Context): API => ({
  execCommand: (command, options?, callback?): Request<CommandResult> =>
    execCommand(context, command, options, callback),
  queryReadModel: (query, options, callback?): Request<ReadModelQueryResult> =>
    queryReadModel(context, query, options, callback)
})
