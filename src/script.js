/* Add custom Js styles below */ 
/* ============================================
   Lunel Bundles - Configuration & Loader
   ============================================ */

// ============================================
// PART 1: CONFIGURATION (Edit this for your products)
// ============================================
window.LUNEL_BUNDLES_CONFIG = {
    // Product ID 1904366049
    1904366049: {
        name: 'مجموعة التفتيح والنضارة',
        bundles: [
            {
                id: 'bundle-1',
                title: 'مجموعة التفتيح والنضارة',
                discountText: 'وفر %40',
                selected: true,
                path: 'lunel-refund-return-guarantee-3x3/p1904366049',
                imageUrl: 'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png'
            },
            {
                id: 'bundle-2',
                title: 'مجموعة لونيل المتكاملة',
                discountText: 'وفر %30',
                selected: false,
                path: 'lunel-refund-return-guarantee-3x3/p2094249977',
                imageUrl: 'https://cdn.jsdelivr.net/gh/ahmedalsanadi/salla-lunel-bundles@main/images/full-lunel-collection.png'
            }
        ]
    },
    
    // Product ID 2094249977
    2094249977: {
        name: 'مجموعة لونيل المتكاملة',
        bundles: [
            {
                id: 'bundle-2',
                title: 'مجموعة لونيل المتكاملة',
                discountText: 'وفر %30',
                selected: true,
                path: 'lunel-refund-return-guarantee-3x3/p2094249977',
                imageUrl: 'https://cdn.jsdelivr.net/gh/ahmedalsanadi/salla-lunel-bundles@main/images/full-lunel-collection.png'
            },
            {
                id: 'bundle-3',
                title: 'مجموعة الترطيب والعناية بالعين',
                discountText: 'وفر %25',
                selected: false,
                path: 'lunel-refund-return-guarantee-3x3/p1644875761',
                imageUrl: 'https://cdn.salla.sa/PdPWWG/81e639d9-6749-4ca6-bf8a-d9ab162c1e0c-1000x1000-CLxJzGdHfzX6jYJnUD35xxQuaKkY3Fj4l26pk5rz.png'
            },
            {
                id: 'bundle-1',
                title: 'مجموعة التفتيح والنضارة',
                discountText: 'وفر %40',
                selected: false,
                path: 'lunel-refund-return-guarantee-3x3/p1904366049',
                imageUrl: 'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png'
            }
        ]
    },
    
    // Product ID 1644875761
    1644875761: {
        name: 'مجموعة الترطيب والعناية بالعين',
        bundles: [
            {
                id: 'bundle-3',
                title: 'مجموعة الترطيب والعناية بالعين',
                discountText: 'وفر %25',
                selected: true,
                path: 'lunel-refund-return-guarantee-3x3/p1644875761',
                imageUrl: 'https://cdn.salla.sa/PdPWWG/81e639d9-6749-4ca6-bf8a-d9ab162c1e0c-1000x1000-CLxJzGdHfzX6jYJnUD35xxQuaKkY3Fj4l26pk5rz.png'
            },
            {
                id: 'bundle-2',
                title: 'مجموعة لونيل المتكاملة',
                discountText: 'وفر %30',
                selected: false,
                path: 'lunel-refund-return-guarantee-3x3/p2094249977',
                imageUrl: 'https://cdn.jsdelivr.net/gh/ahmedalsanadi/salla-lunel-bundles@main/images/full-lunel-collection.png'
            }
        ]
    }
};

// ============================================
// PART 2: CACHE-BUSTING LOADER
// ============================================
(function() {
    'use strict';
    
    // Prevent loading twice
    if (window.__lunelLoaderExecuted) return;
    window.__lunelLoaderExecuted = true;
    
    // IMPORTANT: Increment this number EVERY TIME you change the config
    const CONFIG_VERSION = '6.0.2';
    
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