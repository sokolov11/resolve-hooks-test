import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { take } from 'redux-saga/effects';
import getHash from './get_hash';
import createConnectionManager from './create_connection_manager';
import createSagaManager from './create_saga_manager';
import { CONNECT_READMODEL, DISCONNECT_READMODEL } from './action_types';
import connectReadModelSaga from './connect_read_model_saga';
import disconnectReadModelSaga from './disconnect_read_model_saga';

var readModelsSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function readModelsSaga(sagaArgs) {
  var connectionManager, sagaManager, action, readModelName, resolverName, resolverArgs, sagaKey, _readModelName, _resolverName, _resolverArgs, _sagaKey;

  return _regeneratorRuntime.wrap(function readModelsSaga$(_context) {
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
          return take([CONNECT_READMODEL, DISCONNECT_READMODEL]);

        case 5:
          action = _context.sent;
          _context.t0 = action.type;
          _context.next = _context.t0 === CONNECT_READMODEL ? 9 : _context.t0 === DISCONNECT_READMODEL ? 13 : 17;
          break;

        case 9:
          readModelName = action.readModelName, resolverName = action.resolverName, resolverArgs = action.resolverArgs;
          sagaKey = getHash({
            readModelName: readModelName,
            resolverName: resolverName,
            resolverArgs: resolverArgs
          });
          return _context.delegateYield(sagaManager.start("" + CONNECT_READMODEL + sagaKey, connectReadModelSaga, _objectSpread({}, sagaArgs, {
            connectionManager: connectionManager,
            sagaManager: sagaManager,
            sagaKey: sagaKey
          }), action), "t1", 12);

        case 12:
          return _context.abrupt("break", 17);

        case 13:
          _readModelName = action.readModelName, _resolverName = action.resolverName, _resolverArgs = action.resolverArgs;
          _sagaKey = getHash({
            readModelName: _readModelName,
            resolverName: _resolverName,
            resolverArgs: _resolverArgs
          });
          return _context.delegateYield(sagaManager.start("" + DISCONNECT_READMODEL + _sagaKey, disconnectReadModelSaga, _objectSpread({}, sagaArgs, {
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
  }, readModelsSaga);
});

export default readModelsSaga;
//# sourceMappingURL=read_models_saga.js.map