"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _resolve_context = require("./resolve_context");

var actions = _interopRequireWildcard(require("./actions"));

var connectResolveAdvanced = function connectResolveAdvanced(Component) {
  var ConnectResolveAdvanced =
  /*#__PURE__*/
  function (_React$PureComponent) {
    (0, _inheritsLoose2["default"])(ConnectResolveAdvanced, _React$PureComponent);

    function ConnectResolveAdvanced() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "functionAsChildComponent", function (context) {
        return _react["default"].createElement(Component, (0, _extends2["default"])({}, context, {
          actions: actions
        }, _this.props));
      });
      return _this;
    }

    var _proto = ConnectResolveAdvanced.prototype;

    _proto.render = function render() {
      return _react["default"].createElement(_resolve_context.Consumer, null, this.functionAsChildComponent);
    };

    return ConnectResolveAdvanced;
  }(_react["default"].PureComponent);

  (0, _hoistNonReactStatics["default"])(ConnectResolveAdvanced, Component);
  return ConnectResolveAdvanced;
};

var _default = connectResolveAdvanced;
exports["default"] = _default;
//# sourceMappingURL=connect_resolve_advanced.js.map