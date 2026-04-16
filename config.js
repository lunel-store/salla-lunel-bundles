/* Add custom Js styles below */
/* ============================================
   Lunel Bundles - Configuration & Loader
   ============================================ */

(function () {
  'use strict';

  // Bump when you change config, bundles.js, or image assets (loader + fallbacks use v{VERSION} then main).
  var LUNEL_BUNDLES_CONFIG_VERSION = '7.1.2';

  var LUNEL_GITHUB_REPO = 'lunel-store/salla-lunel-bundles';
  var JSDELIVR_PREFIX =
    'https://cdn.jsdelivr.net/gh/' + LUNEL_GITHUB_REPO + '@';
  var JSDELIVR_TAG_PREFIX =
    JSDELIVR_PREFIX + 'v' + LUNEL_BUNDLES_CONFIG_VERSION;
  var JSDELIVR_MAIN_PREFIX = JSDELIVR_PREFIX + 'main';
  var LUNEL_LOCAL_ENV = false;

  // ============================================
  // PART 1: CONFIGURATION (Edit this for your products)
  // ============================================
  (function () {
    'use strict';

    function lunelJsdelivrImage(fileName, isMain = false) {
      var f = String(fileName || '').replace(/^\/+/, '');
      if (!f) return '';
      return (
        (isMain ? JSDELIVR_MAIN_PREFIX : JSDELIVR_TAG_PREFIX) + '/images/' + f
      );
    }

    var CATALOG = {
      'bundle-1': {
        id: 'bundle-1',
        title: 'مجموعة التفتيح والنضارة',
        subtitle: 'الروتين المتكامل للتفتيح والنضارة',
        path: 'lunel-refund-return-guarantee-3x3/p1904366049',
        imageUrl: lunelJsdelivrImage('p1904366049.webp'),
        fallbackImageUrl: lunelJsdelivrImage('p1904366049.webp', true),
      },
      'bundle-2': {
        id: 'bundle-2',
        title: 'مجموعة الترطيب والعناية بالعين',
        subtitle: 'الروتين المتكامل للتفتيح والنضارة',
        path: 'lunel-refund-return-guarantee-3x3/p1644875761',
        imageUrl: lunelJsdelivrImage('p1644875761.webp'),
        fallbackImageUrl: lunelJsdelivrImage('p1644875761.webp', true),
      },
      'bundle-3': {
        id: 'bundle-3',
        title: 'مجموعة لونيل المتكاملة',
        subtitle: 'الروتين المتكامل للتفتيح والنضارة',
        path: 'lunel-refund-return-guarantee-3x3/p2094249977',
        imageUrl: lunelJsdelivrImage('p2094249977.webp'),
        fallbackImageUrl: lunelJsdelivrImage('p2094249977.webp', true),
      },
    };

    var BY_PRODUCT = {
      1904366049: {
        name: CATALOG['bundle-1'].title,
        selected: 'bundle-1',
        bundles: [
          {
            id: 'bundle-1',
            metadata: {
              discountText: 'وفر %30',
            },
          },
          {
            id: 'bundle-3',
            metadata: {
              discountText: 'وفر %50',
              topRibbon: { text: 'الأكثر مبيعاً', tone: 'green', type: 'seal' },
              topRibbon2: {
                text: 'ينفد خلال أيام',
                tone: 'orange',
                type: 'flame',
              },
            },
          },
        ],
      },
      1644875761: {
        name: CATALOG['bundle-2'].title,
        selected: 'bundle-2',
        bundles: [
          {
            id: 'bundle-2',
            metadata: {
              discountText: 'وفر %30',
              topRibbon: { text: 'لأفضل نتائج', tone: 'green', type: 'seal' },
            },
          },
          {
            id: 'bundle-3',
            metadata: {
              discountText: 'وفر %50',
              topRibbon: {
                text: 'الأكثر مبيعاً',
                tone: 'orange',
                type: 'flame',
              },
            },
          },
        ],
      },
      2094249977: {
        name: CATALOG['bundle-3'].title,
        selected: 'bundle-3',
        bundles: [
          {
            id: 'bundle-1',
            metadata: {
              discountText: 'وفر %30',
              topRibbon: { text: 'لأفضل نتائج', tone: 'green', type: 'seal' },
            },
          },
          {
            id: 'bundle-2',
            metadata: {
              discountText: 'وفر %30',
              topRibbon: { text: 'لأفضل نتائج', tone: 'green', type: 'seal' },
            },
          },
          {
            id: 'bundle-3',
            metadata: {
              discountText: 'وفر %50',
              topRibbon: {
                text: 'الأكثر مبيعاً',
                tone: 'orange',
                type: 'flame',
              },
            },
          },
        ],
      },
    };

    function productHrefFromPath(path) {
      var p = String(path || '')
        .trim()
        .replace(/^\/+/, '');
      if (!p) return '#';
      var host = window.location.hostname;
      var prefix = '';
      if (host === 'salla.sa' || host.slice(-9) === '.salla.sa') {
        var parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length > 0) prefix = '/' + parts[0];
        else {
          var fb = window.LUNEL_BUNDLES_SALLA_STORE_SLUG;
          if (typeof fb === 'string' && fb.trim()) {
            prefix = '/' + fb.trim().replace(/^\/+|\/+$/g, '');
          }
        }
      }
      return window.location.origin + prefix + '/' + p;
    }

    function buldProductConfig(productId) {
      var product = BY_PRODUCT[productId];

      if (!product) {
        console.warn('Lunel Bundles: No config for product ID', productId);
        return null;
      }

      return {
        name: product.name,
        bundles: product.bundles
          .map(function (bundle) {
            var base = CATALOG[bundle.id];
            if (!base) {
              console.warn(
                'Lunel Bundles: missing catalog entry for',
                bundle.id,
              );
              return null;
            }

            return {
              id: base.id,
              title: base.title,
              subtitle: base.subtitle,
              path: base.path,
              href: productHrefFromPath(base.path),
              imageUrl: base.imageUrl,
              fallbackImageUrl: base.fallbackImageUrl,
              discountText: bundle.metadata.discountText,
              topRibbon: bundle.metadata.topRibbon,
              topRibbon2: bundle.metadata.topRibbon2,
              selected: bundle.id === product.selected,
            };
          })
          .filter(Boolean),
      };
    }

    var out = {};
    for (var productId in BY_PRODUCT) {
      if (!Object.prototype.hasOwnProperty.call(BY_PRODUCT, productId))
        continue;
      var productConfig = buldProductConfig(productId);
      if (productConfig) out[productId] = productConfig;
    }

    window.LUNEL_BUNDLES_CONFIG = out;
  })();

  // ============================================
  // PART 2: CACHE-BUSTING LOADER
  // ============================================
  (function () {
    'use strict';

    // Prevent duplicate bundles.js injection (do not reuse __lunelLoaderExecuted — external bootstraps may set that before config runs).
    if (window.__lunelBundlesJsLoaderExecuted) return;
    window.__lunelBundlesJsLoaderExecuted = true;

    function sanitizeGitRef(ref) {
      return String(ref || '')
        .trim()
        .replace(/^@+/, '')
        .replace(/[^a-zA-Z0-9._/-]/g, '');
    }

    function bundlesJsUrl(ref) {
      if (LUNEL_LOCAL_ENV) return '../../../bundles.js';

      return (
        JSDELIVR_PREFIX +
        ref +
        '/bundles.js?v=' +
        encodeURIComponent(LUNEL_BUNDLES_CONFIG_VERSION)
      );
    }

    function loadBundlesJs(ref, allowMainFallback) {
      const script = document.createElement('script');
      script.src = bundlesJsUrl(ref);
      script.defer = true;
      script.onload = function () {
        console.log(
          '✅ Lunel Bundles: Loaded successfully (v' +
            LUNEL_BUNDLES_CONFIG_VERSION +
            ', ref ' +
            ref +
            ')',
        );
      };
      script.onerror = function () {
        if (allowMainFallback && ref !== 'main') {
          console.warn(
            'Lunel Bundles: ref "' + ref + '" failed, retrying @main',
          );
          loadBundlesJs('main', false);
          return;
        }
        console.error(
          '❌ Lunel Bundles: Failed to load. Check GitHub file URL.',
        );
      };
      document.head.appendChild(script);
    }

    const explicit = sanitizeGitRef(window.LUNEL_BUNDLES_JS_REF_BRANCH);
    if (explicit) {
      loadBundlesJs(explicit, false);
    } else {
      loadBundlesJs('v' + LUNEL_BUNDLES_CONFIG_VERSION, true);
    }
  })();
})();
