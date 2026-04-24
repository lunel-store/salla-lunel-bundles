(function () {
  'use strict';

  if (window.__lunelProductsLoaded && window.LUNEL_PRODUCTS) return;
  window.__lunelProductsLoaded = true;

  function productHrefFromPath(path) {
    var p = String(path || '')
      .trim()
      .replace(/^\/+/, '');
    if (!p) return '#';
    var host = window.location.hostname;
    var prefix = '';
    if (host === 'salla.sa' || host.slice(-9) === '.salla.sa') {
      var parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length > 0) prefix = '/' + parts[0];
      else {
        prefix = '/lunel';
      }
    }
    return window.location.origin + prefix + '/' + p;
  }

  window.LUNEL_PRODUCTS = {
    1904366049: {
      id: 'bundle-1',
      productId: 1904366049,
      title: 'مجموعة التفتيح والنضارة',
      subtitle: 'مقشر + سيروم + وسائد قطنية',
      url: productHrefFromPath('lunel-refund-return-guarantee-3x3/p1904366049'),
      imageUrl: window.LunelUrlBuilder('assets/images/p1904366049.webp'),
      discountText: 'وفر %35',
      order: 2,
      skip_if_product: 1644875761,
      ribbon1: {
        text: 'أفضل قيمة',
        tone: 'blue',
        type: 'money',
        color: '#0095f6',
      },
    },
    1644875761: {
      id: 'bundle-2',
      productId: 1644875761,
      title: 'مجموعة الهالات والترطيب',
      subtitle: 'كريم الهالات + مرطب',
      url: productHrefFromPath('lunel-refund-return-guarantee-3x3/p1644875761'),
      imageUrl: window.LunelUrlBuilder('assets/images/p1644875761.webp'),
      discountText: 'وفر %40',
      order: 1,
      skip_if_product: 1904366049,
      ribbon1: {
        text: 'وصل حديثًا',
        tone: 'blue',
        type: 'arrows',
        color: '#0095f6',
      },
    },
    2094249977: {
      id: 'bundle-3',
      productId: 2094249977,
      title: 'مجموعة لونيل المتكاملة',
      subtitle: 'الروتين المتكامل للتفتيح والنضارة',
      url: productHrefFromPath('lunel-refund-return-guarantee-3x3/p2094249977'),
      imageUrl: window.LunelUrlBuilder('assets/images/p2094249977.webp'),
      discountText: 'وفر %42',
      order: 3,
      skip_if_product: null,
      ribbon1: {
        text: 'الأكثر مبيعًا',
        tone: 'green',
        type: 'seal',
        color: '#27b43e',
      },
      ribbon2: {
        text: 'توصيل مجاني',
        tone: 'orange',
        type: 'free_delivery',
        color: '#f24822',
      },
    },
  };
})();
