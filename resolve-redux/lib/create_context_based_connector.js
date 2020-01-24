"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _resolve_context = require("./resolve_context");

var validate = _interopRequireWildcard(require("./validate"));

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
        (0, _inheritsLoose2["default"])(ContextBasedComponent, _React$PureComponent);

        function ContextBasedComponent() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
          (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "functionAsChildComponent", function (context) {
            var _this$props = _this.props,
                innerRef = _this$props.innerRef,
                props = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["innerRef"]);
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

            return _react["default"].createElement(Component, (0, _extends2["default"])({}, props, staticBasedProps, {
              ref: innerRef
            }));
          });
          return _this;
        }

        var _proto = ContextBasedComponent.prototype;

        _proto.render = function render() {
          return _react["default"].createElement(_resolve_context.Consumer, null, this.functionAsChildComponent);
        };

        return ContextBasedComponent;
      }(_react["default"].PureComponent), _temp;
    };
  };
};

var _default = createContextBasedConnector;
exports["default"] = _default;
//# sourceMappingURL=create_context_based_connector.js.map