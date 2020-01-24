import { UPDATE_JWT, LOGOUT } from './action_types';

var createJwtReducer = function createJwtReducer() {
  return function (state, action) {
    if (state === void 0) {
      state = {};
    }

    switch (action.type) {
      case UPDATE_JWT:
        {
          return action.jwt;
        }

      case LOGOUT:
        {
          return {};
        }

      default:
        return state;
    }
  };
};

export default createJwtReducer;
//# sourceMappingURL=create_jwt_reducer.js.map