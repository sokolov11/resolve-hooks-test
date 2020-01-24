import _regeneratorRuntime from "@babel/runtime/regenerator";
import { put } from 'redux-saga/effects';
import { loadReadModelStateSuccess, loadReadModelStateFailure } from './actions';

var loadReadModelStateSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function loadReadModelStateSaga(_ref, _ref2) {
  var api, readModelName, resolverName, resolverArgs, queryId, _ref3, serializedData, timestamp, data;

  return _regeneratorRuntime.wrap(function loadReadModelStateSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          api = _ref.api;
          readModelName = _ref2.readModelName, resolverName = _ref2.resolverName, resolverArgs = _ref2.resolverArgs, queryId = _ref2.queryId;
          _context.prev = 2;
          _context.next = 5;
          return api.loadReadModelState({
            readModelName: readModelName,
            resolverName: resolverName,
            resolverArgs: resolverArgs,
            queryId: queryId
          });

        case 5:
          _ref3 = _context.sent;
          serializedData = _ref3.result;
          timestamp = _ref3.timestamp;
          data = JSON.parse(serializedData);
          _context.next = 11;
          return put(loadReadModelStateSuccess(readModelName, resolverName, resolverArgs, queryId, data, timestamp));

        case 11:
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          _context.next = 17;
          return put(loadReadModelStateFailure(readModelName, resolverName, resolverArgs, queryId, _context.t0));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, loadReadModelStateSaga, null, [[2, 13]]);
});

export default loadReadModelStateSaga;
//# sourceMappingURL=load_read_model_state_saga.js.map