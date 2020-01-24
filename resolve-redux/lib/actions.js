"use strict";

exports.__esModule = true;
exports.authFailure = exports.authSuccess = exports.authRequest = exports.logout = exports.updateJwt = exports.hotModuleReplacement = exports.dispatchTopicMessage = exports.dropReadModelState = exports.loadReadModelStateFailure = exports.loadReadModelStateSuccess = exports.loadReadModelStateRequest = exports.disconnectReadModel = exports.connectReadModel = exports.dropViewModelState = exports.loadViewModelStateFailure = exports.loadViewModelStateSuccess = exports.loadViewModelStateRequest = exports.disconnectViewModel = exports.connectViewModel = exports.unsubscribeTopicFailure = exports.unsubscribeTopicSuccess = exports.unsubscribeTopicRequest = exports.subscribeTopicFailure = exports.subscribeTopicSuccess = exports.subscribeTopicRequest = exports.sendCommandFailure = exports.sendCommandSuccess = exports.sendCommandRequest = void 0;

var _action_types = require("./action_types");

var sendCommandRequest = function sendCommandRequest(commandType, aggregateId, aggregateName, payload) {
  return {
    type: _action_types.SEND_COMMAND_REQUEST,
    commandType: commandType,
    aggregateId: aggregateId,
    aggregateName: aggregateName,
    payload: payload
  };
};

exports.sendCommandRequest = sendCommandRequest;

var sendCommandSuccess = function sendCommandSuccess(commandType, aggregateId, aggregateName, payload) {
  return {
    type: _action_types.SEND_COMMAND_SUCCESS,
    commandType: commandType,
    aggregateId: aggregateId,
    aggregateName: aggregateName,
    payload: payload
  };
};

exports.sendCommandSuccess = sendCommandSuccess;

var sendCommandFailure = function sendCommandFailure(commandType, aggregateId, aggregateName, payload, error) {
  return {
    type: _action_types.SEND_COMMAND_FAILURE,
    commandType: commandType,
    aggregateId: aggregateId,
    aggregateName: aggregateName,
    payload: payload,
    error: error
  };
};

exports.sendCommandFailure = sendCommandFailure;

var subscribeTopicRequest = function subscribeTopicRequest(topicName, topicId) {
  return {
    type: _action_types.SUBSCRIBE_TOPIC_REQUEST,
    topicName: topicName,
    topicId: topicId
  };
};

exports.subscribeTopicRequest = subscribeTopicRequest;

var subscribeTopicSuccess = function subscribeTopicSuccess(topicName, topicId) {
  return {
    type: _action_types.SUBSCRIBE_TOPIC_SUCCESS,
    topicName: topicName,
    topicId: topicId
  };
};

exports.subscribeTopicSuccess = subscribeTopicSuccess;

var subscribeTopicFailure = function subscribeTopicFailure(topicName, topicId, error) {
  return {
    type: _action_types.SUBSCRIBE_TOPIC_FAILURE,
    topicName: topicName,
    topicId: topicId,
    error: error
  };
};

exports.subscribeTopicFailure = subscribeTopicFailure;

var unsubscribeTopicRequest = function unsubscribeTopicRequest(topicName, topicId) {
  return {
    type: _action_types.UNSUBSCRIBE_TOPIC_REQUEST,
    topicName: topicName,
    topicId: topicId
  };
};

exports.unsubscribeTopicRequest = unsubscribeTopicRequest;

var unsubscribeTopicSuccess = function unsubscribeTopicSuccess(topicName, topicId) {
  return {
    type: _action_types.UNSUBSCRIBE_TOPIC_SUCCESS,
    topicName: topicName,
    topicId: topicId
  };
};

exports.unsubscribeTopicSuccess = unsubscribeTopicSuccess;

var unsubscribeTopicFailure = function unsubscribeTopicFailure(topicName, topicId, error) {
  return {
    type: _action_types.UNSUBSCRIBE_TOPIC_FAILURE,
    topicName: topicName,
    topicId: topicId,
    error: error
  };
};

exports.unsubscribeTopicFailure = unsubscribeTopicFailure;

var connectViewModel = function connectViewModel(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: _action_types.CONNECT_VIEWMODEL,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
};

exports.connectViewModel = connectViewModel;

var disconnectViewModel = function disconnectViewModel(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: _action_types.DISCONNECT_VIEWMODEL,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
};

exports.disconnectViewModel = disconnectViewModel;

var loadViewModelStateRequest = function loadViewModelStateRequest(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: _action_types.LOAD_VIEWMODEL_STATE_REQUEST,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
}; // TODO fix docs


exports.loadViewModelStateRequest = loadViewModelStateRequest;

var loadViewModelStateSuccess = function loadViewModelStateSuccess(viewModelName, aggregateIds, aggregateArgs, result, timestamp) {
  return {
    type: _action_types.LOAD_VIEWMODEL_STATE_SUCCESS,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs,
    result: result,
    timestamp: timestamp
  };
};

exports.loadViewModelStateSuccess = loadViewModelStateSuccess;

var loadViewModelStateFailure = function loadViewModelStateFailure(viewModelName, aggregateIds, aggregateArgs, error) {
  return {
    type: _action_types.LOAD_VIEWMODEL_STATE_FAILURE,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs,
    error: error
  };
};

exports.loadViewModelStateFailure = loadViewModelStateFailure;

var dropViewModelState = function dropViewModelState(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: _action_types.DROP_VIEWMODEL_STATE,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
};

exports.dropViewModelState = dropViewModelState;

var connectReadModel = function connectReadModel(readModelName, resolverName, resolverArgs) {
  return {
    type: _action_types.CONNECT_READMODEL,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs
  };
};

exports.connectReadModel = connectReadModel;

var disconnectReadModel = function disconnectReadModel(readModelName, resolverName, resolverArgs) {
  return {
    type: _action_types.DISCONNECT_READMODEL,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs
  };
};

exports.disconnectReadModel = disconnectReadModel;

var loadReadModelStateRequest = function loadReadModelStateRequest(readModelName, resolverName, resolverArgs, queryId) {
  return {
    type: _action_types.LOAD_READMODEL_STATE_REQUEST,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs,
    queryId: queryId
  };
};

exports.loadReadModelStateRequest = loadReadModelStateRequest;

var loadReadModelStateSuccess = function loadReadModelStateSuccess(readModelName, resolverName, resolverArgs, queryId, result, timestamp) {
  return {
    type: _action_types.LOAD_READMODEL_STATE_SUCCESS,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs,
    queryId: queryId,
    result: result,
    timestamp: timestamp
  };
};

exports.loadReadModelStateSuccess = loadReadModelStateSuccess;

var loadReadModelStateFailure = function loadReadModelStateFailure(readModelName, resolverName, resolverArgs, queryId, error) {
  return {
    type: _action_types.LOAD_READMODEL_STATE_FAILURE,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs,
    queryId: queryId,
    error: error
  };
};

exports.loadReadModelStateFailure = loadReadModelStateFailure;

var dropReadModelState = function dropReadModelState(readModelName, resolverName, resolverArgs) {
  return {
    type: _action_types.DROP_READMODEL_STATE,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs
  };
};

exports.dropReadModelState = dropReadModelState;

var dispatchTopicMessage = function dispatchTopicMessage(message) {
  return {
    type: _action_types.DISPATCH_TOPIC_MESSAGE,
    message: message
  };
};

exports.dispatchTopicMessage = dispatchTopicMessage;

var hotModuleReplacement = function hotModuleReplacement(hotModuleReplacementId) {
  return {
    type: _action_types.HOT_MODULE_REPLACEMENT,
    hotModuleReplacementId: hotModuleReplacementId
  };
};

exports.hotModuleReplacement = hotModuleReplacement;

var updateJwt = function updateJwt(jwt) {
  return {
    type: _action_types.UPDATE_JWT,
    jwt: jwt
  };
};

exports.updateJwt = updateJwt;

var logout = function logout() {
  return {
    type: _action_types.LOGOUT
  };
};

exports.logout = logout;

var authRequest = function authRequest(url, body) {
  if (body === void 0) {
    body = {};
  }

  return {
    type: _action_types.AUTH_REQUEST,
    url: url,
    body: body
  };
};

exports.authRequest = authRequest;

var authSuccess = function authSuccess(url, body) {
  return {
    type: _action_types.AUTH_SUCCESS,
    url: url,
    body: body
  };
};

exports.authSuccess = authSuccess;

var authFailure = function authFailure(url, body, error) {
  return {
    type: _action_types.AUTH_FAILURE,
    url: url,
    body: body,
    error: error
  };
};

exports.authFailure = authFailure;
//# sourceMappingURL=actions.js.map