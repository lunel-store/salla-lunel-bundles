/* Add custom Js styles below */ 
/* ============================================
   Lunel Bundles - Configuration & Loader
   ============================================ */

// Bump when you change config, bundles.js, or image assets (loader + fallbacks use v{VERSION} then main).
var LUNEL_BUNDLES_CONFIG_VERSION = '6.1.5';

// ============================================
// PART 1: CONFIGURATION (Edit this for your products)
// ============================================
(function () {
    'use strict';

    var GITHUB_REPO = 'lunel-store/salla-lunel-bundles';

    function lunelJsdelivrImage(gitRef, fileName) {
        var f = String(fileName || '').replace(/^\/+/, '');
        if (!f) return '';
        return 'https://cdn.jsdelivr.net/gh/' + GITHUB_REPO + '@' + gitRef + '/images/' + f;
    }

    var CATALOG = {
        'bundle-1': {
            id: 'bundle-1',
            title: 'مجموعة التفتيح والنضارة',
            discountText: 'وفر %40',
            path: 'lunel-refund-return-guarantee-3x3/p1904366049',
            imageUrl: 'https://cdn.salla.sa/PdPWWG/45bac867-ef96-46ce-a384-6e756a30583c-1000x1000-rWPmls1QWgnfrr9ZiNJiAvpwrNIkkWEhXqEinVMc.png',
            imageFallbackFile: 'p1904366049.webp',
            topRibbon: { text: 'لأفضل نتائج', tone: 'green', seal: true }
        },
        'bundle-2': {
            id: 'bundle-2',
            title: 'مجموعة لونيل المتكاملة',
            discountText: 'وفر %30',
            path: 'lunel-refund-return-guarantee-3x3/p2094249977',
            imageUrl: 'https://cdn.salla.sa/PdPWWG/97a4430c-7c79-40b3-90d5-2ecd63944b86-1000x1000-aFE1QorPvoKTE4e2yKJkeU9k3E2pSP9t3hTAkDwO.png',
            imageFallbackFile: 'p2094249977.webp',
            topRibbon: { text: 'الأكثر مبيعاً', tone: 'orange', seal: true },
            topRibbon2: { text: 'ينفد خلال أيام', tone: 'red', flame: true }
        },
        'bundle-3': {
            id: 'bundle-3',
            title: 'مجموعة الترطيب والعناية بالعين',
            discountText: 'وفر %25',
            path: 'lunel-refund-return-guarantee-3x3/p1644875761',
            imageUrl: 'https://cdn.salla.sa/PdPWWG/81e639d9-6749-4ca6-bf8a-d9ab162c1e0c-1000x1000-CLxJzGdHfzX6jYJnUD35xxQuaKkY3Fj4l26pk5rz.png',
            imageFallbackFile: 'p1644875761.webp',
            topRibbon: { text: 'لأفضل نتائج', tone: 'green', seal: true }
        }
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

    var BY_PRODUCT = {
        1904366049: {
            name: 'مجموعة التفتيح والنضارة',
            bundles: ['bundle-1', 'bundle-2'],
            selected: 'bundle-1'
        },
        2094249977: {
            name: 'مجموعة لونيل المتكاملة',
            bundles: ['bundle-2', 'bundle-3', 'bundle-1'],
            selected: 'bundle-2'
        },
        1644875761: {
            name: 'مجموعة الترطيب والعناية بالعين',
            bundles: ['bundle-3', 'bundle-2'],
            selected: 'bundle-3'
        }
    };

    var out = {};
    for (var productId in BY_PRODUCT) {
        if (!Object.prototype.hasOwnProperty.call(BY_PRODUCT, productId)) continue;
        var def = BY_PRODUCT[productId];
        out[productId] = {
            name: def.name,
            bundles: def.bundles
                .map(function (bundleId) {
                    var base = CATALOG[bundleId];
                    if (!base) {
                        console.warn('Lunel Bundles: missing catalog entry for', bundleId);
                        return null;
                    }
                    var tagRef = 'v' + LUNEL_BUNDLES_CONFIG_VERSION;
                    var file = base.imageFallbackFile;
                    var fbTag = file ? lunelJsdelivrImage(tagRef, file) : '';
                    var fbMain = file ? lunelJsdelivrImage('main', file) : '';
                    return {
                        id: base.id,
                        title: base.title,
                        discountText: base.discountText,
                        path: base.path,
                        href: productHrefFromPath(base.path),
                        imageUrl: base.imageUrl,
                        imageFallbackUrl: fbTag,
                        imageFallbackUrlMain: fbMain,
                        topRibbon: base.topRibbon,
                        topRibbon2: base.topRibbon2,
                        selected: bundleId === def.selected
                    };
                })
                .filter(Boolean)
        };
    }
    window.LUNEL_BUNDLES_CONFIG = out;
})();

// ============================================
// PART 2: CACHE-BUSTING LOADER
// ============================================
(function() {
    'use strict';
    
    // Prevent loading twice
    if (window.__lunelLoaderExecuted) return;
    window.__lunelLoaderExecuted = true;
    
    const CONFIG_VERSION = LUNEL_BUNDLES_CONFIG_VERSION;
    const GITHUB_REPO = 'lunel-store/salla-lunel-bundles';

    function sanitizeGitRef(ref) {
        return String(ref || '')
            .trim()
            .replace(/^@+/, '')
            .replace(/[^a-zA-Z0-9._/-]/g, '');
    }

    function bundlesJsUrl(ref) {
        return (
            'https://cdn.jsdelivr.net/gh/' +
            GITHUB_REPO +
            '@' +
            ref +
            '/bundles.js?v=' +
            encodeURIComponent(CONFIG_VERSION)
        );
    }

    function loadBundlesJs(ref, allowMainFallback) {
        const script = document.createElement('script');
        script.src = bundlesJsUrl(ref);
        script.defer = true;
        script.onload = function () {
            console.log('✅ Lunel Bundles: Loaded successfully (v' + CONFIG_VERSION + ', ref ' + ref + ')');
        };
        script.onerror = function () {
            if (allowMainFallback && ref !== 'main') {
                console.warn('Lunel Bundles: ref "' + ref + '" failed, retrying @main');
                loadBundlesJs('main', false);
                return;
            }
            console.error('❌ Lunel Bundles: Failed to load. Check GitHub file URL.');
        };
        document.head.appendChild(script);
    }

    const explicit = sanitizeGitRef(window.LUNEL_BUNDLES_JS_REF);
    if (explicit) {
        loadBundlesJs(explicit, false);
    } else {
        loadBundlesJs('v' + CONFIG_VERSION, true);
    }
})();