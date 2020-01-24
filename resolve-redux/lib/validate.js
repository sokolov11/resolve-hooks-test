"use strict";

exports.__esModule = true;
exports.arrayOfString = exports.leadingSlash = exports.nonEmptyString = exports.string = void 0;

var _utils = require("./utils");

var string = function string(value, name) {
  if (!(0, _utils.isString)(value)) {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must be a string");
  }
};

exports.string = string;

var nonEmptyString = function nonEmptyString(value, name) {
  string(value, name);

  if (value === '') {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must be a non-empty string");
  }
};

exports.nonEmptyString = nonEmptyString;

var leadingSlash = function leadingSlash(value, name) {
  if (!(0, _utils.isLeadingSlash)(value)) {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must have leading \"/\"");
  }
};

exports.leadingSlash = leadingSlash;

var arrayOfString = function arrayOfString(value, name) {
  if (!Array.isArray(value) || value.find(_utils.isNonString)) {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must be an Array<String>");
  }
};

exports.arrayOfString = arrayOfString;
//# sourceMappingURL=validate.js.map