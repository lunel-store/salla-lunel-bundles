(function () {
  'use strict';

  if (window.__lunelOutOfStockLoaded) return;
  window.__lunelOutOfStockLoaded = true;

  window.OUT_OF_STOCK_PRODUCTS = Array.isArray(window.OUT_OF_STOCK_PRODUCTS)
    ? window.OUT_OF_STOCK_PRODUCTS
    : [];

  var products = window.LUNEL_PRODUCTS || {};

  function removeById(id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function runRules() {
    var oos = window.OUT_OF_STOCK_PRODUCTS;
    var oosCount = Array.isArray(oos) ? oos.length : 0;
    var productsCount = products ? Object.keys(products).length : 0;

    if (productsCount > 0 && oosCount === productsCount) {
      removeById('featured-prod-cards-1');
      removeById('featured-prod-cards-2');
      return;
    }

    if (
      Array.isArray(oos) &&
      oos.some(function (id) {
        return String(id) === '2094249977';
      })
    ) {
      removeById('featured-prod-cards-2');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runRules, { once: true });
  } else {
    runRules();
  }
})();
