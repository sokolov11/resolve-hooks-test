"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _reactRouter = require("react-router");

var Routes = function Routes(_ref) {
  var path = _ref.path,
      Component = _ref.component,
      routes = _ref.routes,
      exact = _ref.exact,
      redirectTo = _ref.redirectTo;

  if (redirectTo) {
    return _react["default"].createElement(_reactRouter.Redirect, {
      from: path,
      to: redirectTo
    });
  }

  return routes ? _react["default"].createElement(_reactRouter.Route, {
    path: path,
    exact: exact,
    render: function render(props) {
      var content = _react["default"].createElement(_reactRouter.Switch, null, routes.map(function (route, index) {
        return _react["default"].createElement(Routes, (0, _extends2["default"])({
          key: index
        }, route));
      }));

      return Component ? _react["default"].createElement(Component, props, content) : content;
    }
  }) : _react["default"].createElement(_reactRouter.Route, {
    path: path,
    exact: exact,
    component: Component
  });
};

var _default = Routes;
exports["default"] = _default;
//# sourceMappingURL=routes.js.map