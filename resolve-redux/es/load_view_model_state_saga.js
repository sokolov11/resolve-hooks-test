import _regeneratorRuntime from "@babel/runtime/regenerator";
import { put } from 'redux-saga/effects';
import { loadViewModelStateSuccess, loadViewModelStateFailure } from './actions';

var loadViewModelStateSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function loadViewModelStateSaga(_ref, _ref2) {
  var api, viewModels, viewModelName, aggregateIds, aggregateArgs, _ref3, serializedState, timestamp, _viewModels$find, deserializeState, state;

  return _regeneratorRuntime.wrap(function loadViewModelStateSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          api = _ref.api, viewModels = _ref.viewModels;
          viewModelName = _ref2.viewModelName, aggregateIds = _ref2.aggregateIds, aggregateArgs = _ref2.aggregateArgs;
          _context.prev = 2;
          _context.next = 5;
          return api.loadViewModelState({
            viewModelName: viewModelName,
            aggregateIds: aggregateIds,
            aggregateArgs: aggregateArgs
          });

        case 5:
          _ref3 = _context.sent;
          serializedState = _ref3.result;
          timestamp = _ref3.timestamp;
          _viewModels$find = viewModels.find(function (_ref4) {
            var name = _ref4.name;
            return name === viewModelName;
          }), deserializeState = _viewModels$find.deserializeState;
          state = deserializeState(serializedState);
          _context.next = 12;
          return put(loadViewModelStateSuccess(viewModelName, aggregateIds, aggregateArgs, state, timestamp));

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](2);
          _context.next = 18;
          return put(loadViewModelStateFailure(viewModelName, aggregateIds, aggregateArgs, _context.t0));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, loadViewModelStateSaga, null, [[2, 14]]);
});

export default loadViewModelStateSaga;
//# sourceMappingURL=load_view_model_state_saga.js.map