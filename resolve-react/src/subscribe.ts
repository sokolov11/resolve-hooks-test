import createConnectionManager from './create_connection_manager'
import createEmptySubscribeAdapter, { CreateSubscribeAdapter } from './empty_subscribe_adapter'
import { getSubscribeAdapterOptions } from './client'
import { Context } from './context'
import getOrigin from './get_origin'

const initSubscribeAdapter = async (
  context: Context,
  createSubscribeAdapter: CreateSubscribeAdapter,
  callback?: Function
): Promise<any> => {
  if (createSubscribeAdapter === createEmptySubscribeAdapter) {
    return createEmptySubscribeAdapter()
  }

  const { appId, url } = await getSubscribeAdapterOptions(context, createSubscribeAdapter.adapterName)
  const { origin = getOrigin(), rootPath } = context

  const subscribeAdapter = createSubscribeAdapter({
    appId,
    origin,
    rootPath,
    url,
    onEvent: callback
  })
  await subscribeAdapter.init()

  return subscribeAdapter
}

let subscribeAdapterPromise = null

const getSubscribeAdapterPromise = async (
  context: Context,
  createSubscribeAdapter: CreateSubscribeAdapter,
  callback?: Function
): Promise<any> => {
  if (subscribeAdapterPromise !== null) {
    return subscribeAdapterPromise
  }
  subscribeAdapterPromise = await initSubscribeAdapter(context, createSubscribeAdapter, callback)
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
  callback?: Function
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

  await Promise.all([
    addedConnections.length > 0
      ? subscribeAdapter.subscribeToTopics(
        addedConnections.map(({ connectionName, connectionId }) => ({
          topicName: connectionName, topicId: connectionId
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
