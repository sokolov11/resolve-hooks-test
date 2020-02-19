"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const resolve_api_1 = require("resolve-api");
const context_1 = require("./context");
/* interface Event {
  type: string
  [key: string]: any
} */
const useSubscription = (viewModelName, aggregateIds, aggregateArgs, onEvent, onSubscribe) => {
    const context = react_1.useContext(context_1.ResolveContext);
    if (!context) {
        throw Error('You cannot use resolve effects outside Resolve context');
    }
    const { viewModels } = context;
    const api = resolve_api_1.getApi(context);
    react_1.useEffect(() => {
        const viewModel = viewModels.find(({ name }) => name === viewModelName);
        if (!viewModel) {
            return undefined;
        }
        api.subscribeTo(viewModelName, aggregateIds, onEvent, onSubscribe);
        return () => {
            if (!viewModel) {
                api.unsubscribeFrom(viewModelName, aggregateIds, onEvent);
            }
        };
    }, []);
};
exports.useSubscription = useSubscription;
//# sourceMappingURL=use_subscription.js.map