"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _action_types = require("./action_types");

var createJwtReducer = function createJwtReducer() {
  return function (state, action) {
    if (state === void 0) {
      state = {};
    }

    switch (action.type) {
      case _action_types.UPDATE_JWT:
        {
          return action.jwt;
        }

      case _action_types.LOGOUT:
        {
          return {};
        }

      default:
        return state;
    }
  };
};

var _default = createJwtReducer;
exports["default"] = _default;
//# sourceMappingURL=create_jwt_reducer.js.map