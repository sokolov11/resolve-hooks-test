import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { take, put, select } from 'redux-saga/effects';
import getHash from './get_hash';
import { aggregateVersionsMap, lastTimestampMap } from './constants';
import { CONNECT_VIEWMODEL, DISPATCH_TOPIC_MESSAGE } from './action_types';
import unsubscribeViewModelTopicsSaga from './unsubscribe_view_model_topics_saga';

var eventListenerSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function eventListenerSaga(_ref, connectAction) {
  var viewModels, sagaKey, sagaManager, eventTypes, store, _ref2, event, _ref3, _ref3$viewModels, viewModelAggregateVersionsMap, viewModelLastTimestampMap, key, lastTimestamp, versionsMap;

  return _regeneratorRuntime.wrap(function eventListenerSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          viewModels = _ref.viewModels, sagaKey = _ref.sagaKey, sagaManager = _ref.sagaManager, eventTypes = _ref.eventTypes, store = _ref.store;

        case 1:
          if (!true) {
            _context.next = 33;
            break;
          }

          _context.next = 4;
          return take(function (action) {
            return action.type === DISPATCH_TOPIC_MESSAGE && eventTypes.indexOf(action.message.type) > -1 && (connectAction.aggregateIds === '*' || connectAction.aggregateIds.indexOf(action.message.aggregateId) > -1);
          });

        case 4:
          _ref2 = _context.sent;
          event = _ref2.message;
          _context.next = 8;
          return select();

        case 8:
          _ref3 = _context.sent;
          _ref3$viewModels = _ref3.viewModels;
          viewModelAggregateVersionsMap = _ref3$viewModels[aggregateVersionsMap];
          viewModelLastTimestampMap = _ref3$viewModels[lastTimestampMap];
          key = "" + connectAction.viewModelName + getHash(connectAction.aggregateIds) + getHash(connectAction.aggregateArgs);

          if (viewModelAggregateVersionsMap.hasOwnProperty(key)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("continue", 1);

        case 15:
          lastTimestamp = viewModelLastTimestampMap[key];
          versionsMap = viewModelAggregateVersionsMap[key];

          if (!versionsMap.hasOwnProperty(event.aggregateId)) {
            versionsMap[event.aggregateId] = 0;
          }

          if (!(event.aggregateVersion > versionsMap[event.aggregateId] && event.timestamp >= lastTimestamp)) {
            _context.next = 31;
            break;
          }

          _context.prev = 19;
          _context.next = 22;
          return put(event);

        case 22:
          versionsMap[event.aggregateId] = event.aggregateVersion;
          viewModelLastTimestampMap[key] = event.timestamp;
          _context.next = 31;
          break;

        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](19);
          // eslint-disable-next-line no-console
          console.warn(_context.t0);
          return _context.delegateYield(unsubscribeViewModelTopicsSaga({
            viewModels: viewModels,
            viewModelName: connectAction.viewModelName,
            aggregateIds: connectAction.aggregateIds
          }), "t1", 30);

        case 30:
          return _context.delegateYield(sagaManager.stop("" + CONNECT_VIEWMODEL + sagaKey, function () {
            return store.dispatch(_objectSpread({}, connectAction, {
              skipConnectionManager: true
            }));
          }), "t2", 31);

        case 31:
          _context.next = 1;
          break;

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, eventListenerSaga, null, [[19, 26]]);
});

export default eventListenerSaga;
//# sourceMappingURL=event_listener_saga.js.map