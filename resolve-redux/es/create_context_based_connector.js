import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import React from 'react';
import { Consumer } from './resolve_context';
import * as validate from './validate';
var defaultContext = {
  origin: '',
  rootPath: '',
  staticPath: 'static'
};

var createContextBasedConnector = function createContextBasedConnector(getContextBasedUrl) {
  return function (propsList) {
    return function (Component) {
      var _temp;

      validate.arrayOfString(propsList, 'Props list');
      var propsListSize = propsList.length;
      return _temp =
      /*#__PURE__*/
      function (_React$PureComponent) {
        _inheritsLoose(ContextBasedComponent, _React$PureComponent);

        function ContextBasedComponent() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "functionAsChildComponent", function (context) {
            var _this$props = _this.props,
                innerRef = _this$props.innerRef,
                props = _objectWithoutPropertiesLoose(_this$props, ["innerRef"]);

            var staticBasedProps = {};

            for (var propertyIndex = 0; propertyIndex < propsListSize; propertyIndex++) {
              var propertyName = propsList[propertyIndex];
              var propertyValue = props[propertyName];

              if (Array.isArray(propertyValue)) {
                var subProps = [];
                var subPropertySize = propertyValue.length;

                for (var subPropertyIndex = 0; subPropertyIndex < subPropertySize; subPropertyIndex++) {
                  subProps[subPropertyIndex] = getContextBasedUrl(context || defaultContext, propertyValue[subPropertyIndex]);
                }

                staticBasedProps[propertyName] = subProps;
              } else {
                staticBasedProps[propertyName] = getContextBasedUrl(context || defaultContext, propertyValue);
              }
            }

            return React.createElement(Component, _extends({}, props, staticBasedProps, {
              ref: innerRef
            }));
          });

          return _this;
        }

        var _proto = ContextBasedComponent.prototype;

        _proto.render = function render() {
          return React.createElement(Consumer, null, this.functionAsChildComponent);
        };

        return ContextBasedComponent;
      }(React.PureComponent), _temp;
    };
  };
};

export default createContextBasedConnector;
//# sourceMappingURL=create_context_based_connector.js.map