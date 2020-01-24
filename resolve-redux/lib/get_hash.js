"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var weakMap = new WeakMap();

var getHash = function getHash(value) {
  if (value == null) {
    throw new Error('Can not calculate hash of null/undefined value');
  }

  if (value.constructor === String || value.constructor === Number || value.constructor === Boolean) {
    return value;
  }

  if (weakMap.has(value)) {
    return weakMap.get(value);
  }

  var result = (0, _jsonStableStringify["default"])(value);
  weakMap.set(value, result);
  return result;
};

var _default = getHash;
exports["default"] = _default;
//# sourceMappingURL=get_hash.js.map