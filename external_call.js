(function () {
  'use strict';

  var LUNEL_BUNDLES_CONFIG_VERSION = '7.0.2';
  var LUNEL_GITHUB_REPO = 'lunel-store/salla-lunel-bundles';
  var JSDELIVR_PREFIX = 'https://cdn.jsdelivr.net/gh/' + LUNEL_GITHUB_REPO + '@';

  // Only this bootstrap; must NOT set __lunelBundlesJsLoaderExecuted (config.js Part 2 owns that and loads bundles.js).
  if (window.__lunelConfigBootstrapExecuted) return;
  window.__lunelConfigBootstrapExecuted = true;

  function configJsUrl(ref) {
    return (
      JSDELIVR_PREFIX +
      ref +
      '/config.js?v=' +
      encodeURIComponent(LUNEL_BUNDLES_CONFIG_VERSION)
    );
  }

  function loadLunelConfig(ref, allowMainFallback) {
    const script = document.createElement('script');
    script.src = configJsUrl(ref);
    script.defer = true;
    script.onload = function () {
      console.log(
        '✅ Lunel Bundles: config.js loaded (v' +
          LUNEL_BUNDLES_CONFIG_VERSION +
          ', ref ' +
          ref +
          '). bundles.js is injected by config.js.',
      );
    };
    script.onerror = function () {
      if (allowMainFallback && ref !== 'main') {
        console.warn(
          'Lunel Bundles: ref "' +
            ref +
            '" failed, retrying @main for config.js',
        );
        loadLunelConfig('main', false);
        return;
      }
      console.error(
        '❌ Lunel Bundles: Failed to load config.js. Check GitHub / jsDelivr URL.',
      );
    };
    document.head.appendChild(script);
  }

  loadLunelConfig('v' + LUNEL_BUNDLES_CONFIG_VERSION, true);
})();
