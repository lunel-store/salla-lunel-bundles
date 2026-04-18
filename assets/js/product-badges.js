(function () {
  'use strict';

  if (window.__lunelProductBadgesLoaded) return;
  window.__lunelProductBadgesLoaded = true;

  const BADGE_TARGET_LAYOUT_CLASSES =
    'absolute right-1 top-1 z-20 flex items-center p-1 px-2 gap-1 animate-pulse';

  function applyBadgeLayoutClasses(el) {
    BADGE_TARGET_LAYOUT_CLASSES.split(/\s+/).forEach(function (cls) {
      if (cls) el.classList.add(cls);
    });
  }

  function removeProductBadgeTarget(id, target) {
    const card = document.getElementById(id);
    if (!card) return;
    const container = card.querySelector(`.${CSS.escape(target)}`);
    if (container) container.remove();
  }

  function updateProductBadge({ id, target, ribbon }) {
    const card = document.getElementById(id);
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
    <small class="!text-xxs md:!text-xs !leading-[initial] text-white">
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
      });
    } else {
      removeProductBadgeTarget(id, 'product-bestSellers');
    }
    if (ribbon2) {
      updateProductBadge({
        id: id,
        target: 'product-outWithin',
        ribbon: ribbon2,
      });
    } else {
      removeProductBadgeTarget(id, 'product-outWithin');
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
