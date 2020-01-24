import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { take, put, delay } from 'redux-saga/effects';
import getHash from './get_hash';
import eventListenerSaga from './event_listener_saga';
import { subscribeTopicRequest, loadViewModelStateRequest } from './actions';
import { CONNECT_VIEWMODEL, DISCONNECT_VIEWMODEL, SUBSCRIBE_TOPIC_SUCCESS, SUBSCRIBE_TOPIC_FAILURE, LOAD_VIEWMODEL_STATE_FAILURE, LOAD_VIEWMODEL_STATE_SUCCESS } from './action_types';
import { HttpError } from './create_api';
/*
  Saga is launched on action `CONNECT_VIEWMODEL`, emitted by view model connector.
  If view model with supposed options had already been fetched, do nothing.
  Saga performs view model state fetching and subscribe to topics Array<{aggregateId, eventType}>
  If launches `event_listener_saga`.
  Saga ends when view model state is fetched and all necessary topics are acknowledged.
  View model state is fetched by `load_view_model_state_saga`, interaction
  performs through following actions: `LOAD_VIEWMODEL_STATE_REQUEST`,
  `LOAD_VIEWMODEL_STATE_SUCCESS` and `LOAD_VIEWMODEL_STATE_FAILURE`.
  Subscription to necessary topics are performed by `subscribe_saga`, interaction
  performs by following actions: `SUBSCRIBE_TOPIC_REQUEST`,
  `SUBSCRIBE_TOPIC_SUCCESS` and `SUBSCRIBE_TOPIC_FAILURE`.
*/

var connectViewModelSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function connectViewModelSaga(sagaArgs, action) {
  var viewModels, connectionManager, sagaManager, sagaKey, skipConnectionManager, viewModelName, aggregateIds, aggregateArgs, connectionId, _connectionManager$ad, addedConnections, viewModel, eventTypes, subscriptionKeys, counter, _iterator, _isArray, _i, _ref2, _ref3, aggregateId, eventType, _loop, loadViewModelStateResultAction;

  return _regeneratorRuntime.wrap(function connectViewModelSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          viewModels = sagaArgs.viewModels, connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey, skipConnectionManager = sagaArgs.skipConnectionManager;
          viewModelName = action.viewModelName, aggregateIds = action.aggregateIds, aggregateArgs = action.aggregateArgs;
          connectionId = "" + getHash(action.aggregateIds) + getHash(action.aggregateArgs);

          if (skipConnectionManager) {
            _context2.next = 7;
            break;
          }

          _connectionManager$ad = connectionManager.addConnection({
            connectionName: viewModelName,
            connectionId: connectionId
          }), addedConnections = _connectionManager$ad.addedConnections;

          if (!(addedConnections.length !== 1)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return");

        case 7:
          return _context2.delegateYield(sagaManager.stop("" + DISCONNECT_VIEWMODEL + sagaKey), "t0", 8);

        case 8:
          viewModel = viewModels.find(function (_ref) {
            var name = _ref.name;
            return name === viewModelName;
          });
          eventTypes = Object.keys(viewModel.projection).filter(function (eventType) {
            return eventType !== 'Init';
          }); // viewModelName + aggregateIds => Array<{ aggregateId, eventType }>

          subscriptionKeys = eventTypes.reduce(function (acc, eventType) {
            if (Array.isArray(aggregateIds)) {
              acc.push.apply(acc, aggregateIds.map(function (aggregateId) {
                return {
                  aggregateId: aggregateId,
                  eventType: eventType
                };
              }));
            } else if (aggregateIds === '*') {
              acc.push({
                aggregateId: '*',
                eventType: eventType
              });
            }

            return acc;
          }, []);

        case 11:
          if (!(subscriptionKeys.length > 0)) {
            _context2.next = 36;
            break;
          }

          counter = subscriptionKeys.length;
          _iterator = subscriptionKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

        case 14:
          if (!_isArray) {
            _context2.next = 20;
            break;
          }

          if (!(_i >= _iterator.length)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("break", 29);

        case 17:
          _ref2 = _iterator[_i++];
          _context2.next = 24;
          break;

        case 20:
          _i = _iterator.next();

          if (!_i.done) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("break", 29);

        case 23:
          _ref2 = _i.value;

        case 24:
          _ref3 = _ref2, aggregateId = _ref3.aggregateId, eventType = _ref3.eventType;
          _context2.next = 27;
          return put(subscribeTopicRequest(eventType, aggregateId));

        case 27:
          _context2.next = 14;
          break;

        case 29:
          _loop =
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _loop() {
            var subscribeResultAction;
            return _regeneratorRuntime.wrap(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return take(function (action) {
                      return (action.type === SUBSCRIBE_TOPIC_SUCCESS || action.type === SUBSCRIBE_TOPIC_FAILURE) && subscriptionKeys.find(function (key) {
                        return key.aggregateId === action.topicId && key.eventType === action.topicName;
                      });
                    });

                  case 2:
                    subscribeResultAction = _context.sent;

                    if (subscribeResultAction.type === SUBSCRIBE_TOPIC_SUCCESS) {
                      subscriptionKeys = subscriptionKeys.filter(function (key) {
                        return !(key.aggregateId === subscribeResultAction.topicId && key.eventType === subscribeResultAction.topicName);
                      });
                    }

                    counter--;

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _loop);
          });

        case 30:
          if (!(counter > 0)) {
            _context2.next = 34;
            break;
          }

          return _context2.delegateYield(_loop(), "t1", 32);

        case 32:
          _context2.next = 30;
          break;

        case 34:
          _context2.next = 11;
          break;

        case 36:
          return _context2.delegateYield(sagaManager.start("" + CONNECT_VIEWMODEL + sagaKey, eventListenerSaga, _objectSpread({}, sagaArgs, {
            eventTypes: eventTypes
          }), action), "t2", 37);

        case 37:
          if (!true) {
            _context2.next = 52;
            break;
          }

          _context2.next = 40;
          return put(loadViewModelStateRequest(viewModelName, aggregateIds, aggregateArgs));

        case 40:
          _context2.next = 42;
          return take(function (action) {
            return (action.type === LOAD_VIEWMODEL_STATE_SUCCESS || action.type === LOAD_VIEWMODEL_STATE_FAILURE) && action.viewModelName === viewModelName && "" + getHash(action.aggregateIds) + getHash(action.aggregateArgs) === connectionId;
          });

        case 42:
          loadViewModelStateResultAction = _context2.sent;

          if (!(loadViewModelStateResultAction.type === LOAD_VIEWMODEL_STATE_SUCCESS)) {
            _context2.next = 45;
            break;
          }

          return _context2.abrupt("break", 52);

        case 45:
          if (!(loadViewModelStateResultAction.type === LOAD_VIEWMODEL_STATE_FAILURE && loadViewModelStateResultAction.error instanceof HttpError)) {
            _context2.next = 48;
            break;
          }

          // eslint-disable-next-line no-console
          console.warn('Http error: ', loadViewModelStateResultAction.error);
          return _context2.abrupt("return");

        case 48:
          _context2.next = 50;
          return delay(500);

        case 50:
          _context2.next = 37;
          break;

        case 52:
        case "end":
          return _context2.stop();
      }
    }
  }, connectViewModelSaga);
});

export default connectViewModelSaga;
//# sourceMappingURL=connect_view_model_saga.js.map