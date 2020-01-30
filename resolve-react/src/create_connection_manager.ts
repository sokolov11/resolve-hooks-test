interface Connection {
  connectionName: string
  connectionId: string
}

interface ConnectionOperationResult {
  addedConnections: Array<Connection>
  removedConnections: Array<Connection>
}

interface Pool {
  connections: object
  wildcardSymbol: string
}

export interface ConnectionManager {
  addConnection: (connection: Connection) => ConnectionOperationResult
  removeConnection: (connection: Connection) => ConnectionOperationResult
  getConnections: () => ConnectionOperationResult
}

const getAddedConnections = (prevConnections: Array<Connection>, nextConnections: Array<Connection>): Array<Connection> =>
  nextConnections.filter(
    connection =>
      !prevConnections.find(
        ({ connectionName, connectionId }) =>
          connection.connectionName === connectionName &&
          connection.connectionId === connectionId
      )
  )

const getRemovedConnections = (prevConnections: Array<Connection>, nextConnections: Array<Connection>): Array<Connection> =>
  prevConnections.filter(
    connection =>
      !nextConnections.find(
        ({ connectionName, connectionId }) =>
          connection.connectionName === connectionName &&
          connection.connectionId === connectionId
      )
  )

const getConnections = ({ connections, wildcardSymbol }): Array<Connection> => {
  const result = []
  for (const connectionName in connections) {
    let connectionsByName: Array<Connection> = []
    for (const connectionId in connections[connectionName]) {
      if (connectionId === wildcardSymbol) {
        connectionsByName = [
          {
            connectionName,
            connectionId
          }
        ]
        break
      }
      connectionsByName.push({
        connectionName,
        connectionId
      })
    }
    result.push.apply(result, connectionsByName)
  }

  return result
}

const addConnection = (pool: Pool, { connectionName, connectionId }: Connection): ConnectionOperationResult => {
  const prevConnections = getConnections(pool)

  if (!pool.connections[connectionName]) {
    pool.connections[connectionName] = Object.create(null)
  }
  if (!pool.connections[connectionName][connectionId]) {
    pool.connections[connectionName][connectionId] = 0
  }
  pool.connections[connectionName][connectionId]++

  const nextConnections = getConnections(pool)

  const addedConnections = getAddedConnections(prevConnections, nextConnections)
  const removedConnections = getRemovedConnections(
    prevConnections,
    nextConnections
  )

  return { addedConnections, removedConnections }
}

const removeConnection = (pool: Pool, { connectionName, connectionId }: Connection): ConnectionOperationResult => {
  const prevConnections = getConnections(pool)

  pool.connections[connectionName][connectionId]--

  if (!pool.connections[connectionName][connectionId]) {
    delete pool.connections[connectionName][connectionId]
  }

  if (Object.keys(pool.connections[connectionName]).length === 0) {
    delete pool.connections[connectionName]
  }

  const nextConnections = getConnections(pool)

  const addedConnections = getAddedConnections(prevConnections, nextConnections)
  const removedConnections = getRemovedConnections(
    prevConnections,
    nextConnections
  )

  return { addedConnections, removedConnections }
}

const createConnectionManager = ({ wildcardSymbol = '*' } = {}): ConnectionManager => {
  const pool = {
    connections: Object.create(null),
    wildcardSymbol
  }

  return {
    addConnection: addConnection.bind(null, pool),
    removeConnection: removeConnection.bind(null, pool),
    getConnections: getConnections.bind(null, pool)
  }
}

export default createConnectionManager
