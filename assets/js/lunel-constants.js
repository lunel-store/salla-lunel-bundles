/**
 * Lunel Bundles — shared constants (version, CDN URLs, DOM ids, ribbon SVG HTML).
 * Load first. Initializes once (see __lunelBundlesConstantsLoaded).
 * Optional: set window.LUNEL_LOCAL_ENV = true in an inline script before this file for local asset paths.
 */
(function () {
  'use strict';

  if (window.__lunelBundlesConstantsLoaded) return;
  window.__lunelBundlesConstantsLoaded = true;

  window.LUNEL_BUNDLES_ROOT_ID = 'lunel-bundles-root';

  if (typeof window.LUNEL_LOCAL_ENV !== 'boolean') {
    window.LUNEL_LOCAL_ENV = false;
  }
})();
