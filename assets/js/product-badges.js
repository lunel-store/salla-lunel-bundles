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

  function removeProductBadgeTarget(id, target) {
    const card = document.getElementById(id);
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
        userId: true,
      });
      updateProductBadge({
        id: 'details-slider-' + id,
        target: 'product-bestSellers',
        ribbon: ribbon1,
        userId: true,
      });
      updateProductBadge({
        id: id,
        target: 'product-bestSellers',
        ribbon: ribbon1,
        useId: false,
      });
    } else {
      removeProductBadgeTarget(id, 'product-bestSellers');
      removeProductBadgeTarget('details-slider-' + id, 'product-bestSellers');
    }
    if (ribbon2) {
      updateProductBadge({
        id: id,
        target: 'product-outWithin',
        ribbon: ribbon2,
        userId: true,
      });
      updateProductBadge({
        id: 'details-slider-' + id,
        target: 'product-outWithin',
        ribbon: ribbon2,
        userId: true,
      });
      updateProductBadge({
        id: id,
        target: 'product-outWithin',
        ribbon: ribbon2,
        useId: false,
      });
    } else {
      removeProductBadgeTarget(id, 'product-outWithin');
      removeProductBadgeTarget('details-slider-' + id, 'product-outWithin');
    }
  }

  var products = window.LUNEL_PRODUCTS;

  if (products) {
    Object.values(products).forEach((product) => {
      updateProductBadges({
        id: product.productId,
        ribbon1: product.ribbon1,
        ribbon2: product.ribbon2,
      });
    });
  }
})();
