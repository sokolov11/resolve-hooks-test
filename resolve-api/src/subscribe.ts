import createConnectionManager from './create_connection_manager'
import createEmptySubscribeAdapter from './empty_subscribe_adapter'
// import { getSubscribeAdapterOptions } from './client'
import { Context } from './context'
import { rootCallback, addCallback, removeCallback } from './view_model_subscribe_callback'
import determineOrigin from './determine_origin'
import { GenericError } from './errors'
import { request } from './request'

interface SubscriptionKey {
  aggregateId: string
  eventType: string
}

export const getSubscriptionKeys = (
  context: Context,
  viewModelName: string,
  aggregateIds: Array<string> | '*'
): Array<SubscriptionKey> => {
  const { viewModels } = context
  const viewModel = viewModels.find(({ name }) => name === viewModelName)
  if (!viewModel) {
    return []
  }
  const eventTypes = Object.keys(viewModel.projection).filter(eventType => eventType !== 'Init')
  return eventTypes.reduce((acc: Array<SubscriptionKey>, eventType) => {
    if (Array.isArray(aggregateIds)) {
      acc.push(...aggregateIds.map(aggregateId => ({ aggregateId, eventType })))
    } else if (aggregateIds === '*') {
      acc.push({ aggregateId: '*', eventType })
    }
    return acc
  }, [])
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
    throw new GenericError(error)
  }
}

const initSubscribeAdapter = async (context: Context): Promise<any> => {
  const { subscribeAdapter: createSubscribeAdapter } = context
  if (createSubscribeAdapter === createEmptySubscribeAdapter) {
    return createEmptySubscribeAdapter()
  }
  if (!createSubscribeAdapter) {
    return Promise.resolve()
  }
  const { appId, url } = await getSubscribeAdapterOptions(context, createSubscribeAdapter.adapterName)
  const { origin: customOrigin, rootPath } = context

  const origin = determineOrigin(customOrigin)

  const subscribeAdapter = createSubscribeAdapter({
    appId,
    origin,
    rootPath,
    url,
    onEvent: rootCallback
  })
  await subscribeAdapter.init()

  return subscribeAdapter
}

let subscribeAdapterPromise: Promise<any> | null = null

const getSubscribeAdapterPromise = (context: Context): Promise<any> => {
  if (subscribeAdapterPromise !== null) {
    return subscribeAdapterPromise
  }
  subscribeAdapterPromise = initSubscribeAdapter(context)
  return subscribeAdapterPromise
}

export const dropSubscribeAdapterPromise = (): void => {
  subscribeAdapterPromise = null
  const connectionManager = createConnectionManager()
  connectionManager.destroy()
}

const doSubscribe = async (context: Context, { topicName, topicId }, callback: Function): Promise<object> => {
  const connectionManager = createConnectionManager()
  const subscribeAdapter = await getSubscribeAdapterPromise(context)
  if (subscribeAdapter === null) {
    return Promise.resolve({})
  }
  const { addedConnections, removedConnections } = connectionManager.addConnection({
    connectionName: topicName,
    connectionId: topicId
  })

  addCallback(topicName, topicId, callback)
  await Promise.all([
    addedConnections.length > 0
      ? subscribeAdapter.subscribeToTopics(
        addedConnections.map(({ connectionName, connectionId }) => ({
          topicName: connectionName,
          topicId: connectionId
        }))
      )
      : Promise.resolve(),
    removedConnections.length > 0
      ? subscribeAdapter.unsubscribeFromTopics(
        removedConnections.map(({ connectionName, connectionId }) => ({
          topicName: connectionName,
          topicId: connectionId
        }))
      )
      : Promise.resolve()
  ])

  return { topicName, topicId }
}

const doUnsubscribe = async (
  context: Context,
  { topicName, topicId },
  callback?: Function
): Promise<object> => {
  const connectionManager = createConnectionManager()
  const subscribeAdapter = await getSubscribeAdapterPromise(context)
  if (subscribeAdapter === null) {
    return Promise.resolve({})
  }

  const { addedConnections, removedConnections } = connectionManager.removeConnection({
    connectionName: topicName,
    connectionId: topicId
  })
  removeCallback(topicName, topicId, callback)
  await Promise.all([
    addedConnections.length > 0
      ? subscribeAdapter.subscribeToTopics(
        addedConnections.map(({ connectionName, connectionId }) => ({
          topicName: connectionName,
          topicId: connectionId
        }))
      )
      : Promise.resolve(),
    removedConnections.length > 0
      ? subscribeAdapter.unsubscribeFromTopics(
        removedConnections.map(({ connectionName, connectionId }) => ({
          topicName: connectionName,
          topicId: connectionId
        }))
      )
      : Promise.resolve()
  ])

  return { topicName, topicId }
}

export { doSubscribe, doUnsubscribe }
