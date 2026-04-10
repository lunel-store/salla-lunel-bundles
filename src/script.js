/* Add custom Js styles below */ 
/* ============================================
   Lunel Bundles - Configuration & Loader
   ============================================ */

// ============================================
// PART 1: CONFIGURATION (Edit this for your products)
// ============================================
(function () {
    'use strict';

    var CATALOG = {
        'bundle-1': {
            id: 'bundle-1',
            title: 'مجموعة التفتيح والنضارة',
            discountText: 'وفر %40',
            path: 'lunel-refund-return-guarantee-3x3/p1904366049',
            imageUrl: 'https://cdn.salla.sa/PdPWWG/45bac867-ef96-46ce-a384-6e756a30583c-1000x1000-rWPmls1QWgnfrr9ZiNJiAvpwrNIkkWEhXqEinVMc.png',
            imageFallbackUrl: 'https://cdn.jsdelivr.net/gh/lunel-store/salla-lunel-bundles@main/images/p1904366049.webp'
        },
        'bundle-2': {
            id: 'bundle-2',
            title: 'مجموعة لونيل المتكاملة',
            discountText: 'وفر %30',
            path: 'lunel-refund-return-guarantee-3x3/p2094249977',
            imageUrl: 'https://cdn.salla.sa/PdPWWG/97a4430c-7c79-40b3-90d5-2ecd63944b86-1000x1000-aFE1QorPvoKTE4e2yKJkeU9k3E2pSP9t3hTAkDwO.png',
            imageFallbackUrl: 'https://cdn.jsdelivr.net/gh/lunel-store/salla-lunel-bundles@main/images/p2094249977.webp'
        },
        'bundle-3': {
            id: 'bundle-3',
            title: 'مجموعة الترطيب والعناية بالعين',
            discountText: 'وفر %25',
            path: 'lunel-refund-return-guarantee-3x3/p1644875761',
            imageUrl: 'https://cdn.salla.sa/PdPWWG/81e639d9-6749-4ca6-bf8a-d9ab162c1e0c-1000x1000-CLxJzGdHfzX6jYJnUD35xxQuaKkY3Fj4l26pk5rz.png',
            imageFallbackUrl: 'https://cdn.jsdelivr.net/gh/lunel-store/salla-lunel-bundles@main/images/p1644875761.webp'
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
                    return {
                        id: base.id,
                        title: base.title,
                        discountText: base.discountText,
                        path: base.path,
                        href: productHrefFromPath(base.path),
                        imageUrl: base.imageUrl,
                        imageFallbackUrl: base.imageFallbackUrl,
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
    
    // IMPORTANT: Increment this number EVERY TIME you change the config
    const CONFIG_VERSION = '6.0.7';
    
    // Force fresh load from GitHub
    const SCRIPT_URL = 'https://cdn.jsdelivr.net/gh/lunel-store/salla-lunel-bundles@main/bundles.js?v=' + CONFIG_VERSION;
    
    // Load the script
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.defer = true;
    script.onload = function() {
        console.log('✅ Lunel Bundles: Loaded successfully (v' + CONFIG_VERSION + ')');
    };
    script.onerror = function() {
        console.error('❌ Lunel Bundles: Failed to load. Check GitHub file URL.');
    };
    document.head.appendChild(script);
})();