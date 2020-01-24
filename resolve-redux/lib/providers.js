"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _resolve_context = require("./resolve_context");

var _create_api = _interopRequireDefault(require("./create_api"));

var Providers =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inheritsLoose2["default"])(Providers, _React$PureComponent);

  function Providers() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = Providers.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        origin = _this$props.origin,
        rootPath = _this$props.rootPath,
        staticPath = _this$props.staticPath,
        store = _this$props.store,
        children = _this$props.children;
    var api = (0, _create_api["default"])({
      origin: origin,
      rootPath: rootPath,
      store: store
    });
    return _react["default"].createElement(_resolve_context.Provider, {
      value: {
        api: api,
        origin: origin,
        rootPath: rootPath,
        staticPath: staticPath
      }
    }, _react["default"].createElement(_reactRedux.Provider, {
      store: store
    }, children));
  };

  return Providers;
}(_react["default"].PureComponent);

var _default = Providers;
exports["default"] = _default;
//# sourceMappingURL=providers.js.map