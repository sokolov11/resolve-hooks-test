"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _effects = require("redux-saga/effects");

var createSagaManager = function createSagaManager() {
  var sagas = {};
  return {
    start:
    /*#__PURE__*/
    _regenerator["default"].mark(function start(key, saga) {
      var _len,
          sagaArgs,
          _key,
          sagaId,
          _args = arguments;

      return _regenerator["default"].wrap(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!Array.isArray(sagas[key])) {
                sagas[key] = [];
              }

              for (_len = _args.length, sagaArgs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                sagaArgs[_key - 2] = _args[_key];
              }

              _context.next = 4;
              return _effects.fork.apply(void 0, [saga].concat(sagaArgs));

            case 4:
              sagaId = _context.sent;
              sagas[key].push(sagaId);
              return _context.abrupt("return", sagaId);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, start);
    }),
    stop:
    /*#__PURE__*/
    _regenerator["default"].mark(function stop(key, callback) {
      var _iterator, _isArray, _i, _ref, sagaId;

      return _regenerator["default"].wrap(function stop$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!Array.isArray(sagas[key])) {
                _context2.next = 17;
                break;
              }

              _iterator = sagas[key], _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

            case 2:
              if (!_isArray) {
                _context2.next = 8;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt("break", 17);

            case 5:
              _ref = _iterator[_i++];
              _context2.next = 12;
              break;

            case 8:
              _i = _iterator.next();

              if (!_i.done) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("break", 17);

            case 11:
              _ref = _i.value;

            case 12:
              sagaId = _ref;
              _context2.next = 15;
              return (0, _effects.cancel)(sagaId);

            case 15:
              _context2.next = 2;
              break;

            case 17:
              delete sagas[key];

              if (typeof callback === 'function') {
                callback();
              }

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, stop);
    })
  };
};

var _default = createSagaManager;
exports["default"] = _default;
//# sourceMappingURL=create_saga_manager.js.map