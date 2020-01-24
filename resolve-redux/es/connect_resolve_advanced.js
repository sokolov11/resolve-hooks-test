import _extends from "@babel/runtime/helpers/esm/extends";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Consumer } from './resolve_context';
import * as actions from './actions';

var connectResolveAdvanced = function connectResolveAdvanced(Component) {
  var ConnectResolveAdvanced =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inheritsLoose(ConnectResolveAdvanced, _React$PureComponent);

    function ConnectResolveAdvanced() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;

      _defineProperty(_assertThisInitialized(_this), "functionAsChildComponent", function (context) {
        return React.createElement(Component, _extends({}, context, {
          actions: actions
        }, _this.props));
      });

      return _this;
    }

    var _proto = ConnectResolveAdvanced.prototype;

    _proto.render = function render() {
      return React.createElement(Consumer, null, this.functionAsChildComponent);
    };

    return ConnectResolveAdvanced;
  }(React.PureComponent);

  hoistNonReactStatic(ConnectResolveAdvanced, Component);
  return ConnectResolveAdvanced;
};

export default connectResolveAdvanced;
//# sourceMappingURL=connect_resolve_advanced.js.map