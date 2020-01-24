"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _get_root_based_url = _interopRequireDefault(require("./get_root_based_url"));

var validate = _interopRequireWildcard(require("./validate"));

var _utils = require("./utils");

var getStaticBasedUrl = function getStaticBasedUrl(origin, rootPath, staticPath, path) {
  validate.string(path, 'Path');
  validate.nonEmptyString(staticPath, 'Static path');

  if ((0, _utils.isAbsoluteUrl)(path)) {
    return path;
  }

  validate.leadingSlash(path, 'Path');

  if ((0, _utils.isAbsoluteUrl)(staticPath)) {
    return "" + staticPath + path;
  }

  return (0, _get_root_based_url["default"])(origin, rootPath, "/" + staticPath + path);
};

var _default = getStaticBasedUrl;
exports["default"] = _default;
//# sourceMappingURL=get_static_based_url.js.map