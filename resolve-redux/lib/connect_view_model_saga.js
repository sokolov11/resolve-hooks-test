"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var _get_hash = _interopRequireDefault(require("./get_hash"));

var _event_listener_saga = _interopRequireDefault(require("./event_listener_saga"));

var _actions = require("./actions");

var _action_types = require("./action_types");

var _create_api = require("./create_api");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var connectViewModelSaga =
/*#__PURE__*/
_regenerator["default"].mark(function connectViewModelSaga(sagaArgs, action) {
  var viewModels, connectionManager, sagaManager, sagaKey, skipConnectionManager, viewModelName, aggregateIds, aggregateArgs, connectionId, _connectionManager$ad, addedConnections, viewModel, eventTypes, subscriptionKeys, counter, _iterator, _isArray, _i, _ref2, _ref3, aggregateId, eventType, _loop, loadViewModelStateResultAction;

  return _regenerator["default"].wrap(function connectViewModelSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          viewModels = sagaArgs.viewModels, connectionManager = sagaArgs.connectionManager, sagaManager = sagaArgs.sagaManager, sagaKey = sagaArgs.sagaKey, skipConnectionManager = sagaArgs.skipConnectionManager;
          viewModelName = action.viewModelName, aggregateIds = action.aggregateIds, aggregateArgs = action.aggregateArgs;
          connectionId = "" + (0, _get_hash["default"])(action.aggregateIds) + (0, _get_hash["default"])(action.aggregateArgs);

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
          return _context2.delegateYield(sagaManager.stop("" + _action_types.DISCONNECT_VIEWMODEL + sagaKey), "t0", 8);

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
          return (0, _effects.put)((0, _actions.subscribeTopicRequest)(eventType, aggregateId));

        case 27:
          _context2.next = 14;
          break;

        case 29:
          _loop =
          /*#__PURE__*/
          _regenerator["default"].mark(function _loop() {
            var subscribeResultAction;
            return _regenerator["default"].wrap(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _effects.take)(function (action) {
                      return (action.type === _action_types.SUBSCRIBE_TOPIC_SUCCESS || action.type === _action_types.SUBSCRIBE_TOPIC_FAILURE) && subscriptionKeys.find(function (key) {
                        return key.aggregateId === action.topicId && key.eventType === action.topicName;
                      });
                    });

                  case 2:
                    subscribeResultAction = _context.sent;

                    if (subscribeResultAction.type === _action_types.SUBSCRIBE_TOPIC_SUCCESS) {
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
          return _context2.delegateYield(sagaManager.start("" + _action_types.CONNECT_VIEWMODEL + sagaKey, _event_listener_saga["default"], _objectSpread({}, sagaArgs, {
            eventTypes: eventTypes
          }), action), "t2", 37);

        case 37:
          if (!true) {
            _context2.next = 52;
            break;
          }

          _context2.next = 40;
          return (0, _effects.put)((0, _actions.loadViewModelStateRequest)(viewModelName, aggregateIds, aggregateArgs));

        case 40:
          _context2.next = 42;
          return (0, _effects.take)(function (action) {
            return (action.type === _action_types.LOAD_VIEWMODEL_STATE_SUCCESS || action.type === _action_types.LOAD_VIEWMODEL_STATE_FAILURE) && action.viewModelName === viewModelName && "" + (0, _get_hash["default"])(action.aggregateIds) + (0, _get_hash["default"])(action.aggregateArgs) === connectionId;
          });

        case 42:
          loadViewModelStateResultAction = _context2.sent;

          if (!(loadViewModelStateResultAction.type === _action_types.LOAD_VIEWMODEL_STATE_SUCCESS)) {
            _context2.next = 45;
            break;
          }

          return _context2.abrupt("break", 52);

        case 45:
          if (!(loadViewModelStateResultAction.type === _action_types.LOAD_VIEWMODEL_STATE_FAILURE && loadViewModelStateResultAction.error instanceof _create_api.HttpError)) {
            _context2.next = 48;
            break;
          }

          // eslint-disable-next-line no-console
          console.warn('Http error: ', loadViewModelStateResultAction.error);
          return _context2.abrupt("return");

        case 48:
          _context2.next = 50;
          return (0, _effects.delay)(500);

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

var _default = connectViewModelSaga;
exports["default"] = _default;
//# sourceMappingURL=connect_view_model_saga.js.map