import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import getHash from './get_hash';
import { LOAD_VIEWMODEL_STATE_REQUEST, LOAD_VIEWMODEL_STATE_SUCCESS, LOAD_VIEWMODEL_STATE_FAILURE, DROP_VIEWMODEL_STATE, CONNECT_VIEWMODEL, DISCONNECT_VIEWMODEL } from './action_types';
import { connectorMetaMap, aggregateVersionsMap, lastTimestampMap } from './constants';
export var dropKey = function dropKey(state, key) {
  var nextState = _objectSpread({}, state);

  delete nextState[key];
  return nextState;
};
export default function createViewModelsReducer(viewModels) {
  var _state;

  var handlers = {};

  handlers[LOAD_VIEWMODEL_STATE_REQUEST] = function (state, action) {
    var _objectSpread2, _objectSpread3, _objectSpread4, _objectSpread5;

    var viewModelName = action.viewModelName;
    var aggregateIds = getHash(action.aggregateIds);
    var aggregateArgs = getHash(action.aggregateArgs);
    var key = "" + viewModelName + aggregateIds + aggregateArgs;
    return _objectSpread({}, state, (_objectSpread5 = {}, _objectSpread5[connectorMetaMap] = _objectSpread({}, state[connectorMetaMap], (_objectSpread2 = {}, _objectSpread2["" + viewModelName + aggregateIds + aggregateArgs] = {
      isLoading: true,
      isFailure: false
    }, _objectSpread2)), _objectSpread5[aggregateVersionsMap] = _objectSpread({}, state[aggregateVersionsMap], (_objectSpread3 = {}, _objectSpread3[key] = {}, _objectSpread3)), _objectSpread5[lastTimestampMap] = _objectSpread({}, state[lastTimestampMap], (_objectSpread4 = {}, _objectSpread4[key] = +Infinity, _objectSpread4)), _objectSpread5));
  };

  handlers[LOAD_VIEWMODEL_STATE_SUCCESS] = function (state, action) {
    var _objectSpread6, _objectSpread7, _objectSpread8, _objectSpread9, _objectSpread10;

    var viewModelName = action.viewModelName;
    var aggregateIds = getHash(action.aggregateIds);
    var aggregateArgs = getHash(action.aggregateArgs);
    var viewModelState = action.result;
    var viewModelTimestamp = action.timestamp;
    var key = "" + viewModelName + aggregateIds + aggregateArgs;
    return _objectSpread({}, state, (_objectSpread10 = {}, _objectSpread10[viewModelName] = _objectSpread({}, state[viewModelName] || {}, (_objectSpread7 = {}, _objectSpread7[aggregateIds] = _objectSpread({}, (state[viewModelName] || {})[aggregateIds] || {}, (_objectSpread6 = {}, _objectSpread6[aggregateArgs] = viewModelState, _objectSpread6)), _objectSpread7)), _objectSpread10[connectorMetaMap] = _objectSpread({}, state[connectorMetaMap], (_objectSpread8 = {}, _objectSpread8[key] = {
      isLoading: false,
      isFailure: false
    }, _objectSpread8)), _objectSpread10[lastTimestampMap] = _objectSpread({}, state[lastTimestampMap], (_objectSpread9 = {}, _objectSpread9[key] = viewModelTimestamp, _objectSpread9)), _objectSpread10));
  };

  handlers[LOAD_VIEWMODEL_STATE_FAILURE] = function (state, action) {
    var _objectSpread11, _objectSpread12;

    var viewModelName = action.viewModelName;
    var aggregateIds = getHash(action.aggregateIds);
    var aggregateArgs = getHash(action.aggregateArgs);
    var error = action.error;
    var key = "" + viewModelName + aggregateIds + aggregateArgs;
    return _objectSpread({}, state, (_objectSpread12 = {}, _objectSpread12[connectorMetaMap] = _objectSpread({}, state[connectorMetaMap], (_objectSpread11 = {}, _objectSpread11[key] = {
      isLoading: false,
      isFailure: true,
      error: error
    }, _objectSpread11)), _objectSpread12));
  };

  handlers[DROP_VIEWMODEL_STATE] = function (state, action) {
    var _objectSpread13, _objectSpread14;

    var viewModelName = action.viewModelName;
    var aggregateIds = getHash(action.aggregateIds);
    var aggregateArgs = getHash(action.aggregateArgs);
    var key = "" + viewModelName + aggregateIds + aggregateArgs;
    return _objectSpread({}, state, (_objectSpread14 = {}, _objectSpread14[viewModelName] = _objectSpread({}, state[viewModelName], (_objectSpread13 = {}, _objectSpread13[aggregateIds] = dropKey(state[viewModelName][aggregateIds], aggregateArgs), _objectSpread13)), _objectSpread14[connectorMetaMap] = dropKey(state[connectorMetaMap], key), _objectSpread14[aggregateVersionsMap] = dropKey(state[aggregateVersionsMap], key), _objectSpread14[lastTimestampMap] = dropKey(state[lastTimestampMap], key), _objectSpread14));
  };

  var aggregateHash = new Map();

  handlers[CONNECT_VIEWMODEL] = function (state, action) {
    if (action.aggregateIds !== '*') {
      var aggregatesKey = getHash(action.aggregateIds);

      for (var _iterator = action.aggregateIds, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var aggregateId = _ref;

        if (!aggregateHash.has(aggregateId)) {
          aggregateHash.set(aggregateId, []);
        }

        aggregateHash.get(aggregateId).push(aggregatesKey);
      }
    }

    return state;
  };

  handlers[DISCONNECT_VIEWMODEL] = function (state, action) {
    if (action.aggregateIds !== '*') {
      var aggregatesKey = getHash(action.aggregateIds);

      for (var _iterator2 = action.aggregateIds, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var aggregateId = _ref2;
        var aggregateKeys = aggregateHash.get(aggregateId);
        var idx = aggregateKeys.indexOf(aggregatesKey);

        if (idx >= 0) {
          aggregateKeys.splice(idx, 1);
        }

        if (aggregateKeys.length === 0) {
          aggregateHash["delete"](aggregateId);
        }
      }
    }

    return state;
  };

  var uniqueListeners = new Map();

  for (var _iterator3 = viewModels, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var viewModel = _ref3;

    for (var _iterator5 = Object.keys(viewModel.projection).filter(function (eventType) {
      return eventType !== 'Init';
    }), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref5 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref5 = _i5.value;
      }

      var eventType = _ref5;

      if (!uniqueListeners.has(eventType)) {
        uniqueListeners.set(eventType, []);
      }

      uniqueListeners.get(eventType).push(viewModel);
    }
  }

  var _loop = function _loop() {
    if (_isArray4) {
      if (_i4 >= _iterator4.length) return "break";
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) return "break";
      _ref4 = _i4.value;
    }

    var _ref6 = _ref4,
        eventType = _ref6[0],
        viewModels = _ref6[1];

    handlers[eventType] = function (state, action) {
      for (var _iterator6 = viewModels, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
        var _ref7;

        if (_isArray6) {
          if (_i6 >= _iterator6.length) break;
          _ref7 = _iterator6[_i6++];
        } else {
          _i6 = _iterator6.next();
          if (_i6.done) break;
          _ref7 = _i6.value;
        }

        var _viewModel = _ref7;
        var handler = _viewModel.projection[action.type];
        var aggregateKeys = Array.from(new Set(aggregateHash.get(action.aggregateId)));

        for (var _i7 = 0, _aggregateKeys = aggregateKeys; _i7 < _aggregateKeys.length; _i7++) {
          var aggregateKey = _aggregateKeys[_i7];

          if (state[_viewModel.name] && state[_viewModel.name][aggregateKey]) {
            for (var _i9 = 0, _Object$keys2 = Object.keys(state[_viewModel.name][aggregateKey]); _i9 < _Object$keys2.length; _i9++) {
              var _aggregateArgs = _Object$keys2[_i9];
              state[_viewModel.name][aggregateKey][_aggregateArgs] = handler(state[_viewModel.name][aggregateKey][_aggregateArgs], action);
            }

            state[_viewModel.name][aggregateKey] = _objectSpread({}, state[_viewModel.name][aggregateKey]);
          }
        }

        if (state[_viewModel.name] && state[_viewModel.name]['*']) {
          for (var _i8 = 0, _Object$keys = Object.keys(state[_viewModel.name]['*']); _i8 < _Object$keys.length; _i8++) {
            var aggregateArgs = _Object$keys[_i8];
            state[_viewModel.name]['*'][aggregateArgs] = handler(state[_viewModel.name]['*'][aggregateArgs], action);
          }

          state[_viewModel.name]['*'] = _objectSpread({}, state[_viewModel.name]['*']);
        }

        state[_viewModel.name] = _objectSpread({}, state[_viewModel.name]);
      }

      return _objectSpread({}, state);
    };
  };

  for (var _iterator4 = uniqueListeners.entries(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
    var _ref4;

    var _ret = _loop();

    if (_ret === "break") break;
  }

  var state = (_state = {}, _state[connectorMetaMap] = {}, _state[aggregateVersionsMap] = {}, _state[lastTimestampMap] = {}, _state);
  return function (_, action) {
    var eventHandler = handlers[action.type];

    if (eventHandler) {
      state = eventHandler(state, action);
    }

    return state;
  };
}
//# sourceMappingURL=create_view_models_reducer.js.map