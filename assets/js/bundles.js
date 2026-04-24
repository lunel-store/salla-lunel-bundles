(function () {
  'use strict';

  // Prevent duplicate execution
  if (window.__lunelBundlesLoaded) return;
  window.__lunelBundlesLoaded = true;

  const LUNEL_BUNDLES_ROOT_ID =
    window.LUNEL_BUNDLES_ROOT_ID || 'lunel-bundles-root';
  const BUNDLES_PRODUCTS = window.LUNEL_PRODUCTS || {};
  window.OUT_OF_STOCK_PRODUCTS = Array.isArray(window.OUT_OF_STOCK_PRODUCTS)
    ? window.OUT_OF_STOCK_PRODUCTS
    : [];

  console.log('Lunel Bundles: Script loaded');

  // Early exit if no config exists
  if (Object.keys(BUNDLES_PRODUCTS).length === 0) {
    console.warn('Lunel Bundles: No configuration found.');
    return;
  }

  function getProductIdFromURL() {
    const match = window.location.pathname.match(/\/p(\d+)/);
    return match ? match[1] : null;
  }

  function getInsertionPoint() {
    // Strategy 0: Dedicated container — insert inside
    const saji = document.querySelector('.saji-custom-div');
    if (saji) {
      return { element: saji, position: 'beforeend' };
    }

    // Strategy 1: Find the price element and insert after its container
    const priceEl = document.querySelector('.total-price-single');
    if (priceEl) {
      // Try to find the parent flex container
      let insertTarget = priceEl.closest('.flex.flex-wrap');
      if (insertTarget) {
        return { element: insertTarget, position: 'afterend' };
      }
      // If no flex container, insert after the price's parent
      if (priceEl.parentElement) {
        return { element: priceEl.parentElement, position: 'afterend' };
      }
    }

    // Strategy 2: Find the product title and insert after it
    const titleEl = document.querySelector('.product-title');
    if (titleEl && titleEl.parentElement) {
      return { element: titleEl.parentElement, position: 'afterend' };
    }

    // Strategy 3: Find the form and insert after the first div inside it
    const form = document.querySelector('#single-product-form');
    if (form && form.firstChild) {
      return { element: form.firstChild, position: 'afterend' };
    }

    console.warn('Lunel Bundles: No insertion point found');
    return null;
  }

  function attachClickHandler() {
    const grid = document.querySelector(
      `#${LUNEL_BUNDLES_ROOT_ID} .lunel-bundles__grid`,
    );
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
        el.setAttribute('aria-pressed', String(isSelected));
      });

      // Trigger custom event
      window.dispatchEvent(
        new CustomEvent('lunelBundleSelected', {
          detail: { bundleId: bundleId },
        }),
      );

      // Navigate ONLY if href is different from current page
      if (href && href !== '#' && href !== currentUrl) {
        window.location.href = href;
      }
    });
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

  function buildRibbonSpan(ribbon) {
    if (!ribbon || !String(ribbon.text || '').trim()) return '';
    const tone = /^(orange|green|blue)$/.test(ribbon.tone)
      ? ribbon.tone
      : 'green';
    const text = escapeHtml(ribbon.text);
    const type = ribbon.type;

    let iconHtml = '';
    if (typeof window.getLunelBundleBadgeIconHtml === 'function') {
      iconHtml = window.getLunelBundleBadgeIconHtml(type);
    } else if (window.LUNEL_BUNDLE_BADGE_ICONS && type) {
      const fragment = window.LUNEL_BUNDLE_BADGE_ICONS[type];
      iconHtml = typeof fragment === 'string' ? fragment : '';
    }

    if (iconHtml) {
      iconHtml = `<span class="badge" aria-hidden="true">${iconHtml}</span>`;
    }

    return `<span class="lunel-bundles__top_badge_item ${tone}-badge">${iconHtml}${iconHtml ? ' ' : ''}${text}</span>`;
  }

  function buildRibbonsBlock(bundle) {
    const parts = [];
    if (bundle.ribbon1) {
      const a = buildRibbonSpan(bundle.ribbon1);
      if (a) parts.push(a);
    }

    if (bundle.ribbon2) {
      const b = buildRibbonSpan(bundle.ribbon2);
      if (b) parts.push(b);
    }

    if (!parts.length) return '';

    return parts.join('');
  }

  function shouldShowBundle(bundle, currentProductId) {
    const oos = window.OUT_OF_STOCK_PRODUCTS;
    if (
      Array.isArray(oos) &&
      oos.length < 3 &&
      oos.some((id) => String(id) === String(bundle.productId))
    ) {
      return false;
    }
    const skip = bundle.skip_if_product;
    if (skip == null || skip === '') return true;
    return String(skip) !== String(currentProductId);
  }

  function buildBundlesHTML(currentProductId) {
    const bundlesToShow = Object.values(BUNDLES_PRODUCTS)
      .filter((bundle) => shouldShowBundle(bundle, currentProductId))
      .sort((a, b) => a.order - b.order);

    if (!bundlesToShow.length) return '';

    const cardsHTML = bundlesToShow
      .map((bundle) => {
        // Ribbons
        const ribbons = buildRibbonsBlock(bundle);
        const hasRibbons = ribbons ? ' lunel-bundles__card--has-ribbons' : '';

        // Subtitle
        const subtitleRaw = String(bundle.subtitle || '').trim();
        const subtitleBlock = subtitleRaw
          ? `<div class="lunel-bundles__subtitle" dir="rtl"><span>${escapeHtml(subtitleRaw)}</span></div>`
          : '';

        // Discount
        const discountRaw = String(bundle.discountText || '').trim();
        const discountBlock = discountRaw
          ? `<span class="lunel-bundles__discount-text">${escapeHtml(discountRaw)}</span>`
          : '';

        const price = String(bundle.price || '').trim();
        const priceBlock = price
          ? `<span class="before-price-single line-through decoration-[var(--product-price-offer)] font-normal text-[var(--product-price-offer)]" style="font-size: 15px !important;">${escapeHtml(price)} <i class="sicon-sar"></i></span>`
          : '';

        const salePrice = String(bundle.salePrice || '').trim();
        const salePriceBlock = salePrice
          ? `<strong class="total-price-single text-[var(--product-price-color)] font-bold text-xl inline-block" style="font-size: 20px !important;">${escapeHtml(salePrice)} <i class="sicon-sar"></i></strong>`
          : '';

        const pricesBlock =
          priceBlock || salePriceBlock
            ? `<div dir="rtl">${salePriceBlock}${priceBlock}</div>`
            : '';

        const leftBox = `
          <div class="lunel-bundles__discount-wrap">
              ${pricesBlock}
              ${discountBlock}
          </div>
        `;

        // image
        const image = `
          <img class="lunel-bundles__img"
              src="${escapeHtml(bundle.imageUrl)}"
              alt="${escapeHtml(bundle.title)}"
              width="100"
              height="100"
              decoding="async"
              loading="eager"
              onerror="
                  this.onerror=null;
                  this.src='https://placehold.co/100x100?text=No+Image';
          ">
        `;

        const isSelected =
          String(bundle.productId) === String(currentProductId);

        return `
            <a class="lunel-bundles__card${isSelected ? ' lunel-bundles__card--selected' : ''}${hasRibbons}"
               href="${escapeHtml(bundle.url)}"
               role="button"
               aria-pressed="${String(!!isSelected)}"
               data-bundle-id="${bundle.productId}">
                <div class="lunel-bundles__top_badges">${ribbons}</div>
                <div class="lunel-bundles__product-details">
                    <div class="lunel-bundles__media">${image}</div>
                    <div class="lunel-bundles__product-description">
                        <strong class="lunel-bundles__title" dir="rtl">${escapeHtml(bundle.title)}</strong>
                        ${subtitleBlock}
                    </div>
                </div>
                ${leftBox}
            </a>`;
      })
      .join('');

    return `
            <section id="${LUNEL_BUNDLES_ROOT_ID}" class="lunel-bundles" dir="rtl">
                <h3 class="lunel-bundles__heading">المجموعات</h3>
                <div class="lunel-bundles__grid">${cardsHTML}</div>
            </section>
        `;
  }

  function insertBundles(currentProductId) {
    if (document.getElementById(LUNEL_BUNDLES_ROOT_ID)) {
      console.log('Lunel Bundles: Already inserted');
      return true;
    }

    const target = getInsertionPoint();
    if (!target) return false;

    const { element, position } = target;
    const html = buildBundlesHTML(currentProductId);
    if (!html) {
      console.log('Lunel Bundles: No bundles to show (skip_if_product filter)');
      return false;
    }
    element.insertAdjacentHTML(position, html);
    attachClickHandler();
    console.log('Lunel Bundles: Successfully inserted bundles');
    return true;
  }

  // FAST INITIALIZATION
  const currentProductId = getProductIdFromURL();
  console.log('Lunel Bundles: Current product ID =', currentProductId);

  if (!currentProductId || !BUNDLES_PRODUCTS[currentProductId]) {
    console.log('Lunel Bundles: Product not found in config');
    return;
  }

  if (Object.keys(BUNDLES_PRODUCTS).length) {
    let attempts = 0;
    const maxAttempts = 20;

    function tryInsert() {
      if (insertBundles(currentProductId)) return;
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryInsert, attempts * 50);
      }
    }

    tryInsert();
  } else {
    console.log('Lunel Bundles: No bundles data for product');
  }
})();
