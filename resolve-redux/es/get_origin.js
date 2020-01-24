var getOrigin = function getOrigin(location) {
  return location != null ? location.origin == null ? location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : '') + ")" : location.origin : null;
};

export default getOrigin;
//# sourceMappingURL=get_origin.js.map