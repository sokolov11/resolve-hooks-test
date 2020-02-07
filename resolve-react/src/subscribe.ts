import createConnectionManager from './create_connection_manager'
import createEmptySubscribeAdapter, { CreateSubscribeAdapter } from './empty_subscribe_adapter'
import { getSubscribeAdapterOptions } from './client'
import { Context } from './context'
import { rootCallback, addCallback, removeCallback } from './view_model_subscribe_callback'
import determineOrigin from './determine_origin'

const initSubscribeAdapter = async (
  context: Context,
  createSubscribeAdapter: CreateSubscribeAdapter,
  callback?: Function
): Promise<any> => {
  if (createSubscribeAdapter === createEmptySubscribeAdapter) {
    return createEmptySubscribeAdapter()
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

const getSubscribeAdapterPromise = (
  context: Context,
  createSubscribeAdapter: CreateSubscribeAdapter,
  callback?: Function
): Promise<any> => {
  if (subscribeAdapterPromise !== null) {
    return subscribeAdapterPromise
  }
  subscribeAdapterPromise = initSubscribeAdapter(context, createSubscribeAdapter, callback)
  return subscribeAdapterPromise
}

export const dropSubscribeAdapterPromise = () => {
  subscribeAdapterPromise = null
  const connectionManager = createConnectionManager()
  connectionManager.destroy()
}

const doSubscribe = async (
  context: Context,
  createSubscribeAdapter: CreateSubscribeAdapter,
  { topicName, topicId },
  callback: Function
): Promise<object> => {
  const connectionManager = createConnectionManager()
  const subscribeAdapter = await getSubscribeAdapterPromise(context, createSubscribeAdapter, callback)
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
  createSubscribeAdapter: CreateSubscribeAdapter,
  { topicName, topicId },
  callback?: Function
): Promise<object> => {
  const connectionManager = createConnectionManager()
  const subscribeAdapter = await getSubscribeAdapterPromise(context, createSubscribeAdapter, callback)
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
