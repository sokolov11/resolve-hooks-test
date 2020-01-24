"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var _get_hash = _interopRequireDefault(require("./get_hash"));

var _actions = require("./actions");

var _action_types = require("./action_types");

var _unsubscribe_view_model_topics_saga = _interopRequireDefault(require("./unsubscribe_view_model_topics_saga"));

var disconnectViewModelSaga =
/*#__PURE__*/
_regenerator["default"].mark(function disconnectViewModelSaga(sagaArgs, action) {
  var viewModels, connectionManager, sagaManager, sagaKey, viewModelName, aggregateIds, aggregateArgs, connectionId, _connectionManager$re, removedConnections;

  return _regenerator["default"].wrap(function disconnectViewModelSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          viewModels = sagaArgs.viewModels, connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey;
          viewModelName = action.viewModelName, aggregateIds = action.aggregateIds, aggregateArgs = action.aggregateArgs;
          connectionId = "" + (0, _get_hash["default"])(aggregateIds) + (0, _get_hash["default"])(aggregateArgs);
          _connectionManager$re = connectionManager.removeConnection({
            connectionName: viewModelName,
            connectionId: connectionId
          }), removedConnections = _connectionManager$re.removedConnections;

          if (!(removedConnections.length !== 1)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          return _context.delegateYield(sagaManager.stop("" + _action_types.CONNECT_VIEWMODEL + sagaKey), "t0", 7);

        case 7:
          _context.next = 9;
          return (0, _effects.put)((0, _actions.dropViewModelState)(viewModelName, aggregateIds, aggregateArgs));

        case 9:
          return _context.delegateYield((0, _unsubscribe_view_model_topics_saga["default"])({
            viewModels: viewModels,
            viewModelName: viewModelName,
            aggregateIds: aggregateIds
          }), "t1", 10);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, disconnectViewModelSaga);
});

var _default = disconnectViewModelSaga;
exports["default"] = _default;
//# sourceMappingURL=disconnect_view_model_saga.js.map