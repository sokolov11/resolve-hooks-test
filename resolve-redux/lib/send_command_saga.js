"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var _create_api = require("./create_api");

var _actions = require("./actions");

var CONCURRENT_ERROR_RETRY_COUNT = 3;
var CONCURRENT_ERROR_CODE = 408;

var sendCommandSaga =
/*#__PURE__*/
_regenerator["default"].mark(function sendCommandSaga(_ref, _ref2) {
  var api, commandType, aggregateId, aggregateName, payload, event, lastError, index;
  return _regenerator["default"].wrap(function sendCommandSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          api = _ref.api;
          commandType = _ref2.commandType, aggregateId = _ref2.aggregateId, aggregateName = _ref2.aggregateName, payload = _ref2.payload;
          event = null;
          lastError = null;
          _context.prev = 4;
          index = 0;

        case 6:
          if (!(index < CONCURRENT_ERROR_RETRY_COUNT)) {
            _context.next = 26;
            break;
          }

          _context.prev = 7;
          _context.next = 10;
          return api.sendCommand({
            commandType: commandType,
            aggregateId: aggregateId,
            aggregateName: aggregateName,
            payload: payload
          });

        case 10:
          event = _context.sent;
          lastError = null;
          return _context.abrupt("break", 26);

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](7);
          lastError = _context.t0;

          if (!(_context.t0 instanceof _create_api.HttpError && _context.t0.code === CONCURRENT_ERROR_CODE)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("continue", 23);

        case 22:
          return _context.abrupt("break", 26);

        case 23:
          index++;
          _context.next = 6;
          break;

        case 26:
          if (!(lastError != null)) {
            _context.next = 28;
            break;
          }

          throw lastError;

        case 28:
          _context.next = 30;
          return (0, _effects.put)((0, _actions.sendCommandSuccess)(commandType, aggregateId, aggregateName, payload));

        case 30:
          _context.next = 32;
          return (0, _effects.put)((0, _actions.dispatchTopicMessage)(event));

        case 32:
          _context.next = 38;
          break;

        case 34:
          _context.prev = 34;
          _context.t1 = _context["catch"](4);
          _context.next = 38;
          return (0, _effects.put)((0, _actions.sendCommandFailure)(commandType, aggregateId, aggregateName, payload, _context.t1));

        case 38:
        case "end":
          return _context.stop();
      }
    }
  }, sendCommandSaga, null, [[4, 34], [7, 15]]);
});

var _default = sendCommandSaga;
exports["default"] = _default;
//# sourceMappingURL=send_command_saga.js.map