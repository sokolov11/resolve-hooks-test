import * as validate from './validate';
import { isAbsoluteUrl } from './utils';

var getRootBasedUrl = function getRootBasedUrl(origin, rootPath, path) {
  validate.string(path, 'Path');

  if (isAbsoluteUrl(path)) {
    return path;
  }

  validate.leadingSlash(path, 'Path');
  return "" + origin + (rootPath ? "/" + rootPath : '') + path;
};

export default getRootBasedUrl;
//# sourceMappingURL=get_root_based_url.js.map