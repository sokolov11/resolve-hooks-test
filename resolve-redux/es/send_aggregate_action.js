import * as actions from './actions';

var sendAggregateAction = function sendAggregateAction(aggregateName, commandType, aggregateId, payload) {
  return actions.sendCommandRequest(commandType, aggregateId, aggregateName, payload);
};

export default sendAggregateAction;
//# sourceMappingURL=send_aggregate_action.js.map