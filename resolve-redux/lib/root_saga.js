"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _effects = require("redux-saga/effects");

var _action_types = require("./action_types");

var _load_view_model_state_saga = _interopRequireDefault(require("./load_view_model_state_saga"));

var _load_read_model_state_saga = _interopRequireDefault(require("./load_read_model_state_saga"));

var _send_command_saga = _interopRequireDefault(require("./send_command_saga"));

var _view_models_saga = _interopRequireDefault(require("./view_models_saga"));

var _read_models_saga = _interopRequireDefault(require("./read_models_saga"));

var _subscribe_saga = _interopRequireDefault(require("./subscribe_saga"));

var _auth_saga = _interopRequireDefault(require("./auth_saga"));

var _logout_saga = _interopRequireDefault(require("./logout_saga"));

var _marked =
/*#__PURE__*/
_regenerator["default"].mark(rootSaga);

function rootSaga(_ref) {
  var customSagas, sagaArgs, _iterator, _isArray, _i, _ref2, customSaga;

  return _regenerator["default"].wrap(function rootSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          customSagas = _ref.customSagas, sagaArgs = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["customSagas"]);
          _context.next = 3;
          return (0, _effects.fork)(_subscribe_saga["default"], sagaArgs);

        case 3:
          _context.next = 5;
          return (0, _effects.takeEvery)(_action_types.LOAD_VIEWMODEL_STATE_REQUEST, _load_view_model_state_saga["default"], sagaArgs);

        case 5:
          _context.next = 7;
          return (0, _effects.takeEvery)(_action_types.LOAD_READMODEL_STATE_REQUEST, _load_read_model_state_saga["default"], sagaArgs);

        case 7:
          _context.next = 9;
          return (0, _effects.takeEvery)(_action_types.SEND_COMMAND_REQUEST, _send_command_saga["default"], sagaArgs);

        case 9:
          _context.next = 11;
          return (0, _effects.takeEvery)(_action_types.AUTH_REQUEST, _auth_saga["default"], sagaArgs);

        case 11:
          _context.next = 13;
          return (0, _effects.takeEvery)(_action_types.LOGOUT, _logout_saga["default"], sagaArgs);

        case 13:
          _context.next = 15;
          return (0, _effects.fork)(_view_models_saga["default"], sagaArgs);

        case 15:
          _context.next = 17;
          return (0, _effects.fork)(_read_models_saga["default"], sagaArgs);

        case 17:
          _iterator = customSagas, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

        case 18:
          if (!_isArray) {
            _context.next = 24;
            break;
          }

          if (!(_i >= _iterator.length)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("break", 33);

        case 21:
          _ref2 = _iterator[_i++];
          _context.next = 28;
          break;

        case 24:
          _i = _iterator.next();

          if (!_i.done) {
            _context.next = 27;
            break;
          }

          return _context.abrupt("break", 33);

        case 27:
          _ref2 = _i.value;

        case 28:
          customSaga = _ref2;
          _context.next = 31;
          return (0, _effects.fork)(customSaga, sagaArgs);

        case 31:
          _context.next = 18;
          break;

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var _default = rootSaga;
exports["default"] = _default;
//# sourceMappingURL=root_saga.js.map