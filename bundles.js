(function () {
  'use strict';

  // Prevent duplicate execution
  if (window.__lunelBundlesLoaded) return;
  window.__lunelBundlesLoaded = true;

  const LUNEL_BUNDLES_ROOT_ID =
    window.LUNEL_BUNDLES_ROOT_ID || 'lunel-bundles-root';
  const BUNDLES_BY_PRODUCT_ID = window.LUNEL_BUNDLES_CONFIG || {};

  console.log('Lunel Bundles: Script loaded');
  console.log('Lunel Bundles: Config =', BUNDLES_BY_PRODUCT_ID);

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
    // Strategy 0: Dedicated container — insert inside
    const saji = document.querySelector('.saji-custom-div');
    if (saji) {
      console.log('Lunel Bundles: Inserting inside .saji-custom-div');
      return { element: saji, position: 'beforeend' };
    }

    // Strategy 1: Find the price element and insert after its container
    const priceEl = document.querySelector('.total-price-single');
    console.log('Lunel Bundles: Price element found?', priceEl);

    if (priceEl) {
      // Try to find the parent flex container
      let insertTarget = priceEl.closest('.flex.flex-wrap');
      if (insertTarget) {
        console.log('Lunel Bundles: Inserting after price container');
        return { element: insertTarget, position: 'afterend' };
      }
      // If no flex container, insert after the price's parent
      if (priceEl.parentElement) {
        console.log('Lunel Bundles: Inserting after price parent');
        return { element: priceEl.parentElement, position: 'afterend' };
      }
    }

    // Strategy 2: Find the product title and insert after it
    const titleEl = document.querySelector('.product-title');
    if (titleEl && titleEl.parentElement) {
      console.log('Lunel Bundles: Inserting after title');
      return { element: titleEl.parentElement, position: 'afterend' };
    }

    // Strategy 3: Find the form and insert after the first div inside it
    const form = document.querySelector('#single-product-form');
    if (form && form.firstChild) {
      console.log('Lunel Bundles: Inserting at form start');
      return { element: form.firstChild, position: 'afterend' };
    }

    console.warn('Lunel Bundles: No insertion point found');
    return null;
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

  function getScriptBaseUrl() {
    try {
      const s = document.currentScript;
      if (s && s.src) return new URL('.', s.src).toString();
    } catch (_) {
      // ignore
    }
    return '';
  }

  function resolveAssetUrl(relativePath) {
    const p = String(relativePath || '').trim();
    if (!p) return '';
    if (/^(?:https?:)?\/\//i.test(p) || p.startsWith('data:')) return p;

    const base = getScriptBaseUrl();
    if (base) {
      try {
        return new URL(p.replace(/^\/+/, ''), base).toString();
      } catch (_) {
        // ignore
      }
    }
    return p;
  }

  function getSallaStorePathPrefix() {
    const host = window.location.hostname;
    if (host !== 'salla.sa' && !host.endsWith('.salla.sa')) return '';
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return '/' + parts[0];
    const fallback = window.LUNEL_BUNDLES_SALLA_STORE_SLUG;
    if (typeof fallback === 'string' && fallback.trim()) {
      return '/' + fallback.trim().replace(/^\/+|\/+$/g, '');
    }
    return '';
  }

  function resolveBundleHref(bundle) {
    const existing = bundle.href && String(bundle.href).trim();
    if (existing && /^https?:\/\//i.test(existing)) return existing;
    const path = String(bundle.path || '')
      .trim()
      .replace(/^\/+/, '');
    if (path) {
      const prefix = getSallaStorePathPrefix();
      return window.location.origin + prefix + '/' + path;
    }
    if (existing) return existing;
    return '#';
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

  function buildRibbonsBlock(bundle, cardCount) {
    const parts = [];
    const a = buildRibbonSpan(bundle.topRibbon);
    if (a) parts.push(a);
    if (bundle.topRibbon2) {
      const b = buildRibbonSpan(bundle.topRibbon2);
      if (b) parts.push(b);
    }
    if (!parts.length) return '';

    return parts.join('');
  }

  function buildBundlesHTML(bundlesData) {
    const nCards = bundlesData.length;
    const cardsHTML = bundlesData
      .map((bundle) => {
        const ribbons = buildRibbonsBlock(bundle, nCards);
        const hasRibbons = ribbons ? ' lunel-bundles__card--has-ribbons' : '';
        const subtitleRaw =
          bundle.subtitle != null ? String(bundle.subtitle).trim() : '';
        const subtitleBlock = subtitleRaw
          ? `<div class="lunel-bundles__subtitle" dir="rtl"><span>${escapeHtml(subtitleRaw)}</span></div>`
          : '';
        const discountRaw =
          bundle.discountText != null ? String(bundle.discountText).trim() : '';
        const discountBlock = discountRaw
          ? `<div class="lunel-bundles__discount-wrap"><span class="lunel-bundles__discount-text">${escapeHtml(discountRaw)}</span></div>`
          : '';
        return `
            <a class="lunel-bundles__card${bundle.selected ? ' lunel-bundles__card--selected' : ''}${hasRibbons}"
               href="${escapeHtml(resolveBundleHref(bundle))}"
               role="button"
               aria-pressed="${String(!!bundle.selected)}"
               data-bundle-id="${bundle.id}">
                <div class="lunel-bundles__top_badges">${ribbons}</div>
                <div class="lunel-bundles__product-details">
                    <div class="lunel-bundles__media">
                        <img class="lunel-bundles__img"
                            src="${escapeHtml(bundle.imageUrl)}"
                            alt="${escapeHtml(bundle.title)}"
                            width="100"
                            height="80"
                            decoding="async"
                            loading="eager"
                            onerror="
                                this.onerror=null;
                                if (!this.dataset.fallback && '${escapeHtml(bundle.fallbackImageUrl)}') {
                                    this.dataset.fallback = 1;
                                    this.src='${escapeHtml(bundle.fallbackImageUrl)}';
                                } else {
                                    this.src='https://placehold.co/100x80?text=No+Image';
                                }
                        ">
                    </div>
                    <div class="lunel-bundles__product-description">
                        <strong class="lunel-bundles__title" dir="rtl">${escapeHtml(bundle.title)}</strong>
                        ${subtitleBlock}
                    </div>
                </div>
                ${discountBlock}
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

  function insertBundles(bundlesData) {
    if (document.getElementById(LUNEL_BUNDLES_ROOT_ID)) {
      console.log('Lunel Bundles: Already inserted');
      return true;
    }

    const target = getInsertionPoint();
    if (!target) return false;

    const { element, position } = target;
    element.insertAdjacentHTML(position, buildBundlesHTML(bundlesData));
    attachClickHandler();
    console.log('Lunel Bundles: Successfully inserted bundles');
    return true;
  }

  // FAST INITIALIZATION
  const productId = getProductIdFromURL();
  console.log('Lunel Bundles: Current product ID =', productId);

  if (productId && BUNDLES_BY_PRODUCT_ID[productId]) {
    console.log('Lunel Bundles: Product found in config');
    const bundlesData = normalizeBundleSelection(
      BUNDLES_BY_PRODUCT_ID[productId].bundles,
    );
    console.log('Lunel Bundles: Bundles data =', bundlesData);

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
    } else {
      console.log('Lunel Bundles: No bundles data for product');
    }
  } else {
    console.log(
      'Lunel Bundles: Product',
      productId,
      'NOT found in config. Available products:',
      Object.keys(BUNDLES_BY_PRODUCT_ID),
    );
  }
})();
