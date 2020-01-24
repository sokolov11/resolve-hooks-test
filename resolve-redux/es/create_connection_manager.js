var getAddedConnections = function getAddedConnections(prevConnections, nextConnections) {
  return nextConnections.filter(function (connection) {
    return !prevConnections.find(function (_ref) {
      var connectionName = _ref.connectionName,
          connectionId = _ref.connectionId;
      return connection.connectionName === connectionName && connection.connectionId === connectionId;
    });
  });
};

var getRemovedConnections = function getRemovedConnections(prevConnections, nextConnections) {
  return prevConnections.filter(function (connection) {
    return !nextConnections.find(function (_ref2) {
      var connectionName = _ref2.connectionName,
          connectionId = _ref2.connectionId;
      return connection.connectionName === connectionName && connection.connectionId === connectionId;
    });
  });
};

var getConnections = function getConnections(_ref3) {
  var connections = _ref3.connections,
      wildcardSymbol = _ref3.wildcardSymbol;
  var result = [];

  for (var connectionName in connections) {
    var connectionsByName = [];

    for (var connectionId in connections[connectionName]) {
      if (connectionId === wildcardSymbol) {
        connectionsByName = [{
          connectionName: connectionName,
          connectionId: connectionId
        }];
        break;
      }

      connectionsByName.push({
        connectionName: connectionName,
        connectionId: connectionId
      });
    }

    result.push.apply(result, connectionsByName);
  }

  return result;
};

var addConnection = function addConnection(pool, _ref4) {
  var connectionName = _ref4.connectionName,
      connectionId = _ref4.connectionId;
  var prevConnections = getConnections(pool);

  if (!pool.connections[connectionName]) {
    pool.connections[connectionName] = Object.create(null);
  }

  if (!pool.connections[connectionName][connectionId]) {
    pool.connections[connectionName][connectionId] = 0;
  }

  pool.connections[connectionName][connectionId]++;
  var nextConnections = getConnections(pool);
  var addedConnections = getAddedConnections(prevConnections, nextConnections);
  var removedConnections = getRemovedConnections(prevConnections, nextConnections);
  return {
    addedConnections: addedConnections,
    removedConnections: removedConnections
  };
};

var removeConnection = function removeConnection(pool, _ref5) {
  var connectionName = _ref5.connectionName,
      connectionId = _ref5.connectionId;
  var prevConnections = getConnections(pool);
  pool.connections[connectionName][connectionId]--;

  if (!pool.connections[connectionName][connectionId]) {
    delete pool.connections[connectionName][connectionId];
  }

  if (Object.keys(pool.connections[connectionName]).length === 0) {
    delete pool.connections[connectionName];
  }

  var nextConnections = getConnections(pool);
  var addedConnections = getAddedConnections(prevConnections, nextConnections);
  var removedConnections = getRemovedConnections(prevConnections, nextConnections);
  return {
    addedConnections: addedConnections,
    removedConnections: removedConnections
  };
};

var createConnectionManager = function createConnectionManager(_temp) {
  var _ref6 = _temp === void 0 ? {} : _temp,
      _ref6$wildcardSymbol = _ref6.wildcardSymbol,
      wildcardSymbol = _ref6$wildcardSymbol === void 0 ? '*' : _ref6$wildcardSymbol;

  var pool = {
    connections: Object.create(null),
    wildcardSymbol: wildcardSymbol
  };
  return {
    addConnection: addConnection.bind(null, pool),
    removeConnection: removeConnection.bind(null, pool),
    getConnections: getConnections.bind(null, pool)
  };
};

export default createConnectionManager;
//# sourceMappingURL=create_connection_manager.js.map