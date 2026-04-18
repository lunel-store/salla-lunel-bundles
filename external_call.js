(function () {
  'use strict';

  const LUNEL_BUNDLES_CONFIG_VERSION = '7.3.1';

  const JSDELIVR_PREFIX =
    'https://cdn.jsdelivr.net/gh/lunel-store/lunel-bundles@v' +
    LUNEL_BUNDLES_CONFIG_VERSION;
  const JSDELIVR_CONFIG_URL =
    JSDELIVR_PREFIX +
    '/config.js?v=' +
    encodeURIComponent(LUNEL_BUNDLES_CONFIG_VERSION);
  const JSDELIVR_CONSTANTS_URL =
    JSDELIVR_PREFIX +
    '/lunel-constants.js?v=' +
    encodeURIComponent(LUNEL_BUNDLES_CONFIG_VERSION);
  const JSDELIVR_STYLE_URL =
    JSDELIVR_PREFIX +
    '/style.css?v=' +
    encodeURIComponent(LUNEL_BUNDLES_CONFIG_VERSION);

  // Only this bootstrap; must NOT set __lunelBundlesJsLoaderExecuted (config.js Part 2 owns that and loads bundles.js).
  if (window.__lunelConfigBootstrapExecuted) return;
  window.__lunelConfigBootstrapExecuted = true;

  function loadLunelJS(url) {
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    script.onload = function () {
      console.log(
        '✅ Lunel Bundles: Successfully loaded ' + url + ' from jsDelivr.',
      );
    };
    script.onerror = function () {
      console.error(
        '❌ Lunel Bundles: Failed to load ' +
          url +
          ' from jsDelivr. Check GitHub / jsDelivr URL.',
      );
    };
    document.head.appendChild(script);
  }

  function loadStyle() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = JSDELIVR_STYLE_URL;
    document.head.appendChild(link);
  }

  loadLunelJS(JSDELIVR_CONSTANTS_URL);
  loadLunelJS(JSDELIVR_CONFIG_URL);
  loadStyle();
})();
