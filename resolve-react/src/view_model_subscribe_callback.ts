let callbackMap: {
  [key: string]: {
    [key: string]: Array<Function>
  }
} = {}

const addCallback = (topicName: string, topicId: string, callback: Function): void => {
  if (!callbackMap[topicName]) {
    callbackMap[topicName] = {}
  }
  if (!callbackMap[topicName][topicId]) {
    callbackMap[topicName][topicId] = []
  }
  callbackMap[topicName][topicId].push(callback)
  console.debug(callbackMap)
}

const removeCallback = (topicName: string, topicId: string, callback?: Function): void => {
  callbackMap[topicName][topicId] = callbackMap[topicName][topicId].filter(f => f !== callback)
}

const rootCallback = (event: any): void => {
  const { type: eventTopic, aggregateId } = event
  for (const topicName in callbackMap) {
    if (topicName === eventTopic) {
      let listeners: Array<Function> = []
      const wildcard = callbackMap[topicName]['*'] ?? []
      listeners = listeners.concat(wildcard).concat(callbackMap[topicName][aggregateId])
      if (listeners) {
        listeners.forEach(listener => listener(event))
      }
    }
  }
}

const dropCallbackMap = (): void => {
  callbackMap = {}
}

export { rootCallback, addCallback, removeCallback, dropCallbackMap }
