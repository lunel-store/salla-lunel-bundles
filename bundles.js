(function () {
    'use strict';

    // Prevent duplicate execution
    if (window.__lunelBundlesLoaded) return;
    window.__lunelBundlesLoaded = true;

    const LUNEL_BUNDLES_ROOT_ID = 'lunel-bundles-root';
    const BUNDLES_BY_PRODUCT_ID = window.LUNEL_BUNDLES_CONFIG || {};

    console.log('Lunel Bundles: Script loaded');
    console.log('Lunel Bundles: Config =', BUNDLES_BY_PRODUCT_ID);

    // Early exit if no config exists
    if (Object.keys(BUNDLES_BY_PRODUCT_ID).length === 0) {
        console.warn('Lunel Bundles: No configuration found.');
        return;
    }

    function getProductIdFromURL() {
        const match = window.location.pathname.match(/\/p(\d+)/);
        return match ? match[1] : null;
    }

    function normalizeBundleSelection(list) {
        if (!list || !list.length) return [];
        if (list.some((b) => b.selected)) return list;
        if (list[0]) list[0] = { ...list[0], selected: true };
        return list;
    }

    function getInsertionPoint() {
        // Strategy 1: Find the price element and insert after its container
        const priceEl = document.querySelector('.total-price-single');
        console.log('Lunel Bundles: Price element found?', priceEl);
        
        if (priceEl) {
            // Try to find the parent flex container
            let insertTarget = priceEl.closest('.flex.flex-wrap');
            if (insertTarget) {
                console.log('Lunel Bundles: Inserting after price container');
                return insertTarget;
            }
            // If no flex container, insert after the price's parent
            if (priceEl.parentElement) {
                console.log('Lunel Bundles: Inserting after price parent');
                return priceEl.parentElement;
            }
        }
        
        // Strategy 2: Find the product title and insert after it
        const titleEl = document.querySelector('.product-title');
        if (titleEl && titleEl.parentElement) {
            console.log('Lunel Bundles: Inserting after title');
            return titleEl.parentElement;
        }
        
        // Strategy 3: Find the form and insert after the first div inside it
        const form = document.querySelector('#single-product-form');
        if (form && form.firstChild) {
            console.log('Lunel Bundles: Inserting at form start');
            return form.firstChild;
        }
        
        console.warn('Lunel Bundles: No insertion point found');
        return null;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function buildBundlesHTML(bundlesData) {
        const cardsHTML = bundlesData.map((bundle) => `
            <a class="lunel-bundles__card${bundle.selected ? ' lunel-bundles__card--selected' : ''}"
               href="${bundle.href || '#'}"
               role="button"
               aria-pressed="${bundle.selected}"
               data-bundle-id="${bundle.id}">
                <div class="lunel-bundles__badge">${escapeHtml(bundle.discountText)}</div>
                <div class="lunel-bundles__media">
                    <img class="lunel-bundles__img"
                         src="${escapeHtml(bundle.imageUrl)}"
                         alt="${escapeHtml(bundle.title)}"
                         width="112"
                         height="72"
                         decoding="async"
                         loading="eager"
                         onerror="this.src='https://placehold.co/112x72?text=No+Image'">
                </div>
                <div class="lunel-bundles__label">${escapeHtml(bundle.title)}</div>
            </a>
        `).join('');

        return `
            <section id="${LUNEL_BUNDLES_ROOT_ID}" class="lunel-bundles" dir="rtl">
                <h3 class="lunel-bundles__heading">المجموعات</h3>
                <div class="lunel-bundles__grid">${cardsHTML}</div>
            </section>
        `;
    }

    function attachClickHandler() {
        const grid = document.querySelector(`#${LUNEL_BUNDLES_ROOT_ID} .lunel-bundles__grid`);
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.lunel-bundles__card');
            if (!card) return;

            const bundleId = card.dataset.bundleId;
            const href = card.getAttribute('href');
            const currentUrl = window.location.href;
            
            // Update selection UI
            grid.querySelectorAll('.lunel-bundles__card').forEach((el) => {
                const isSelected = el.dataset.bundleId === bundleId;
                el.classList.toggle('lunel-bundles__card--selected', isSelected);
                el.setAttribute('aria-pressed', isSelected);
            });

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('lunelBundleSelected', {
                detail: { bundleId: bundleId }
            }));

            // Navigate ONLY if href is different from current page
            if (href && href !== '#' && href !== currentUrl) {
                window.location.href = href;
            }
        });
    }

    function insertBundles(bundlesData) {
        if (document.getElementById(LUNEL_BUNDLES_ROOT_ID)) {
            console.log('Lunel Bundles: Already inserted');
            return true;
        }

        const anchor = getInsertionPoint();
        if (!anchor) return false;

        anchor.insertAdjacentHTML('afterend', buildBundlesHTML(bundlesData));
        attachClickHandler();
        console.log('Lunel Bundles: Successfully inserted bundles');
        return true;
    }

    // FAST INITIALIZATION
    const productId = getProductIdFromURL();
    console.log('Lunel Bundles: Current product ID =', productId);
    
    if (productId && BUNDLES_BY_PRODUCT_ID[productId]) {
        console.log('Lunel Bundles: Product found in config');
        const bundlesData = normalizeBundleSelection(BUNDLES_BY_PRODUCT_ID[productId].bundles);
        console.log('Lunel Bundles: Bundles data =', bundlesData);
        
        if (bundlesData.length) {
            let attempts = 0;
            const maxAttempts = 20;
            
            function tryInsert() {
                if (insertBundles(bundlesData)) return;
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryInsert, attempts * 50);
                }
            }
            
            tryInsert();
        } else {
            console.log('Lunel Bundles: No bundles data for product');
        }
    } else {
        console.log('Lunel Bundles: Product', productId, 'NOT found in config. Available products:', Object.keys(BUNDLES_BY_PRODUCT_ID));
    }
})();