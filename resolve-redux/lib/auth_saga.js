"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var _actions = require("./actions");

var authSaga =
/*#__PURE__*/
_regenerator["default"].mark(function authSaga(_ref, _ref2) {
  var api, url, body;
  return _regenerator["default"].wrap(function authSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          api = _ref.api;
          url = _ref2.url, body = _ref2.body;
          _context.prev = 2;
          _context.next = 5;
          return api.request({
            url: url,
            body: body
          });

        case 5:
          _context.next = 7;
          return (0, _effects.put)((0, _actions.authSuccess)(url, body));

        case 7:
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          _context.next = 13;
          return (0, _effects.put)((0, _actions.authFailure)(url, body, _context.t0));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, authSaga, null, [[2, 9]]);
});

var _default = authSaga;
exports["default"] = _default;
//# sourceMappingURL=auth_saga.js.map