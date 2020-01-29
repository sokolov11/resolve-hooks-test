import createConnectionManager from './create_connection_manager'
import createEmptySubscribeAdapter from './empty_subscribe_adapter'

let connectionManager
let subscribeAdapterPromise

const initSubscribeAdapter = async ({
  api,
  origin,
  rootPath,
  // store,
  subscribeAdapter: createSubscribeAdapter
}) => {
  if (createSubscribeAdapter === createEmptySubscribeAdapter) {
    return createEmptySubscribeAdapter()
  }

  const { appId, url } = await api.getSubscribeAdapterOptions(
    createSubscribeAdapter.adapterName
  )

  // const onEvent = event => store.dispatch(dispatchTopicMessage(event))
  const onEvent = event => {
    console.log('--- topic event:', event)
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
  
    console.log({
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

  console.log('subscribeAdapter', subscribeAdapter)
  return subscribeAdapter
}

const initSubscription = async (options) => {
  connectionManager = createConnectionManager()
  subscribeAdapterPromise = await initSubscribeAdapter(options)
  console.log('subscription init done', subscribeAdapterPromise)
}

const doSubscribe = async ({ topicName, topicId }) => {
  const subscribeAdapter = subscribeAdapterPromise
  const {
    addedConnections,
    removedConnections
  } = connectionManager.addConnection({
    connectionName: topicName,
    connectionId: topicId
  })
  console.log(addedConnections, removedConnections)

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
  } catch (error) {
    console.log('subscribe error', error)
    throw error
  }
}

const doUnsubscribe = async ({ topicName, topicId }) => {
  const subscribeAdapter = subscribeAdapterPromise

  const {
    addedConnections,
    removedConnections
  } = connectionManager.removeConnection({
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
  } catch (error) {
    console.log('unsubscribe error', error)
    throw (error)
  }
}

export {
  initSubscription,
  doSubscribe,
  doUnsubscribe
}
