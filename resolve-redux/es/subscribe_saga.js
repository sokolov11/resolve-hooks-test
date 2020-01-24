import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import { put, takeEvery, fork, delay } from 'redux-saga/effects';
import createConnectionManager from './create_connection_manager';
import createEmptySubscribeAdapter from './empty_subscribe_adapter';
import { SUBSCRIBE_TOPIC_REQUEST, UNSUBSCRIBE_TOPIC_REQUEST } from './action_types';
import { subscribeTopicSuccess, subscribeTopicFailure, unsubscribeTopicSuccess, unsubscribeTopicFailure, dispatchTopicMessage } from './actions';
var SUBSCRIBE_ADAPTER_POLL_INTERVAL = 5000;

var initSubscribeAdapter =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(_ref) {
    var api, origin, rootPath, store, createSubscribeAdapter, _ref3, appId, url, onEvent, subscribeAdapter;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            api = _ref.api, origin = _ref.origin, rootPath = _ref.rootPath, store = _ref.store, createSubscribeAdapter = _ref.subscribeAdapter;

            if (!(createSubscribeAdapter === createEmptySubscribeAdapter)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", createEmptySubscribeAdapter());

          case 3:
            _context.next = 5;
            return api.getSubscribeAdapterOptions(createSubscribeAdapter.adapterName);

          case 5:
            _ref3 = _context.sent;
            appId = _ref3.appId;
            url = _ref3.url;

            onEvent = function onEvent(event) {
              return store.dispatch(dispatchTopicMessage(event));
            };

            subscribeAdapter = createSubscribeAdapter({
              appId: appId,
              origin: origin,
              rootPath: rootPath,
              url: url,
              onEvent: onEvent
            });
            _context.next = 12;
            return subscribeAdapter.init();

          case 12:
            return _context.abrupt("return", subscribeAdapter);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initSubscribeAdapter(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var subscribeSaga =
/*#__PURE__*/
_regeneratorRuntime.mark(function subscribeSaga(subscribeSagaOptions) {
  var connectionManager, subscribeAdapterPromise;
  return _regeneratorRuntime.wrap(function subscribeSaga$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          connectionManager = createConnectionManager();
          subscribeAdapterPromise = initSubscribeAdapter(subscribeSagaOptions);
          _context5.next = 4;
          return fork(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee2() {
            var subscribeAdapter, activeConnections, refreshSubscribeAdapter;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!true) {
                      _context2.next = 35;
                      break;
                    }

                    _context2.next = 3;
                    return delay(SUBSCRIBE_ADAPTER_POLL_INTERVAL);

                  case 3:
                    subscribeAdapter = null;
                    _context2.prev = 4;
                    _context2.next = 7;
                    return subscribeAdapterPromise;

                  case 7:
                    subscribeAdapter = _context2.sent;

                    if (!subscribeAdapter.isConnected()) {
                      _context2.next = 10;
                      break;
                    }

                    return _context2.abrupt("continue", 0);

                  case 10:
                    _context2.next = 14;
                    break;

                  case 12:
                    _context2.prev = 12;
                    _context2.t0 = _context2["catch"](4);

                  case 14:
                    activeConnections = connectionManager.getConnections();
                    refreshSubscribeAdapter = null;
                    subscribeAdapterPromise = new Promise(function (resolve, reject) {
                      return refreshSubscribeAdapter = function refreshSubscribeAdapter(value) {
                        return value != null && value instanceof Error ? reject(value) : resolve(value);
                      };
                    });
                    subscribeAdapterPromise["catch"](function () {});
                    _context2.prev = 18;

                    if (!(subscribeAdapter != null)) {
                      _context2.next = 22;
                      break;
                    }

                    _context2.next = 22;
                    return subscribeAdapter.close();

                  case 22:
                    _context2.next = 24;
                    return initSubscribeAdapter(subscribeSagaOptions);

                  case 24:
                    subscribeAdapter = _context2.sent;
                    _context2.next = 27;
                    return subscribeAdapter.subscribeToTopics(activeConnections.map(function (_ref4) {
                      var connectionName = _ref4.connectionName,
                          connectionId = _ref4.connectionId;
                      return {
                        topicName: connectionName,
                        topicId: connectionId
                      };
                    }));

                  case 27:
                    refreshSubscribeAdapter(subscribeAdapter);
                    _context2.next = 33;
                    break;

                  case 30:
                    _context2.prev = 30;
                    _context2.t1 = _context2["catch"](18);
                    refreshSubscribeAdapter(_context2.t1);

                  case 33:
                    _context2.next = 0;
                    break;

                  case 35:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[4, 12], [18, 30]]);
          }));

        case 4:
          _context5.next = 6;
          return takeEvery(SUBSCRIBE_TOPIC_REQUEST,
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee3(_ref5) {
            var topicName, topicId, subscribeAdapter, _connectionManager$ad, addedConnections, removedConnections;

            return _regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    topicName = _ref5.topicName, topicId = _ref5.topicId;
                    _context3.next = 3;
                    return subscribeAdapterPromise;

                  case 3:
                    subscribeAdapter = _context3.sent;
                    _connectionManager$ad = connectionManager.addConnection({
                      connectionName: topicName,
                      connectionId: topicId
                    }), addedConnections = _connectionManager$ad.addedConnections, removedConnections = _connectionManager$ad.removedConnections;
                    _context3.prev = 5;
                    _context3.next = 8;
                    return Promise.all([addedConnections.length > 0 ? subscribeAdapter.subscribeToTopics(addedConnections.map(function (_ref6) {
                      var connectionName = _ref6.connectionName,
                          connectionId = _ref6.connectionId;
                      return {
                        topicName: connectionName,
                        topicId: connectionId
                      };
                    })) : Promise.resolve(), removedConnections.length > 0 ? subscribeAdapter.unsubscribeFromTopics(removedConnections.map(function (_ref7) {
                      var connectionName = _ref7.connectionName,
                          connectionId = _ref7.connectionId;
                      return {
                        topicName: connectionName,
                        topicId: connectionId
                      };
                    })) : Promise.resolve()]);

                  case 8:
                    _context3.next = 10;
                    return put(subscribeTopicSuccess(topicName, topicId));

                  case 10:
                    _context3.next = 16;
                    break;

                  case 12:
                    _context3.prev = 12;
                    _context3.t0 = _context3["catch"](5);
                    _context3.next = 16;
                    return put(subscribeTopicFailure(topicName, topicId, _context3.t0));

                  case 16:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, null, [[5, 12]]);
          }));

        case 6:
          _context5.next = 8;
          return takeEvery(UNSUBSCRIBE_TOPIC_REQUEST,
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee4(_ref8) {
            var topicName, topicId, subscribeAdapter, _connectionManager$re, addedConnections, removedConnections;

            return _regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    topicName = _ref8.topicName, topicId = _ref8.topicId;
                    _context4.next = 3;
                    return subscribeAdapterPromise;

                  case 3:
                    subscribeAdapter = _context4.sent;
                    _connectionManager$re = connectionManager.removeConnection({
                      connectionName: topicName,
                      connectionId: topicId
                    }), addedConnections = _connectionManager$re.addedConnections, removedConnections = _connectionManager$re.removedConnections;
                    _context4.prev = 5;
                    _context4.next = 8;
                    return Promise.all([addedConnections.length > 0 ? subscribeAdapter.subscribeToTopics(addedConnections.map(function (_ref9) {
                      var connectionName = _ref9.connectionName,
                          connectionId = _ref9.connectionId;
                      return {
                        topicName: connectionName,
                        topicId: connectionId
                      };
                    })) : Promise.resolve(), removedConnections.length > 0 ? subscribeAdapter.unsubscribeFromTopics(removedConnections.map(function (_ref10) {
                      var connectionName = _ref10.connectionName,
                          connectionId = _ref10.connectionId;
                      return {
                        topicName: connectionName,
                        topicId: connectionId
                      };
                    })) : Promise.resolve()]);

                  case 8:
                    _context4.next = 10;
                    return put(unsubscribeTopicSuccess(topicName, topicId));

                  case 10:
                    _context4.next = 16;
                    break;

                  case 12:
                    _context4.prev = 12;
                    _context4.t0 = _context4["catch"](5);
                    _context4.next = 16;
                    return put(unsubscribeTopicFailure(topicName, topicId, _context4.t0));

                  case 16:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, null, [[5, 12]]);
          }));

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, subscribeSaga);
});

export default subscribeSaga;
//# sourceMappingURL=subscribe_saga.js.map