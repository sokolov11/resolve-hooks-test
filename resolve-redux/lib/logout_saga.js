"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var logoutSaga =
/*#__PURE__*/
_regenerator["default"].mark(function logoutSaga(_ref) {
  var jwtProvider;
  return _regenerator["default"].wrap(function logoutSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          jwtProvider = _ref.jwtProvider;
          _context.next = 3;
          return jwtProvider.set('');

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, logoutSaga);
});

var _default = logoutSaga;
exports["default"] = _default;
//# sourceMappingURL=logout_saga.js.map