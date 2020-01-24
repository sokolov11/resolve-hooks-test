"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var _get_hash = _interopRequireDefault(require("./get_hash"));

var _actions = require("./actions");

var _action_types = require("./action_types");

var disconnectReadModelSaga =
/*#__PURE__*/
_regenerator["default"].mark(function disconnectReadModelSaga(sagaArgs, action) {
  var connectionManager, sagaManager, sagaKey, readModelName, resolverName, resolverArgs, connectionId, _connectionManager$re, removedConnections;

  return _regenerator["default"].wrap(function disconnectReadModelSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey;
          readModelName = action.readModelName, resolverName = action.resolverName, resolverArgs = action.resolverArgs;
          connectionId = "" + (0, _get_hash["default"])(resolverName) + (0, _get_hash["default"])(resolverArgs);
          _connectionManager$re = connectionManager.removeConnection({
            connectionName: readModelName,
            connectionId: connectionId
          }), removedConnections = _connectionManager$re.removedConnections;

          if (!(removedConnections.length !== 1)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          return _context.delegateYield(sagaManager.stop("" + _action_types.CONNECT_READMODEL + sagaKey), "t0", 7);

        case 7:
          _context.next = 9;
          return (0, _effects.put)((0, _actions.dropReadModelState)(readModelName, resolverName, resolverArgs));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, disconnectReadModelSaga);
});

var _default = disconnectReadModelSaga;
exports["default"] = _default;
//# sourceMappingURL=disconnect_read_model_saga.js.map