import _regeneratorRuntime from "@babel/runtime/regenerator";
import { take, put } from 'redux-saga/effects';
import { unsubscribeTopicRequest } from './actions';
import { UNSUBSCRIBE_TOPIC_FAILURE, UNSUBSCRIBE_TOPIC_SUCCESS } from './action_types';

var unsubscribeViewModelTopicsSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function unsubscribeViewModelTopicsSaga(_ref) {
  var viewModels, viewModelName, aggregateIds, viewModel, eventTypes, subscriptionKeys, counter, _iterator, _isArray, _i, _ref3, _ref4, aggregateId, eventType, _loop;

  return _regeneratorRuntime.wrap(function unsubscribeViewModelTopicsSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          viewModels = _ref.viewModels, viewModelName = _ref.viewModelName, aggregateIds = _ref.aggregateIds;
          viewModel = viewModels.find(function (_ref2) {
            var name = _ref2.name;
            return name === viewModelName;
          });
          eventTypes = Object.keys(viewModel.projection).filter(function (eventType) {
            return eventType !== 'Init';
          });
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

        case 4:
          if (!(subscriptionKeys.length > 0)) {
            _context2.next = 29;
            break;
          }

          counter = subscriptionKeys.length;
          _iterator = subscriptionKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

        case 7:
          if (!_isArray) {
            _context2.next = 13;
            break;
          }

          if (!(_i >= _iterator.length)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("break", 22);

        case 10:
          _ref3 = _iterator[_i++];
          _context2.next = 17;
          break;

        case 13:
          _i = _iterator.next();

          if (!_i.done) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("break", 22);

        case 16:
          _ref3 = _i.value;

        case 17:
          _ref4 = _ref3, aggregateId = _ref4.aggregateId, eventType = _ref4.eventType;
          _context2.next = 20;
          return put(unsubscribeTopicRequest(eventType, aggregateId));

        case 20:
          _context2.next = 7;
          break;

        case 22:
          _loop =
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _loop() {
            var unsubscribeResultAction;
            return _regeneratorRuntime.wrap(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return take( // eslint-disable-next-line no-loop-func
                    function (action) {
                      return (action.type === UNSUBSCRIBE_TOPIC_SUCCESS || action.type === UNSUBSCRIBE_TOPIC_FAILURE) && subscriptionKeys.find(function (key) {
                        return key.aggregateId === action.topicId && key.eventType === action.topicName;
                      });
                    });

                  case 2:
                    unsubscribeResultAction = _context.sent;

                    if (unsubscribeResultAction.type === UNSUBSCRIBE_TOPIC_SUCCESS) {
                      subscriptionKeys = subscriptionKeys.filter(function (key) {
                        return !(key.aggregateId === unsubscribeResultAction.topicId && key.eventType === unsubscribeResultAction.topicName);
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

        case 23:
          if (!(counter > 0)) {
            _context2.next = 27;
            break;
          }

          return _context2.delegateYield(_loop(), "t0", 25);

        case 25:
          _context2.next = 23;
          break;

        case 27:
          _context2.next = 4;
          break;

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, unsubscribeViewModelTopicsSaga);
});

export default unsubscribeViewModelTopicsSaga;
//# sourceMappingURL=unsubscribe_view_model_topics_saga.js.map