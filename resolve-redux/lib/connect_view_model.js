"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.mapStateToConnectorProps = exports.mapDispatchToConnectorProps = void 0;

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

var mapDispatchToConnectorProps = function mapDispatchToConnectorProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    connectViewModel: actions.connectViewModel,
    disconnectViewModel: actions.disconnectViewModel
  }, dispatch);
};

exports.mapDispatchToConnectorProps = mapDispatchToConnectorProps;

var mapStateToConnectorProps = function mapStateToConnectorProps(mapStateToOptions, state, ownProps) {
  var connectorOptions = mapStateToOptions(state, ownProps);

  if (!connectorOptions.hasOwnProperty('aggregateArgs')) {
    connectorOptions.aggregateArgs = {};
  }

  if (Array.isArray(connectorOptions.aggregateIds) && connectorOptions.aggregateIds.indexOf('*') !== -1) {
    throw new Error("Incorrect value of \"aggregateIds\". Maybe you meant to use \"*\", not [\"*\"]");
  }

  var viewModelName = connectorOptions.viewModelName;
  var aggregateIds = (0, _get_hash["default"])(connectorOptions.aggregateIds);
  var aggregateArgs = (0, _get_hash["default"])(connectorOptions.aggregateArgs);
  var connectorMeta = state.viewModels && state.viewModels[_constants.connectorMetaMap] && state.viewModels[_constants.connectorMetaMap]["" + viewModelName + aggregateIds + aggregateArgs] ? state.viewModels[_constants.connectorMetaMap]["" + viewModelName + aggregateIds + aggregateArgs] : {};
  var isLoading = connectorMeta.isLoading,
      isFailure = connectorMeta.isFailure;
  var data = isLoading === false && isFailure === false ? state.viewModels[viewModelName][aggregateIds][aggregateArgs] : null;
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

exports.mapStateToConnectorProps = mapStateToConnectorProps;

var connectViewModel = function connectViewModel(mapStateToOptions) {
  return function (Component) {
    var ViewModelContainer =
    /*#__PURE__*/
    function (_React$PureComponent) {
      (0, _inheritsLoose2["default"])(ViewModelContainer, _React$PureComponent);

      function ViewModelContainer() {
        return _React$PureComponent.apply(this, arguments) || this;
      }

      var _proto = ViewModelContainer.prototype;

      _proto.componentDidMount = function componentDidMount() {
        var _this$props$connector = this.props.connectorOptions,
            viewModelName = _this$props$connector.viewModelName,
            aggregateIds = _this$props$connector.aggregateIds,
            aggregateArgs = _this$props$connector.aggregateArgs;
        this.props.connectViewModel(viewModelName, aggregateIds, aggregateArgs);
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        var _this$props$connector2 = this.props.connectorOptions,
            viewModelName = _this$props$connector2.viewModelName,
            aggregateIds = _this$props$connector2.aggregateIds,
            aggregateArgs = _this$props$connector2.aggregateArgs;
        this.props.disconnectViewModel(viewModelName, aggregateIds, aggregateArgs);
      };

      _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
        var connectorOptions = this.props.connectorOptions;
        var prevConnectorOptions = prevProps.connectorOptions;

        if (connectorOptions && prevConnectorOptions && (prevConnectorOptions.viewModelName !== connectorOptions.viewModelName || prevConnectorOptions.aggregateIds !== connectorOptions.aggregateIds || prevConnectorOptions.aggregateArgs !== connectorOptions.aggregateArgs) && (prevConnectorOptions.viewModelName !== connectorOptions.viewModelName || (0, _get_hash["default"])(prevConnectorOptions.aggregateIds) !== (0, _get_hash["default"])(connectorOptions.aggregateIds) || (0, _get_hash["default"])(prevConnectorOptions.aggregateArgs) !== (0, _get_hash["default"])(connectorOptions.aggregateArgs))) {
          this.props.disconnectViewModel(prevConnectorOptions.viewModelName, prevConnectorOptions.aggregateIds, prevConnectorOptions.aggregateArgs);
          this.props.connectViewModel(connectorOptions.viewModelName, connectorOptions.aggregateIds, connectorOptions.aggregateArgs);
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

      return ViewModelContainer;
    }(_react["default"].PureComponent);

    var ViewModelConnector = (0, _reactRedux.connect)(mapStateToConnectorProps.bind(null, mapStateToOptions), mapDispatchToConnectorProps)(ViewModelContainer);
    ViewModelConnector.mapStateToOptions = mapStateToOptions;
    (0, _hoistNonReactStatics["default"])(ViewModelConnector, ViewModelContainer);
    return (0, _connect_resolve_advanced["default"])(ViewModelConnector);
  };
};

var _default = connectViewModel;
exports["default"] = _default;
//# sourceMappingURL=connect_view_model.js.map