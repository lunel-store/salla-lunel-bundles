(function () {
  'use strict';

  if (window.__lunelProductBadgesLoaded) return;
  window.__lunelProductBadgesLoaded = true;

  const BADGE_TARGET_LAYOUT_CLASSES =
    'absolute right-1 top-1 z-20 flex items-center p-1 px-2 gap-1 fast-animate-pulse';

  function applyBadgeLayoutClasses(el) {
    BADGE_TARGET_LAYOUT_CLASSES.split(/\s+/).forEach(function (cls) {
      if (cls) el.classList.add(cls);
    });
  }

  function removeProductBadgeTarget({ id, target, useId = true }) {
    const card = useId
      ? document.getElementById(id)
      : document.querySelector(`[data-product-id="${id}"]`);
    if (!card) return;

    const container = card.querySelector(`.${CSS.escape(target)}`);
    if (container) container.style.display = 'none';
  }

  function updateProductBadge({ id, target, ribbon, useId = true }) {
    const card = useId
      ? document.getElementById(id)
      : document.querySelector(`[data-product-id="${id}"]`);
    if (!card) return;

    let container = card.querySelector(`.${CSS.escape(target)}`);
    if (!container) {
      container = document.createElement('div');
      container.className = target;
      applyBadgeLayoutClasses(container);
      const imageHost = card.querySelector('.product-entry__image');
      if (imageHost) {
        imageHost.appendChild(container);
      } else {
        card.appendChild(container);
      }
    }

    // Normalize animation classes even for pre-existing containers
    container.classList.remove('animate-pulse');
    container.classList.add('fast-animate-pulse');

    var svg = '';

    // Update background (optional)
    if (ribbon.color) {
      container.style.background = ribbon.color;
    }

    if (typeof window.getLunelBundleBadgeIconHtml === 'function') {
      svg = window.getLunelBundleBadgeIconHtml(ribbon.type);
    } else if (window.LUNEL_BUNDLE_BADGE_ICONS && ribbon.type) {
      const fragment = window.LUNEL_BUNDLE_BADGE_ICONS[ribbon.type];
      svg = typeof fragment === 'string' ? fragment : '';
    }

    // Replace content
    container.innerHTML = `
    ${svg}
    <small class="!text-xxs md:!text-xs !leading-[initial] text-white" style="font-weight: 900 !important; white-space: nowrap;">
      ${ribbon.text}
    </small>
  `;
  }

  function updateProductBadges({ id, ribbon1, ribbon2 }) {
    if (ribbon1) {
      updateProductBadge({
        id: id,
        target: 'product-bestSellers',
        ribbon: ribbon1,
        useId: true,
      });
      updateProductBadge({
        id: 'details-slider-' + id,
        target: 'product-bestSellers',
        ribbon: ribbon1,
        useId: true,
      });
      updateProductBadge({
        id: id,
        target: 'product-bestSellers',
        ribbon: ribbon1,
        useId: false,
      });
    } else {
      removeProductBadgeTarget({
        id: id,
        target: 'product-bestSellers',
        useId: true,
      });
      removeProductBadgeTarget({
        id: 'details-slider-' + id,
        target: 'product-bestSellers',
        useId: true,
      });
      removeProductBadgeTarget({
        id: id,
        target: 'product-bestSellers',
        useId: false,
      });
    }
    if (ribbon2) {
      updateProductBadge({
        id: id,
        target: 'product-outWithin',
        ribbon: ribbon2,
        useId: true,
      });
      updateProductBadge({
        id: 'details-slider-' + id,
        target: 'product-outWithin',
        ribbon: ribbon2,
        useId: true,
      });
      updateProductBadge({
        id: id,
        target: 'product-outWithin',
        ribbon: ribbon2,
        useId: false,
      });
    } else {
      removeProductBadgeTarget({
        id: id,
        target: 'product-outWithin',
        useId: true,
      });
      removeProductBadgeTarget({
        id: 'details-slider-' + id,
        target: 'product-outWithin',
        useId: true,
      });
      removeProductBadgeTarget({
        id: id,
        target: 'product-outWithin',
        useId: false,
      });
    }
  }

  function applyAllProductBadges() {
    var products = window.LUNEL_PRODUCTS;
    if (!products) return false;

    Object.values(products).forEach((product) => {
      if (!product || !product.productId) return;
      updateProductBadges({
        id: product.productId,
        ribbon1: product.ribbon1,
        ribbon2: product.ribbon2,
      });
    });
    return true;
  }

  // Expose a tiny public hook so other scripts can trigger a refresh
  window.__lunelApplyProductBadges = applyAllProductBadges;

  // Apply ASAP (in case data+DOM are already ready)
  applyAllProductBadges();

  // If products/cards arrive later (AJAX/slider), keep attempting and re-apply on DOM changes.
  var retryCount = 0;
  var maxRetries = 40; // ~10s max (40 * 250ms)
  var retryTimer = null;
  function scheduleRetry() {
    if (retryTimer) return;
    retryTimer = setTimeout(function () {
      retryTimer = null;
      retryCount++;
      var ok = applyAllProductBadges();
      if (!ok && retryCount < maxRetries) scheduleRetry();
    }, 250);
  }

  if (!window.LUNEL_PRODUCTS) scheduleRetry();

  var moPending = null;
  var observer = new MutationObserver(function () {
    if (moPending) clearTimeout(moPending);
    moPending = setTimeout(function () {
      moPending = null;
      applyAllProductBadges();
    }, 80);
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      observer.observe(document.body, { childList: true, subtree: true });
      applyAllProductBadges();
    });
  }
})();
