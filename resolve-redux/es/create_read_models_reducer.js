import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import getHash from './get_hash';
import { LOAD_READMODEL_STATE_REQUEST, LOAD_READMODEL_STATE_SUCCESS, LOAD_READMODEL_STATE_FAILURE, DROP_READMODEL_STATE } from './action_types';
import { connectorMetaMap } from './constants';
export var dropKey = function dropKey(state, key) {
  var nextState = _objectSpread({}, state);

  delete nextState[key];
  return nextState;
};
export default function createReadModelsReducer() {
  var _state;

  var handlers = {};

  handlers[LOAD_READMODEL_STATE_REQUEST] = function (state, action) {
    var _objectSpread2, _objectSpread3;

    var readModelName = action.readModelName;
    var resolverName = getHash(action.resolverName);
    var resolverArgs = getHash(action.resolverArgs);
    return _objectSpread({}, state, (_objectSpread3 = {}, _objectSpread3[connectorMetaMap] = _objectSpread({}, state[connectorMetaMap], (_objectSpread2 = {}, _objectSpread2["" + readModelName + resolverName + resolverArgs] = {
      isLoading: true,
      isFailure: false
    }, _objectSpread2)), _objectSpread3));
  };

  handlers[LOAD_READMODEL_STATE_SUCCESS] = function (state, action) {
    var _objectSpread4, _objectSpread5, _objectSpread6, _objectSpread7;

    var readModelName = action.readModelName;
    var resolverName = getHash(action.resolverName);
    var resolverArgs = getHash(action.resolverArgs);
    var readModelState = action.result;
    var key = "" + readModelName + resolverName + resolverArgs;
    return _objectSpread({}, state, (_objectSpread7 = {}, _objectSpread7[readModelName] = _objectSpread({}, state[readModelName] || {}, (_objectSpread5 = {}, _objectSpread5[resolverName] = _objectSpread({}, (state[readModelName] || {})[resolverName] || {}, (_objectSpread4 = {}, _objectSpread4[resolverArgs] = readModelState, _objectSpread4)), _objectSpread5)), _objectSpread7[connectorMetaMap] = _objectSpread({}, state[connectorMetaMap], (_objectSpread6 = {}, _objectSpread6[key] = {
      isLoading: false,
      isFailure: false
    }, _objectSpread6)), _objectSpread7));
  };

  handlers[LOAD_READMODEL_STATE_FAILURE] = function (state, action) {
    var _objectSpread8, _objectSpread9;

    var readModelName = action.readModelName;
    var resolverName = getHash(action.resolverName);
    var resolverArgs = getHash(action.resolverArgs);
    var error = action.error;
    var key = "" + readModelName + resolverName + resolverArgs;
    return _objectSpread({}, state, (_objectSpread9 = {}, _objectSpread9[connectorMetaMap] = _objectSpread({}, state[connectorMetaMap], (_objectSpread8 = {}, _objectSpread8[key] = {
      isLoading: false,
      isFailure: true,
      error: error
    }, _objectSpread8)), _objectSpread9));
  };

  handlers[DROP_READMODEL_STATE] = function (state, action) {
    var _objectSpread10, _objectSpread11;

    var readModelName = action.readModelName;
    var resolverName = getHash(action.resolverName);
    var resolverArgs = getHash(action.resolverArgs);
    var key = "" + readModelName + resolverName + resolverArgs;
    return _objectSpread({}, state, (_objectSpread11 = {}, _objectSpread11[readModelName] = _objectSpread({}, state[readModelName], (_objectSpread10 = {}, _objectSpread10[resolverName] = dropKey((state[readModelName] || {})[resolverName], resolverArgs), _objectSpread10)), _objectSpread11[connectorMetaMap] = dropKey(state[connectorMetaMap], key), _objectSpread11));
  };

  var state = (_state = {}, _state[connectorMetaMap] = {}, _state);
  return function (_, action) {
    var eventHandler = handlers[action.type];

    if (eventHandler) {
      state = eventHandler(state, action);
    }

    return state;
  };
}
//# sourceMappingURL=create_read_models_reducer.js.map