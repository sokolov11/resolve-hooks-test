var regExpAbsoluteUrl = /:\/\//i;
var regExpLeadingSlash = /^\//i;
export var isAbsoluteUrl = function isAbsoluteUrl(value) {
  return regExpAbsoluteUrl.test(value);
};
export var isLeadingSlash = function isLeadingSlash(value) {
  return regExpLeadingSlash.test(value);
};
export var isString = function isString(value) {
  return value != null && value.constructor === String;
};
export var isNonString = function isNonString(value) {
  return !isString(value);
};
//# sourceMappingURL=utils.js.map