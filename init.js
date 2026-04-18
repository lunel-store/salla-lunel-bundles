/**
 * Lunel Bundles — single entry for external sites (e.g. jsDelivr).
 * Loads assets strictly in order: style.css → lunel-constants.js → config.js → bundles.js → product_badge.js
 */
(function () {
  'use strict';

  if (window.__lunelBundlesInitStarted) return;
  window.__lunelBundlesInitStarted = true;

  window.LUNEL_JSDELIVR_LINK =
    'https://cdn.jsdelivr.net/gh/lunel-store/lunel-bundles@v8.0.2/';

  function urlFor(file) {
    const name = typeof file === 'string' ? file.replace(/^\/+/, '') : '';

    if (!name) {
      console.error('urlFor: Invalid file name:', file);
      return null;
    }

    const baseLink = window?.LUNEL_JSDELIVR_LINK;

    if (typeof baseLink !== 'string' || !baseLink) {
      console.error('urlFor: Invalid baseLink:', baseLink);
      return null;
    }

    try {
      return new URL(name, baseLink.replace(/\/?$/, '/')).href;
    } catch (error) {
      console.error('urlFor: Failed to construct URL', {
        file: name,
        baseLink,
        error,
      });
      return null;
    }
  }

  window.LunelUrlBuilder = urlFor;

  function loadCss(href) {
    if (!href) {
      return Promise.reject(
        new Error('Lunel Bundles: loadCss called with invalid href: ' + href),
      );
    }

    return new Promise(function (resolve) {
      var settled = false;
      function done() {
        if (settled) return;
        settled = true;
        resolve();
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = done;
      link.onerror = done;
      document.head.appendChild(link);
      setTimeout(function () {
        try {
          if (link.sheet) done();
        } catch (_) {
          /* cross-origin: may throw */
        }
      }, 0);
    });
  }

  function loadScript(src) {
    if (!src) {
      return Promise.reject(
        new Error('Lunel Bundles: loadScript called with invalid src: ' + src),
      );
    }

    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error('Lunel Bundles: failed to load ' + src));
      };
      document.head.appendChild(s);
    });
  }

  loadCss(urlFor('assets/css/style.css'))
    .then(function () {
      return loadScript(urlFor('assets/js/lunel-constants.js'));
    })
    .then(function () {
      return loadScript(urlFor('assets/js/badge-icons.js'));
    })
    .then(function () {
      return loadScript(urlFor('assets/js/products.js'));
    })
    .then(function () {
      return loadScript(urlFor('assets/js/bundles.js'));
    })
    .then(function () {
      return loadScript(urlFor('assets/js/product-badges.js'));
    })
    .catch(function (err) {
      if (window.console && console.error) {
        console.error(err && err.message ? err.message : err);
      }
    });
})();
