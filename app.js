/* Soft Corporate Closet — app logic (vanilla JS, no build step) */
(function () {
  'use strict';
  const { RETAILERS, PALETTE, MOODS, FORMALITY, FIT_TAGS, CATEGORIES, PRODUCTS, LOOKS } = window.SCC;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const money = n => '$' + n.toFixed(2);
  const storeName = k => (RETAILERS[k] || { name: k || 'Retailer' }).name;
  const color = k => PALETTE[k] || { name: k, hex: '#cccccc', family: 'neutral' };
  const hasPrice = p => typeof p.price === 'number' && p.price > 0;
  const shortName = p => p.name.split(' — ')[0];

  /* ---------------- saved state (localStorage) — kept separate from product/look data ---------------- */
  const KEY = 'scc.v1';   // same key as V1 so saved looks carry over
  const DEFAULTS = { v: 2, saved: [], savedProducts: [], recent: [], filters: {}, custom: [], mode: 'looks' };
  let S;
  try { S = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEFAULTS); }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: state lives in memory */ } };
  const allLooks = () => LOOKS.concat(S.custom);
  const getLook = id => allLooks().find(o => o.id === id);
  (function migrate() {
    const LEGACY = { 'friday-cute': 'friday-casual' };          // V1 look ids that were renamed
    const arr = a => (Array.isArray(a) ? a : []);
    S.custom = arr(S.custom).filter(o => arr(o.productIds).length && o.productIds.every(id => byId[id]));   // V1 remixes used demo items
    S.saved = [...new Set(arr(S.saved).map(id => LEGACY[id] || id))].filter(getLook);
    S.recent = [...new Set(arr(S.recent).map(id => LEGACY[id] || id))].filter(getLook);
    S.savedProducts = arr(S.savedProducts).filter(id => byId[id]);
    if (S.v !== 2) S.filters = {};
    delete S.owned; delete S.preferOwned; delete S.filtersOpen;  // closet tracking removed in V2
    S.v = 2; persist();
  })();
  const isSaved = id => S.saved.includes(id);
  const isSavedP = id => S.savedProducts.includes(id);
  const lookProducts = o => (o.productIds || []).map(id => byId[id]).filter(Boolean);

  /* ---------------- pricing: never present a partial sum as a full outfit total ---------------- */
  function subtotal(ps) {
    const known = ps.filter(hasPrice);
    return { sum: known.reduce((n, p) => n + p.price, 0), known: known.length, missing: ps.length - known.length };
  }
  function priceLine(o, long) {
    const ps = lookProducts(o), t = subtotal(ps), extra = (o.suggestions || []).length;
    if (!ps.length) return 'Styling ideas only';
    let s = t.missing ? `<strong>${money(t.sum)}</strong> known-items subtotal · ${t.missing} price${t.missing > 1 ? 's' : ''} to check`
      : `<strong>${money(t.sum)}</strong> subtotal · ${ps.length} piece${ps.length > 1 ? 's' : ''}`;
    if (long && extra) s += ' · styling suggestions not included';
    return s;
  }
  const priceText = p => (hasPrice(p) ? money(p.price) : 'Check price');

  /* ---------------- icons ---------------- */
  const ico = (d, fill) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const HEART = '<path d="M12 20.3l-1.3-1.2C5.6 14.5 3 12.2 3 9.2A4.1 4.1 0 0 1 7.1 5c1.4 0 2.7.7 3.5 1.7L12 8.4l1.4-1.7A4.5 4.5 0 0 1 16.9 5 4.1 4.1 0 0 1 21 9.2c0 3-2.6 5.3-7.7 9.9L12 20.3z"/>';
  const I = {
    heart: on => ico(HEART, on),
    close: ico('<path d="M6 6l12 12M18 6L6 18"/>'),
    shuffle: ico('<path d="M3 7h3.5c2 0 3.4 1 4.5 2.8l2 3.4c1.1 1.8 2.5 2.8 4.5 2.8H21M21 7h-3.5c-1.4 0-2.6.5-3.5 1.500M3 17h3.5c1.4 0 2.6-.5 3.5-1.500M18 4l3 3-3 3M18 14l3 3-3 3"/>'),
    filter: ico('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
    lock: ico('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    unlock: ico('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>'),
    swap: ico('<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/>')
  };

  /* ---------------- photos: real retailer image or neutral placeholder (no illustrations) ---------------- */
  function photo(p, second) {
    const src = second ? p.imageUrl2 : p.imageUrl;
    return `<span class="photo"><span class="pending"><b>Product image pending</b><small>${esc(storeName(p.retailer))} · ${esc(shortName(p))}</small></span>` +
      (src ? `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer">` : '') + '</span>';
  }
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.closest('.photo')) e.target.remove(); }, true);
  const mosaic = ps => `<span class="mosaic m${Math.min(ps.length, 3)}">${ps.slice(0, 3).map(p => photo(p)).join('')}</span>`;
  const swatches = ps => { const ks = [...new Set(ps.map(p => p.color))]; return `<span class="dots" role="img" aria-label="Colors: ${esc(ks.map(k => color(k).name).join(', '))}">${ks.map(k => `<i style="background:${color(k).hex}"></i>`).join('')}</span>`; };
  const SW = { excellent: 'Soft Winter: excellent', good: 'Soft Winter: good, style softly', neutral: 'Grounding neutral' };
  const swBadge = p => `<span class="badge sw-${esc(p.softWinter.rating)}">${SW[p.softWinter.rating] || 'Soft Winter'}</span>`;
  const shopLink = (p, cls = 'btn sm primary') => /^https?:\/\/\S+$/i.test(p.url || '')
    ? `<a class="${cls}" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Shop at ${esc(storeName(p.retailer))} <span aria-hidden="true">↗</span></a>`
    : `<span class="${cls} disabled" aria-disabled="true">Link unavailable</span>`;
  const saveBtn = (o, label) => { const on = isSaved(o.id); return `<button class="btn ${on ? 'on' : ''}" data-act="save" data-id="${o.id}" aria-pressed="${on}">${I.heart(on)}${on ? 'Saved' : label || 'Save'}</button>`; };
  const heartBtn = (act, id, on, name) => `<button class="heart ${on ? 'on' : ''}" data-act="${act}" data-id="${id}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Save'} ${esc(name)}">${I.heart(on)}</button>`;
  const retailerMix = ps => [...new Set(ps.map(p => storeName(p.retailer)))].join(' + ');

  /* ---------------- cards ---------------- */
  function lookCard(o, compact) {
    const ps = lookProducts(o);
    return `<article class="look ${compact ? 'compact' : ''}">
      ${heartBtn('save', o.id, isSaved(o.id), o.name)}
      <button class="look-img" data-act="view" data-id="${o.id}" aria-label="View ${esc(o.name)}">${mosaic(ps)}</button>
      <div class="look-body">
        <p class="eyebrow">${esc((MOODS[o.moods[0]] || {}).label || 'Remix')}${o.custom ? ' · your remix' : ''}</p>
        <h3>${esc(o.name)}</h3>
        ${compact ? '' : `<p class="vibe">${esc(o.vibe || '')}</p>`}
        <p class="meta">${priceLine(o)}</p>
        ${compact ? '' : `<p class="meta">${esc(retailerMix(ps))}${(o.suggestions || []).length ? ' · plus styling suggestions' : ''}</p>
        <div class="btns"><button class="btn primary" data-act="view" data-id="${o.id}">View / Shop Look</button>${saveBtn(o)}</div>`}
      </div>
    </article>`;
  }
  function productCard(p, compact) {
    const seen = LOOKS.filter(o => o.productIds.includes(p.id));
    return `<article class="product ${compact ? 'compact' : ''}">
      ${heartBtn('save-p', p.id, isSavedP(p.id), p.name)}
      <a class="product-img" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.name)} at ${esc(storeName(p.retailer))}">${photo(p)}</a>
      <div class="product-body">
        <p class="eyebrow">${esc(storeName(p.retailer))}</p>
        <h3>${esc(p.name)}</h3>
        <p class="price">${priceText(p)}</p>
        ${compact ? '' : `${swBadge(p)}
        <details><summary>Fit and styling notes</summary>
          <p>${esc(p.softWinter.note)}</p><p>${esc(p.fitNotes)}</p><p>${esc(p.stylistNote)}</p>
          <p class="small">Sizes: ${p.sizes && p.sizes.length ? esc(p.sizes.join(', ')) : 'see retailer page'}</p>
          ${seen.length ? `<p class="small">Seen in: ${seen.map(o => `<button class="link" data-act="view" data-id="${o.id}">${esc(o.name)}</button>`).join(', ')}</p>` : ''}
        </details>
        ${shopLink(p)}`}
      </div>
    </article>`;
  }
  const empty = (title, text, cta) => `<div class="empty"><h3>${title}</h3><p>${text}</p>${cta || ''}</div>`;
  const rail = html => `<div class="rail">${html}</div>`;

  /* ---------------- filters ---------------- */
  const usedColors = Object.keys(PALETTE).filter(k => PRODUCTS.some(p => p.color === k));
  const usedStores = Object.keys(RETAILERS).filter(k => PRODUCTS.some(p => p.retailer === k));
  const GROUPS = [
    ['mood', 'Mood', Object.keys(MOODS).map(k => [k, MOODS[k].label])],
    ['store', 'Store', usedStores.map(k => [k, RETAILERS[k].name])],
    ['category', 'Category', Object.entries(CATEGORIES)],
    ['color', 'Color', usedColors.map(k => [k, PALETTE[k].name])],
    ['formality', 'Formality', FORMALITY.map(f => [f.id, f.label])],
    ['fit', 'Fit', Object.entries(FIT_TAGS)]
  ];
  const sel = g => S.filters[g] || [];
  const activeCount = () => GROUPS.reduce((n, g) => n + sel(g[0]).length, 0);
  const any = (a, b) => !a.length || a.some(x => b.includes(x));
  function lookMatches(o) {
    const ps = lookProducts(o);
    return any(sel('mood'), o.moods) && any(sel('store'), ps.map(p => p.retailer)) && any(sel('category'), ps.map(p => p.category)) &&
      any(sel('color'), ps.map(p => p.color)) && any(sel('formality'), [o.formality]) && any(sel('fit'), ps.flatMap(p => p.fit));
  }
  const productMatches = p => any(sel('mood'), p.moods) && any(sel('store'), [p.retailer]) && any(sel('category'), [p.category]) &&
    any(sel('color'), [p.color]) && any(sel('formality'), p.formality) && any(sel('fit'), p.fit);
  function chip(group, id, label) {
    const on = sel(group).includes(id);
    return `<button class="chip ${on ? 'on' : ''}" data-act="filter" data-group="${group}" data-value="${id}" aria-pressed="${on}">${group === 'color' ? `<i class="dot" style="background:${PALETTE[id].hex}"></i>` : ''}${esc(label)}</button>`;
  }
  const drawer = $('#drawer');
  function drawerHTML() {
    const n = S.mode === 'pieces' ? PRODUCTS.filter(productMatches).length : allLooks().filter(lookMatches).length;
    return `<div class="sheet-head"><h2 id="drawer-title">Filters</h2><button class="icon close" data-act="close-drawer" aria-label="Close filters">${I.close}</button></div>
      ${GROUPS.map(g => `<fieldset><legend>${g[1]}</legend><div class="chips">${g[2].map(v => chip(g[0], v[0], v[1])).join('')}</div></fieldset>`).join('')}
      <div class="drawer-foot"><button class="btn" data-act="clear">Clear all</button><button class="btn primary" data-act="close-drawer">Show ${n} ${S.mode === 'pieces' ? 'piece' : 'look'}${n === 1 ? '' : 's'}</button></div>`;
  }

  /* ---------------- shuffle engine (Soft Winter logic, verified products only) ---------------- */
  const ROLES = ['top', 'bottom', 'shoes'];
  const ROLE_LABEL = { top: 'Top', bottom: 'Bottom', shoes: 'Shoes' };
  const roleOf = p => ({ tops: 'top', bottoms: 'bottom', shoes: 'shoes' })[p.category];
  const fIdx = id => Math.max(0, FORMALITY.findIndex(f => f.id === id));
  const isMini = p => /mini/i.test(p.name) && p.category === 'bottoms';

  function score(p, ctx) {
    if (!p.formality.some(f => Math.abs(fIdx(f) - ctx.f) <= 1)) return -1e9;      // keep the dress code compatible
    let s = Math.random() * 2.5;
    if (p.moods.includes(ctx.mood)) s += 3;
    if (p.formality.includes(FORMALITY[ctx.f].id)) s += 2;
    if (ctx.color && p.color === ctx.color) s += 5;                               // optional color preference
    if (p.pattern && ctx.chosen.some(c => c.pattern)) s -= 6;                     // one pattern at a time
    s += { excellent: 0.8, good: 0.3 }[p.softWinter.rating] || 0;                 // lean toward the best Soft Winter colors
    return s;
  }
  function pick(role, ctx, avoid) {
    let c = PRODUCTS.filter(p => roleOf(p) === role).map(p => [score(p, ctx), p]).filter(x => x[0] > -1e8);
    if (c.length > 1) c = c.filter(x => x[1].id !== avoid);
    c.sort((a, b) => b[0] - a[0]);
    return c.length ? c[0][1] : null;
  }
  function build(keep, prev) {
    const ctx = { mood: R.mood, f: fIdx(rFormality()), color: R.color, chosen: Object.values(keep).map(id => byId[id]).filter(Boolean) };
    const out = Object.assign({}, keep);
    ROLES.forEach(r => { if (out[r]) return; const p = pick(r, ctx, prev[r]); if (p) { out[r] = p.id; ctx.chosen.push(p); } });
    return out;
  }
  /* styling suggestions are ideas only: never priced, never linked */
  function suggest(ps, mood) {
    const top = ps.find(p => p.category === 'tops'), bottom = ps.find(p => p.category === 'bottoms'), out = [];
    if (bottom && isMini(bottom)) out.push({ type: 'tights', label: mood === 'cold' || mood === 'winter-kiss' ? 'Opaque soft-black or charcoal tights' : 'Sheer soft-black tights' });
    if (bottom && !isMini(bottom)) out.push({ type: 'boots', label: 'Sleek black ankle boots as a colder-day swap' });
    if (mood === 'friday') out.push({ type: 'shoes', label: 'Pink Dr. Martens for a Friday swap' });
    const metal = !top ? 'gold, white-gold or rose-gold' : top.color === 'burgundy' ? 'gold' : top.color === 'sky-blue' ? 'white-gold' : 'rose-gold or white-gold';
    out.push({ type: 'jewelry', label: `Delicate ${metal} jewelry` });
    out.push({ type: 'bag', label: top && top.color === 'burgundy' ? 'Small soft-black shoulder bag' : 'Cool burgundy or charcoal shoulder bag' });
    return out;
  }
  function whyFor(ps) {
    const top = ps.find(p => p.category === 'tops'), bottom = ps.find(p => p.category === 'bottoms');
    const waist = ps.find(p => p.fit.includes('waist'));
    return (top && bottom ? `${color(top.color).name} over ${color(bottom.color).name.toLowerCase()} stays cool and moderate in contrast, which is the Soft Winter brief. ` : '') +
      (waist ? `The ${shortName(waist).toLowerCase()} gives you waist definition. ` : 'Tuck the top to keep your waist defined. ') +
      (bottom && isMini(bottom) ? 'A short hem keeps a petite frame long; add tights for the office.' : 'A long, unbroken line below the waist lengthens a petite frame.');
  }
  const R = { mood: 'cute-polished', formality: 'auto', color: '', slots: null, locks: {}, from: '', savedId: '' };
  const rFormality = () => (R.formality === 'auto' ? (MOODS[R.mood] || {}).formality || 'polished' : R.formality);
  function shuffleAll() {
    const keep = {};
    if (R.slots) ROLES.forEach(r => { if (R.locks[r] && R.slots[r]) keep[r] = R.slots[r]; });
    R.slots = build(keep, R.slots || {}); R.savedId = '';
  }
  function swapOne(role) { const keep = Object.assign({}, R.slots); delete keep[role]; R.slots = build(keep, R.slots); R.savedId = ''; }
  function surprise() {
    const moods = Object.keys(MOODS).filter(m => m !== R.mood);
    R.mood = moods[Math.floor(Math.random() * moods.length)]; R.formality = 'auto'; R.color = ''; R.locks = {}; R.from = '';
    shuffleAll();
  }
  function remixLook(o) {
    const slots = {};
    lookProducts(o).forEach(p => { const r = roleOf(p); if (r && !slots[r]) slots[r] = p.id; });
    R.mood = MOODS[o.moods[0]] ? o.moods[0] : R.mood; R.formality = o.formality || 'auto'; R.color = ''; R.locks = {}; R.from = o.name;
    const roles = Object.keys(slots), keepRole = roles[Math.floor(Math.random() * roles.length)];   // keep one piece so it stays "similar"
    R.slots = build(keepRole ? { [keepRole]: slots[keepRole] } : {}, slots); R.savedId = '';
  }

  /* ---------------- views ---------------- */
  const grid = (looks, cls = '') => `<div class="grid ${cls}">${looks.map(o => lookCard(o)).join('')}</div>`;
  function feature(o, flip) {
    const ps = lookProducts(o);
    return `<section class="feature ${flip ? 'flip' : ''}" aria-label="${esc(o.name)}">
      <button class="feature-img" data-act="view" data-id="${o.id}" aria-label="View ${esc(o.name)}">${mosaic(ps)}</button>
      <div class="feature-text">
        <p class="eyebrow">${esc(MOODS[o.moods[0]].label)}</p><h2>${esc(o.name)}</h2>
        <p class="vibe">${esc(o.vibe)}</p><p>${esc(o.why)}</p>
        <p class="meta">${priceLine(o)} · ${esc(retailerMix(ps))}</p>
        <div class="btns"><button class="btn primary" data-act="view" data-id="${o.id}">Shop the look</button>${saveBtn(o)}</div>
      </div></section>`;
  }
  function viewExplore() {
    const L = id => LOOKS.find(o => o.id === id);
    const order = { excellent: 0, good: 1, neutral: 2 };
    const workwear = PRODUCTS.slice().sort((a, b) => order[a.softWinter.rating] - order[b.softWinter.rating]);
    const fresh = LOOKS.filter(o => o.isNew).concat(LOOKS.filter(o => !o.isNew));
    return `<section class="hero">
        <div class="hero-text">
          <p class="eyebrow">The Soft Winter workwear edit</p>
          <h1>Get dressed for work, but make it cute.</h1>
          <p class="lede">Shoppable office looks in cool, softened color. Fitted, feminine and petite-friendly, from Cider and SHEIN.</p>
          <div class="btns"><a class="btn primary lg" href="#shop">Shop the looks</a><button class="btn lg" data-act="surprise-go">${I.shuffle}Surprise me</button></div>
        </div>
        <button class="hero-img" data-act="view" data-id="winter-kiss-office" aria-label="View Winter Kiss Office">${mosaic(lookProducts(L('winter-kiss-office')))}<span class="caption">Winter Kiss Office</span></button>
      </section>
      <section aria-labelledby="h-new"><div class="sec-head"><h2 id="h-new">New Looks</h2><a class="link" href="#shop">All ${LOOKS.length} looks</a></div>
        ${rail(fresh.map(o => lookCard(o, true)).join(''))}</section>
      ${feature(L('winter-kiss-office'))}
      <section aria-labelledby="h-work"><div class="sec-head"><h2 id="h-work">Soft Winter Workwear</h2><button class="link" data-act="pieces-go">All pieces</button></div>
        <p class="sec-sub">Cool burgundy, soft navy and icy blue, grounded with black.</p>
        ${rail(workwear.map(p => productCard(p, true)).join(''))}</section>
      ${feature(L('cute-and-polished'), true)}
      ${feature(L('office-baddie-lite'))}
      ${feature(L('friday-casual'), true)}
      <p class="disclaimer">Prices are reference prices and may change. Check the retailer for current price, sizes and availability.</p>`;
  }

  function viewShop() {
    const looks = allLooks().filter(lookMatches), pieces = PRODUCTS.filter(productMatches), n = activeCount();
    const isLooks = S.mode !== 'pieces';
    const active = GROUPS.flatMap(g => sel(g[0]).map(v => chip(g[0], v, (g[2].find(x => x[0] === v) || [v, v])[1])));
    const clear = '<button class="btn" data-act="clear">Clear filters</button>';
    return `<section><div class="sec-head"><h1>Shop Looks</h1></div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Show">
          <button data-act="mode" data-value="looks" aria-pressed="${isLooks}">Looks (${looks.length})</button>
          <button data-act="mode" data-value="pieces" aria-pressed="${!isLooks}">Pieces (${pieces.length})</button>
        </div>
        <button class="btn filter-btn" data-act="open-drawer">${I.filter}Filters${n ? ` <b>${n}</b>` : ''}</button>
      </div>
      ${n ? `<div class="chips active">${active.join('')}<button class="chip clear" data-act="clear">Clear all</button></div>` : ''}
      ${isLooks
        ? (looks.length ? grid(looks) : empty('No looks match those filters', 'Try removing a filter or two.', clear))
        : (pieces.length ? `<div class="grid pieces">${pieces.map(p => productCard(p)).join('')}</div>` : empty('No pieces match those filters', 'Try removing a filter or two.', clear))}
      <p class="disclaimer">Prices are reference prices and may change. Check the retailer for current price, sizes and availability.</p>
      </section>`;
  }

  function viewShuffle() {
    if (!R.slots) shuffleAll();
    const roles = ROLES.filter(r => R.slots[r] && byId[R.slots[r]]), ps = roles.map(r => byId[R.slots[r]]);
    const t = subtotal(ps), sug = suggest(ps, R.mood);
    return `<section><div class="sec-head"><h1>Shuffle</h1>${R.from ? `<p class="sec-sub">Remixing ${esc(R.from)}</p>` : ''}</div>
      <div class="shuffle">
        <div class="controls">
          <button class="btn primary lg wide" data-act="surprise">${I.shuffle}Surprise Me</button>
          <fieldset><legend>Mood</legend><div class="chips">${Object.keys(MOODS).map(k => `<button class="chip ${R.mood === k ? 'on' : ''}" data-act="r-mood" data-value="${k}" aria-pressed="${R.mood === k}">${esc(MOODS[k].label)}</button>`).join('')}</div></fieldset>
          <div class="ctl-row">
            <label>Dress code<select data-change="r-formality"><option value="auto">Match the mood</option>${FORMALITY.map(x => `<option value="${x.id}" ${R.formality === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}</select></label>
            <label>Color preference<select data-change="r-color"><option value="">No preference</option>${usedColors.map(k => `<option value="${k}" ${R.color === k ? 'selected' : ''}>${esc(PALETTE[k].name)}</option>`).join('')}</select></label>
          </div>
          <div class="btns"><button class="btn lg" data-act="shuffle">${I.swap}Shuffle again</button>
            <button class="btn lg ${R.savedId ? 'on' : ''}" data-act="save-remix" ${R.savedId ? 'disabled' : ''}>${I.heart(!!R.savedId)}${R.savedId ? 'Saved' : 'Save this look'}</button></div>
          <p class="small">Lock a piece to keep it, then shuffle the rest.</p>
        </div>
        <div class="result" aria-live="polite">
          <div class="result-img">${mosaic(ps)}</div>
          <p class="eyebrow">${esc(MOODS[R.mood].label)} · ${esc(FORMALITY[fIdx(rFormality())].label)}</p>
          <p class="meta">${t.missing ? `<strong>${money(t.sum)}</strong> known-items subtotal · ${t.missing} price to check` : `<strong>${money(t.sum)}</strong> subtotal · ${ps.length} pieces`}</p>
          <p>${esc(whyFor(ps))}</p>
          <ul class="slots">${roles.map(r => { const p = byId[R.slots[r]], lock = !!R.locks[r]; return `<li class="${lock ? 'locked' : ''}">
              <span class="thumb">${photo(p)}</span>
              <div class="slot-info"><span class="eyebrow">${ROLE_LABEL[r]} · ${esc(storeName(p.retailer))}</span><strong>${esc(p.name)}</strong><span class="meta">${priceText(p)}</span>${shopLink(p, 'link')}</div>
              <div class="slot-btns">
                <button class="icon ${lock ? 'on' : ''}" data-act="lock" data-value="${r}" aria-pressed="${lock}" aria-label="${lock ? 'Unlock' : 'Lock'} ${ROLE_LABEL[r]}">${lock ? I.lock : I.unlock}</button>
                <button class="icon" data-act="swap" data-value="${r}" aria-label="Swap ${ROLE_LABEL[r]}" ${lock ? 'disabled' : ''}>${I.swap}</button>
              </div></li>`; }).join('')}</ul>
          ${suggestBlock(sug)}
        </div>
      </div></section>`;
  }
  const suggestBlock = sug => (sug && sug.length ? `<div class="suggest"><h3>Finish the look</h3><p class="small">Styling suggestions only. These are ideas, not linked products.</p><ul>${sug.map(s => `<li><span class="eyebrow">${esc(s.type)}</span>${esc(s.label)}</li>`).join('')}</ul></div>` : '');

  function viewSaved() {
    const looks = S.saved.map(getLook).filter(Boolean), ps = S.savedProducts.map(id => byId[id]).filter(Boolean);
    const recent = S.recent.map(getLook).filter(o => o && !isSaved(o.id)).slice(0, 3);
    return `<section><div class="sec-head"><h1>Saved</h1><p class="sec-sub">${looks.length} look${looks.length === 1 ? '' : 's'} · ${ps.length} piece${ps.length === 1 ? '' : 's'}</p></div>
      <h2>Looks</h2>
      ${looks.length ? grid(looks) : empty('No saved looks yet', 'Tap the heart on any look to keep it here.', '<a class="btn primary" href="#shop">Shop looks</a>')}
      </section>
      <section><h2>Pieces</h2>
      ${ps.length ? `<div class="grid pieces">${ps.map(p => productCard(p)).join('')}</div>` : empty('No saved pieces yet', 'Tap the heart on any piece to keep it here.', '<button class="btn" data-act="pieces-go">Browse pieces</button>')}
      </section>
      ${recent.length ? `<section><h2>Recently viewed</h2>${grid(recent)}</section>` : ''}`;
  }

  function viewStyle() {
    const sw = (keys, cls = '') => `<div class="palette ${cls}">${keys.map(k => `<span><i style="background:${PALETTE[k].hex}"></i>${esc(PALETTE[k].name)}</span>`).join('')}</div>`;
    const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
    return `<section class="style"><div class="sec-head"><h1>Style Preferences</h1><p class="sec-sub">The logic behind every look</p></div>
      <div class="style-grid">
        <article class="card"><p class="eyebrow">Color season</p><h2>Soft Winter</h2><p>Cool, softened color with moderate contrast. Depth comes from navy, charcoal and burgundy rather than stark black-and-white or very saturated brights.</p>${sw(Object.keys(PALETTE).filter(k => k !== 'sky-blue'))}<p class="small">Soft black is used as an accent or grounding neutral, usually away from the face. Avoided: warm beige, camel, orange, mustard and neon brights.</p></article>
        <article class="card"><p class="eyebrow">Fit</p><h2>Petite and curvy</h2><p>Built for 5'2.5" with curves: everything starts at the waist.</p>${list(['Waist-defining silhouettes and high rises', 'Fitted, feminine tops: wrap, ruched, V, scoop and round necklines', 'Flare or straight jeans and tailored pants', 'Skorts, mini skirts and short dresses, with tights in winter'])}</article>
        <article class="card"><p class="eyebrow">Shoes</p><h2>Light on the foot</h2>${list(['Mary Janes', 'Ballet flats', 'Feminine sneakers', 'Sleek ankle boots', 'Pink Dr. Martens'])}</article>
        <article class="card"><p class="eyebrow">Jewelry</p><h2>Delicate metals</h2>${list(['<strong>Gold</strong> with burgundy and berry', '<strong>White gold</strong> with icy blue and gray', '<strong>Rose gold</strong> with navy, pink and blush'])}</article>
        <article class="card"><p class="eyebrow">Skip</p><h2>Not for me</h2>${list(['Maxi skirts', 'Chunky loafers', 'Boxy or matronly officewear', 'Beige-heavy corporate basics'])}</article>
        <article class="card"><p class="eyebrow">Shuffle</p><h2>How outfits are built</h2>${list(['Only verified products with real retailer links', 'Keeps the mood and a compatible dress code', 'Favors the strongest Soft Winter colors', 'One pattern at a time', 'Tights, boots, bags and jewelry appear as styling suggestions, never as fake products'])}</article>
      </div></section>`;
  }

  /* ---------------- look detail sheet ---------------- */
  const sheet = $('#sheet');
  let sheetId = null;
  function sheetHTML(o) {
    const ps = lookProducts(o), t = subtotal(ps);
    const shots = ps.flatMap(p => [photo(p)].concat(p.imageUrl2 ? [photo(p, true)] : []));
    return `<div class="sheet-head"><div><p class="eyebrow">${esc(o.moods.map(m => (MOODS[m] || {}).label).filter(Boolean).join(' · '))}</p>
        <h2 id="sheet-title">${esc(o.name)}</h2><p class="vibe">${esc(o.vibe || '')}</p></div>
        <button class="icon close" data-act="close" aria-label="Close">${I.close}</button></div>
      <div class="gallery g${Math.min(shots.length, 3)}">${shots.join('')}</div>
      <div class="btns sheet-actions">${saveBtn(o, 'Save Look')}<button class="btn" data-act="remix" data-id="${o.id}">${I.shuffle}Remix Similar Look</button></div>
      <div class="row">${swatches(ps)}<span class="badge">${esc(FORMALITY[fIdx(o.formality)].label)}</span>${(o.tags || []).map(x => `<span class="badge">${esc(x)}</span>`).join('')}</div>
      <p>${esc(o.why || whyFor(ps))}</p>
      ${o.stylistNote ? `<blockquote class="note"><span class="eyebrow">Stylist note</span>${esc(o.stylistNote)}</blockquote>` : ''}
      <h3>Shop the pieces</h3>
      <ul class="pieces-list">${ps.map(p => `<li>
          <span class="thumb">${photo(p)}</span>
          <div class="pl-info"><span class="eyebrow">${esc(storeName(p.retailer))} · ${esc(CATEGORIES[p.category] || p.category)}</span>
            <strong>${esc(p.name)}</strong>
            <span class="meta"><i class="dot" style="background:${color(p.color).hex}"></i>${esc(color(p.color).name)} · Sizes: ${p.sizes && p.sizes.length ? esc(p.sizes.join(', ')) : 'see retailer'}</span>
            ${swBadge(p)}
            <span class="small">${esc(p.softWinter.note)}</span><span class="small">${esc(p.fitNotes)}</span>
          </div>
          <div class="pl-act"><span class="price">${priceText(p)}</span>${shopLink(p)}
            <button class="btn sm ${isSavedP(p.id) ? 'on' : ''}" data-act="save-p" data-id="${p.id}" aria-pressed="${isSavedP(p.id)}">${I.heart(isSavedP(p.id))}${isSavedP(p.id) ? 'Saved' : 'Save piece'}</button></div></li>`).join('')}</ul>
      <div class="totals"><p><span>${t.missing ? 'Known-items subtotal' : 'Subtotal'} (${t.known} of ${ps.length} priced)</span><strong>${money(t.sum)}</strong></p>
        ${t.missing ? `<p class="small">${ps.filter(p => !hasPrice(p)).map(p => esc(shortName(p))).join(', ')}: check the price at the retailer. This is not a complete outfit total.</p>` : ''}
        <p class="small">Reference prices, not live guarantees. Styling suggestions are not included.</p></div>
      ${suggestBlock(o.suggestions)}`;
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
    setTimeout(() => { if (!focusSel) return; const el = (host.open === false ? view : host).querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }, 0);
    view.innerHTML = VIEWS[r]();
    document.querySelectorAll('[data-nav]').forEach(n => { if (n.dataset.nav === r) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    document.title = TITLES[r] + (r === 'explore' ? '' : ' · Soft Corporate Closet');
    if (r !== lastRoute && !keepScroll) window.scrollTo(0, 0);
    lastRoute = r;
    if (sheetId && sheet.open) { const o = getLook(sheetId), y = sheet.scrollTop; if (o) { sheet.innerHTML = sheetHTML(o); sheet.scrollTop = y; } else closeSheet(); }
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
    'pieces-go': () => { S.filters = {}; S.mode = 'pieces'; persist(); go('shop'); },
    'surprise-go': () => { surprise(); go('shuffle'); },
    surprise: () => { surprise(); render(true); },
    shuffle: () => { shuffleAll(); render(true); },
    swap: d => { swapOne(d.value); render(true); },
    lock: d => { R.locks[d.value] = !R.locks[d.value]; render(true); },
    'r-mood': d => { R.mood = d.value; R.from = ''; shuffleAll(); render(true); },
    'save-remix': () => {
      const ids = ROLES.map(r => R.slots[r]).filter(Boolean), ps = ids.map(id => byId[id]);
      const id = 'remix-' + Date.now();
      S.custom.push({ id, name: (R.from ? R.from + ' Remix' : MOODS[R.mood].label + ' Remix'), moods: [R.mood], vibe: 'Your own shuffle.', productIds: ids, suggestions: suggest(ps, R.mood), formality: rFormality(), tags: ['remix'], why: whyFor(ps), stylistNote: '', custom: true });
      S.saved.unshift(id); R.savedId = id; persist(); toast('Remix saved'); render(true);
    }
  };
  const CHANGES = {
    'r-formality': v => { R.formality = v; shuffleAll(); render(true); },
    'r-color': v => { R.color = v; shuffleAll(); render(true); }
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.act]; if (fn) fn(el.dataset, el);
  });
  document.addEventListener('change', e => { const k = e.target.dataset && e.target.dataset.change; if (k && CHANGES[k]) CHANGES[k](e.target.value, e.target); });
  window.addEventListener('hashchange', () => { closeSheet(); closeDialog(drawer); render(); });
  render();
})();
