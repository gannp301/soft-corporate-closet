/* Soft Corporate Closet — app logic (vanilla JS, no build step) */
(function () {
  'use strict';
  const { STORES, PALETTE, MOODS, FORMALITY, FIT_TAGS, CATEGORIES, ITEMS, OUTFITS } = window.SCC;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2);
  const storeName = k => (STORES[k] || { name: k || 'Other' }).name;
  const color = k => PALETTE[k] || { name: k, hex: '#cccccc', family: 'neutral' };

  /* ---------------- persistent state (localStorage) ---------------- */
  const KEY = 'scc.v1';
  const DEFAULTS = { saved: [], owned: {}, recent: [], filters: {}, custom: [], preferOwned: false, mode: 'looks' };
  let S;
  try { S = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEFAULTS); }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: state lives in memory */ } };

  const isOwned = it => (it.id in S.owned ? S.owned[it.id] : !!it.owned);
  const isSaved = id => S.saved.includes(id);
  const allLooks = () => OUTFITS.concat(S.custom);
  const getLook = id => allLooks().find(o => o.id === id);
  const lookItems = o => o.itemIds.map(id => byId[id]).filter(Boolean);
  const total = items => items.reduce((n, i) => n + (i.price || 0), 0);
  const ownedCount = items => items.filter(isOwned).length;

  /* ---------------- garment illustrations ---------------- */
  function art(it) {
    if (it.image) return `<img src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy">`;
    const c = color(it.color).hex;
    const n = parseInt(c.slice(1), 16), lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    const d = lum < 0.4 ? 'rgba(255,255,255,.5)' : 'rgba(30,30,60,.3)';
    const o = 'rgba(30,30,60,.32)';
    const P = p => `<path d="${p}" fill="${c}" stroke="${o}" stroke-width="1.2" stroke-linejoin="round"/>`;
    const L = (p, w = 1.2, col = d) => `<path d="${p}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const M = (p, w) => L(p, w + 1.6, o) + L(p, w, c); // metal / strap line with outline
    const dot = (x, y, r = 1.6, col = d) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
    const ring = (x, y, r, w) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${o}" stroke-width="${w + 1.6}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
    const LS = 'L68 19 L80 30 L90 80 L80 82 L69 44 Q65 64 69 88 L31 88 Q35 64 31 44 L20 82 L10 80 L20 30 Z';
    const TEE = 'M31 22 L42 17 Q50 31 58 17 L69 22 L85 36 L75 47 L68 41 Q64 62 68 86 L32 86 Q36 62 32 41 L25 47 L15 36 Z';
    const CARD = 'M32 19 L42 15 L50 40 L58 15 L68 19 L80 30 L90 76 L80 78 L69 44 Q66 60 68 78 L32 78 Q34 60 31 44 L20 78 L10 76 L20 30 Z';
    const SKIRT = 'M35 28 L65 28 L80 74 L20 74 Z';
    const BOOT = 'M38 14 L60 14 L60 50 Q80 56 86 70 L86 80 L30 80 L30 72 L38 58 Z';
    const DRS = 'L63 44 L84 90 L16 90 L37 44 ';
    const shapes = {
      tee: () => P(TEE),
      longsleeve: () => P('M32 19 L42 15 Q50 28 58 15 ' + LS),
      henley: () => P('M32 19 L42 15 Q50 28 58 15 ' + LS) + L('M50 22 L50 46') + dot(50, 28) + dot(50, 35) + dot(50, 42),
      vneck: () => P('M32 19 L42 15 L50 34 L58 15 ' + LS) + L('M40 52 Q50 57 60 52 M40 61 Q50 66 60 61 M41 70 Q50 75 59 70'),
      wrap: () => P('M32 19 L42 15 L50 34 L58 15 ' + LS) + L('M42 15 L64 58 M58 15 L45 42 M64 58 q9 3 7 13 M64 58 q11 -1 14 6'),
      cardigan: () => P(CARD) + L('M50 40 L50 78') + dot(53, 48) + dot(53, 58) + dot(53, 68),
      jacket: () => P('M30 18 L42 14 L50 30 L58 14 L70 18 L82 30 L90 74 L79 76 L70 44 L70 74 L30 74 L30 44 L21 76 L10 74 L18 30 Z') + L('M50 30 L50 74 M42 14 L43 28 L50 30 M58 14 L57 28 L50 30 M34 54 h10 M56 54 h10'),
      straight: () => P('M31 12 L69 12 L73 90 L54 90 L50 36 L46 90 L27 90 Z') + L('M31 19 L69 19'),
      trousers: () => P('M31 12 L69 12 L73 90 L54 90 L50 36 L46 90 L27 90 Z') + L('M31 19 L69 19 M39 24 L37 88 M61 24 L63 88'),
      flare: () => P('M33 12 L67 12 L69 54 L82 90 L57 90 L50 36 L43 90 L18 90 L31 54 Z') + L('M33 19 L67 19'),
      skirt: () => P(SKIRT) + L('M34 35 L66 35'),
      skort: () => P(SKIRT) + L('M34 35 L66 35 M56 35 L63 74'),
      pleated: () => P(SKIRT) + L('M34 35 L66 35 M42 36 L33 73 M50 36 L50 73 M58 36 L67 73 M46 36 L41 73 M54 36 L59 73'),
      shorts: () => P('M31 24 L69 24 L78 68 L54 68 L50 48 L46 68 L22 68 Z') + L('M31 31 L69 31 M41 32 L39 50 M59 32 L61 50'),
      'dress-ls': () => P('M36 12 L44 9 Q50 18 56 9 L64 12 L74 20 L82 52 L74 54 L66 30 ' + DRS + 'L34 30 L26 54 L18 52 L26 20 Z') + L('M37 44 L63 44'),
      'dress-ss': () => P('M36 12 L44 9 Q50 18 56 9 L64 12 L76 22 L69 30 L65 26 ' + DRS + 'L35 26 L31 30 L24 22 Z') + L('M37 44 L63 44'),
      boots: () => P(BOOT) + '<path d="M28 80 H88 V84 H42 V90 H28 Z" fill="#222"/>' + L('M38 22 H60'),
      docs: () => P(BOOT) + '<path d="M27 80 H89 V89 H27 Z" fill="#2b2a30"/>' + L('M31 80 H86', 1.4, '#f6d94f') + L('M60 22 L50 26 M60 30 L50 34 M60 38 L50 42 M60 46 L52 50', 1.4, 'rgba(255,255,255,.8)'),
      maryjane: () => P('M12 64 Q16 52 30 56 Q48 70 76 62 Q90 64 90 76 L12 76 Z') + L('M32 57 Q40 40 54 64', 3.2, c) + '<path d="M10 76 H91 V79 H26 V84 H12 V79 H10 Z" fill="#222"/>',
      sneaker: () => P('M14 52 L32 48 L52 60 Q76 62 88 70 L88 78 L14 78 Z') + `<path d="M12 78 H90 V85 H12 Z" fill="#fff" stroke="${o}"/>` + L('M36 53 L42 48 M42 57 L48 52 M48 61 L54 56', 1.4, '#f77fb5'),
      heel: () => P('M14 42 Q30 62 62 66 Q86 68 88 76 L52 76 Q34 72 27 62 L25 86 L19 86 Z'),
      flat: () => P('M12 66 Q18 54 34 60 Q54 72 80 66 Q90 68 90 76 L12 76 Z') + `<path d="M70 65 l-8 -4 v8 z M70 65 l8 -4 v8 z" fill="${d}"/>`,
      bag: () => M('M32 48 Q50 6 68 48', 3.2) + P('M24 46 H76 Q80 46 80 50 V80 Q80 86 74 86 H26 Q20 86 20 80 V50 Q20 46 24 46 Z') + L('M20 58 Q50 74 80 58') + dot(50, 68, 2.6, '#e2b53e'),
      hoops: () => ring(33, 50, 16, 4) + ring(69, 50, 16, 4),
      huggies: () => ring(36, 50, 9, 6) + ring(66, 50, 9, 6),
      necklace: () => M('M22 20 Q50 84 78 20', 1.8) + dot(50, 53, 4.5, c) + `<circle cx="50" cy="53" r="4.5" fill="none" stroke="${o}"/>`,
      layered: () => M('M30 18 Q50 60 70 18', 1.6) + M('M20 18 Q50 96 80 18', 1.6) + dot(50, 39, 3, c) + dot(50, 57, 4, c),
      bracelet: () => `<ellipse cx="50" cy="52" rx="30" ry="18" fill="none" stroke="${o}" stroke-width="5.6"/><ellipse cx="50" cy="52" rx="30" ry="18" fill="none" stroke="${c}" stroke-width="4"/>` + dot(50, 70, 3.4, '#fff'),
      tights: () => P('M34 10 L66 10 L62 60 L60 92 L52 92 L50 40 L48 92 L40 92 L38 60 Z') + L('M34 17 L66 17')
    };
    const draw = shapes[it.shape] || (() => `<rect x="24" y="24" width="52" height="52" rx="10" fill="${c}" stroke="${o}"/>`);
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${esc(it.name)}">${draw()}</svg>`;
  }
  const tile = (it, extra = '') => `<span class="tile ${extra}" title="${esc(it.name)}">${art(it)}${isOwned(it) ? '<i class="own-dot" aria-hidden="true">✓</i>' : ''}</span>`;
  const swatches = keys => `<span class="dots" aria-label="Color story: ${esc(keys.map(k => color(k).name).join(', '))}">${keys.map(k => `<i style="background:${color(k).hex}" title="${esc(color(k).name)}"></i>`).join('')}</span>`;
  const storyOf = o => o.colorStory && o.colorStory.length ? o.colorStory : [...new Set(lookItems(o).map(i => i.color))];

  /* ---------------- shopping links ---------------- */
  function shopBtn(it, cls = 'btn sm') {
    const st = STORES[it.store] || STORES.other || {};
    if (/^https?:\/\/\S+$/i.test(it.url || '')) return `<a class="${cls}" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">Shop at ${esc(storeName(it.store))} ↗</a>`;
    if (st.search) return `<a class="${cls}" href="${esc(st.search + encodeURIComponent(it.name))}" target="_blank" rel="noopener noreferrer">Find at ${esc(st.name)} ↗</a>`;
    return `<span class="${cls} disabled" aria-disabled="true">${isOwned(it) ? 'In your closet' : 'No link yet'}</span>`;
  }
  const priceText = it => (it.price > 0 ? money(it.price) : isOwned(it) ? 'Owned' : '—');
  const ownBtn = it => `<button class="btn sm own ${isOwned(it) ? 'on' : ''}" data-act="own" data-id="${it.id}" aria-pressed="${isOwned(it)}">${isOwned(it) ? '✓ I own this' : 'I own this'}</button>`;
  function ownedLine(items) {
    const n = ownedCount(items);
    return n ? `<p class="closet-line"><span aria-hidden="true">📎</span> ${n} of ${items.length} pieces already in your closet</p>` : '';
  }
  const fitBadges = (it, only) => it.fit.filter(t => !only || only.includes(t)).map(t => `<span class="badge">${esc(FIT_TAGS[t] || t)}</span>`).join('');

  /* ---------------- cards ---------------- */
  function lookCard(o) {
    const items = lookItems(o), saved = isSaved(o.id), stores = [...new Set(items.map(i => storeName(i.store)))];
    return `<article class="look">
      <span class="tape" aria-hidden="true"></span>
      <button class="heart ${saved ? 'on' : ''}" data-act="save" data-id="${o.id}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${esc(o.name)}">${saved ? '♥' : '♡'}</button>
      <button class="look-board" data-act="view" data-id="${o.id}" aria-label="View ${esc(o.name)}">${items.slice(0, 6).map(i => tile(i)).join('')}</button>
      <div class="look-body">
        <span class="sticker">${esc((MOODS[o.moods[0]] || {}).label || 'Remix')}</span>
        <h3>${esc(o.name)}</h3>
        <p class="vibe">${esc(o.vibe || '')}</p>
        <div class="row">${swatches(storyOf(o))}<span class="tags">${(o.tags || []).slice(0, 3).map(t => `<span>#${esc(t)}</span>`).join(' ')}</span></div>
        <p class="meta"><strong>${money(total(items))}</strong> est. total · ${esc(stores.join(' + '))}</p>
        ${ownedLine(items)}
        <div class="btns">
          <button class="btn primary" data-act="view" data-id="${o.id}">View Look</button>
          <button class="btn" data-act="shop" data-id="${o.id}">Shop</button>
          <button class="btn" data-act="remix" data-id="${o.id}">⟳ Remix</button>
          <button class="btn ${saved ? 'on' : ''}" data-act="save" data-id="${o.id}" aria-pressed="${saved}">${saved ? '♥ Saved' : '♡ Save Look'}</button>
        </div>
      </div>
    </article>`;
  }
  function itemCard(it, withStyle) {
    return `<article class="piece">
      ${tile(it, 'big')}
      <div class="piece-body">
        <h3>${esc(it.name)}</h3>
        <p class="meta"><i class="dot" style="background:${color(it.color).hex}"></i>${esc(color(it.color).name)} · ${esc(CATEGORIES[it.category] || it.category)} · ${esc(storeName(it.store))}</p>
        <p class="price">${priceText(it)}</p>
        <div class="badges">${fitBadges(it, ['petite', 'belly', 'curve', 'waist'])}</div>
        <div class="btns">${shopBtn(it)}${ownBtn(it)}${withStyle ? `<button class="btn sm" data-act="anchor" data-id="${it.id}">⟳ Style it</button>` : ''}</div>
      </div>
    </article>`;
  }
  const empty = (emoji, title, text, cta) => `<div class="empty"><div class="empty-ico" aria-hidden="true">${emoji}</div><h3>${title}</h3><p>${text}</p>${cta || ''}</div>`;

  /* ---------------- filters ---------------- */
  const usedColors = Object.keys(PALETTE).filter(k => ITEMS.some(i => i.color === k));
  const GROUPS = [
    ['store', 'Store', Object.keys(STORES).map(k => [k, STORES[k].name])],
    ['category', 'Category', Object.entries(CATEGORIES)],
    ['mood', 'Mood', Object.keys(MOODS).map(k => [k, MOODS[k].label])],
    ['color', 'Color', usedColors.map(k => [k, PALETTE[k].name])],
    ['formality', 'Formality', FORMALITY.map(f => [f.id, f.label])],
    ['fit', 'Fit / Style', Object.entries(FIT_TAGS)],
    ['personal', 'My closet', [['saved', 'Saved'], ['owned', 'Owned']]]
  ];
  const sel = g => S.filters[g] || [];
  const activeCount = () => GROUPS.reduce((n, g) => n + sel(g[0]).length, 0);
  const any = (a, b) => !a.length || a.some(x => b.includes(x));
  function lookMatches(o) {
    const it = lookItems(o);
    return any(sel('store'), it.map(i => STORES[i.store] ? i.store : 'other')) && any(sel('category'), it.map(i => i.category)) &&
      any(sel('mood'), o.moods) && any(sel('color'), it.map(i => i.color)) && any(sel('formality'), [o.formality]) &&
      any(sel('fit'), it.flatMap(i => i.fit)) &&
      sel('personal').every(p => (p === 'saved' ? isSaved(o.id) : it.some(isOwned)));
  }
  function itemMatches(i) {
    return any(sel('store'), [STORES[i.store] ? i.store : 'other']) && any(sel('category'), [i.category]) && any(sel('mood'), i.moods) &&
      any(sel('color'), [i.color]) && any(sel('formality'), i.formality) && any(sel('fit'), i.fit) &&
      sel('personal').every(p => (p === 'owned' ? isOwned(i) : allLooks().some(o => isSaved(o.id) && o.itemIds.includes(i.id))));
  }
  function chip(group, id, label) {
    const on = sel(group).includes(id);
    const sw = group === 'color' ? `<i class="dot" style="background:${PALETTE[id].hex}"></i>` : '';
    return `<button class="chip ${on ? 'on' : ''}" data-act="filter" data-group="${group}" data-value="${id}" aria-pressed="${on}">${sw}${esc(label)}</button>`;
  }

  /* ---------------- shuffle / remix engine ---------------- */
  const ROLES = ['dress', 'top', 'layer', 'bottom', 'legwear', 'shoes', 'bag', 'jewelry'];
  const ROLE_LABEL = { dress: 'Dress', top: 'Top', layer: 'Layer', bottom: 'Bottom', legwear: 'Tights', shoes: 'Shoes', bag: 'Bag', jewelry: 'Jewelry' };
  const roleOf = i => ({ tops: 'top', bottoms: 'bottom', dresses: 'dress', outerwear: 'layer', shoes: 'shoes', bags: 'bag' })[i.category] || (i.shape === 'tights' ? 'legwear' : 'jewelry');
  const fam = i => color(i.color).family;
  const fIdx = id => Math.max(0, FORMALITY.findIndex(f => f.id === id));
  const OK_PAIRS = ['pink+berry', 'pink+lavender', 'blue+lavender'];
  const pairOk = (a, b) => a === b || OK_PAIRS.includes(a + '+' + b) || OK_PAIRS.includes(b + '+' + a);
  const TIGHTS_OK = ['skort', 'skirt', 'pleated', 'shorts', 'dress-ls', 'dress-ss'];
  const BODY = ['top', 'bottom', 'dress', 'layer'];
  const isDenim = i => /denim/.test(i.color);

  function score(it, ctx) {
    const ch = ctx.chosen;
    if (it.banned) return -1e9;                                                        // never suggest banned styles
    if (!it.formality.some(f => Math.abs(fIdx(f) - ctx.f) <= 1)) return -1e9;          // keep formality compatible
    if (ctx.winter && !it.season.includes('winter')) return -1e9;                      // cold moods need winter pieces
    if (it.shape === 'cardigan' && ch.some(c => c.shape === 'cardigan')) return -1e9;  // no cardigan on cardigan
    let s = Math.random() * 2.5;
    if (it.moods.includes(ctx.mood)) s += 3;
    if (it.formality.includes(FORMALITY[ctx.f].id)) s += 2;
    const f = fam(it), clothes = ch.filter(c => fam(c) !== 'metal');
    const accents = [...new Set(clothes.map(fam).filter(x => x !== 'neutral'))];
    if (f === 'metal') {                                                               // gold / white gold / rose gold logic
      if (it.color === 'gold') s += accents.includes('berry') || accents.includes('green') ? 2.5 : accents.length ? 0 : 1.5;
      if (it.color === 'white-gold') s += accents.includes('blue') || accents.includes('lavender') ? 2.5 : !accents.length && clothes.some(c => c.color === 'white') ? 2 : 0;
      if (it.color === 'rose-gold') s += accents.includes('pink') ? 3 : accents.includes('berry') ? 1 : 0;
    } else if (f === 'neutral') {
      s += 1;
      const body = clothes.filter(c => BODY.includes(roleOf(c)));
      if (BODY.includes(roleOf(it))) {
        if ((it.color === 'navy' && body.some(c => c.color === 'black')) || (it.color === 'black' && body.some(c => c.color === 'navy'))) s -= 2;
        if (isDenim(it) && body.some(isDenim)) s -= 4;                                 // no denim-on-denim
      }
    } else if (accents.includes(f)) s += 2.5;                                          // echo an accent already in the look
    else if (!accents.length) s += 2;                                                  // every look deserves one Bright Winter color
    else if (accents.every(a => pairOk(a, f))) s += 0.5;
    else s -= 6;                                                                       // clashing accent families
    if (ctx.preferOwned && isOwned(it)) s += 6;
    s += ['waist', 'petite', 'curve', 'belly'].filter(t => it.fit.includes(t)).length * 0.4;
    return s;
  }
  function pick(role, ctx, avoid) {
    let c = ITEMS.filter(i => roleOf(i) === role).map(i => [score(i, ctx), i]).filter(x => x[0] > -1e8);
    if (c.length > 1) c = c.filter(x => x[1].id !== avoid);
    c.sort((a, b) => b[0] - a[0]);
    return c.length ? c[0][1] : null;
  }
  function build(mood, formality, keep, roles, prev) {
    const ctx = { mood, f: fIdx(formality), winter: !!(MOODS[mood] || {}).winter, preferOwned: S.preferOwned, chosen: Object.values(keep).map(id => byId[id]).filter(Boolean) };
    const out = Object.assign({}, keep);
    for (const r of ROLES) {
      if (!roles.includes(r) || out[r]) continue;
      if (r === 'legwear') { const base = byId[out.dress || out.bottom]; if (!base || !TIGHTS_OK.includes(base.shape)) continue; }
      const it = pick(r, ctx, prev[r]);
      if (it) { out[r] = it.id; ctx.chosen.push(it); }
    }
    const base = byId[out.dress || out.bottom];
    if (out.legwear && (!base || !TIGHTS_OK.includes(base.shape))) delete out.legwear;
    return out;
  }
  function freshRoles(mood, keep) {
    const winter = !!(MOODS[mood] || {}).winter;
    const dress = keep.dress ? true : keep.top || keep.bottom ? false : Math.random() < 0.3;
    const roles = (dress ? ['dress'] : ['top', 'bottom']).concat(['shoes', 'bag', 'jewelry']);
    if (keep.layer || winter || Math.random() < 0.4) roles.push('layer');
    if (keep.legwear || winter || Math.random() < 0.3) roles.push('legwear');
    return roles;
  }
  const R = { mood: 'cute-polished', formality: 'auto', slots: null, locks: {}, from: '', savedId: '' };
  const rFormality = () => (R.formality === 'auto' ? (MOODS[R.mood] || {}).formality || 'polished' : R.formality);
  function shuffleAll() {
    const keep = {};
    if (R.slots) Object.keys(R.locks).forEach(r => { if (R.locks[r] && R.slots[r]) keep[r] = R.slots[r]; });
    R.slots = build(R.mood, rFormality(), keep, freshRoles(R.mood, keep), R.slots || {});
    R.savedId = '';
  }
  function swapOne(role) {
    const keep = Object.assign({}, R.slots); delete keep[role];
    if (role === 'dress' || role === 'bottom') delete keep.legwear;
    const roles = Object.keys(R.slots);
    R.slots = build(R.mood, rFormality(), keep, roles, R.slots);
    R.savedId = '';
  }
  function remixLook(o) {
    const slots = {};
    lookItems(o).forEach(i => { const r = roleOf(i); if (!slots[r]) slots[r] = i.id; });
    const roles = Object.keys(slots);
    R.mood = MOODS[o.moods[0]] ? o.moods[0] : R.mood; R.formality = o.formality || 'auto'; R.locks = {}; R.from = o.name;
    const order = roles.slice().sort(() => Math.random() - 0.5);
    const keep = {}; order.slice(0, Math.max(1, Math.floor(roles.length / 2))).forEach(r => { keep[r] = slots[r]; });
    if ((keep.dress || keep.bottom) && slots.legwear) keep.legwear = slots.legwear;
    R.slots = build(R.mood, rFormality(), keep, roles, slots);
    R.savedId = '';
  }
  function anchorOn(it) {
    const r = roleOf(it);
    if (!it.moods.includes(R.mood)) R.mood = it.moods[0] || R.mood;
    R.formality = 'auto'; R.from = ''; R.slots = { [r]: it.id }; R.locks = { [r]: true };
    shuffleAll();
  }
  function whyFor(items) {
    const cols = [...new Set(items.filter(i => fam(i) !== 'metal').map(i => color(i.color).name.toLowerCase()))].slice(0, 4);
    const waist = items.find(i => i.fit.includes('waist') && BODY.includes(roleOf(i)));
    const belly = items.find(i => i.fit.includes('belly') && i !== waist);
    const metal = items.find(i => fam(i) === 'metal');
    return `${cols.join(' + ')} keeps this in clean, cool Bright Winter territory.` +
      (waist ? ` The ${waist.name.toLowerCase()} gives you waist definition` + (belly ? `, and the ${belly.name.toLowerCase()} is structured and comfortable through the middle.` : '.') : '') +
      (metal ? ` ${color(metal.color).name} finishes it off.` : '');
  }

  /* ---------------- views ---------------- */
  const moodChips = act => Object.keys(MOODS).map(k => `<button class="chip mood" data-act="${act}" data-value="${k}">${esc(MOODS[k].label)}</button>`).join('');
  const grid = (looks, cls = '') => `<div class="grid ${cls}">${looks.map(lookCard).join('')}</div>`;

  function viewHome() {
    const feat = OUTFITS.filter(o => o.featured);
    const day = Math.floor(Date.now() / 864e5);
    const today = OUTFITS[day % OUTFITS.length], tItems = lookItems(today);
    const recent = S.recent.map(getLook).filter(Boolean).slice(0, 4);
    return `<section class="hero">
        <span class="spark s1" aria-hidden="true">✦</span><span class="spark s2" aria-hidden="true">♡</span><span class="spark s3" aria-hidden="true">✦</span>
        <p class="hand">cute first, professional second</p>
        <h1>Shop the look.<br><em>Soft corporate,</em> but make it you.</h1>
        <p class="lede">A digital fashion board of fitted, feminine, Bright Winter office outfits from Cider, SHEIN and Amazon. Save them, shop them, remix them with what you own.</p>
        <div class="btns"><a class="btn primary lg" href="#browse">Shop the looks</a><a class="btn lg" href="#shuffle">⟳ Shuffle an outfit</a></div>
      </section>

      <section aria-labelledby="h-mood"><h2 id="h-mood">What's the mood?</h2>
        <div class="chips scroll">${moodChips('quick-mood')}</div>
        <div class="chips scroll quick">
          ${[['store', 'cider', 'Cider'], ['store', 'shein', 'SHEIN'], ['store', 'amazon', 'Amazon'], ['formality', 'meeting', 'Meeting-ready'], ['fit', 'winter', 'Winter-friendly'], ['fit', 'belly', 'Lower-belly-friendly'], ['personal', 'owned', 'Uses my closet']]
            .map(q => `<button class="chip" data-act="quick" data-group="${q[0]}" data-value="${q[1]}">${q[2]}</button>`).join('')}
        </div>
      </section>

      <section class="today" aria-labelledby="h-today">
        <div class="today-board">
          <span class="pin" aria-hidden="true">📌</span>
          <p class="hand">today's board</p>
          <h2 id="h-today">${esc(today.name)}</h2>
          <button class="collage" data-act="view" data-id="${today.id}" aria-label="View ${esc(today.name)}">${tItems.map(i => tile(i)).join('')}</button>
          <div class="row">${swatches(storyOf(today))}<span class="meta"><strong>${money(total(tItems))}</strong> est.</span></div>
          ${ownedLine(tItems)}
        </div>
        <div class="today-side">
          <div class="note"><span class="clip" aria-hidden="true">📎</span><p class="hand">stylist note</p><p>${esc(today.stylistNote)}</p></div>
          <p class="vibe">${esc(today.vibe)}</p>
          <div class="btns">
            <button class="btn primary" data-act="view" data-id="${today.id}">View Look</button>
            <button class="btn" data-act="shop" data-id="${today.id}">Shop</button>
            <button class="btn" data-act="remix" data-id="${today.id}">⟳ Remix</button>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-feat"><div class="sec-head"><h2 id="h-feat">Shop the Look <span aria-hidden="true">🎀</span></h2><a href="#browse" class="link">See all ${OUTFITS.length} looks →</a></div>
        ${grid(feat, 'board')}
      </section>
      ${recent.length ? `<section aria-labelledby="h-rec"><h2 id="h-rec">Recently viewed</h2>${grid(recent)}</section>` : ''}`;
  }

  function viewBrowse() {
    const looks = allLooks().filter(lookMatches), pieces = ITEMS.filter(itemMatches), n = activeCount();
    const isLooks = S.mode !== 'pieces';
    const active = GROUPS.flatMap(g => sel(g[0]).map(v => chip(g[0], v, (g[2].find(x => x[0] === v) || [v, v])[1])));
    const clear = '<button class="btn" data-act="clear">Clear filters</button>';
    return `<section><div class="sec-head"><h1>Browse</h1>
        <div class="seg" role="group" aria-label="Show">
          <button data-act="mode" data-value="looks" aria-pressed="${isLooks}">Looks (${looks.length})</button>
          <button data-act="mode" data-value="pieces" aria-pressed="${!isLooks}">Pieces (${pieces.length})</button>
        </div></div>
      <details class="filters" ${S.filtersOpen ? 'open' : ''}>
        <summary><span>Filters${n ? ` <b>${n}</b>` : ''}</span><span class="hand">tap to open</span></summary>
        ${GROUPS.map(g => `<fieldset><legend>${g[1]}</legend><div class="chips">${g[2].map(v => chip(g[0], v[0], v[1])).join('')}</div></fieldset>`).join('')}
      </details>
      ${n ? `<div class="chips active">${active.join('')}<button class="chip clear" data-act="clear">Clear all ✕</button></div>` : ''}
      ${isLooks
        ? (looks.length ? grid(looks) : empty('🔍', 'No looks match those filters', 'Try removing a filter or two.', clear))
        : (pieces.length ? `<div class="grid pieces">${pieces.map(i => itemCard(i)).join('')}</div>` : empty('🔍', 'No pieces match those filters', 'Try removing a filter or two.', clear))}
      </section>`;
  }

  function viewShuffle() {
    if (!R.slots) shuffleAll();
    const roles = ROLES.filter(r => R.slots[r] && byId[R.slots[r]]), items = roles.map(r => byId[R.slots[r]]);
    const f = rFormality(), fLabel = (FORMALITY[fIdx(f)] || {}).label, owned = ITEMS.filter(isOwned);
    const anchorId = Object.keys(R.locks).filter(r => R.locks[r]).map(r => R.slots[r])[0] || '';
    return `<section><div class="sec-head"><h1>Outfit Shuffle</h1><p class="hand">${R.from ? 'remixing “' + esc(R.from) + '”' : 'spin the closet'}</p></div>
      <div class="shuffle">
        <div class="controls">
          <fieldset><legend>Office mood</legend><div class="chips">${Object.keys(MOODS).map(k => `<button class="chip ${R.mood === k ? 'on' : ''}" data-act="r-mood" data-value="${k}" aria-pressed="${R.mood === k}">${esc(MOODS[k].label)}</button>`).join('')}</div></fieldset>
          <div class="ctl-row">
            <label>Formality<select data-change="r-formality"><option value="auto">Match the mood</option>${FORMALITY.map(x => `<option value="${x.id}" ${R.formality === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}</select></label>
            <label>Build around<select data-change="r-anchor"><option value="">Anything</option>${(owned.length ? '<optgroup label="My closet">' + owned.map(i => `<option value="${i.id}" ${anchorId === i.id ? 'selected' : ''}>${esc(i.name)}</option>`).join('') + '</optgroup>' : '')}<optgroup label="All pieces">${ITEMS.filter(i => !isOwned(i)).map(i => `<option value="${i.id}" ${anchorId === i.id ? 'selected' : ''}>${esc(i.name)}</option>`).join('')}</optgroup></select></label>
          </div>
          <label class="switch"><input type="checkbox" data-change="r-owned" ${S.preferOwned ? 'checked' : ''}><span>Use more of what I own</span></label>
          <div class="btns"><button class="btn primary lg" data-act="shuffle">⟳ Shuffle Again</button>
            <button class="btn lg ${R.savedId ? 'on' : ''}" data-act="save-remix" ${R.savedId ? 'disabled' : ''}>${R.savedId ? '♥ Saved to board' : '♡ Save this look'}</button></div>
          <p class="small">Lock <span aria-hidden="true">🔒</span> the pieces you love, then shuffle the rest.</p>
        </div>
        <div class="result" aria-live="polite">
          <div class="result-board"><span class="tape" aria-hidden="true"></span>
            <div class="collage static">${items.map(i => tile(i)).join('')}</div>
            <div class="row"><span class="sticker">${esc(MOODS[R.mood].label)}</span><span class="badge">${esc(fLabel)}</span>${swatches([...new Set(items.map(i => i.color))])}</div>
            <p class="meta"><strong>${money(total(items))}</strong> est. total${ownedCount(items) ? ` · ${money(total(items.filter(i => !isOwned(i))))} left to buy` : ''}</p>
            ${ownedLine(items)}
            <div class="note"><p class="hand">why it works</p><p>${esc(whyFor(items))}</p></div>
          </div>
          <ul class="slots">${roles.map(r => { const it = byId[R.slots[r]], lock = !!R.locks[r]; return `<li class="${lock ? 'locked' : ''}">
              ${tile(it)}
              <div class="slot-info"><span class="role">${ROLE_LABEL[r]}</span><strong>${esc(it.name)}</strong><span class="meta">${esc(storeName(it.store))} · ${priceText(it)}</span>${shopBtn(it, 'link')}</div>
              <div class="slot-btns">
                <button class="icon ${lock ? 'on' : ''}" data-act="lock" data-value="${r}" aria-pressed="${lock}" aria-label="${lock ? 'Unlock' : 'Lock'} ${ROLE_LABEL[r]}">${lock ? '🔒' : '🔓'}</button>
                <button class="icon" data-act="swap" data-value="${r}" aria-label="Swap ${ROLE_LABEL[r]}" ${lock ? 'disabled' : ''}>⟳</button>
              </div></li>`; }).join('')}</ul>
        </div>
      </div></section>`;
  }

  function viewSaved() {
    const looks = S.saved.map(getLook).filter(Boolean);
    const recent = S.recent.map(getLook).filter(o => o && !isSaved(o.id)).slice(0, 4);
    return `<section><div class="sec-head"><h1>Saved Board <span aria-hidden="true">♡</span></h1><p class="hand">${looks.length} look${looks.length === 1 ? '' : 's'} pinned</p></div>
      ${looks.length ? grid(looks, 'board') : empty('♡', 'Nothing pinned yet', 'Tap the heart on any look to pin it to this board.', '<a class="btn primary" href="#browse">Browse looks</a>')}
      </section>
      ${recent.length ? `<section><h2>Recently viewed</h2>${grid(recent)}</section>` : ''}`;
  }

  function viewOwned() {
    const mine = ITEMS.filter(isOwned);
    const close = OUTFITS.map(o => [ownedCount(lookItems(o)) / (lookItems(o).length || 1), o]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 4).map(x => x[1]);
    return `<section><div class="sec-head"><h1>My Closet <span aria-hidden="true">✓</span></h1><p class="hand">${mine.length} piece${mine.length === 1 ? '' : 's'} owned</p></div>
      ${mine.length ? `<div class="grid pieces">${mine.map(i => itemCard(i, true)).join('')}</div>` : empty('👗', 'Your closet is empty', 'Mark pieces with “I own this” and they will show up here.', '')}
      <p class="center"><button class="btn" data-act="add-owned">+ Add pieces I own</button></p></section>
      ${close.length ? `<section><h2>Looks that use your closet</h2>${grid(close)}</section>` : ''}`;
  }

  function viewDna() {
    const sw = keys => `<div class="palette">${keys.map(k => `<span><i style="background:${PALETTE[k].hex}"></i>${esc(PALETTE[k].name)}</span>`).join('')}</div>`;
    const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
    return `<section class="dna"><div class="sec-head"><h1>Style DNA <span aria-hidden="true">✦</span></h1><p class="hand">the logic behind every look</p></div>
      <div class="dna-grid">
        <article class="card tilt-l"><span class="tape" aria-hidden="true"></span><h2>The vibe</h2><p>Cute Gen Z office: elevated, feminine, polished but youthful. A little preppy, a little romantic, sometimes sporty, occasionally office-baddie-lite. <strong>Cute first, professional second</strong> — and always office-appropriate.</p></article>
        <article class="card"><h2>Bright Winter palette</h2><p>Clear, cool, high-contrast color. Black and optic white are the base; saturated jewel tones and icy pastels are the accents.</p>${sw(Object.keys(PALETTE).filter(k => PALETTE[k].family !== 'metal'))}<p class="small">Skipped on purpose: camel, mustard, rust, warm beige, peach, olive, muddy taupe.</p></article>
        <article class="card"><h2>Metals</h2>${sw(['gold', 'white-gold', 'rose-gold'])}${list(['<strong>Polished gold</strong> with black, navy, berry and emerald', '<strong>White gold</strong> with crisp high-contrast and icy blue looks', '<strong>Rose gold</strong> with pink and berry looks', 'Always bright and polished, never brassy or antique'])}</article>
        <article class="card tilt-r"><h2>Shapes that love you back</h2><p>Petite + curvy means proportion is everything.</p>${list(['Fitted scoop, V and wrap necklines', 'High-waisted everything: flares, straight jeans, tailored trousers', 'Short hems: skorts, pleated minis, fit-and-flare dresses (tights in winter)', 'Cropped cardigans and jackets that end at the waist', 'Mary Janes, sleek flats, ankle boots, pink Docs'])}</article>
        <article class="card"><h2>Comfort-smart construction</h2><p>“Lower-belly-friendly” here means pieces that feel smoothing and easy: structured high rises, wrap and ruched fronts, A-line skorts, thicker fabrics, flares, and layers that mark the upper waist.</p></article>
        <article class="card note"><p class="hand">not for me</p>${list(['Long and maxi skirts', 'Chunky loafers', 'Boxy, shapeless or matronly officewear', 'Stiff “HR manager” styling', 'Beige capsule-wardrobe minimalism'])}</article>
        <article class="card"><h2>How Shuffle thinks</h2>${list(['Picks a real outfit formula (separates or a dress, plus shoes, bag, jewelry)', 'Keeps the mood and a compatible formality', 'Builds on neutrals + one accent family (pink with berry or lavender, blue with lavender)', 'Matches the metal to the colors', 'Adds tights and layers for cold moods, skips warm-weather pieces', 'Leans on your closet when “Use more of what I own” is on'])}</article>
      </div></section>`;
  }

  /* ---------------- outfit detail sheet ---------------- */
  const sheet = $('#sheet');
  let sheetId = null;
  function sheetHTML(o) {
    const items = lookItems(o), saved = isSaved(o.id), toBuy = items.filter(i => !isOwned(i));
    const byStore = {}; toBuy.forEach(i => { (byStore[i.store] = byStore[i.store] || []).push(i); });
    const f = FORMALITY[fIdx(o.formality)];
    return `<div class="sheet-head"><button class="icon close" data-act="close" aria-label="Close">✕</button>
        <p class="hand">${esc(o.moods.map(m => (MOODS[m] || {}).label).filter(Boolean).join(' · ') || 'your remix')}</p>
        <h2 id="sheet-title">${esc(o.name)}</h2><p class="vibe">${esc(o.vibe || '')}</p></div>
      <div class="sheet-grid">
        <div class="sheet-board"><span class="tape" aria-hidden="true"></span><div class="collage static large">${items.map(i => tile(i)).join('')}</div>
          <div class="row">${swatches(storyOf(o))}</div>
          <div class="badges"><span class="badge b-pink">${esc(f.label)}</span>${(o.season || []).map(s => `<span class="badge">${esc(s)}</span>`).join('')}${(o.tags || []).map(t => `<span class="badge">#${esc(t)}</span>`).join('')}</div>
        </div>
        <div>
          <div class="btns">
            <button class="btn ${saved ? 'on' : ''}" data-act="save" data-id="${o.id}" aria-pressed="${saved}">${saved ? '♥ Saved' : '♡ Save Look'}</button>
            <button class="btn" data-act="remix" data-id="${o.id}">⟳ Remix Look</button>
            <button class="btn primary" data-act="scroll-shop">Shop Full Look</button>
          </div>
          <h3>Why it works</h3><p>${esc(o.why || whyFor(items))}</p>
          ${o.stylistNote ? `<div class="note"><span class="clip" aria-hidden="true">📎</span><p class="hand">stylist note</p><p>${esc(o.stylistNote)}</p></div>` : ''}
          <p class="meta"><strong>${money(total(items))}</strong> est. total${ownedCount(items) ? ` · ${money(total(toBuy))} left to buy` : ''}</p>
          ${ownedLine(items)}
        </div>
      </div>
      <div class="sec-head"><h3>The pieces</h3>${toBuy.length ? `<button class="btn sm" data-act="own-all" data-id="${o.id}">Mark all owned</button>` : ''}</div>
      <ul class="pieces-list">${items.map(it => `<li>${tile(it)}
          <div class="pl-info"><strong>${esc(it.name)}</strong>
            <span class="meta"><i class="dot" style="background:${color(it.color).hex}"></i>${esc(color(it.color).name)} · ${esc(CATEGORIES[it.category] || it.category)} · ${esc(storeName(it.store))}</span>
            <div class="badges">${fitBadges(it, ['petite', 'belly'])}${isOwned(it) ? '<span class="badge b-own">In your closet</span>' : ''}</div>
            ${it.notes ? `<span class="small">${esc(it.notes)}</span>` : ''}
          </div>
          <div class="pl-act"><span class="price">${priceText(it)}</span>${shopBtn(it)}${ownBtn(it)}</div></li>`).join('')}</ul>
      <div class="shoplist" id="shoplist"><h3>Shopping list <span aria-hidden="true">🛍</span></h3>
        ${toBuy.length ? Object.keys(byStore).map(k => `<div class="store-group"><p class="store-head"><strong>${esc(storeName(k))}</strong><span>${money(total(byStore[k]))}</span></p>
            ${byStore[k].map(i => `<p class="store-row"><span>${esc(i.name)} · ${priceText(i)}</span>${shopBtn(i)}</p>`).join('')}</div>`).join('') + `<p class="meta"><strong>${money(total(toBuy))}</strong> to complete this look</p>`
          : '<p>You own every piece in this look. Go get dressed! ✦</p>'}
      </div>`;
  }
  function openLook(id, toShop) {
    const o = getLook(id); if (!o) return;
    sheetId = id;
    S.recent = [id].concat(S.recent.filter(x => x !== id)).slice(0, 8); persist();
    sheet.innerHTML = sheetHTML(o);
    if (!sheet.open) { if (sheet.showModal) sheet.showModal(); else sheet.setAttribute('open', ''); }
    sheet.scrollTop = 0;
    if (toShop) setTimeout(() => { const el = $('#shoplist'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  }
  function closeSheet() { sheetId = null; if (sheet.open) { if (sheet.close) sheet.close(); else sheet.removeAttribute('open'); } }
  sheet.addEventListener('close', () => { sheetId = null; render(true); });
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

  /* ---------------- render + routing ---------------- */
  const VIEWS = { home: viewHome, browse: viewBrowse, shuffle: viewShuffle, saved: viewSaved, owned: viewOwned, dna: viewDna };
  const route = () => { const h = location.hash.replace('#', ''); return VIEWS[h] ? h : 'home'; };
  let lastRoute = null;
  function render(keepScroll) {
    const r = route(), view = $('#view');
    const a = document.activeElement, d = a && a.dataset && a.dataset.act ? a.dataset : null;   // remember focus across re-render
    const focusSel = d ? `[data-act="${d.act}"]` + (d.id ? `[data-id="${d.id}"]` : '') + (d.value ? `[data-value="${d.value}"]` : '') + (d.group ? `[data-group="${d.group}"]` : '') : '';
    const inSheet = d && sheet.contains(a);
    setTimeout(() => { if (!focusSel) return; const el = (inSheet && sheet.open ? sheet : view).querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }, 0);
    view.innerHTML = VIEWS[r]();
    document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    document.title = { home: 'Soft Corporate Closet', browse: 'Browse', shuffle: 'Shuffle', saved: 'Saved', owned: 'My Closet', dna: 'Style DNA' }[r] + (r === 'home' ? '' : ' · Soft Corporate Closet');
    if (r !== lastRoute && !keepScroll) window.scrollTo(0, 0);
    lastRoute = r;
    if (sheetId && sheet.open) {
      const o = getLook(sheetId), y = sheet.scrollTop;
      if (o) { sheet.innerHTML = sheetHTML(o); sheet.scrollTop = y; } else closeSheet();
    }
  }
  const go = h => { if (route() === h) render(); else location.hash = h; };
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

  /* ---------------- actions ---------------- */
  const ACTIONS = {
    view: d => openLook(d.id),
    shop: d => openLook(d.id, true),
    close: () => closeSheet(),
    'scroll-shop': () => { const el = $('#shoplist'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    save: d => {
      if (isSaved(d.id)) {
        S.saved = S.saved.filter(x => x !== d.id);
        if (S.custom.some(o => o.id === d.id)) { S.custom = S.custom.filter(o => o.id !== d.id); S.recent = S.recent.filter(x => x !== d.id); if (R.savedId === d.id) R.savedId = ''; }
        toast('Removed from your saved board');
      } else { S.saved.unshift(d.id); toast('Pinned to your saved board ♡'); }
      persist(); render(true);
    },
    own: d => { const it = byId[d.id]; if (!it) return; S.owned[it.id] = !isOwned(it); persist(); toast(isOwned(it) ? 'Added to your closet ✓' : 'Removed from your closet'); render(true); },
    'own-all': d => { const o = getLook(d.id); if (!o) return; lookItems(o).forEach(i => { S.owned[i.id] = true; }); persist(); toast('All pieces added to your closet ✓'); render(true); },
    remix: d => { const o = getLook(d.id); if (!o) return; remixLook(o); closeSheet(); go('shuffle'); window.scrollTo(0, 0); },
    anchor: d => { const it = byId[d.id]; if (!it) return; anchorOn(it); go('shuffle'); },
    filter: d => { const a = sel(d.group).slice(), i = a.indexOf(d.value); if (i < 0) a.push(d.value); else a.splice(i, 1); S.filters[d.group] = a; persist(); render(true); },
    clear: () => { S.filters = {}; persist(); render(true); },
    mode: d => { S.mode = d.value; persist(); render(true); },
    'quick-mood': d => { S.filters = { mood: [d.value] }; S.mode = 'looks'; persist(); go('browse'); },
    quick: d => { S.filters = { [d.group]: [d.value] }; S.mode = 'looks'; persist(); go('browse'); },
    'add-owned': () => { S.filters = {}; S.mode = 'pieces'; persist(); go('browse'); },
    shuffle: () => { shuffleAll(); render(true); },
    swap: d => { swapOne(d.value); render(true); },
    lock: d => { R.locks[d.value] = !R.locks[d.value]; render(true); },
    'r-mood': d => { R.mood = d.value; R.from = ''; shuffleAll(); render(true); },
    'save-remix': () => {
      const ids = ROLES.map(r => R.slots[r]).filter(Boolean), items = ids.map(id => byId[id]);
      const id = 'remix-' + Date.now();
      S.custom.push({ id, name: (R.from ? R.from + ' Remix' : MOODS[R.mood].label + ' Remix'), moods: [R.mood], vibe: 'Your own shuffle.', itemIds: ids, colorStory: [...new Set(items.map(i => i.color))], formality: rFormality(), season: [], tags: ['remix'], why: whyFor(items), stylistNote: '', custom: true });
      S.saved.unshift(id); R.savedId = id; persist(); toast('Remix pinned to your saved board ♡'); render(true);
    }
  };
  const CHANGES = {
    'r-formality': v => { R.formality = v; shuffleAll(); render(true); },
    'r-owned': (v, el) => { S.preferOwned = el.checked; persist(); shuffleAll(); render(true); },
    'r-anchor': v => { if (v && byId[v]) anchorOn(byId[v]); else { R.locks = {}; shuffleAll(); } render(true); }
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.act]; if (fn) fn(el.dataset, el);
  });
  document.addEventListener('change', e => { const k = e.target.dataset && e.target.dataset.change; if (k && CHANGES[k]) CHANGES[k](e.target.value, e.target); });
  document.addEventListener('toggle', e => { if (e.target.classList && e.target.classList.contains('filters')) S.filtersOpen = e.target.open; }, true);
  window.addEventListener('hashchange', () => { closeSheet(); render(); });
  render();
})();
