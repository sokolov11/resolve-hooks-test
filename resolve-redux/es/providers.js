import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ResolveProvider } from './resolve_context';
import createApi from './create_api';

var Providers =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Providers, _React$PureComponent);

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
    var api = createApi({
      origin: origin,
      rootPath: rootPath,
      store: store
    });
    return React.createElement(ResolveProvider, {
      value: {
        api: api,
        origin: origin,
        rootPath: rootPath,
        staticPath: staticPath
      }
    }, React.createElement(ReduxProvider, {
      store: store
    }, children));
  };

  return Providers;
}(React.PureComponent);

export default Providers;
//# sourceMappingURL=providers.js.map