import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { createStore as reduxCreateStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import uuid from 'uuid/v4';
import createViewModelsReducer from './create_view_models_reducer';
import createReadModelsReducer from './create_read_models_reducer';
import createJwtReducer from './create_jwt_reducer';
import createResolveMiddleware from './create_resolve_middleware';
import syncJwtProviderWithStore from './sync_jwt_provider_with_store';
import emptySubscribeAdapter from './empty_subscribe_adapter';

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
      subscribeAdapter = _ref$subscribeAdapter === void 0 ? emptySubscribeAdapter : _ref$subscribeAdapter,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? undefined : _ref$initialState,
      _ref$jwtProvider = _ref.jwtProvider,
      jwtProvider = _ref$jwtProvider === void 0 ? undefined : _ref$jwtProvider,
      history = _ref.history,
      origin = _ref.origin,
      rootPath = _ref.rootPath,
      isClient = _ref.isClient;
  var sessionId = uuid();
  var resolveMiddleware = createResolveMiddleware();
  var combinedReducers = combineReducers(_objectSpread({}, reducers, {
    router: routerReducer,
    viewModels: createViewModelsReducer(viewModels),
    readModels: createReadModelsReducer(),
    jwt: createJwtReducer()
  }));
  var appliedMiddlewares = applyMiddleware.apply(void 0, [routerMiddleware(history), resolveMiddleware].concat(middlewares));
  var composedEnhancers = compose.apply(void 0, [appliedMiddlewares].concat(enhancers));
  var store = reduxCreateStore(combinedReducers, initialState, composedEnhancers);
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
    syncJwtProviderWithStore(jwtProvider, store)["catch"]( // eslint-disable-next-line no-console
    function (error) {
      return console.error(error);
    });
  }

  return store;
};

export default createStore;
//# sourceMappingURL=create_store.js.map