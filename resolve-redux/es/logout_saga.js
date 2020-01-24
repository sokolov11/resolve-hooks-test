import _regeneratorRuntime from "@babel/runtime/regenerator";

var logoutSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function logoutSaga(_ref) {
  var jwtProvider;
  return _regeneratorRuntime.wrap(function logoutSaga$(_context) {
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

export default logoutSaga;
//# sourceMappingURL=logout_saga.js.map