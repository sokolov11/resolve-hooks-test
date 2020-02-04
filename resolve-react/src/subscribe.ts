import createConnectionManager from './create_connection_manager'
import createEmptySubscribeAdapter, { CreateSubscribeAdapter } from './empty_subscribe_adapter'
import { getSubscribeAdapterOptions } from './client'
import { Context } from './context'

interface InitSubscribeAdapterOptions {
  origin: string
  rootPath: string
  subscribeAdapter: CreateSubscribeAdapter
}

const initSubscribeAdapter = async (
  context: Context,
  { origin, rootPath, subscribeAdapter: createSubscribeAdapter }: InitSubscribeAdapterOptions
): Promise<any> => {
  if (createSubscribeAdapter === createEmptySubscribeAdapter) {
    return createEmptySubscribeAdapter()
  }

  const { appId, url } = await getSubscribeAdapterOptions(context, createSubscribeAdapter.adapterName)

  // const onEvent = event => store.dispatch(dispatchTopicMessage(event))
  const onEvent = event => {
    console.log('topic event:', event)
    return event
  }

  let subscribeAdapter
  try {
    subscribeAdapter = createSubscribeAdapter({
      appId,
      origin,
      rootPath,
      url,
      onEvent
    })
    await subscribeAdapter.init()
  } catch (err) {
    console.log(err)
    throw err
  }

  return subscribeAdapter
}

let subscribeAdapterPromise = null

const getSubscribeAdapterPromise = async (
  context: Context,
  options: InitSubscribeAdapterOptions
): Promise<any> => {
  if (subscribeAdapterPromise !== null) {
    return subscribeAdapterPromise
  }
  subscribeAdapterPromise = await initSubscribeAdapter(context, options)
  return subscribeAdapterPromise
}

export const dropSubscribeAdapterPromise = () => {
  subscribeAdapterPromise = null
  const connectionManager = createConnectionManager()
  connectionManager.destroy()
}

const doSubscribe = async (
  context: Context,
  options: InitSubscribeAdapterOptions,
  { topicName, topicId }
): Promise<object> => {
  const connectionManager = createConnectionManager()
  const subscribeAdapter = await getSubscribeAdapterPromise(context, options)
  if (subscribeAdapter === null) {
    return Promise.resolve({})
  }
  const { addedConnections, removedConnections } = connectionManager.addConnection({
    connectionName: topicName,
    connectionId: topicId
  })

  try {
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
    // console.log('subscription done', { topicName, topicId })
    return { topicName, topicId }
  } catch (error) {
    console.log('subscribe error', error)
    throw error
  }
}

const doUnsubscribe = async (
  context: Context,
  options: InitSubscribeAdapterOptions,
  { topicName, topicId }
): Promise<object> => {
  const connectionManager = createConnectionManager()
  const subscribeAdapter = await getSubscribeAdapterPromise(context, options)
  if (subscribeAdapter === null) {
    return Promise.resolve({})
  }

  const { addedConnections, removedConnections } = connectionManager.removeConnection({
    connectionName: topicName,
    connectionId: topicId
  })

  try {
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
  } catch (error) {
    console.log('unsubscribe error', error)
    throw error
  }
}

export { doSubscribe, doUnsubscribe }
