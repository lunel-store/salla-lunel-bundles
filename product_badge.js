(function () {
  'use strict';

  function updateProductBadge({ id, target, ribbon }) {
    const card = document.getElementById(id);
    if (!card) return;

    const container = card.querySelector(`.${target}`);
    if (!container) return;

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
    }
    if (ribbon2) {
      updateProductBadge({
        id: id,
        target: 'product-outWithin',
        ribbon: ribbon2,
      });
    }
  }

  var products = window.LUNEL_BUNDLES_CATALOG;

  if (products) {
    Object.values(products).forEach((product) => {
      console.log(product.productId, product.topRibbon, product.topRibbon2);
      updateProductBadges({
        id: product.productId,
        ribbon1: product.topRibbon,
        ribbon2: product.topRibbon2,
      });
    });
  }
})();
