"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.temporaryErrorHttpCodes = exports.HttpError = exports.FetchError = exports.ApiError = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _unfetch = _interopRequireDefault(require("unfetch"));

var _get_root_based_url = _interopRequireDefault(require("./get_root_based_url"));

var _sync_jwt_provider_with_store = _interopRequireDefault(require("./sync_jwt_provider_with_store"));

var ApiError =
/*#__PURE__*/
function (_Error) {
  (0, _inheritsLoose2["default"])(ApiError, _Error);

  function ApiError(error) {
    var _this;

    _this = _Error.call(this) || this;

    for (var key in error) {
      if (!error.hasOwnProperty(key)) {
        continue;
      }

      _this[key] = error[key];
    }

    return _this;
  }

  return ApiError;
}((0, _wrapNativeSuper2["default"])(Error));

exports.ApiError = ApiError;

var FetchError =
/*#__PURE__*/
function (_ApiError) {
  (0, _inheritsLoose2["default"])(FetchError, _ApiError);

  function FetchError(error) {
    var _this2;

    _this2 = _ApiError.call(this, error) || this;
    _this2.name = 'FetchError';
    return _this2;
  }

  return FetchError;
}(ApiError);

exports.FetchError = FetchError;

var HttpError =
/*#__PURE__*/
function (_ApiError2) {
  (0, _inheritsLoose2["default"])(HttpError, _ApiError2);

  function HttpError(error) {
    var _this3;

    _this3 = _ApiError2.call(this, error) || this;
    _this3.name = 'HttpError';
    return _this3;
  }

  return HttpError;
}(ApiError);

exports.HttpError = HttpError;
var temporaryErrorHttpCodes = [408, // Request Timeout
429, // Too Many Requests
502, // Bad Gateway
503, // Service Unavailable
504, // Gateway Timeout
507, // Insufficient Storage
509, // Bandwidth Limit Exceeded
521, // Web Server Is Down
522, // Connection Timed Out
523, // Origin Is Unreachable
524 // A Timeout Occurred
];
exports.temporaryErrorHttpCodes = temporaryErrorHttpCodes;

var doFetch = function doFetch() {
  try {
    return fetch.apply(void 0, arguments);
  } catch (err) {
    return _unfetch["default"].apply(void 0, arguments);
  }
};

var validateStatus =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(response) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!temporaryErrorHttpCodes.find(function (code) {
              return code == response.status;
            })) {
              _context.next = 8;
              break;
            }

            _context.t0 = FetchError;
            _context.t1 = response.status;
            _context.next = 5;
            return response.text();

          case 5:
            _context.t2 = _context.sent;
            _context.t3 = {
              code: _context.t1,
              message: _context.t2
            };
            throw new _context.t0(_context.t3);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function validateStatus(_x) {
    return _ref.apply(this, arguments);
  };
}();

var createApi = function createApi(_ref2) {
  var origin = _ref2.origin,
      rootPath = _ref2.rootPath,
      jwtProvider = _ref2.jwtProvider,
      store = _ref2.store;

  var _request =
  /*#__PURE__*/
  function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(url, body) {
      var rootBasedUrl, options, jwtToken, response, responseJwtToken;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              rootBasedUrl = (0, _get_root_based_url["default"])(origin, rootPath, url);
              options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(body)
              };

              if (!jwtProvider) {
                _context2.next = 7;
                break;
              }

              _context2.next = 5;
              return jwtProvider.get();

            case 5:
              jwtToken = _context2.sent;

              if (jwtToken) {
                options.headers.Authorization = "Bearer " + jwtToken;
              }

            case 7:
              _context2.next = 9;
              return doFetch(rootBasedUrl, options);

            case 9:
              response = _context2.sent;

              if (!jwtProvider) {
                _context2.next = 14;
                break;
              }

              responseJwtToken = response.headers.get('x-jwt');
              _context2.next = 14;
              return jwtProvider.set(responseJwtToken);

            case 14:
              (0, _sync_jwt_provider_with_store["default"])(jwtProvider, store)["catch"]( // eslint-disable-next-line no-console
              function (error) {
                return console.error(error);
              });
              return _context2.abrupt("return", response);

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function request(_x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  return {
    loadViewModelState: function () {
      var _loadViewModelState = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref4) {
        var viewModelName, aggregateIds, aggregateArgs, response, result, queryAggregateIds;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                viewModelName = _ref4.viewModelName, aggregateIds = _ref4.aggregateIds, aggregateArgs = _ref4.aggregateArgs;
                _context3.prev = 1;
                queryAggregateIds = aggregateIds === '*' ? aggregateIds : aggregateIds.join(',');
                _context3.next = 5;
                return _request("/api/query/" + viewModelName + "/" + queryAggregateIds, {
                  aggregateArgs: aggregateArgs
                });

              case 5:
                response = _context3.sent;
                _context3.next = 11;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                throw new FetchError(_context3.t0);

              case 11:
                _context3.next = 13;
                return validateStatus(response);

              case 13:
                if (response.ok) {
                  _context3.next = 21;
                  break;
                }

                _context3.t1 = HttpError;
                _context3.t2 = response.status;
                _context3.next = 18;
                return response.text();

              case 18:
                _context3.t3 = _context3.sent;
                _context3.t4 = {
                  code: _context3.t2,
                  message: _context3.t3
                };
                throw new _context3.t1(_context3.t4);

              case 21:
                _context3.prev = 21;
                _context3.next = 24;
                return response.text();

              case 24:
                result = _context3.sent;
                _context3.next = 30;
                break;

              case 27:
                _context3.prev = 27;
                _context3.t5 = _context3["catch"](21);
                throw new HttpError(_context3.t5);

              case 30:
                return _context3.abrupt("return", {
                  timestamp: Number(new Date(response.headers.get('Date'))),
                  result: result
                });

              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 8], [21, 27]]);
      }));

      function loadViewModelState(_x4) {
        return _loadViewModelState.apply(this, arguments);
      }

      return loadViewModelState;
    }(),
    loadReadModelState: function () {
      var _loadReadModelState = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref5) {
        var readModelName, resolverName, resolverArgs, response, result;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                readModelName = _ref5.readModelName, resolverName = _ref5.resolverName, resolverArgs = _ref5.resolverArgs;
                _context4.prev = 1;
                _context4.next = 4;
                return _request("/api/query/" + readModelName + "/" + resolverName, resolverArgs);

              case 4:
                response = _context4.sent;
                _context4.next = 10;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](1);
                throw new FetchError(_context4.t0);

              case 10:
                _context4.next = 12;
                return validateStatus(response);

              case 12:
                if (response.ok) {
                  _context4.next = 20;
                  break;
                }

                _context4.t1 = HttpError;
                _context4.t2 = response.status;
                _context4.next = 17;
                return response.text();

              case 17:
                _context4.t3 = _context4.sent;
                _context4.t4 = {
                  code: _context4.t2,
                  message: _context4.t3
                };
                throw new _context4.t1(_context4.t4);

              case 20:
                _context4.prev = 20;
                _context4.next = 23;
                return response.text();

              case 23:
                result = _context4.sent;
                _context4.next = 29;
                break;

              case 26:
                _context4.prev = 26;
                _context4.t5 = _context4["catch"](20);
                throw new HttpError(_context4.t5);

              case 29:
                return _context4.abrupt("return", {
                  timestamp: Number(new Date(response.headers.get('Date'))),
                  result: result
                });

              case 30:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 7], [20, 26]]);
      }));

      function loadReadModelState(_x5) {
        return _loadReadModelState.apply(this, arguments);
      }

      return loadReadModelState;
    }(),
    sendCommand: function () {
      var _sendCommand = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref6) {
        var commandType, aggregateId, aggregateName, payload, response, result;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                commandType = _ref6.commandType, aggregateId = _ref6.aggregateId, aggregateName = _ref6.aggregateName, payload = _ref6.payload;
                _context5.prev = 1;
                _context5.next = 4;
                return _request('/api/commands', {
                  type: commandType,
                  aggregateId: aggregateId,
                  aggregateName: aggregateName,
                  payload: payload
                });

              case 4:
                response = _context5.sent;
                _context5.next = 10;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](1);
                throw new FetchError(_context5.t0);

              case 10:
                _context5.next = 12;
                return validateStatus(response);

              case 12:
                if (response.ok) {
                  _context5.next = 20;
                  break;
                }

                _context5.t1 = HttpError;
                _context5.t2 = response.status;
                _context5.next = 17;
                return response.text();

              case 17:
                _context5.t3 = _context5.sent;
                _context5.t4 = {
                  code: _context5.t2,
                  message: _context5.t3
                };
                throw new _context5.t1(_context5.t4);

              case 20:
                _context5.prev = 20;
                _context5.next = 23;
                return response.json();

              case 23:
                result = _context5.sent;
                _context5.next = 29;
                break;

              case 26:
                _context5.prev = 26;
                _context5.t5 = _context5["catch"](20);
                throw new HttpError(_context5.t5);

              case 29:
                return _context5.abrupt("return", result);

              case 30:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[1, 7], [20, 26]]);
      }));

      function sendCommand(_x6) {
        return _sendCommand.apply(this, arguments);
      }

      return sendCommand;
    }(),
    getSubscribeAdapterOptions: function () {
      var _getSubscribeAdapterOptions = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(adapterName) {
        var response, result;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return _request('/api/subscribe', {
                  origin: origin,
                  rootPath: rootPath,
                  adapterName: adapterName
                });

              case 3:
                response = _context6.sent;
                _context6.next = 9;
                break;

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                throw new FetchError(_context6.t0);

              case 9:
                _context6.next = 11;
                return validateStatus(response);

              case 11:
                if (response.ok) {
                  _context6.next = 19;
                  break;
                }

                _context6.t1 = HttpError;
                _context6.t2 = response.status;
                _context6.next = 16;
                return response.text();

              case 16:
                _context6.t3 = _context6.sent;
                _context6.t4 = {
                  code: _context6.t2,
                  message: _context6.t3
                };
                throw new _context6.t1(_context6.t4);

              case 19:
                _context6.prev = 19;
                _context6.next = 22;
                return response.json();

              case 22:
                result = _context6.sent;
                _context6.next = 28;
                break;

              case 25:
                _context6.prev = 25;
                _context6.t5 = _context6["catch"](19);
                throw new HttpError(_context6.t5);

              case 28:
                return _context6.abrupt("return", result);

              case 29:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 6], [19, 25]]);
      }));

      function getSubscribeAdapterOptions(_x7) {
        return _getSubscribeAdapterOptions.apply(this, arguments);
      }

      return getSubscribeAdapterOptions;
    }(),
    request: function () {
      var _request2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref7) {
        var url, body;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                url = _ref7.url, body = _ref7.body;
                return _context7.abrupt("return", _request(url, body));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function request(_x8) {
        return _request2.apply(this, arguments);
      }

      return request;
    }()
  };
};

var _default = createApi;
exports["default"] = _default;
//# sourceMappingURL=create_api.js.map