"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = void 0;

var validate = _interopRequireWildcard(require("./validate"));

var _utils = require("./utils");

var getRootBasedUrl = function getRootBasedUrl(origin, rootPath, path) {
  validate.string(path, 'Path');

  if ((0, _utils.isAbsoluteUrl)(path)) {
    return path;
  }

  validate.leadingSlash(path, 'Path');
  return "" + origin + (rootPath ? "/" + rootPath : '') + path;
};

var _default = getRootBasedUrl;
exports["default"] = _default;
//# sourceMappingURL=get_root_based_url.js.map