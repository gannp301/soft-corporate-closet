# Soft Corporate Closet

A fashion discovery and **shop-the-look** app for cute, polished office outfits: fitted, feminine, petite-friendly, and styled for a **Soft Winter** palette. Static site, no build step, no backend. Saved looks and pieces live in your browser (`localStorage`).

## Features

- **Explore** – editorial feed: New Looks, feature stories and a Soft Winter Workwear rail.
- **Shop Looks** – large look cards, a Looks / Pieces switch, and a compact filter drawer (Store, Category, Color, Occasion).
- **Look details** – product photos, itemized reference prices, exact retailer links, Soft Winter and fit notes, stylist note, styling suggestions, Save Look, Remix Similar Look.
- **Shuffle** – pick an Occasion, a Vibe and an optional color, then **Style My Outfit**. Builds top + bottom + shoes from verified products only, never mixes patterns or off-occasion pieces, and cycles through every valid outfit before repeating one. Lock a piece on the result and shuffle the rest.
- **Saved** – favorite looks, pieces and saved remixes.
- **Style Preferences** – a short profile of the Soft Winter and fit rules, applied automatically (button at the top right).

Only real, approved products are shoppable. Tights, boots, bags, denim and jewelry appear as **styling suggestions** with no price or link. If a product has no known price, looks show a **known-items subtotal**, never a full total.

## Run locally

Open `index.html` in a browser, or:

```
python3 -m http.server 8000
```

## Deploy with GitHub Pages

Repo **Settings → Pages → Deploy from a branch**, pick the branch and `/ (root)`, Save. The site appears at `https://<username>.github.io/soft-corporate-closet/`. All paths are relative.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page shell and navigation |
| `styles.css` | All styling |
| `app.js` | Views, filters, saved state, shuffle engine |
| `data/products.js` | **Products**, retailers, Soft Winter palette, occasions, vibes, color groups, collections |
| `data/looks.js` | **Looks** |

Saved state is stored separately from this data, under the `scc.v1` localStorage key.

## Editing data

Field descriptions are in the comment at the top of each data file.

**Product photos** – the four Cider products link to Cider's own image host. The five SHEIN products still need photos (SHEIN blocks automated retrieval). To add one, set `imageUrl` (and optionally `imageUrl2`) on a product to the retailer's image URL, or save the photo into `assets/` and use `'assets/file.jpg'`. Empty or broken images show a neutral "Product image pending" placeholder.

**Prices** – `price` is a reference price. Use `null` for "Check price"; never guess.

**Sizes** – add only sizes you have verified, e.g. `sizes: ['S', 'M']`. Empty shows "see retailer".

**Add a product** – copy an entry in `SCC.PRODUCTS`, give it a unique `id`, and use the exact retailer `url`. `category` must be `tops`, `bottoms` or `shoes` for Shuffle to use it, and `occasions` lists where it is appropriate.

**Add a store** – add one line to `SCC.RETAILERS`, then use that key as `retailer`.

**Add a look** – copy an entry in `SCC.LOOKS`, list product ids in `productIds`, and set `occasions` and `vibe`. Put non-product ideas in `suggestions`. `collection` groups looks into a seasonal edit such as Winter Kiss Office.

## Coming later

A beauty section. Not included yet.
