"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var _uuid = _interopRequireDefault(require("uuid"));

var _get_hash = _interopRequireDefault(require("./get_hash"));

var _actions = require("./actions");

var _action_types = require("./action_types");

var _create_api = require("./create_api");

var connectReadModelSaga =
/*#__PURE__*/
_regenerator["default"].mark(function connectReadModelSaga(sagaArgs, action) {
  var connectionManager, sagaManager, sagaKey, queryIdMap, sessionId, readModelName, resolverName, resolverArgs, skipConnectionManager, _connectionManager$ad, addedConnections, key, queryId, loadReadModelStateResultAction;

  return _regenerator["default"].wrap(function connectReadModelSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey, queryIdMap = sagaArgs.queryIdMap, sessionId = sagaArgs.sessionId;
          readModelName = action.readModelName, resolverName = action.resolverName, resolverArgs = action.resolverArgs, skipConnectionManager = action.skipConnectionManager;

          if (skipConnectionManager) {
            _context.next = 6;
            break;
          }

          _connectionManager$ad = connectionManager.addConnection({
            connectionName: readModelName,
            connectionId: "" + (0, _get_hash["default"])(action.resolverName) + (0, _get_hash["default"])(action.resolverArgs)
          }), addedConnections = _connectionManager$ad.addedConnections;

          if (!(addedConnections.length !== 1)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          return _context.delegateYield(sagaManager.stop("" + _action_types.DISCONNECT_READMODEL + sagaKey), "t0", 7);

        case 7:
          key = "" + readModelName + (0, _get_hash["default"])(action.resolverName) + (0, _get_hash["default"])(action.resolverArgs);

          if (!queryIdMap.has(key)) {
            queryIdMap.set(key, 0);
          }

          queryIdMap.set(key, queryIdMap.get(key) + 1);
          queryId = (0, _uuid["default"])("" + key + queryIdMap.get(key) + sessionId, '00000000-0000-0000-0000-000000000000');

        case 11:
          if (!true) {
            _context.next = 26;
            break;
          }

          _context.next = 14;
          return (0, _effects.put)((0, _actions.loadReadModelStateRequest)(readModelName, resolverName, resolverArgs, queryId));

        case 14:
          _context.next = 16;
          return (0, _effects.take)(function (action) {
            return (action.type === _action_types.LOAD_READMODEL_STATE_SUCCESS || action.type === _action_types.LOAD_READMODEL_STATE_FAILURE) && action.queryId === queryId;
          });

        case 16:
          loadReadModelStateResultAction = _context.sent;

          if (!(loadReadModelStateResultAction.type === _action_types.LOAD_READMODEL_STATE_SUCCESS)) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("break", 26);

        case 19:
          if (!(loadReadModelStateResultAction.type === _action_types.LOAD_READMODEL_STATE_FAILURE && loadReadModelStateResultAction.error instanceof _create_api.HttpError)) {
            _context.next = 22;
            break;
          }

          // eslint-disable-next-line no-console
          console.warn('Http error: ', loadReadModelStateResultAction.error);
          return _context.abrupt("return");

        case 22:
          _context.next = 24;
          return (0, _effects.delay)(500);

        case 24:
          _context.next = 11;
          break;

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, connectReadModelSaga);
});

var _default = connectReadModelSaga;
exports["default"] = _default;
//# sourceMappingURL=connect_read_model_saga.js.map