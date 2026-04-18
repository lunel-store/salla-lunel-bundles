(function () {
  'use strict';

  const LUNEL_JSDELIVR_LINK =
    'https://cdn.jsdelivr.net/gh/lunel-store/lunel-bundles@v7.3.4/init.js';

  if (window.__lunelInitBootstrapExecuted) return;
  window.__lunelInitBootstrapExecuted = true;

  const script = document.createElement('script');
  script.src = LUNEL_JSDELIVR_LINK;
  script.defer = true;
  script.onload = function () {
    console.log(
      '✅ Lunel Bundles: Successfully loaded ' +
        LUNEL_JSDELIVR_LINK +
        ' from jsDelivr.',
    );
  };
  script.onerror = function () {
    console.error(
      '❌ Lunel Bundles: Failed to load ' +
        LUNEL_JSDELIVR_LINK +
        ' from jsDelivr. Check GitHub / jsDelivr URL.',
    );
  };
  document.head.appendChild(script);
})();
