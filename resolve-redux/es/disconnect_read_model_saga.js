import _regeneratorRuntime from "@babel/runtime/regenerator";
import { put } from 'redux-saga/effects';
import getHash from './get_hash';
import { dropReadModelState } from './actions';
import { CONNECT_READMODEL } from './action_types';

var disconnectReadModelSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function disconnectReadModelSaga(sagaArgs, action) {
  var connectionManager, sagaManager, sagaKey, readModelName, resolverName, resolverArgs, connectionId, _connectionManager$re, removedConnections;

  return _regeneratorRuntime.wrap(function disconnectReadModelSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey;
          readModelName = action.readModelName, resolverName = action.resolverName, resolverArgs = action.resolverArgs;
          connectionId = "" + getHash(resolverName) + getHash(resolverArgs);
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
          return _context.delegateYield(sagaManager.stop("" + CONNECT_READMODEL + sagaKey), "t0", 7);

        case 7:
          _context.next = 9;
          return put(dropReadModelState(readModelName, resolverName, resolverArgs));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, disconnectReadModelSaga);
});

export default disconnectReadModelSaga;
//# sourceMappingURL=disconnect_read_model_saga.js.map