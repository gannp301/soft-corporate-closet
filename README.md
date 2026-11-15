# Soft Corporate Closet

A fashion discovery and **shop-the-look** app for cute, polished office outfits: fitted, feminine, petite-friendly, and styled for a **Soft Winter** palette. Static site, no build step, no backend. Saved looks and pieces live in your browser (`localStorage`).

## Features

- **Explore** – editorial feed: new looks, a section for each of the six styles, and rails of pieces.
- **Shop Looks** – look cards built from product photos, a Looks / Pieces switch, style chips, and a small filter drawer (Category, Color).
- **Look details** – photo gallery, itemized reference prices, retailer links, sizes, stylist note, Save Look, Remix Similar Look.
- **Shuffle** – pick an Occasion, a Vibe and an optional color, then **Style My Outfit**. Builds separates or a dress plus shoes and matching accessories, never mixes patterns or off-occasion pieces, and does not repeat an outfit while others are available. Lock a piece and shuffle the rest.
- **Saved** – favorite looks, pieces and saved remixes.
- **Style Preferences** – a short profile of the Soft Winter and fit rules, applied automatically.

**Catalog rule:** every product is a real retailer listing with a photo, a link and a reference price. A product without a photo is never shown, and a look is hidden if any of its products is missing. Ideas that are not products (for example pink Dr. Martens) are labelled "Styling ideas (not products)" and have no price or link.

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
| `data/products.js` | **Products**, retailers, Soft Winter palette, styles, occasions, vibes, color groups |
| `data/looks.js` | **Looks** |

Saved state is stored separately from this data, under the `scc.v1` localStorage key.

## Editing data

Field descriptions are in the comment at the top of each data file.

**Products** (`SCC.PRODUCTS`) – copy an entry, give it a unique `id`, and fill in the real `name`, `url`, `imageUrl`, `price` and `sizes` from the retailer page. `imageUrl` is required. `category` is `tops`, `bottoms`, `dresses`, `shoes` or `accessories` (accessories also need `sub`: `tights`, `bag` or `jewelry`). `occasions` and `vibes` tell Shuffle when to use it. Use `price: null` for "Check price"; never guess.

**Photos** – the current catalog links to Cider's image host, which also serves the smaller copies the app requests. You can instead save a photo into `assets/` and use `'assets/file.jpg'`.

**Looks** (`SCC.LOOKS`) – copy an entry, set `style` (one of the six in `SCC.STYLES`), and list product ids in `productIds`. The first four photos make the collage, so put the main pieces first. Each look should be complete: a top and bottom or a dress, plus shoes.

**Stores** – add one line to `SCC.RETAILERS`, then use that key as `retailer`. A Store filter appears automatically once more than one store is in the catalog.

Prices, sizes and stock were read from the retailer when the catalog was built and will drift.

## Coming later

A beauty section. Not included yet.
