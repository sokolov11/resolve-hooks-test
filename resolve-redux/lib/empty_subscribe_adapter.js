"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var emptySubscribeAdapter = function emptySubscribeAdapter() {
  return {
    init: function () {
      var _init = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }(),
    subscribeToTopics: function () {
      var _subscribeToTopics = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function subscribeToTopics() {
        return _subscribeToTopics.apply(this, arguments);
      }

      return subscribeToTopics;
    }(),
    unsubscribeFromTopics: function () {
      var _unsubscribeFromTopics = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function unsubscribeFromTopics() {
        return _unsubscribeFromTopics.apply(this, arguments);
      }

      return unsubscribeFromTopics;
    }(),
    close: function () {
      var _close = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }(),
    isConnected: function isConnected() {
      return true;
    }
  };
};

emptySubscribeAdapter.adapterName = 'empty';
var _default = emptySubscribeAdapter;
exports["default"] = _default;
//# sourceMappingURL=empty_subscribe_adapter.js.map