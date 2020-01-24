import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { take } from 'redux-saga/effects';
import getHash from './get_hash';
import createConnectionManager from './create_connection_manager';
import createSagaManager from './create_saga_manager';
import { CONNECT_VIEWMODEL, DISCONNECT_VIEWMODEL } from './action_types';
import connectViewModelSaga from './connect_view_model_saga';
import disconnectViewModelSaga from './disconnect_view_model_saga';

var viewModelsSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function viewModelsSaga(sagaArgs) {
  var connectionManager, sagaManager, action, viewModelName, aggregateIds, aggregateArgs, sagaKey, _viewModelName, _aggregateIds, _aggregateArgs, _sagaKey;

  return _regeneratorRuntime.wrap(function viewModelsSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          connectionManager = createConnectionManager({
            wildcardSymbol: null
          });
          sagaManager = createSagaManager();

        case 2:
          if (!true) {
            _context.next = 19;
            break;
          }

          _context.next = 5;
          return take([CONNECT_VIEWMODEL, DISCONNECT_VIEWMODEL]);

        case 5:
          action = _context.sent;
          _context.t0 = action.type;
          _context.next = _context.t0 === CONNECT_VIEWMODEL ? 9 : _context.t0 === DISCONNECT_VIEWMODEL ? 13 : 17;
          break;

        case 9:
          viewModelName = action.viewModelName, aggregateIds = action.aggregateIds, aggregateArgs = action.aggregateArgs;
          sagaKey = getHash({
            viewModelName: viewModelName,
            aggregateIds: aggregateIds,
            aggregateArgs: aggregateArgs
          });
          return _context.delegateYield(sagaManager.start("" + CONNECT_VIEWMODEL + sagaKey, connectViewModelSaga, _objectSpread({}, sagaArgs, {
            connectionManager: connectionManager,
            sagaManager: sagaManager,
            sagaKey: sagaKey
          }), action), "t1", 12);

        case 12:
          return _context.abrupt("break", 17);

        case 13:
          _viewModelName = action.viewModelName, _aggregateIds = action.aggregateIds, _aggregateArgs = action.aggregateArgs;
          _sagaKey = getHash({
            viewModelName: _viewModelName,
            aggregateIds: _aggregateIds,
            aggregateArgs: _aggregateArgs
          });
          return _context.delegateYield(sagaManager.start("" + DISCONNECT_VIEWMODEL + _sagaKey, disconnectViewModelSaga, _objectSpread({}, sagaArgs, {
            connectionManager: connectionManager,
            sagaManager: sagaManager,
            sagaKey: _sagaKey
          }), action), "t2", 16);

        case 16:
          return _context.abrupt("break", 17);

        case 17:
          _context.next = 2;
          break;

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, viewModelsSaga);
});

export default viewModelsSaga;
//# sourceMappingURL=view_models_saga.js.map