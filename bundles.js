(function () {
    'use strict';

    const LUNEL_BUNDLES_ROOT_ID = 'lunel-bundles-root';
    const WAIT_MAX_MS = 12000;

    const BUNDLES_BY_PRODUCT_ID = {
        1904366049: {
            bundles: [
                {
                    id: 'bundle-1',
                    title: 'مجموعة لوليل المتكاملة',
                    discountText: 'وفر %40',
                    selected: false,
                    href: '#',
                    imageUrl:
                        'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png',
                },
                {
                    id: 'bundle-2',
                    title: 'مجموعة التفتيح والنضارة',
                    discountText: 'وفر %30',
                    selected: true,
                    href: '#',
                    imageUrl:
                        'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png',
                },
            ],
        },
        1839649229: {
            bundles: [
                {
                    id: 'bundle-1',
                    title: 'مثال — مجموعة أ',
                    discountText: 'وفر %40',
                    selected: false,
                    href: '#',
                    imageUrl:
                        'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png',
                },
                {
                    id: 'bundle-2',
                    title: 'مثال — مجموعة ب',
                    discountText: 'وفر %30',
                    selected: true,
                    href: '#',
                    imageUrl:
                        'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png',
                },
            ],
        },
        935405481: {
            bundles: [
                {
                    id: 'bundle-3',
                    title: 'مثال — مجموعة ج',
                    discountText: 'وفر %25',
                    selected: true,
                    href: '#',
                    imageUrl:
                        'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png',
                },
                {
                    id: 'bundle-4',
                    title: 'مثال — مجموعة د',
                    discountText: 'وفر %15',
                    selected: false,
                    href: '#',
                    imageUrl:
                        'https://cdn.salla.sa/PdPWWG/d26b4610-39c1-41ed-b485-097a77bd969b-1000x1000-eNNwLczaTo3BZWzaXOfetaklAglGGjAf227YqQKH.png',
                },
            ],
        },
    };

    //Early exit — check product ID immediately
    const productId = getProductIdFromURL();
    if (!productId || !BUNDLES_BY_PRODUCT_ID[productId]) return;

    // Cache bundles data once
    const bundlesData = normalizeBundleSelection(
        BUNDLES_BY_PRODUCT_ID[productId].bundles,
    );
    if (!bundlesData.length) return;

    // Simplified product ID extraction
    function getProductIdFromURL() {
        const match = window.location.pathname.match(/\/p(\d+)/);
        return match ? match[1] : null;
    }

    function normalizeBundleSelection(list) {
        if (!list || !list.length) return [];
        if (list.some((b) => b.selected)) return list;
        list[0] = { ...list[0], selected: true };
        return list;
    }

    // Simplified anchor detection
    function getInsertionPoint() {
        const form = document.querySelector(
            '#single-product-form, form.product-form',
        );
        if (!form) return null;

        // Try fire icon row first, then price row
        const fireIcon = form.querySelector('.sicon-fire');
        if (fireIcon) {
            const row = fireIcon.closest('.my-6');
            if (row) return row;
        }

        const priceEl = form.querySelector('.total-price-single');
        return priceEl?.closest('.flex.flex-wrap') || null;
    }

    // Build HTML with template literal 
    function buildBundlesHTML() {
        const cardsHTML = bundlesData
            .map(
                (bundle) => `
            <a class="lunel-bundles__card${bundle.selected ? ' lunel-bundles__card--selected' : ''}"
               href="${bundle.href || '#'}"
               role="button"
               aria-pressed="${bundle.selected}"
               data-bundle-id="${bundle.id}">
                <div class="lunel-bundles__badge">${bundle.discountText}</div>
                <div class="lunel-bundles__media">
                    <img class="lunel-bundles__img"
                         src="${bundle.imageUrl}"
                         alt="${bundle.title}"
                         width="112"
                         height="72"
                         decoding="async"
                         loading="eager">
                </div>
                <div class="lunel-bundles__label">${bundle.title}</div>
            </a>
        `,
            )
            .join('');

        return `
            <section id="${LUNEL_BUNDLES_ROOT_ID}" class="lunel-bundles" dir="rtl">
                <h3 class="lunel-bundles__heading">المجموعات</h3>
                <div class="lunel-bundles__grid">${cardsHTML}</div>
            </section>
        `;
    }

    // Simplified card selection with event delegation
    function attachClickHandler() {
        const grid = document.querySelector(
            `#${LUNEL_BUNDLES_ROOT_ID} .lunel-bundles__grid`,
        );
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.lunel-bundles__card');
            if (!card) return;

            e.preventDefault();
            const bundleId = card.dataset.bundleId;

            // Update all cards in one pass
            grid.querySelectorAll('.lunel-bundles__card').forEach((el) => {
                const isSelected = el.dataset.bundleId === bundleId;
                el.classList.toggle(
                    'lunel-bundles__card--selected',
                    isSelected,
                );
                el.setAttribute('aria-pressed', isSelected);
            });
        });
    }

    // Streamlined insertion logic
    function insertBundles() {
        if (document.getElementById(LUNEL_BUNDLES_ROOT_ID)) return true;

        const anchor = getInsertionPoint();
        if (!anchor) return false;

        anchor.insertAdjacentHTML('afterend', buildBundlesHTML());
        attachClickHandler();
        return true;
    }

    // Smarter observer with debouncing 
    function init() {
        // Try immediate insertion
        if (insertBundles()) return;

        const startTime = Date.now();
        let pending = false;

        const observer = new MutationObserver(() => {
            if (pending) return;
            pending = true;

            requestAnimationFrame(() => {
                pending = false;

                if (Date.now() - startTime > WAIT_MAX_MS) {
                    observer.disconnect();
                    return;
                }

                if (insertBundles()) {
                    observer.disconnect();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Optimal initialization timing 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        // Use requestIdleCallback if available, otherwise setTimeout
        (window.requestIdleCallback || ((fn) => setTimeout(fn, 1)))(init);
    }
})();
