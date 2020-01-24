"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jwtDecode = _interopRequireDefault(require("jwt-decode"));

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _actions = require("./actions");

var syncJwtProviderWithStore =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(jwtProvider, store) {
    var jwtToken, jwt;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!jwtProvider) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return jwtProvider.get();

          case 3:
            jwtToken = _context.sent;
            jwt = store.getState().jwt;

            try {
              jwt = (0, _jwtDecode["default"])(jwtToken);
            } catch (err) {}

            if ((0, _jsonStableStringify["default"])(store.getState().jwt) !== (0, _jsonStableStringify["default"])(jwt)) {
              store.dispatch((0, _actions.updateJwt)(jwt));
            }

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function syncJwtProviderWithStore(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = syncJwtProviderWithStore;
exports["default"] = _default;
//# sourceMappingURL=sync_jwt_provider_with_store.js.map