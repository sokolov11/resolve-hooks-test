"use strict";

exports.__esModule = true;
exports.isNonString = exports.isString = exports.isLeadingSlash = exports.isAbsoluteUrl = void 0;
var regExpAbsoluteUrl = /:\/\//i;
var regExpLeadingSlash = /^\//i;

var isAbsoluteUrl = function isAbsoluteUrl(value) {
  return regExpAbsoluteUrl.test(value);
};

exports.isAbsoluteUrl = isAbsoluteUrl;

var isLeadingSlash = function isLeadingSlash(value) {
  return regExpLeadingSlash.test(value);
};

exports.isLeadingSlash = isLeadingSlash;

var isString = function isString(value) {
  return value != null && value.constructor === String;
};

exports.isString = isString;

var isNonString = function isNonString(value) {
  return !isString(value);
};

exports.isNonString = isNonString;
//# sourceMappingURL=utils.js.map