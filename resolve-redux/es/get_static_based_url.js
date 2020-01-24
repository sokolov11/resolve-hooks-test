import getRootBasedUrl from './get_root_based_url';
import * as validate from './validate';
import { isAbsoluteUrl } from './utils';

var getStaticBasedUrl = function getStaticBasedUrl(origin, rootPath, staticPath, path) {
  validate.string(path, 'Path');
  validate.nonEmptyString(staticPath, 'Static path');

  if (isAbsoluteUrl(path)) {
    return path;
  }

  validate.leadingSlash(path, 'Path');

  if (isAbsoluteUrl(staticPath)) {
    return "" + staticPath + path;
  }

  return getRootBasedUrl(origin, rootPath, "/" + staticPath + path);
};

export default getStaticBasedUrl;
//# sourceMappingURL=get_static_based_url.js.map