"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _get_static_based_url = _interopRequireDefault(require("./get_static_based_url"));

var _create_context_based_connector = _interopRequireDefault(require("./create_context_based_connector"));

var connectStaticBasedUrls = (0, _create_context_based_connector["default"])(function (_ref, path) {
  var origin = _ref.origin,
      rootPath = _ref.rootPath,
      staticPath = _ref.staticPath;
  return (0, _get_static_based_url["default"])(origin, rootPath, staticPath, path);
});
var _default = connectStaticBasedUrls;
exports["default"] = _default;
//# sourceMappingURL=connect_static_based_urls.js.map