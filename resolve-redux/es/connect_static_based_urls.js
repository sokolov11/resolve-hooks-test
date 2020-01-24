import getStaticBasedUrl from './get_static_based_url';
import createContextBasedConnector from './create_context_based_connector';
var connectStaticBasedUrls = createContextBasedConnector(function (_ref, path) {
  var origin = _ref.origin,
      rootPath = _ref.rootPath,
      staticPath = _ref.staticPath;
  return getStaticBasedUrl(origin, rootPath, staticPath, path);
});
export default connectStaticBasedUrls;
//# sourceMappingURL=connect_static_based_urls.js.map