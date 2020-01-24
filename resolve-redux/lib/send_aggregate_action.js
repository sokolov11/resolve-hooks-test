"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = void 0;

var actions = _interopRequireWildcard(require("./actions"));

var sendAggregateAction = function sendAggregateAction(aggregateName, commandType, aggregateId, payload) {
  return actions.sendCommandRequest(commandType, aggregateId, aggregateName, payload);
};

var _default = sendAggregateAction;
exports["default"] = _default;
//# sourceMappingURL=send_aggregate_action.js.map