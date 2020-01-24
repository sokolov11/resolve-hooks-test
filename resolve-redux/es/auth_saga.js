import _regeneratorRuntime from "@babel/runtime/regenerator";
import { put } from 'redux-saga/effects';
import { authSuccess, authFailure } from './actions';

var authSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function authSaga(_ref, _ref2) {
  var api, url, body;
  return _regeneratorRuntime.wrap(function authSaga$(_context) {
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
          return put(authSuccess(url, body));

        case 7:
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          _context.next = 13;
          return put(authFailure(url, body, _context.t0));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, authSaga, null, [[2, 9]]);
});

export default authSaga;
//# sourceMappingURL=auth_saga.js.map