import _extends from "@babel/runtime/helpers/esm/extends";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import * as actions from './actions';
import { connectorMetaMap } from './constants';
import getHash from './get_hash';
import connectResolveAdvanced from './connect_resolve_advanced';
export var mapDispatchToConnectorProps = function mapDispatchToConnectorProps(dispatch) {
  return bindActionCreators({
    connectViewModel: actions.connectViewModel,
    disconnectViewModel: actions.disconnectViewModel
  }, dispatch);
};
export var mapStateToConnectorProps = function mapStateToConnectorProps(mapStateToOptions, state, ownProps) {
  var connectorOptions = mapStateToOptions(state, ownProps);

  if (!connectorOptions.hasOwnProperty('aggregateArgs')) {
    connectorOptions.aggregateArgs = {};
  }

  if (Array.isArray(connectorOptions.aggregateIds) && connectorOptions.aggregateIds.indexOf('*') !== -1) {
    throw new Error("Incorrect value of \"aggregateIds\". Maybe you meant to use \"*\", not [\"*\"]");
  }

  var viewModelName = connectorOptions.viewModelName;
  var aggregateIds = getHash(connectorOptions.aggregateIds);
  var aggregateArgs = getHash(connectorOptions.aggregateArgs);
  var connectorMeta = state.viewModels && state.viewModels[connectorMetaMap] && state.viewModels[connectorMetaMap]["" + viewModelName + aggregateIds + aggregateArgs] ? state.viewModels[connectorMetaMap]["" + viewModelName + aggregateIds + aggregateArgs] : {};
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

var connectViewModel = function connectViewModel(mapStateToOptions) {
  return function (Component) {
    var ViewModelContainer =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inheritsLoose(ViewModelContainer, _React$PureComponent);

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

        if (connectorOptions && prevConnectorOptions && (prevConnectorOptions.viewModelName !== connectorOptions.viewModelName || prevConnectorOptions.aggregateIds !== connectorOptions.aggregateIds || prevConnectorOptions.aggregateArgs !== connectorOptions.aggregateArgs) && (prevConnectorOptions.viewModelName !== connectorOptions.viewModelName || getHash(prevConnectorOptions.aggregateIds) !== getHash(connectorOptions.aggregateIds) || getHash(prevConnectorOptions.aggregateArgs) !== getHash(connectorOptions.aggregateArgs))) {
          this.props.disconnectViewModel(prevConnectorOptions.viewModelName, prevConnectorOptions.aggregateIds, prevConnectorOptions.aggregateArgs);
          this.props.connectViewModel(connectorOptions.viewModelName, connectorOptions.aggregateIds, connectorOptions.aggregateArgs);
        }
      };

      _proto.render = function render() {
        var _this$props = this.props,
            ownProps = _this$props.ownProps,
            isLoading = _this$props.isLoading,
            data = _this$props.data;
        return React.createElement(Component, _extends({}, ownProps, {
          isLoading: isLoading,
          data: data
        }));
      };

      return ViewModelContainer;
    }(React.PureComponent);

    var ViewModelConnector = connect(mapStateToConnectorProps.bind(null, mapStateToOptions), mapDispatchToConnectorProps)(ViewModelContainer);
    ViewModelConnector.mapStateToOptions = mapStateToOptions;
    hoistNonReactStatic(ViewModelConnector, ViewModelContainer);
    return connectResolveAdvanced(ViewModelConnector);
  };
};

export default connectViewModel;
//# sourceMappingURL=connect_view_model.js.map