"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _effects = require("redux-saga/effects");

var _get_hash = _interopRequireDefault(require("./get_hash"));

var _create_connection_manager = _interopRequireDefault(require("./create_connection_manager"));

var _create_saga_manager = _interopRequireDefault(require("./create_saga_manager"));

var _action_types = require("./action_types");

var _connect_read_model_saga = _interopRequireDefault(require("./connect_read_model_saga"));

var _disconnect_read_model_saga = _interopRequireDefault(require("./disconnect_read_model_saga"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var readModelsSaga =
/*#__PURE__*/
_regenerator["default"].mark(function readModelsSaga(sagaArgs) {
  var connectionManager, sagaManager, action, readModelName, resolverName, resolverArgs, sagaKey, _readModelName, _resolverName, _resolverArgs, _sagaKey;

  return _regenerator["default"].wrap(function readModelsSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          connectionManager = (0, _create_connection_manager["default"])({
            wildcardSymbol: null
          });
          sagaManager = (0, _create_saga_manager["default"])();

        case 2:
          if (!true) {
            _context.next = 19;
            break;
          }

          _context.next = 5;
          return (0, _effects.take)([_action_types.CONNECT_READMODEL, _action_types.DISCONNECT_READMODEL]);

        case 5:
          action = _context.sent;
          _context.t0 = action.type;
          _context.next = _context.t0 === _action_types.CONNECT_READMODEL ? 9 : _context.t0 === _action_types.DISCONNECT_READMODEL ? 13 : 17;
          break;

        case 9:
          readModelName = action.readModelName, resolverName = action.resolverName, resolverArgs = action.resolverArgs;
          sagaKey = (0, _get_hash["default"])({
            readModelName: readModelName,
            resolverName: resolverName,
            resolverArgs: resolverArgs
          });
          return _context.delegateYield(sagaManager.start("" + _action_types.CONNECT_READMODEL + sagaKey, _connect_read_model_saga["default"], _objectSpread({}, sagaArgs, {
            connectionManager: connectionManager,
            sagaManager: sagaManager,
            sagaKey: sagaKey
          }), action), "t1", 12);

        case 12:
          return _context.abrupt("break", 17);

        case 13:
          _readModelName = action.readModelName, _resolverName = action.resolverName, _resolverArgs = action.resolverArgs;
          _sagaKey = (0, _get_hash["default"])({
            readModelName: _readModelName,
            resolverName: _resolverName,
            resolverArgs: _resolverArgs
          });
          return _context.delegateYield(sagaManager.start("" + _action_types.DISCONNECT_READMODEL + _sagaKey, _disconnect_read_model_saga["default"], _objectSpread({}, sagaArgs, {
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

var _default = readModelsSaga;
exports["default"] = _default;
//# sourceMappingURL=read_models_saga.js.map