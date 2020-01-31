import createConnectionManager, { ConnectionManager } from './create_connection_manager'
import createEmptySubscribeAdapter, { CreateSubscribeAdapter } from './empty_subscribe_adapter'
import { getSubscribeAdapterOptions } from './client'
import { Context } from './context'

let connectionManager: ConnectionManager
let subscribeAdapterPromise

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

const initSubscription = async (context: Context, options: InitSubscribeAdapterOptions): Promise<any> => {
  connectionManager = createConnectionManager()
  subscribeAdapterPromise = await initSubscribeAdapter(context, options)
}

const doSubscribe = async ({ topicName, topicId }): Promise<object> => {
  const subscribeAdapter = subscribeAdapterPromise
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
    console.log('subscription done', { topicName, topicId })
    return { topicName, topicId }
  } catch (error) {
    console.log('subscribe error', error)
    throw error
  }
}

const doUnsubscribe = async ({ topicName, topicId }): Promise<object> => {
  const subscribeAdapter = subscribeAdapterPromise

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

export { initSubscription, doSubscribe, doUnsubscribe }
