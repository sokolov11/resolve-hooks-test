"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var actions = _interopRequireWildcard(require("./actions"));

var _constants = require("./constants");

var _get_hash = _interopRequireDefault(require("./get_hash"));

var _connect_resolve_advanced = _interopRequireDefault(require("./connect_resolve_advanced"));

var connectReadModel = function connectReadModel(mapStateToOptions) {
  return function (Component) {
    var ReadModelContainer =
    /*#__PURE__*/
    function (_React$PureComponent) {
      (0, _inheritsLoose2["default"])(ReadModelContainer, _React$PureComponent);

      function ReadModelContainer() {
        return _React$PureComponent.apply(this, arguments) || this;
      }

      var _proto = ReadModelContainer.prototype;

      _proto.componentDidMount = function componentDidMount() {
        var _this$props$connector = this.props.connectorOptions,
            readModelName = _this$props$connector.readModelName,
            resolverName = _this$props$connector.resolverName,
            resolverArgs = _this$props$connector.resolverArgs;
        this.props.connectReadModel(readModelName, resolverName, resolverArgs);
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        var _this$props$connector2 = this.props.connectorOptions,
            readModelName = _this$props$connector2.readModelName,
            resolverName = _this$props$connector2.resolverName,
            resolverArgs = _this$props$connector2.resolverArgs;
        this.props.disconnectReadModel(readModelName, resolverName, resolverArgs);
      };

      _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
        var connectorOptions = this.props.connectorOptions;
        var prevConnectorOptions = prevProps.connectorOptions;

        if (connectorOptions && prevConnectorOptions && (prevConnectorOptions.readModelName !== connectorOptions.readModelName || prevConnectorOptions.resolverName !== connectorOptions.resolverName || prevConnectorOptions.resolverArgs !== connectorOptions.resolverArgs) && (prevConnectorOptions.readModelName !== connectorOptions.readModelName || prevConnectorOptions.resolverName !== connectorOptions.resolverName || (0, _get_hash["default"])(prevConnectorOptions.resolverArgs) !== (0, _get_hash["default"])(connectorOptions.resolverArgs))) {
          this.props.disconnectReadModel(prevConnectorOptions.readModelName, prevConnectorOptions.resolverName, prevConnectorOptions.resolverArgs);
          this.props.connectReadModel(connectorOptions.readModelName, connectorOptions.resolverName, connectorOptions.resolverArgs);
        }
      };

      _proto.render = function render() {
        var _this$props = this.props,
            ownProps = _this$props.ownProps,
            isLoading = _this$props.isLoading,
            data = _this$props.data;
        return _react["default"].createElement(Component, (0, _extends2["default"])({}, ownProps, {
          isLoading: isLoading,
          data: data
        }));
      };

      return ReadModelContainer;
    }(_react["default"].PureComponent);

    var mapStateToConnectorProps = function mapStateToConnectorProps(state, ownProps) {
      var connectorOptions = mapStateToOptions(state, ownProps);
      var readModelName = connectorOptions.readModelName;
      var resolverName = (0, _get_hash["default"])(connectorOptions.resolverName);
      var resolverArgs = (0, _get_hash["default"])(connectorOptions.resolverArgs);
      var connectorMeta = state.readModels && state.readModels[_constants.connectorMetaMap] && state.readModels[_constants.connectorMetaMap]["" + readModelName + resolverName + resolverArgs] ? state.readModels[_constants.connectorMetaMap]["" + readModelName + resolverName + resolverArgs] : {};
      var isLoading = connectorMeta.isLoading,
          isFailure = connectorMeta.isFailure;
      var data = isLoading === false && isFailure === false ? state.readModels[readModelName][resolverName][resolverArgs] : null;
      var error = isLoading === false && isFailure === true ? connectorMeta.error : null;
      return {
        ownProps: ownProps,
        connectorOptions: connectorOptions,
        isLoading: isLoading,
        isFailure: isFailure,
        data: data,
        error: error
      };
    };

    var mapDispatchToConnectorProps = function mapDispatchToConnectorProps(dispatch) {
      return (0, _redux.bindActionCreators)({
        connectReadModel: actions.connectReadModel,
        disconnectReadModel: actions.disconnectReadModel
      }, dispatch);
    };

    var ReadModelConnector = (0, _reactRedux.connect)(mapStateToConnectorProps, mapDispatchToConnectorProps)(ReadModelContainer);
    ReadModelConnector.mapStateToOptions = mapStateToOptions;
    (0, _hoistNonReactStatics["default"])(ReadModelConnector, ReadModelContainer);
    return (0, _connect_resolve_advanced["default"])(ReadModelConnector);
  };
};

var _default = connectReadModel;
exports["default"] = _default;
//# sourceMappingURL=connect_read_model.js.map