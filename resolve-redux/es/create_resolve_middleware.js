import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import createSagaMiddleware from 'redux-saga';
import rootSaga from './root_saga';
import emptySaga from './empty_saga';
import createApi from './create_api';

var createResolveMiddleware = function createResolveMiddleware() {
  var sagaMiddleware = createSagaMiddleware();
  var sagaMiddlewareRun = sagaMiddleware.run.bind(sagaMiddleware);

  var sagaRunInternal = function sagaRunInternal(sagaArgs) {
    var api = createApi(sagaArgs);
    var queryIdMap = new Map();
    sagaMiddlewareRun(sagaArgs.isClient ? rootSaga : emptySaga, _objectSpread({}, sagaArgs, {
      queryIdMap: queryIdMap,
      api: api
    }));
  };

  Object.defineProperty(sagaMiddleware, 'run', {
    get: function get() {
      return sagaRunInternal;
    },
    set: function set(value) {
      return sagaMiddlewareRun = value.bind(sagaMiddleware);
    }
  });
  return sagaMiddleware;
};

export default createResolveMiddleware;
//# sourceMappingURL=create_resolve_middleware.js.map