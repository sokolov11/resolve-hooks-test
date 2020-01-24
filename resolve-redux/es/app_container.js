import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import Routes from './routes';
import Providers from './providers';

var AppContainer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(AppContainer, _React$PureComponent);

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
    return React.createElement(Providers, {
      origin: origin,
      rootPath: rootPath,
      staticPath: staticPath,
      store: store
    }, React.createElement(ConnectedRouter, {
      history: history,
      isSSR: isSSR
    }, React.createElement(Routes, {
      routes: routes
    })));
  };

  return AppContainer;
}(React.PureComponent);

export default AppContainer;
//# sourceMappingURL=app_container.js.map