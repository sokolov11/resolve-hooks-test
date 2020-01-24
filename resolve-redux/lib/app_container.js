"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterRedux = require("react-router-redux");

var _routes = _interopRequireDefault(require("./routes"));

var _providers = _interopRequireDefault(require("./providers"));

var AppContainer =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inheritsLoose2["default"])(AppContainer, _React$PureComponent);

  function AppContainer() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = AppContainer.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        origin = _this$props.origin,
        rootPath = _this$props.rootPath,
        staticPath = _this$props.staticPath,
        store = _this$props.store,
        history = _this$props.history,
        routes = _this$props.routes,
        isSSR = _this$props.isSSR;
    return _react["default"].createElement(_providers["default"], {
      origin: origin,
      rootPath: rootPath,
      staticPath: staticPath,
      store: store
    }, _react["default"].createElement(_reactRouterRedux.ConnectedRouter, {
      history: history,
      isSSR: isSSR
    }, _react["default"].createElement(_routes["default"], {
      routes: routes
    })));
  };

  return AppContainer;
}(_react["default"].PureComponent);

var _default = AppContainer;
exports["default"] = _default;
//# sourceMappingURL=app_container.js.map