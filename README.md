# Soft Corporate Closet 🎀

A personal **shop-the-look** fashion board for cute Gen Z office outfits: fitted, feminine, petite- and curve-friendly, built around a **Bright Winter** palette. Static site, no build step, no backend. Personal state lives in your browser (`localStorage`).

## Features

- **Shop the Look** – outfit cards with pieces, color story, tags, estimated total, store mix, and Save / View / Shop / Remix.
- **Outfit detail** – why it works, stylist note, every piece with store, price, tags and shop link, plus a per-store shopping list.
- **Shuffle / Remix** – a real outfit generator: keeps the mood and a compatible formality, matches colors and metals, adds tights/layers for cold moods, lets you lock pieces, build around one item (e.g. the pink Docs) and "use more of what I own".
- **Browse + filters** – by store, category, mood, color, formality, fit/style, saved/owned; for looks or individual pieces.
- **Saved + Owned** – hearts, "I own this" toggles, "3 of 5 pieces already in your closet", recently viewed, saved remixes.
- **Style DNA** – the fashion logic behind the recommendations.

## Run locally

Open `index.html` in a browser. Or serve the folder:

```
python3 -m http.server 8000
```

then visit <http://localhost:8000>.

## Deploy with GitHub Pages

1. Merge/push this code to your default branch (e.g. `main`).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Pick the branch and `/ (root)`, then **Save**.
4. The site appears at `https://<username>.github.io/soft-corporate-closet/` after a minute. All paths are relative, so no extra config is needed.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page shell and navigation |
| `styles.css` | All styling |
| `app.js` | Views, filters, saving, shuffle engine, garment illustrations |
| `data/items.js` | **Items**, stores, palette, moods, formality levels, fit tags |
| `data/outfits.js` | **Outfits** |

## Editing data

Field descriptions are in the comment at the top of each data file.

**Shopping links** – every item has a `url: ''` line. Paste the real product link there. While it is empty, the button falls back to a store search for the item name ("Find at …"); stores without a search URL show "No link yet".

**Add a store** – add one line to `SCC.STORES` in `data/items.js`:

```js
target: { name: 'Target', search: 'https://www.target.com/s?searchTerm=' },
```

Then use `store: 'target'` on items. It appears in the filters automatically.

**Add an item** – copy an existing entry in `SCC.ITEMS`, give it a unique `id`, and edit the fields. `shape` picks the illustration (list in the file header); `color` must be a key from `SCC.PALETTE`. To use a real photo, set `image` to a file in `assets/` (e.g. `'assets/pink-cardigan.jpg'`) or an image URL.

**Add an outfit** – copy an entry in `SCC.OUTFITS` (`data/outfits.js`) and list the item ids in `itemIds`. Set `featured: true` to show it on Home.

**Mark something owned** – toggle it in the app, or set `owned: true` on the item to make it the default.

## Notes

- Saved looks, owned pieces and filters are stored per browser/device under the `scc.v1` localStorage key.
- Starter prices are estimates and starter links are store searches, not specific products.

## Coming later

A beauty/makeup section. Moods, palette and data files are kept separate from the UI so it can be added alongside the clothing data without a rebuild.
