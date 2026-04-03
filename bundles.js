(function () {
    'use strict';

    // Prevent duplicate execution
    if (window.__lunelBundlesLoaded) return;
    window.__lunelBundlesLoaded = true;

    const LUNEL_BUNDLES_ROOT_ID = 'lunel-bundles-root';
    const BUNDLES_BY_PRODUCT_ID = window.LUNEL_BUNDLES_CONFIG || {};

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
        const form = document.querySelector('#single-product-form, form.product-form');
        if (!form) return null;

        const fireIcon = form.querySelector('.sicon-fire');
        if (fireIcon) {
            const row = fireIcon.closest('.my-6');
            if (row) return row;
        }

        const priceEl = document.querySelector('.total-price-single');
        return priceEl?.closest('.flex.flex-wrap') || null;
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

    // FIXED: Navigates to href when clicked
    function attachClickHandler() {
        const grid = document.querySelector(`#${LUNEL_BUNDLES_ROOT_ID} .lunel-bundles__grid`);
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.lunel-bundles__card');
            if (!card) return;

            const bundleId = card.dataset.bundleId;
            const href = card.getAttribute('href');
            
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

            // Navigate to the link (if it's a valid URL and not "#")
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    }

    function insertBundles(bundlesData) {
        if (document.getElementById(LUNEL_BUNDLES_ROOT_ID)) return true;

        const anchor = getInsertionPoint();
        if (!anchor) return false;

        anchor.insertAdjacentHTML('afterend', buildBundlesHTML(bundlesData));
        attachClickHandler();
        return true;
    }

    // FAST INITIALIZATION
    const productId = getProductIdFromURL();
    if (productId && BUNDLES_BY_PRODUCT_ID[productId]) {
        const bundlesData = normalizeBundleSelection(BUNDLES_BY_PRODUCT_ID[productId].bundles);
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
        }
    }
})();