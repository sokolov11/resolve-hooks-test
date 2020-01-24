import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var deserializeInitialState = function deserializeInitialState(viewModels, serializedInitialState) {
  var initialState = _objectSpread({}, serializedInitialState, {
    viewModels: _objectSpread({}, serializedInitialState.viewModels)
  });

  for (var viewModelIndex = 0; viewModelIndex < viewModels.length; viewModelIndex++) {
    var _viewModels$viewModel = viewModels[viewModelIndex],
        viewModelName = _viewModels$viewModel.name,
        deserializeState = _viewModels$viewModel.deserializeState;
    var viewModelInitialState = initialState.viewModels[viewModelName];

    for (var aggregateId in viewModelInitialState) {
      if (viewModelInitialState.hasOwnProperty(aggregateId)) {
        viewModelInitialState[aggregateId] = deserializeState(viewModelInitialState[aggregateId]);
      }
    }
  }

  return initialState;
};

export default deserializeInitialState;
//# sourceMappingURL=deserialize_initial_state.js.map