import { SEND_COMMAND_REQUEST, SEND_COMMAND_SUCCESS, SEND_COMMAND_FAILURE, SUBSCRIBE_TOPIC_REQUEST, SUBSCRIBE_TOPIC_SUCCESS, SUBSCRIBE_TOPIC_FAILURE, UNSUBSCRIBE_TOPIC_REQUEST, UNSUBSCRIBE_TOPIC_SUCCESS, UNSUBSCRIBE_TOPIC_FAILURE, CONNECT_VIEWMODEL, DISCONNECT_VIEWMODEL, LOAD_VIEWMODEL_STATE_REQUEST, LOAD_VIEWMODEL_STATE_SUCCESS, LOAD_VIEWMODEL_STATE_FAILURE, DROP_VIEWMODEL_STATE, CONNECT_READMODEL, DISCONNECT_READMODEL, LOAD_READMODEL_STATE_REQUEST, LOAD_READMODEL_STATE_SUCCESS, LOAD_READMODEL_STATE_FAILURE, DROP_READMODEL_STATE, DISPATCH_TOPIC_MESSAGE, HOT_MODULE_REPLACEMENT, UPDATE_JWT, LOGOUT, AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from './action_types';
export var sendCommandRequest = function sendCommandRequest(commandType, aggregateId, aggregateName, payload) {
  return {
    type: SEND_COMMAND_REQUEST,
    commandType: commandType,
    aggregateId: aggregateId,
    aggregateName: aggregateName,
    payload: payload
  };
};
export var sendCommandSuccess = function sendCommandSuccess(commandType, aggregateId, aggregateName, payload) {
  return {
    type: SEND_COMMAND_SUCCESS,
    commandType: commandType,
    aggregateId: aggregateId,
    aggregateName: aggregateName,
    payload: payload
  };
};
export var sendCommandFailure = function sendCommandFailure(commandType, aggregateId, aggregateName, payload, error) {
  return {
    type: SEND_COMMAND_FAILURE,
    commandType: commandType,
    aggregateId: aggregateId,
    aggregateName: aggregateName,
    payload: payload,
    error: error
  };
};
export var subscribeTopicRequest = function subscribeTopicRequest(topicName, topicId) {
  return {
    type: SUBSCRIBE_TOPIC_REQUEST,
    topicName: topicName,
    topicId: topicId
  };
};
export var subscribeTopicSuccess = function subscribeTopicSuccess(topicName, topicId) {
  return {
    type: SUBSCRIBE_TOPIC_SUCCESS,
    topicName: topicName,
    topicId: topicId
  };
};
export var subscribeTopicFailure = function subscribeTopicFailure(topicName, topicId, error) {
  return {
    type: SUBSCRIBE_TOPIC_FAILURE,
    topicName: topicName,
    topicId: topicId,
    error: error
  };
};
export var unsubscribeTopicRequest = function unsubscribeTopicRequest(topicName, topicId) {
  return {
    type: UNSUBSCRIBE_TOPIC_REQUEST,
    topicName: topicName,
    topicId: topicId
  };
};
export var unsubscribeTopicSuccess = function unsubscribeTopicSuccess(topicName, topicId) {
  return {
    type: UNSUBSCRIBE_TOPIC_SUCCESS,
    topicName: topicName,
    topicId: topicId
  };
};
export var unsubscribeTopicFailure = function unsubscribeTopicFailure(topicName, topicId, error) {
  return {
    type: UNSUBSCRIBE_TOPIC_FAILURE,
    topicName: topicName,
    topicId: topicId,
    error: error
  };
};
export var connectViewModel = function connectViewModel(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: CONNECT_VIEWMODEL,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
};
export var disconnectViewModel = function disconnectViewModel(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: DISCONNECT_VIEWMODEL,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
};
export var loadViewModelStateRequest = function loadViewModelStateRequest(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: LOAD_VIEWMODEL_STATE_REQUEST,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
}; // TODO fix docs

export var loadViewModelStateSuccess = function loadViewModelStateSuccess(viewModelName, aggregateIds, aggregateArgs, result, timestamp) {
  return {
    type: LOAD_VIEWMODEL_STATE_SUCCESS,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs,
    result: result,
    timestamp: timestamp
  };
};
export var loadViewModelStateFailure = function loadViewModelStateFailure(viewModelName, aggregateIds, aggregateArgs, error) {
  return {
    type: LOAD_VIEWMODEL_STATE_FAILURE,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs,
    error: error
  };
};
export var dropViewModelState = function dropViewModelState(viewModelName, aggregateIds, aggregateArgs) {
  return {
    type: DROP_VIEWMODEL_STATE,
    viewModelName: viewModelName,
    aggregateIds: aggregateIds,
    aggregateArgs: aggregateArgs
  };
};
export var connectReadModel = function connectReadModel(readModelName, resolverName, resolverArgs) {
  return {
    type: CONNECT_READMODEL,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs
  };
};
export var disconnectReadModel = function disconnectReadModel(readModelName, resolverName, resolverArgs) {
  return {
    type: DISCONNECT_READMODEL,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs
  };
};
export var loadReadModelStateRequest = function loadReadModelStateRequest(readModelName, resolverName, resolverArgs, queryId) {
  return {
    type: LOAD_READMODEL_STATE_REQUEST,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs,
    queryId: queryId
  };
};
export var loadReadModelStateSuccess = function loadReadModelStateSuccess(readModelName, resolverName, resolverArgs, queryId, result, timestamp) {
  return {
    type: LOAD_READMODEL_STATE_SUCCESS,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs,
    queryId: queryId,
    result: result,
    timestamp: timestamp
  };
};
export var loadReadModelStateFailure = function loadReadModelStateFailure(readModelName, resolverName, resolverArgs, queryId, error) {
  return {
    type: LOAD_READMODEL_STATE_FAILURE,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs,
    queryId: queryId,
    error: error
  };
};
export var dropReadModelState = function dropReadModelState(readModelName, resolverName, resolverArgs) {
  return {
    type: DROP_READMODEL_STATE,
    readModelName: readModelName,
    resolverName: resolverName,
    resolverArgs: resolverArgs
  };
};
export var dispatchTopicMessage = function dispatchTopicMessage(message) {
  return {
    type: DISPATCH_TOPIC_MESSAGE,
    message: message
  };
};
export var hotModuleReplacement = function hotModuleReplacement(hotModuleReplacementId) {
  return {
    type: HOT_MODULE_REPLACEMENT,
    hotModuleReplacementId: hotModuleReplacementId
  };
};
export var updateJwt = function updateJwt(jwt) {
  return {
    type: UPDATE_JWT,
    jwt: jwt
  };
};
export var logout = function logout() {
  return {
    type: LOGOUT
  };
};
export var authRequest = function authRequest(url, body) {
  if (body === void 0) {
    body = {};
  }

  return {
    type: AUTH_REQUEST,
    url: url,
    body: body
  };
};
export var authSuccess = function authSuccess(url, body) {
  return {
    type: AUTH_SUCCESS,
    url: url,
    body: body
  };
};
export var authFailure = function authFailure(url, body, error) {
  return {
    type: AUTH_FAILURE,
    url: url,
    body: body,
    error: error
  };
};
//# sourceMappingURL=actions.js.map