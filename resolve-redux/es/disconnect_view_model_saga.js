import _regeneratorRuntime from "@babel/runtime/regenerator";
import { put } from 'redux-saga/effects';
import getHash from './get_hash';
import { dropViewModelState } from './actions';
import { CONNECT_VIEWMODEL } from './action_types';
import unsubscribeViewModelTopicsSaga from './unsubscribe_view_model_topics_saga';

var disconnectViewModelSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function disconnectViewModelSaga(sagaArgs, action) {
  var viewModels, connectionManager, sagaManager, sagaKey, viewModelName, aggregateIds, aggregateArgs, connectionId, _connectionManager$re, removedConnections;

  return _regeneratorRuntime.wrap(function disconnectViewModelSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          viewModels = sagaArgs.viewModels, connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey;
          viewModelName = action.viewModelName, aggregateIds = action.aggregateIds, aggregateArgs = action.aggregateArgs;
          connectionId = "" + getHash(aggregateIds) + getHash(aggregateArgs);
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
          return _context.delegateYield(sagaManager.stop("" + CONNECT_VIEWMODEL + sagaKey), "t0", 7);

        case 7:
          _context.next = 9;
          return put(dropViewModelState(viewModelName, aggregateIds, aggregateArgs));

        case 9:
          return _context.delegateYield(unsubscribeViewModelTopicsSaga({
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

export default disconnectViewModelSaga;
//# sourceMappingURL=disconnect_view_model_saga.js.map