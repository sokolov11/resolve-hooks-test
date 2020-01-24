"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _redux = require("redux");

var _reactRouterRedux = require("react-router-redux");

var _v = _interopRequireDefault(require("uuid/v4"));

var _create_view_models_reducer = _interopRequireDefault(require("./create_view_models_reducer"));

var _create_read_models_reducer = _interopRequireDefault(require("./create_read_models_reducer"));

var _create_jwt_reducer = _interopRequireDefault(require("./create_jwt_reducer"));

var _create_resolve_middleware = _interopRequireDefault(require("./create_resolve_middleware"));

var _sync_jwt_provider_with_store = _interopRequireDefault(require("./sync_jwt_provider_with_store"));

var _empty_subscribe_adapter = _interopRequireDefault(require("./empty_subscribe_adapter"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var createStore = function createStore(_ref) {
  var _ref$redux = _ref.redux;
  _ref$redux = _ref$redux === void 0 ? {} : _ref$redux;
  var _ref$redux$reducers = _ref$redux.reducers,
      reducers = _ref$redux$reducers === void 0 ? {} : _ref$redux$reducers,
      _ref$redux$middleware = _ref$redux.middlewares,
      middlewares = _ref$redux$middleware === void 0 ? [] : _ref$redux$middleware,
      _ref$redux$enhancers = _ref$redux.enhancers,
      enhancers = _ref$redux$enhancers === void 0 ? [] : _ref$redux$enhancers,
      _ref$redux$sagas = _ref$redux.sagas,
      customSagas = _ref$redux$sagas === void 0 ? [] : _ref$redux$sagas,
      _ref$viewModels = _ref.viewModels,
      viewModels = _ref$viewModels === void 0 ? [] : _ref$viewModels,
      _ref$subscribeAdapter = _ref.subscribeAdapter,
      subscribeAdapter = _ref$subscribeAdapter === void 0 ? _empty_subscribe_adapter["default"] : _ref$subscribeAdapter,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? undefined : _ref$initialState,
      _ref$jwtProvider = _ref.jwtProvider,
      jwtProvider = _ref$jwtProvider === void 0 ? undefined : _ref$jwtProvider,
      history = _ref.history,
      origin = _ref.origin,
      rootPath = _ref.rootPath,
      isClient = _ref.isClient;
  var sessionId = (0, _v["default"])();
  var resolveMiddleware = (0, _create_resolve_middleware["default"])();
  var combinedReducers = (0, _redux.combineReducers)(_objectSpread({}, reducers, {
    router: _reactRouterRedux.routerReducer,
    viewModels: (0, _create_view_models_reducer["default"])(viewModels),
    readModels: (0, _create_read_models_reducer["default"])(),
    jwt: (0, _create_jwt_reducer["default"])()
  }));

  var appliedMiddlewares = _redux.applyMiddleware.apply(void 0, [(0, _reactRouterRedux.routerMiddleware)(history), resolveMiddleware].concat(middlewares));

  var composedEnhancers = _redux.compose.apply(void 0, [appliedMiddlewares].concat(enhancers));

  var store = (0, _redux.createStore)(combinedReducers, initialState, composedEnhancers);
  resolveMiddleware.run({
    store: store,
    viewModels: viewModels,
    origin: origin,
    rootPath: rootPath,
    subscribeAdapter: subscribeAdapter,
    sessionId: sessionId,
    jwtProvider: jwtProvider,
    isClient: isClient,
    customSagas: customSagas
  });

  if (jwtProvider != null) {
    (0, _sync_jwt_provider_with_store["default"])(jwtProvider, store)["catch"]( // eslint-disable-next-line no-console
    function (error) {
      return console.error(error);
    });
  }

  return store;
};

var _default = createStore;
exports["default"] = _default;
//# sourceMappingURL=create_store.js.map