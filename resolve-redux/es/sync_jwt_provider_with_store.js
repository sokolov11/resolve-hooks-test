import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import jwtDecode from 'jwt-decode';
import stableStringify from 'json-stable-stringify';
import { updateJwt } from './actions';

var syncJwtProviderWithStore =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(jwtProvider, store) {
    var jwtToken, jwt;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
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
              jwt = jwtDecode(jwtToken);
            } catch (err) {}

            if (stableStringify(store.getState().jwt) !== stableStringify(jwt)) {
              store.dispatch(updateJwt(jwt));
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

export default syncJwtProviderWithStore;
//# sourceMappingURL=sync_jwt_provider_with_store.js.map