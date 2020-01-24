"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var getOrigin = function getOrigin(location) {
  return location != null ? location.origin == null ? location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : '') + ")" : location.origin : null;
};

var _default = getOrigin;
exports["default"] = _default;
//# sourceMappingURL=get_origin.js.map