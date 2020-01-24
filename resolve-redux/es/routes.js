import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { Route, Redirect, Switch } from 'react-router';

var Routes = function Routes(_ref) {
  var path = _ref.path,
      Component = _ref.component,
      routes = _ref.routes,
      exact = _ref.exact,
      redirectTo = _ref.redirectTo;

  if (redirectTo) {
    return React.createElement(Redirect, {
      from: path,
      to: redirectTo
    });
  }

  return routes ? React.createElement(Route, {
    path: path,
    exact: exact,
    render: function render(props) {
      var content = React.createElement(Switch, null, routes.map(function (route, index) {
        return React.createElement(Routes, _extends({
          key: index
        }, route));
      }));
      return Component ? React.createElement(Component, props, content) : content;
    }
  }) : React.createElement(Route, {
    path: path,
    exact: exact,
    component: Component
  });
};

export default Routes;
//# sourceMappingURL=routes.js.map