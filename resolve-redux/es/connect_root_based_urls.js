import getRootBasedUrl from './get_root_based_url';
import createContextBasedConnector from './create_context_based_connector';
var connectRootBasedUrls = createContextBasedConnector(function (_ref, path) {
  var origin = _ref.origin,
      rootPath = _ref.rootPath;
  return getRootBasedUrl(origin, rootPath, path);
});
export default connectRootBasedUrls;
//# sourceMappingURL=connect_root_based_urls.js.map