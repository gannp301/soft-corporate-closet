/* Soft Corporate Closet — app logic (vanilla JS, no build step) */
(function () {
  'use strict';
  const { RETAILERS, PALETTE, STYLES, OCCASIONS, VIBES, COLOR_GROUPS, CATEGORIES } = window.SCC;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isUrl = u => /^https?:\/\/\S+$/i.test(u || '');

  /* Catalog rule: a product is only shown if it has a photo and a working-format link.
     A look is only shown if every one of its products passed that rule. */
  const PRODUCTS = window.SCC.PRODUCTS.filter(p => p.imageUrl && isUrl(p.url));
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const LOOKS = window.SCC.LOOKS.filter(o => o.productIds.length && o.productIds.every(id => byId[id]));

  const money = n => '$' + n.toFixed(2);
  const storeName = k => (RETAILERS[k] || { name: k || 'Retailer' }).name;
  const color = k => PALETTE[k] || { name: k, hex: '#cccccc', family: 'neutral' };
  const fam = p => color(p.color).family;
  const hasPrice = p => typeof p.price === 'number' && p.price > 0;

  /* ---------------- saved state (localStorage) — kept separate from product/look data ---------------- */
  const KEY = 'scc.v1';   // unchanged since V1 so favorites carry over
  const DEFAULTS = { v: 4, saved: [], savedProducts: [], recent: [], filters: {}, custom: [], mode: 'looks' };
  let S;
  try { S = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEFAULTS); }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: state lives in memory */ } };
  const allLooks = () => LOOKS.concat(S.custom);
  const getLook = id => allLooks().find(o => o.id === id);
  (function migrate() {
    const LEGACY = { 'friday-cute': 'friday-casual' };
    const arr = a => (Array.isArray(a) ? a : []);
    S.custom = arr(S.custom).filter(o => arr(o.productIds).length && o.productIds.every(id => byId[id]));   // drop remixes that used removed products
    S.custom.forEach(o => { if (!o.occasions) { o.occasions = ['everyday']; o.vibe = 'cute'; o.blurb = 'Your own shuffle.'; delete o.moods; delete o.formality; } });
    S.saved = [...new Set(arr(S.saved).map(id => LEGACY[id] || id))].filter(getLook);
    S.recent = [...new Set(arr(S.recent).map(id => LEGACY[id] || id))].filter(getLook);
    S.savedProducts = arr(S.savedProducts).filter(id => byId[id]);
    if (S.v !== 4) S.filters = {};
    delete S.owned; delete S.preferOwned; delete S.filtersOpen;
    S.v = 4; persist();
  })();
  const isSaved = id => S.saved.includes(id);
  const isSavedP = id => S.savedProducts.includes(id);
  const lookProducts = o => (o.productIds || []).map(id => byId[id]).filter(Boolean);

  /* ---------------- pricing: never present a partial sum as a full outfit total ---------------- */
  function subtotal(ps) {
    const known = ps.filter(hasPrice);
    return { sum: known.reduce((n, p) => n + p.price, 0), known: known.length, missing: ps.length - known.length };
  }
  function priceLine(ps) {
    const t = subtotal(ps);
    return t.missing ? `<strong>${money(t.sum)}</strong> known items · ${t.missing} to check` : `<strong>${money(t.sum)}</strong> · ${ps.length} pieces`;
  }
  const priceText = p => (hasPrice(p) ? money(p.price) : 'Check price');

  /* ---------------- icons ---------------- */
  const ico = (d, fill) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const HEART = '<path d="M12 20.3l-1.3-1.2C5.6 14.5 3 12.2 3 9.2A4.1 4.1 0 0 1 7.1 5c1.4 0 2.7.7 3.5 1.7L12 8.4l1.4-1.7A4.5 4.5 0 0 1 16.9 5 4.1 4.1 0 0 1 21 9.2c0 3-2.6 5.3-7.7 9.9L12 20.3z"/>';
  const I = {
    heart: on => ico(HEART, on),
    close: ico('<path d="M6 6l12 12M18 6L6 18"/>'),
    shuffle: ico('<path d="M3 7h3.5c2 0 3.4 1 4.5 2.8l2 3.4c1.1 1.8 2.5 2.8 4.5 2.8H21M21 7h-3.5c-1.4 0-2.6.5-3.5 1.5M3 17h3.5c1.4 0 2.6-.5 3.5-1.5M18 4l3 3-3 3M18 14l3 3-3 3"/>'),
    filter: ico('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
    lock: ico('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    unlock: ico('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>'),
    again: ico('<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/>')
  };

  /* ---------------- photos ---------------- */
  // Cider's image host can serve a resized copy, which keeps pages fast on mobile.
  const sized = (url, w) => (/^https:\/\/img1\.shopcider\.com\//.test(url) ? `${url}?x-oss-process=image/resize,m_lfit,w_${w}/quality,Q_80/format,webp` : url);
  const photo = (p, w = 640, second) => `<span class="photo"><img src="${esc(sized(second ? p.imageUrl2 : p.imageUrl, w))}" alt="${esc(p.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>`;
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.closest('.photo')) e.target.remove(); }, true);
  const mosaic = (ps, w = 480) => `<span class="mosaic m${Math.min(ps.length, 4)}">${ps.slice(0, 4).map(p => photo(p, w)).join('')}</span>`;
  const SW = { excellent: 'Soft Winter: excellent', good: 'Soft Winter: good', neutral: 'Grounding neutral' };
  const swBadge = p => (p.softWinter ? `<span class="badge sw-${esc(p.softWinter.rating)}">${SW[p.softWinter.rating] || 'Soft Winter'}</span>` : '');
  const shopLink = (p, cls = 'btn sm primary') => `<a class="${cls}" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Shop at ${esc(storeName(p.retailer))} <span aria-hidden="true">↗</span></a>`;
  const heartBtn = (act, id, on, name) => `<button class="heart ${on ? 'on' : ''}" data-act="${act}" data-id="${id}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Save'} ${esc(name)}">${I.heart(on)}</button>`;
  const kicker = o => (o.custom ? 'Your remix' : (STYLES[o.style] || {}).label || OCCASIONS[(o.occasions || [])[0]] || 'Look');

  /* ---------------- cards ---------------- */
  function lookCard(o, compact) {
    const ps = lookProducts(o);
    return `<article class="look ${compact ? 'compact' : ''}">
      ${heartBtn('save', o.id, isSaved(o.id), o.name)}
      <button class="look-img" data-act="view" data-id="${o.id}" aria-label="View ${esc(o.name)}">${mosaic(ps)}</button>
      <div class="card-body">
        <p class="eyebrow">${esc(kicker(o))}</p>
        <h3>${esc(o.name)}</h3>
        ${compact ? '' : `<p class="blurb">${esc(o.blurb || '')}</p>`}
        <p class="meta">${priceLine(ps)}</p>
        ${compact ? '' : `<button class="btn primary wide" data-act="view" data-id="${o.id}">Shop the look</button>`}
      </div>
    </article>`;
  }
  function productCard(p, compact) {
    return `<article class="product ${compact ? 'compact' : ''}">
      ${heartBtn('save-p', p.id, isSavedP(p.id), p.name)}
      <a class="product-img" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.name)} at ${esc(storeName(p.retailer))}">${photo(p, compact ? 400 : 640)}</a>
      <div class="card-body">
        <p class="eyebrow">${esc(storeName(p.retailer))} · ${esc(CATEGORIES[p.category] || p.category)}</p>
        <h3>${esc(p.name)}</h3>
        <p class="price">${priceText(p)}</p>
        ${compact ? '' : `${swBadge(p)}${shopLink(p, 'btn sm wide')}`}
      </div>
    </article>`;
  }
  const empty = (title, text, cta) => `<div class="empty"><h3>${title}</h3><p>${text}</p>${cta || ''}</div>`;
  const rail = (html, cls = '') => `<div class="rail ${cls}">${html}</div>`;
  const grid = looks => `<div class="grid">${looks.map(o => lookCard(o)).join('')}</div>`;
  const DISCLAIMER = '<p class="disclaimer">Prices and sizes are reference values from when each listing was read. Check the retailer for current price and availability.</p>';

  /* ---------------- filters ---------------- */
  const usedStores = Object.keys(RETAILERS).filter(k => PRODUCTS.some(p => p.retailer === k));
  const GROUPS = [
    ['style', 'Style', Object.keys(STYLES).map(k => [k, STYLES[k].label])],
    ['category', 'Category', Object.entries(CATEGORIES).filter(([k]) => PRODUCTS.some(p => p.category === k))],
    ['color', 'Color', Object.keys(COLOR_GROUPS).map(k => [k, COLOR_GROUPS[k].label])]
  ].concat(usedStores.length > 1 ? [['store', 'Store', usedStores.map(k => [k, RETAILERS[k].name])]] : []);
  const DRAWER_GROUPS = GROUPS.filter(g => g[0] !== 'style');   // Style has its own chip row on the page
  const sel = g => S.filters[g] || [];
  const activeCount = groups => groups.reduce((n, g) => n + sel(g[0]).length, 0);
  const any = (a, b) => !a.length || a.some(x => b.includes(x));
  const colorGroups = p => Object.keys(COLOR_GROUPS).filter(k => COLOR_GROUPS[k].colors.includes(p.color));
  const stylesOf = p => [...new Set(LOOKS.filter(o => o.productIds.includes(p.id)).map(o => o.style))];
  function lookMatches(o) {
    const ps = lookProducts(o);
    return any(sel('style'), [o.style]) && any(sel('category'), ps.map(p => p.category)) &&
      any(sel('color'), ps.flatMap(colorGroups)) && any(sel('store'), ps.map(p => p.retailer));
  }
  const productMatches = p => any(sel('style'), stylesOf(p)) && any(sel('category'), [p.category]) && any(sel('color'), colorGroups(p)) && any(sel('store'), [p.retailer]);
  function chip(group, id, label) {
    const on = sel(group).includes(id);
    return `<button class="chip ${on ? 'on' : ''}" data-act="filter" data-group="${group}" data-value="${id}" aria-pressed="${on}">${esc(label)}</button>`;
  }
  const drawer = $('#drawer');
  function drawerHTML() {
    const n = S.mode === 'pieces' ? PRODUCTS.filter(productMatches).length : allLooks().filter(lookMatches).length;
    return `<div class="sheet-head"><h2 id="drawer-title">Filters</h2><button class="icon close" data-act="close-drawer" aria-label="Close filters">${I.close}</button></div>
      ${DRAWER_GROUPS.map(g => `<fieldset><legend>${g[1]}</legend><div class="chips">${g[2].map(v => chip(g[0], v[0], v[1])).join('')}</div></fieldset>`).join('')}
      <div class="drawer-foot"><button class="btn" data-act="clear">Clear all</button><button class="btn primary" data-act="close-drawer">Show ${n} ${S.mode === 'pieces' ? 'piece' : 'look'}${n === 1 ? '' : 's'}</button></div>`;
  }

  /* ---------------- shuffle engine ----------------
     Soft Winter color logic and fit preferences (petite, waist-defining, feminine) are applied
     automatically. Every piece is a real, image-backed product. */
  const ROLES = ['dress', 'top', 'bottom', 'shoes'];
  const ROLE_LABEL = { dress: 'Dress', top: 'Top', bottom: 'Bottom', shoes: 'Shoes' };
  const roleOf = p => ({ tops: 'top', bottoms: 'bottom', dresses: 'dress', shoes: 'shoes' })[p.category];
  const isShort = p => p.category === 'dresses' || /mini|skort/i.test(p.name);
  const R = { occasion: 'everyday', vibe: 'surprise', color: 'any', slots: null, extras: [], locks: {}, from: '', savedId: '', usedVibe: 'cute', relaxed: '', shown: {}, tick: 0 };
  const comboKey = c => ROLES.map(r => c[r] || '').join('|');
  const parts = c => ROLES.map(r => byId[c[r]]).filter(Boolean);
  const ALL_COMBOS = (() => {
    const by = r => PRODUCTS.filter(p => roleOf(p) === r), out = [];
    by('shoes').forEach(sh => {
      by('top').forEach(t => by('bottom').forEach(b => out.push({ top: t.id, bottom: b.id, shoes: sh.id })));
      by('dress').forEach(d => out.push({ dress: d.id, shoes: sh.id }));
    });
    return out;
  })();
  function generate() {
    const locked = ROLES.filter(r => R.locks[r] && R.slots && R.slots[r]);
    const vibes = Object.keys(VIBES);
    const vibe = R.vibe === 'surprise' ? vibes[Math.floor(Math.random() * vibes.length)] : R.vibe;
    const grp = COLOR_GROUPS[R.color];
    const okLock = c => locked.every(r => c[r] === R.slots[r]);
    const okPattern = c => parts(c).filter(p => p.pattern).length <= 1;                                          // one pattern at a time
    const okHarmony = c => { const f = parts(c).map(fam); return !(f.includes('blue') && f.includes('berry')); };  // no unrelated accents
    const okOccasion = c => ROLES.every(r => !c[r] || locked.includes(r) || byId[c[r]].occasions.includes(R.occasion));
    const okColor = c => !grp || parts(c).some(p => grp.colors.includes(p.color));
    const tiers = [[okLock, okPattern, okHarmony, okOccasion, okColor, ''], [okLock, okPattern, okHarmony, okOccasion, 'color'], [okLock, okPattern, okHarmony, 'occasion'], [okLock, 'pattern']];
    let pool = [], relaxed = '';
    for (const t of tiers) { relaxed = t[t.length - 1]; pool = ALL_COMBOS.filter(c => t.slice(0, -1).every(f => f(c))); if (pool.length) break; }
    if (!pool.length) return;
    const shown = c => R.shown[comboKey(c)] || 0;                        // least recently shown first:
    const oldest = Math.min.apply(null, pool.map(shown));                // never repeats while other valid outfits exist
    const fresh = pool.filter(c => shown(c) === oldest);
    const score = c => {
      const ps = parts(c), main = ps[0], shoes = ps[ps.length - 1];
      return ps.reduce((n, p) => n + (p.vibes.includes(vibe) ? 2 : 0) + ({ excellent: 1, good: 0.5 }[p.softWinter.rating] || 0) +
        (p.fit.includes('waist') ? 0.6 : 0) + (p.fit.includes('petite') ? 0.4 : 0) + (p.fit.includes('feminine') ? 0.2 : 0) +
        (grp && grp.colors.includes(p.color) ? 1 : 0), Math.random() * 4) + (fam(shoes) !== 'neutral' && fam(shoes) === fam(main) ? 1.5 : 0) + (c.dress ? 1.5 : 0);
    };
    const best = fresh.map(c => [score(c), c]).sort((a, b) => b[0] - a[0])[0][1];
    R.slots = Object.assign({}, best); R.shown[comboKey(best)] = ++R.tick; R.usedVibe = vibe; R.relaxed = relaxed; R.savedId = '';
    R.extras = finishing(parts(best), R.occasion, R.tick).map(p => p.id);
  }
  /* finishing pieces are real accessories from the catalog, chosen to match the outfit */
  function finishing(ps, occasion, seed) {
    const acc = sub => PRODUCTS.filter(p => p.category === 'accessories' && p.sub === sub), out = [];
    const main = ps[0], f = ps.map(fam);
    const metal = f.includes('berry') ? 'gold' : fam(main) === 'blue' || (fam(main) === 'neutral' && !f.includes('pink')) ? 'white-gold' : 'rose-gold';
    const jewelry = acc('jewelry').filter(p => p.color === metal);
    if (jewelry.length) out.push(jewelry[seed % jewelry.length]); else if (acc('jewelry').length) out.push(acc('jewelry')[0]);
    if ((occasion === 'meeting' || occasion === 'dressy' || main.category === 'dresses') && acc('bag').length) out.push(acc('bag')[0]);
    if (ps.some(isShort) && acc('tights').length) out.push(acc('tights')[0]);   // last, so the collage leads with the outfit
    return out;
  }
  /* ideas that are not products: never priced, never linked */
  function ideas(ps, occasion) {
    const out = [];
    if (ps.some(p => p.category === 'bottoms' && !isShort(p))) out.push({ type: 'boots', label: 'Sleek black ankle boots as a colder-day shoe swap' });
    if (occasion === 'friday') out.push({ type: 'shoes', label: 'Pink Dr. Martens as a shoe swap' });
    return out;
  }
  function whyFor(ps) {
    const main = ps[0], bottom = ps.find(p => p.category === 'bottoms'), cn = p => color(p.color).name;
    if (main.category === 'dresses') return `${cn(main)} in one piece keeps the color story simple and cool. A defined waist and a short hem keep a petite frame long; add tights for the office.`;
    return (main.color === bottom.color ? `${cn(main)} head to toe is tonal and rich, with no hard contrast. ` : `${cn(main)} over ${cn(bottom).toLowerCase()} stays cool and moderate in contrast, which is the Soft Winter brief. `) +
      (ps.some(p => p.fit.includes('waist')) ? 'A high or belted waist keeps your shape defined. ' : 'Tuck the top to keep your waist defined. ') +
      (isShort(bottom) ? 'The short hem keeps a petite frame long.' : 'A long, unbroken line below the waist lengthens a petite frame.');
  }
  function remixLook(o) {
    const slots = {};
    lookProducts(o).forEach(p => { const r = roleOf(p); if (r && !slots[r]) slots[r] = p.id; });
    const roles = Object.keys(slots), keep = roles[Math.floor(Math.random() * roles.length)];   // keep one piece so it stays "similar"
    R.occasion = OCCASIONS[(o.occasions || [])[0]] ? o.occasions[0] : 'everyday'; R.vibe = VIBES[o.vibe] ? o.vibe : 'surprise'; R.color = 'any';
    R.slots = slots; R.locks = keep ? { [keep]: true } : {}; R.from = o.name;
    R.shown[comboKey(slots)] = ++R.tick;
    generate();
  }

  /* ---------------- views ---------------- */
  function viewExplore() {
    const lead = LOOKS.find(o => o.id === 'winter-kiss-office') || LOOKS[0];
    const fresh = LOOKS.filter(o => o.isNew);
    const cat = (...c) => PRODUCTS.filter(p => c.includes(p.category));
    const styleSection = k => {
      const looks = LOOKS.filter(o => o.style === k);
      return looks.length ? `<section aria-label="${esc(STYLES[k].label)}"><div class="sec-head"><h2>${esc(STYLES[k].label)}</h2><button class="link" data-act="quick-style" data-value="${k}">Shop all</button></div>
        <p class="sec-sub">${esc(STYLES[k].blurb)}</p>${rail(looks.map(o => lookCard(o, true)).join(''))}</section>` : '';
    };
    const pieces = (title, sub, list) => `<section aria-label="${title}"><div class="sec-head"><h2>${title}</h2><button class="link" data-act="pieces-go">All pieces</button></div>
        <p class="sec-sub">${sub}</p>${rail(list.map(p => productCard(p, true)).join(''), 'narrow')}</section>`;
    const keys = Object.keys(STYLES);
    return `<section class="hero">
        <div class="hero-text">
          <p class="eyebrow">The Soft Winter workwear edit</p>
          <h1>Get dressed for work, but make it cute.</h1>
          <p class="lede">${LOOKS.length} shoppable office looks in cool, softened color. Fitted, feminine and petite-friendly.</p>
          <div class="btns"><a class="btn primary lg" href="#shop">Shop the looks</a><button class="btn lg" data-act="style-go">${I.shuffle}Style my outfit</button></div>
        </div>
        <button class="hero-img" data-act="view" data-id="${lead.id}" aria-label="View ${esc(lead.name)}">${mosaic(lookProducts(lead), 640)}<span class="caption">${esc(lead.name)}</span></button>
      </section>
      <nav class="style-nav" aria-label="Styles">${rail(keys.map(k => `<button class="chip" data-act="quick-style" data-value="${k}">${esc(STYLES[k].label)}</button>`).join(''), 'chips-rail')}</nav>
      <section aria-label="New this week"><div class="sec-head"><h2>New this week</h2><a class="link" href="#shop">All ${LOOKS.length} looks</a></div>
        ${rail(fresh.map(o => lookCard(o, true)).join(''))}</section>
      ${keys.slice(0, 2).map(styleSection).join('')}
      ${pieces('Knits, tees and dresses', 'Wrap, ruched, V and scoop necklines in burgundy, navy, pink and blue.', cat('tops', 'dresses'))}
      ${keys.slice(2, 4).map(styleSection).join('')}
      ${pieces('Skirts, trousers and denim', 'High waists, short hems and petite lengths.', cat('bottoms'))}
      ${keys.slice(4).map(styleSection).join('')}
      ${pieces('Shoes and finishing touches', 'Mary Janes, flats, tights and delicate jewelry.', cat('shoes', 'accessories'))}
      ${DISCLAIMER}`;
  }

  function viewShop() {
    const looks = allLooks().filter(lookMatches), pieces = PRODUCTS.filter(productMatches), n = activeCount(DRAWER_GROUPS);
    const isLooks = S.mode !== 'pieces';
    const clear = '<button class="btn" data-act="clear">Clear filters</button>';
    return `<section><div class="sec-head"><h1>Shop Looks</h1></div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Show">
          <button data-act="mode" data-value="looks" aria-pressed="${isLooks}">Looks (${looks.length})</button>
          <button data-act="mode" data-value="pieces" aria-pressed="${!isLooks}">Pieces (${pieces.length})</button>
        </div>
        <button class="btn filter-btn" data-act="open-drawer">${I.filter}Filters${n ? ` <b>${n}</b>` : ''}</button>
      </div>
      ${rail(GROUPS[0][2].map(v => chip('style', v[0], v[1])).join(''), 'chips-rail')}
      ${isLooks
        ? (looks.length ? grid(looks) : empty('No looks match those filters', 'Try removing a filter or two.', clear))
        : (pieces.length ? `<div class="grid pieces">${pieces.map(p => productCard(p)).join('')}</div>` : empty('No pieces match those filters', 'Try removing a filter or two.', clear))}
      ${DISCLAIMER}
      </section>`;
  }

  const ideasBlock = list => (list && list.length ? `<div class="ideas"><p class="eyebrow">Styling ideas (not products)</p><ul>${list.map(s => `<li>${esc(s.label)}</li>`).join('')}</ul></div>` : '');
  function viewShuffle() {
    if (!R.slots || !parts(R.slots).length || !R.slots.shoes) generate();
    const roles = ROLES.filter(r => byId[R.slots[r]]), main = roles.map(r => byId[R.slots[r]]), extras = R.extras.map(id => byId[id]).filter(Boolean), ps = main.concat(extras);
    const pick = (group, opts) => `<div class="chips">${opts.map(([k, label]) => `<button class="chip ${R[group] === k ? 'on' : ''}" data-act="r-set" data-group="${group}" data-value="${k}" aria-pressed="${R[group] === k}">${esc(label)}</button>`).join('')}</div>`;
    const relaxed = { color: 'No outfit in that color fits this occasion, so the color preference was relaxed.', occasion: 'Your locked pieces do not fit this occasion, so it was relaxed.', pattern: 'Your locked pieces are both patterned.' }[R.relaxed];
    const row = (p, r) => { const lock = r && !!R.locks[r]; return `<li class="${lock ? 'locked' : ''}">
        <span class="thumb">${photo(p, 240)}</span>
        <div class="slot-info"><span class="eyebrow">${r ? ROLE_LABEL[r] : 'Finishing piece'}</span><strong>${esc(p.name)}</strong><span class="meta">${priceText(p)}</span>${shopLink(p, 'link')}</div>
        ${r ? `<button class="icon ${lock ? 'on' : ''}" data-act="lock" data-value="${r}" aria-pressed="${lock}" aria-label="${lock ? 'Unlock' : 'Keep'} ${ROLE_LABEL[r]} when shuffling">${lock ? I.lock : I.unlock}</button>` : ''}</li>`; };
    return `<section><div class="sec-head"><h1>Shuffle</h1>${R.from ? `<p class="sec-sub">Similar to ${esc(R.from)}</p>` : ''}</div>
      <div class="shuffle">
        <div class="controls">
          <fieldset><legend>Occasion</legend>${pick('occasion', Object.entries(OCCASIONS))}</fieldset>
          <fieldset><legend>Vibe</legend>${pick('vibe', [['surprise', 'Surprise Me']].concat(Object.entries(VIBES)))}</fieldset>
          <fieldset><legend>Color <span>optional</span></legend>${pick('color', [['any', 'Any']].concat(Object.keys(COLOR_GROUPS).map(k => [k, COLOR_GROUPS[k].label])))}</fieldset>
          <button class="btn primary lg wide" data-act="style">${I.shuffle}Style My Outfit</button>
        </div>
        <div class="result" id="result" aria-live="polite">
          <div class="result-img">${mosaic(ps, 640)}</div>
          <p class="eyebrow">${esc(OCCASIONS[R.occasion])} · ${esc(VIBES[R.usedVibe])}</p>
          ${relaxed ? `<p class="small">${relaxed}</p>` : ''}
          <p class="meta">${priceLine(ps)}</p>
          <p>${esc(whyFor(main))}</p>
          <div class="btns result-actions">
            <button class="btn" data-act="again">${I.again}Shuffle Again</button>
            <button class="btn ${R.savedId ? 'on' : ''}" data-act="save-remix" ${R.savedId ? 'disabled' : ''}>${I.heart(!!R.savedId)}${R.savedId ? 'Saved' : 'Save Look'}</button>
            <button class="btn primary" data-act="shop-pieces">Shop Pieces</button>
          </div>
          <ul class="slots" id="pieces" tabindex="-1">${roles.map(r => row(byId[R.slots[r]], r)).join('')}${extras.map(p => row(p)).join('')}</ul>
          <p class="small">Tap a lock to keep that piece, then Shuffle Again.</p>
          ${ideasBlock(ideas(main, R.occasion))}
        </div>
      </div></section>`;
  }

  function viewSaved() {
    const looks = S.saved.map(getLook).filter(Boolean), ps = S.savedProducts.map(id => byId[id]).filter(Boolean);
    const recent = S.recent.map(getLook).filter(o => o && !isSaved(o.id)).slice(0, 3);
    return `<section><div class="sec-head"><h1>Saved</h1><p class="sec-sub">${looks.length} look${looks.length === 1 ? '' : 's'} · ${ps.length} piece${ps.length === 1 ? '' : 's'}</p></div>
      ${!looks.length && !ps.length ? empty('Nothing saved yet', 'Tap the heart on any look or piece to keep it here.', '<a class="btn primary" href="#shop">Shop looks</a>') : ''}
      ${looks.length ? `<h2>Looks</h2>${grid(looks)}` : ''}
      </section>
      ${ps.length ? `<section><h2>Pieces</h2><div class="grid pieces">${ps.map(p => productCard(p)).join('')}</div></section>` : ''}
      ${recent.length ? `<section><h2>Recently viewed</h2>${grid(recent)}</section>` : ''}`;
  }

  function viewStyle() {
    const row = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
    return `<section class="style"><div class="sec-head"><h1>Style Preferences</h1></div>
      <p class="sec-sub">Applied automatically to every look and shuffle.</p>
      <div class="palette">${Object.keys(PALETTE).filter(k => !['sky-blue', 'denim'].includes(k)).map(k => `<span><i style="background:${PALETTE[k].hex}"></i>${esc(PALETTE[k].name)}</span>`).join('')}</div>
      <dl class="profile">
        ${row('Color season', 'Soft Winter: cool, softened color with moderate contrast. Soft black as a grounding neutral.')}
        ${row('Fit', 'Petite (5\'2.5") and curvy. Waist-defining, fitted, feminine.')}
        ${row('Tops', 'Wrap, ruched, V, scoop and round necklines.')}
        ${row('Bottoms', 'Flare or straight jeans, tailored pants, skorts, mini skirts, short dresses. Tights in winter.')}
        ${row('Shoes', 'Mary Janes, ballet flats, feminine sneakers, sleek ankle boots, pink Dr. Martens.')}
        ${row('Jewelry', 'Delicate gold, white gold and rose gold.')}
        ${row('Skip', 'Maxi skirts, chunky loafers, boxy or matronly officewear, beige-heavy basics, warm camel, orange, mustard and neon.')}
      </dl></section>`;
  }

  /* ---------------- look detail sheet ---------------- */
  const sheet = $('#sheet');
  let sheetId = null;
  function sheetHTML(o) {
    const ps = lookProducts(o), t = subtotal(ps), saved = isSaved(o.id);
    const shots = ps.map(p => photo(p, 800)).concat(ps.filter(p => p.imageUrl2).map(p => photo(p, 800, true)));
    return `<div class="sheet-head"><div><p class="eyebrow">${esc([kicker(o), VIBES[o.vibe]].filter(Boolean).join(' · '))}</p>
        <h2 id="sheet-title">${esc(o.name)}</h2><p class="blurb">${esc(o.blurb || '')}</p></div>
        <button class="icon close" data-act="close" aria-label="Close">${I.close}</button></div>
      <div class="gallery">${shots.join('')}</div>
      <div class="btns sheet-actions">
        <button class="btn ${saved ? 'on' : ''}" data-act="save" data-id="${o.id}" aria-pressed="${saved}">${I.heart(saved)}${saved ? 'Saved' : 'Save Look'}</button>
        <button class="btn" data-act="remix" data-id="${o.id}">${I.shuffle}Remix Similar Look</button></div>
      ${o.stylistNote ? `<blockquote class="note"><span class="eyebrow">Stylist note</span>${esc(o.stylistNote)}</blockquote>` : ''}
      <h3>Shop the pieces</h3>
      <ul class="pieces-list">${ps.map(p => `<li>
          <span class="thumb">${photo(p, 240)}</span>
          <div class="pl-info"><span class="eyebrow">${esc(storeName(p.retailer))} · ${esc(CATEGORIES[p.category] || p.category)}</span>
            <strong>${esc(p.name)}</strong>
            <span class="meta"><i class="dot" style="background:${color(p.color).hex}"></i>${esc(color(p.color).name)}${p.sizes && p.sizes.length ? ' · ' + esc(p.sizes.join(' ')) : ''}</span>
            ${swBadge(p)}
            <span class="small">${esc(p.stylistNote || '')}</span>
          </div>
          <div class="pl-act"><span class="price">${priceText(p)}</span>${shopLink(p)}
            <button class="btn sm ${isSavedP(p.id) ? 'on' : ''}" data-act="save-p" data-id="${p.id}" aria-pressed="${isSavedP(p.id)}">${I.heart(isSavedP(p.id))}${isSavedP(p.id) ? 'Saved' : 'Save'}</button></div></li>`).join('')}</ul>
      <div class="totals"><p><span>${t.missing ? `Known-items subtotal (${t.known} of ${ps.length} priced)` : `Subtotal · ${ps.length} pieces`}</span><strong>${money(t.sum)}</strong></p>
        ${t.missing ? '<p class="small">Some prices need checking at the retailer. This is not a complete outfit total.</p>' : ''}
        <p class="small">Reference prices, not live guarantees.</p></div>
      ${ideasBlock(o.suggestions)}`;
  }
  function openDialog(d) { if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); } }
  function closeDialog(d) { if (d.open) { if (d.close) d.close(); else d.removeAttribute('open'); } }
  function openLook(id) {
    const o = getLook(id); if (!o) return;
    sheetId = id;
    S.recent = [id].concat(S.recent.filter(x => x !== id)).slice(0, 8); persist();
    sheet.innerHTML = sheetHTML(o); openDialog(sheet); sheet.scrollTop = 0;
  }
  const closeSheet = () => { sheetId = null; closeDialog(sheet); };
  sheet.addEventListener('close', () => { sheetId = null; render(true); });
  [sheet, drawer].forEach(d => d.addEventListener('click', e => { if (e.target === d) closeDialog(d); }));

  /* ---------------- render + routing ---------------- */
  const VIEWS = { explore: viewExplore, shop: viewShop, shuffle: viewShuffle, saved: viewSaved, style: viewStyle };
  const TITLES = { explore: 'Soft Corporate Closet', shop: 'Shop Looks', shuffle: 'Shuffle', saved: 'Saved', style: 'Style Preferences' };
  const LEGACY_ROUTES = { home: 'explore', browse: 'shop', dna: 'style', owned: 'saved' };
  const route = () => { const h = location.hash.replace('#', ''); return VIEWS[h] ? h : LEGACY_ROUTES[h] || 'explore'; };
  let lastRoute = null;
  function render(keepScroll) {
    const r = route(), view = $('#view');
    const a = document.activeElement, d = a && a.dataset && a.dataset.act ? a.dataset : null;   // remember focus across re-render
    const focusSel = d ? `[data-act="${d.act}"]` + (d.id ? `[data-id="${d.id}"]` : '') + (d.value ? `[data-value="${d.value}"]` : '') + (d.group ? `[data-group="${d.group}"]` : '') : '';
    const host = d && sheet.contains(a) ? sheet : d && drawer.contains(a) ? drawer : view;
    const rails = [...view.querySelectorAll('.rail')].map(x => x.scrollLeft);                    // keep horizontal scroll positions
    setTimeout(() => { if (!focusSel) return; const el = (host.open === false ? view : host).querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }, 0);
    view.innerHTML = VIEWS[r]();
    if (r === lastRoute) view.querySelectorAll('.rail').forEach((x, i) => { if (rails[i]) x.scrollLeft = rails[i]; });
    document.querySelectorAll('[data-nav]').forEach(n => { if (n.dataset.nav === r) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    document.title = TITLES[r] + (r === 'explore' ? '' : ' · Soft Corporate Closet');
    if (r !== lastRoute && !keepScroll) window.scrollTo(0, 0);
    lastRoute = r;
    if (sheetId && sheet.open) { const o = getLook(sheetId), y = sheet.scrollTop, x = (sheet.querySelector('.gallery') || {}).scrollLeft; if (o) { sheet.innerHTML = sheetHTML(o); sheet.scrollTop = y; if (x) sheet.querySelector('.gallery').scrollLeft = x; } else closeSheet(); }
    if (drawer.open) { const y = drawer.scrollTop; drawer.innerHTML = drawerHTML(); drawer.scrollTop = y; }
  }
  const go = h => { if (route() === h) render(); else location.hash = h; };
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

  /* ---------------- actions ---------------- */
  const ACTIONS = {
    view: d => openLook(d.id),
    close: () => closeSheet(),
    'open-drawer': () => { drawer.innerHTML = drawerHTML(); openDialog(drawer); drawer.scrollTop = 0; },
    'close-drawer': () => closeDialog(drawer),
    save: d => {
      if (isSaved(d.id)) {
        S.saved = S.saved.filter(x => x !== d.id);
        if (S.custom.some(o => o.id === d.id)) { S.custom = S.custom.filter(o => o.id !== d.id); S.recent = S.recent.filter(x => x !== d.id); if (R.savedId === d.id) R.savedId = ''; }
        toast('Removed from Saved');
      } else { S.saved.unshift(d.id); toast('Look saved'); }
      persist(); render(true);
    },
    'save-p': d => {
      if (!byId[d.id]) return;
      if (isSavedP(d.id)) { S.savedProducts = S.savedProducts.filter(x => x !== d.id); toast('Removed from Saved'); } else { S.savedProducts.unshift(d.id); toast('Piece saved'); }
      persist(); render(true);
    },
    remix: d => { const o = getLook(d.id); if (!o) return; remixLook(o); closeSheet(); go('shuffle'); window.scrollTo(0, 0); },
    filter: d => { const a = sel(d.group).slice(), i = a.indexOf(d.value); if (i < 0) a.push(d.value); else a.splice(i, 1); S.filters[d.group] = a; persist(); render(true); },
    clear: () => { S.filters = {}; persist(); render(true); },
    mode: d => { S.mode = d.value; persist(); render(true); },
    'quick-style': d => { S.filters = { style: [d.value] }; S.mode = 'looks'; persist(); go('shop'); },
    'pieces-go': () => { S.filters = {}; S.mode = 'pieces'; persist(); go('shop'); },
    'style-go': () => { R.locks = {}; R.from = ''; generate(); go('shuffle'); },
    'r-set': d => { R[d.group] = d.value; render(true); },
    style: () => { R.from = ''; generate(); render(true); const el = $('#result'); if (el && el.getBoundingClientRect().top > innerHeight * 0.5) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    again: () => { generate(); render(true); },
    'shop-pieces': () => { const el = $('#pieces'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.focus({ preventScroll: true }); } },
    lock: d => { R.locks[d.value] = !R.locks[d.value]; render(true); },
    'save-remix': () => {
      const main = parts(R.slots), ids = main.map(p => p.id).concat(R.extras);
      const id = 'remix-' + Date.now();
      S.custom.push({ id, name: (R.from ? R.from + ' Remix' : OCCASIONS[R.occasion] + ' Remix'), occasions: [R.occasion], vibe: R.usedVibe, blurb: 'Your own shuffle.', productIds: ids, suggestions: ideas(main, R.occasion), stylistNote: whyFor(main), custom: true });
      S.saved.unshift(id); R.savedId = id; persist(); toast('Look saved'); render(true);
    }
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.act]; if (fn) fn(el.dataset, el);
  });
  window.addEventListener('hashchange', () => { closeSheet(); closeDialog(drawer); render(); });
  render();
})();
