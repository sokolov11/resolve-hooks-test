import { isLeadingSlash, isNonString, isString } from './utils';
export var string = function string(value, name) {
  if (!isString(value)) {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must be a string");
  }
};
export var nonEmptyString = function nonEmptyString(value, name) {
  string(value, name);

  if (value === '') {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must be a non-empty string");
  }
};
export var leadingSlash = function leadingSlash(value, name) {
  if (!isLeadingSlash(value)) {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must have leading \"/\"");
  }
};
export var arrayOfString = function arrayOfString(value, name) {
  if (!Array.isArray(value) || value.find(isNonString)) {
    // eslint-disable-next-line
    console.error(value);
    throw new Error(name + " must be an Array<String>");
  }
};
//# sourceMappingURL=validate.js.map