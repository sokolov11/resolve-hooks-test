import _regeneratorRuntime from "@babel/runtime/regenerator";
import { take, put, delay } from 'redux-saga/effects';
import hash from 'uuid';
import getHash from './get_hash';
import { loadReadModelStateRequest } from './actions';
import { DISCONNECT_READMODEL, LOAD_READMODEL_STATE_FAILURE, LOAD_READMODEL_STATE_SUCCESS } from './action_types';
import { HttpError } from './create_api';
/*
  Saga is launched on action `CONNECT_READMODEL`, emitted by read model connector.
  If read model with supposed options had already been fetched, do nothing.
  Saga performs resolver result fetching and subscribes to diff topic.
  Resolver result is fetched by `load_read_model_state_saga`, interaction
  performs through following actions: `LOAD_READMODEL_STATE_REQUEST`,
  `LOAD_READMODEL_STATE_SUCCESS` and `LOAD_READMODEL_STATE_FAILURE`.
*/

var connectReadModelSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function connectReadModelSaga(sagaArgs, action) {
  var connectionManager, sagaManager, sagaKey, queryIdMap, sessionId, readModelName, resolverName, resolverArgs, skipConnectionManager, _connectionManager$ad, addedConnections, key, queryId, loadReadModelStateResultAction;

  return _regeneratorRuntime.wrap(function connectReadModelSaga$(_context) {
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
            connectionId: "" + getHash(action.resolverName) + getHash(action.resolverArgs)
          }), addedConnections = _connectionManager$ad.addedConnections;

          if (!(addedConnections.length !== 1)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          return _context.delegateYield(sagaManager.stop("" + DISCONNECT_READMODEL + sagaKey), "t0", 7);

        case 7:
          key = "" + readModelName + getHash(action.resolverName) + getHash(action.resolverArgs);

          if (!queryIdMap.has(key)) {
            queryIdMap.set(key, 0);
          }

          queryIdMap.set(key, queryIdMap.get(key) + 1);
          queryId = hash("" + key + queryIdMap.get(key) + sessionId, '00000000-0000-0000-0000-000000000000');

        case 11:
          if (!true) {
            _context.next = 26;
            break;
          }

          _context.next = 14;
          return put(loadReadModelStateRequest(readModelName, resolverName, resolverArgs, queryId));

        case 14:
          _context.next = 16;
          return take(function (action) {
            return (action.type === LOAD_READMODEL_STATE_SUCCESS || action.type === LOAD_READMODEL_STATE_FAILURE) && action.queryId === queryId;
          });

        case 16:
          loadReadModelStateResultAction = _context.sent;

          if (!(loadReadModelStateResultAction.type === LOAD_READMODEL_STATE_SUCCESS)) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("break", 26);

        case 19:
          if (!(loadReadModelStateResultAction.type === LOAD_READMODEL_STATE_FAILURE && loadReadModelStateResultAction.error instanceof HttpError)) {
            _context.next = 22;
            break;
          }

          // eslint-disable-next-line no-console
          console.warn('Http error: ', loadReadModelStateResultAction.error);
          return _context.abrupt("return");

        case 22:
          _context.next = 24;
          return delay(500);

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

export default connectReadModelSaga;
//# sourceMappingURL=connect_read_model_saga.js.map