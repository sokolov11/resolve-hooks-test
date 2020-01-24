"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _root_saga = _interopRequireDefault(require("./root_saga"));

var _empty_saga = _interopRequireDefault(require("./empty_saga"));

var _create_api = _interopRequireDefault(require("./create_api"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var createResolveMiddleware = function createResolveMiddleware() {
  var sagaMiddleware = (0, _reduxSaga["default"])();
  var sagaMiddlewareRun = sagaMiddleware.run.bind(sagaMiddleware);

  var sagaRunInternal = function sagaRunInternal(sagaArgs) {
    var api = (0, _create_api["default"])(sagaArgs);
    var queryIdMap = new Map();
    sagaMiddlewareRun(sagaArgs.isClient ? _root_saga["default"] : _empty_saga["default"], _objectSpread({}, sagaArgs, {
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

var _default = createResolveMiddleware;
exports["default"] = _default;
//# sourceMappingURL=create_resolve_middleware.js.map