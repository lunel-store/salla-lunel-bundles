(function () {
  'use strict';

  // Prevent duplicate execution
  if (window.__lunelBundlesLoaded) return;
  window.__lunelBundlesLoaded = true;

  const LUNEL_BUNDLES_ROOT_ID = 'lunel-bundles-root';
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
    const tone = /^(orange|green|blue)$/.test(ribbon.tone) ? ribbon.tone : 'green';
    const text = escapeHtml(ribbon.text);
    const type = ribbon.type;

    let iconHtml = '';
    if (type === 'seal') {
      iconHtml = `
        <span class="badge" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1.6605 5.90471C1.53027 5.31787 1.55026 4.70763 1.71863 4.13057C1.887 3.55352 2.19828 3.02833 2.62363 2.60371C3.04897 2.17909 3.5746 1.86879 4.15177 1.70156C4.72895 1.53434 5.33899 1.51561 5.92533 1.64712C6.24806 1.14219 6.69265 0.726656 7.21813 0.438824C7.7436 0.150992 8.33305 0.00012207 8.93214 0.00012207C9.53122 0.00012207 10.1207 0.150992 10.6461 0.438824C11.1716 0.726656 11.6162 1.14219 11.9389 1.64712C12.5262 1.51504 13.1373 1.53368 13.7154 1.70131C14.2935 1.86894 14.8198 2.18011 15.2454 2.60588C15.671 3.03165 15.982 3.55819 16.1496 4.13652C16.3172 4.71484 16.3358 5.32617 16.2038 5.91364C16.7085 6.23649 17.1239 6.68126 17.4116 7.20694C17.6993 7.73262 17.8501 8.3223 17.8501 8.92162C17.8501 9.52095 17.6993 10.1106 17.4116 10.6363C17.1239 11.162 16.7085 11.6068 16.2038 11.9296C16.3352 12.5162 16.3165 13.1265 16.1494 13.7039C15.9822 14.2813 15.672 14.8071 15.2476 15.2326C14.8231 15.6581 14.2981 15.9695 13.7213 16.138C13.1445 16.3064 12.5345 16.3264 11.9479 16.1961C11.6256 16.703 11.1806 17.1203 10.6542 17.4094C10.1279 17.6985 9.53709 17.8501 8.9366 17.8501C8.3361 17.8501 7.74532 17.6985 7.21895 17.4094C6.69258 17.1203 6.24764 16.703 5.92533 16.1961C5.33899 16.3276 4.72895 16.3089 4.15177 16.1417C3.5746 15.9745 3.04897 15.6642 2.62363 15.2395C2.19828 14.8149 1.887 14.2897 1.71863 13.7127C1.55026 13.1356 1.53027 12.5254 1.6605 11.9385C1.15189 11.6165 0.732951 11.1711 0.442651 10.6436C0.152352 10.1161 0.00012207 9.52376 0.00012207 8.92162C0.00012207 8.31948 0.152352 7.72713 0.442651 7.19965C0.732951 6.67217 1.15189 6.22672 1.6605 5.90471Z" fill="white"></path>
            <path d="M11.2108 4.9751L11.1718 5.13037L10.7723 6.70947H12.1874L12.6024 5.06982L12.6259 4.9751H13.6171L13.579 5.13037L13.1893 6.70947H14.2557V7.65283H12.9442L12.5135 9.46338H13.705V10.4067H12.2704L11.8651 11.9956L11.8417 12.0894H10.8505L10.8885 11.9341L11.2684 10.4067H9.85339L9.45789 11.9946L9.43445 12.0894H8.43152L8.47156 11.9341L8.85925 10.4067H7.78406V9.46338H9.09656L9.53503 7.65283H8.33484V6.70947H9.76941L10.1844 5.06982L10.2089 4.9751H11.2108ZM10.0966 9.46338H11.5126L11.9423 7.65283H10.5262L10.0966 9.46338ZM6.37781 12.0894H4.79187V7.39502C4.79185 7.23017 4.74243 7.08729 4.65808 6.98779C4.57568 6.89067 4.45284 6.82666 4.28406 6.82666L3.828 6.83643L3.70007 6.83936V6.42432L3.77722 6.39209L5.98035 5.48389L6.04089 5.45947L6.09558 5.49463L6.32019 5.63721L6.37781 5.67432V12.0894Z" fill="#27B43E" stroke="#27B43E" stroke-width="0.25"></path>
          </svg>
        </span>
      `.trim();
    } else if (type === 'flame') {
      iconHtml = `
        <span class="lunel-bundles__top_badge_flame" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1.66037 5.90459C1.53015 5.31774 1.55014 4.7075 1.71851 4.13045C1.88688 3.5534 2.19816 3.02821 2.6235 2.60359C3.04885 2.17897 3.57447 1.86866 4.15165 1.70144C4.72883 1.53421 5.33887 1.51549 5.92521 1.647C6.24794 1.14207 6.69253 0.726534 7.218 0.438702C7.74348 0.15087 8.33293 0 8.93201 0C9.5311 0 10.1205 0.15087 10.646 0.438702C11.1715 0.726534 11.6161 1.14207 11.9388 1.647C12.526 1.51492 13.1371 1.53356 13.7152 1.70119C14.2933 1.86882 14.8197 2.17999 15.2453 2.60576C15.6709 3.03153 15.9819 3.55807 16.1495 4.1364C16.317 4.71472 16.3357 5.32605 16.2037 5.91352C16.7084 6.23637 17.1238 6.68114 17.4115 7.20682C17.6992 7.7325 17.85 8.32218 17.85 8.9215C17.85 9.52082 17.6992 10.1105 17.4115 10.6362C17.1238 11.1619 16.7084 11.6066 16.2037 11.9295C16.3351 12.5161 16.3164 13.1263 16.1492 13.7037C15.9821 14.2812 15.6719 14.807 15.2474 15.2325C14.823 15.658 14.298 15.9694 13.7212 16.1378C13.1444 16.3063 12.5344 16.3263 11.9477 16.196C11.6254 16.7029 11.1805 17.1202 10.6541 17.4093C10.1277 17.6984 9.53697 17.85 8.93647 17.85C8.33598 17.85 7.7452 17.6984 7.21883 17.4093C6.69246 17.1202 6.24752 16.7029 5.92521 16.196C5.33887 16.3275 4.72883 16.3088 4.15165 16.1416C3.57447 15.9743 3.04885 15.664 2.6235 15.2394C2.19816 14.8148 1.88688 14.2896 1.71851 13.7126C1.55014 13.1355 1.53015 12.5253 1.66037 11.9384C1.15177 11.6164 0.732829 11.171 0.442529 10.6435C0.15223 10.116 0 9.52364 0 8.9215C0 8.31936 0.15223 7.727 0.442529 7.19953C0.732829 6.67205 1.15177 6.22659 1.66037 5.90459Z" fill="white"></path>
            <path d="M9.94669 10.6936C9.6875 10.2346 9.05967 9.92998 8.93623 9.34924C8.69782 9.44554 8.4959 9.73612 8.39154 9.97028C8.29397 10.1892 8.19768 10.915 8.16289 10.9519C8.03521 11.0885 7.53082 10.7228 7.41035 10.6219C7.22582 11.3621 7.30048 12.1982 7.79256 12.8057C7.89819 12.9359 8.33936 13.2757 8.36567 13.336C8.38772 13.3869 8.36524 13.4348 8.32112 13.4636H9.53097L9.46479 13.4208C9.41728 13.3249 9.8067 12.9228 9.88815 12.7819C10.2368 12.1779 10.2962 11.3125 9.94669 10.6936Z" fill="white"></path>
            <path d="M10.4625 8.37363C10.782 8.19291 10.7005 7.44122 10.8231 7.27153C10.9593 7.08361 11.2965 7.67029 11.3703 7.78355C11.7458 8.35835 12.1318 9.19617 12.1959 9.88508C12.3596 11.6557 11.0356 12.7998 9.58486 13.4998L9.46311 13.4209C9.4156 13.3254 9.80502 12.9228 9.88647 12.782C10.2352 12.1779 10.2946 11.3125 9.94543 10.694C9.68624 10.2351 9.05799 9.93047 8.93497 9.34973C8.69657 9.44602 8.49464 9.73661 8.39029 9.97077C8.29272 10.1897 8.19642 10.9155 8.16164 10.9524C8.03395 11.089 7.52957 10.7233 7.40909 10.6224C7.22456 11.3626 7.29922 12.1987 7.79131 12.8062C7.89693 12.9364 8.33811 13.2762 8.36441 13.3369C8.40598 13.4319 8.29145 13.5163 8.17224 13.4887C7.10536 13.241 5.80728 12.2013 5.46919 11.1407C5.21509 10.3441 5.32878 8.79402 5.76444 8.06692C5.95957 7.74156 6.10677 8.27775 6.26755 8.43344C6.42832 8.58912 6.61158 8.64088 6.81393 8.71384C6.75157 7.16124 7.31789 5.80462 8.64184 4.96299C8.80644 4.85736 9.44741 4.49212 9.60055 4.47812C9.92677 4.44758 9.5102 5.07923 9.46608 5.19291C9.30997 5.59591 9.21877 6.04812 9.32864 6.47402C9.50214 7.14682 10.5716 7.51757 10.4625 8.37363Z" fill="#F24822"></path>
          </svg>
        </span>
      `.trim();
    } else if (type === 'arrows'){
      iconHtml = `
      <span class="badge" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <!-- background -->
          <rect width="18" height="18" fill="none"/>

          <!-- cloud (scalloped) -->
          <g fill="#fff">
            <circle cx="64" cy="64" r="34"/>
            <circle cx="64" cy="28" r="18"/>
            <circle cx="89" cy="36" r="18"/>
            <circle cx="100" cy="60" r="18"/>
            <circle cx="92" cy="88" r="18"/>
            <circle cx="64" cy="100" r="18"/>
            <circle cx="36" cy="92" r="18"/>
            <circle cx="28" cy="64" r="18"/>
            <circle cx="36" cy="36" r="18"/>
          </g>

          <!-- fast-forward (same blue as background) -->
          <g fill="#00A3FF">
            <path d="M46 48 L66 64 L46 80 Z"/>
            <path d="M66 48 L86 64 L66 80 Z"/>
          </g>
        </svg>
      </span>
      `.trim();
    } else if (type === 'money') {
      iconHtml = `
      <span class="badge" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect width="18" height="18" fill="none"/>

          <g fill="#fff">
            <circle cx="64" cy="64" r="34"/>
            <circle cx="64" cy="28" r="18"/>
            <circle cx="92" cy="38" r="18"/>
            <circle cx="100" cy="64" r="18"/>
            <circle cx="92" cy="90" r="18"/>
            <circle cx="64" cy="100" r="18"/>
            <circle cx="36" cy="90" r="18"/>
            <circle cx="28" cy="64" r="18"/>
            <circle cx="36" cy="38" r="18"/>
          </g>

          <g transform="translate(64 64) rotate(6) translate(-64 -64)">
            <rect x="36" y="50" width="56" height="34" rx="8" fill="#0090E0"/>
            <rect x="42" y="56" width="44" height="22" rx="4" fill="#fff"/>
            <circle cx="64" cy="67" r="6" fill="#0090E0"/>
            <circle cx="64" cy="67" r="1.6" fill="#fff"/>
          </g>

          <g transform="translate(64 64) rotate(-3) translate(-64 -64)">
            <rect x="34" y="42" width="60" height="36" rx="8" fill="#00A3FF"/>
            <rect x="40" y="48" width="48" height="24" rx="4" fill="#fff"/>
            <circle cx="64" cy="60" r="7" fill="#00A3FF"/>
            <circle cx="64" cy="60" r="2" fill="#fff"/>
          </g>
        </svg>
      </span>
      `.trim();
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
