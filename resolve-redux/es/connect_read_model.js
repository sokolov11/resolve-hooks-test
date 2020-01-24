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

var connectReadModel = function connectReadModel(mapStateToOptions) {
  return function (Component) {
    var ReadModelContainer =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inheritsLoose(ReadModelContainer, _React$PureComponent);

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

        if (connectorOptions && prevConnectorOptions && (prevConnectorOptions.readModelName !== connectorOptions.readModelName || prevConnectorOptions.resolverName !== connectorOptions.resolverName || prevConnectorOptions.resolverArgs !== connectorOptions.resolverArgs) && (prevConnectorOptions.readModelName !== connectorOptions.readModelName || prevConnectorOptions.resolverName !== connectorOptions.resolverName || getHash(prevConnectorOptions.resolverArgs) !== getHash(connectorOptions.resolverArgs))) {
          this.props.disconnectReadModel(prevConnectorOptions.readModelName, prevConnectorOptions.resolverName, prevConnectorOptions.resolverArgs);
          this.props.connectReadModel(connectorOptions.readModelName, connectorOptions.resolverName, connectorOptions.resolverArgs);
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

      return ReadModelContainer;
    }(React.PureComponent);

    var mapStateToConnectorProps = function mapStateToConnectorProps(state, ownProps) {
      var connectorOptions = mapStateToOptions(state, ownProps);
      var readModelName = connectorOptions.readModelName;
      var resolverName = getHash(connectorOptions.resolverName);
      var resolverArgs = getHash(connectorOptions.resolverArgs);
      var connectorMeta = state.readModels && state.readModels[connectorMetaMap] && state.readModels[connectorMetaMap]["" + readModelName + resolverName + resolverArgs] ? state.readModels[connectorMetaMap]["" + readModelName + resolverName + resolverArgs] : {};
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
      return bindActionCreators({
        connectReadModel: actions.connectReadModel,
        disconnectReadModel: actions.disconnectReadModel
      }, dispatch);
    };

    var ReadModelConnector = connect(mapStateToConnectorProps, mapDispatchToConnectorProps)(ReadModelContainer);
    ReadModelConnector.mapStateToOptions = mapStateToOptions;
    hoistNonReactStatic(ReadModelConnector, ReadModelContainer);
    return connectResolveAdvanced(ReadModelConnector);
  };
};

export default connectReadModel;
//# sourceMappingURL=connect_read_model.js.map