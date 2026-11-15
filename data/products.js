/* ============================================================
   Soft Corporate Closet — PRODUCT DATA (real, approved products only)

   PRODUCT FIELDS
   id          unique string (used by looks.js)
   name        real product name
   retailer    key from RETAILERS below
   price       reference price in USD, or null = "Check price" (never guess)
   url         exact retailer product link
   imageUrl    >>> paste the retailer product photo URL (or 'assets/photo.jpg') here <<<
               '' shows a neutral "Product image pending" placeholder
   imageUrl2   optional second photo
   category    tops | bottoms | shoes  (key from CATEGORIES)
   color       key from PALETTE
   pattern     optional: true for stripes / houndstooth etc. (Shuffle avoids pattern-on-pattern)
   sizes       verified sizes only, e.g. ['S','M']. [] = "see retailer"
   tags        short style tags
   occasions   keys from OCCASIONS this piece suits (Shuffle never uses it outside them)
   vibes       keys from VIBES
   fit         fit traits used automatically by Shuffle: petite, curve, waist, fitted, feminine, winter
   fitNotes    fit guidance (petite 5'2.5", curvy)
   softWinter  { rating: 'excellent' | 'good' | 'neutral', note }
   stylistNote how to wear it

   Prices are reference prices, not live guarantees.
   Cider photos are linked from Cider's image host. SHEIN photos are still pending.
   ============================================================ */
window.SCC = window.SCC || {};

/* ---- RETAILERS: add a store by adding one line ---- */
SCC.RETAILERS = {
  cider: { name: 'Cider' },
  shein: { name: 'SHEIN' },
  amazon: { name: 'Amazon' }
};

/* ---- SOFT WINTER PALETTE (cool, softened, moderate contrast) ---- */
SCC.PALETTE = {
  'soft-navy':  { name: 'Soft navy',        hex: '#2c3655', family: 'navy' },
  'charcoal':   { name: 'Charcoal',         hex: '#4b4e58', family: 'neutral' },
  'soft-black': { name: 'Soft black',       hex: '#25242a', family: 'neutral' },
  'soft-white': { name: 'Soft white',       hex: '#f3f3f5', family: 'neutral' },
  'cool-gray':  { name: 'Cool gray',        hex: '#b6b9c4', family: 'neutral' },
  'icy-pink':   { name: 'Dusty icy pink',   hex: '#ead0d9', family: 'pink' },
  'cool-blush': { name: 'Cool blush',       hex: '#dcb6c4', family: 'pink' },
  'burgundy':   { name: 'Cool burgundy',    hex: '#6b2037', family: 'berry' },
  'berry':      { name: 'Muted berry',      hex: '#8b3f60', family: 'berry' },
  'icy-blue':   { name: 'Muted icy blue',   hex: '#c3d3e3', family: 'blue' },
  'sky-blue':   { name: 'Sky blue',         hex: '#a3c6e6', family: 'blue' },
  'lavender':   { name: 'Smoky lavender',   hex: '#b5adc9', family: 'lavender' }
};

/* ---- OCCASIONS and VIBES: the two styling dimensions used by Shuffle ---- */
SCC.OCCASIONS = {
  everyday: 'Everyday Office',
  meeting:  'Meeting Day',
  friday:   'Casual Friday',
  dressy:   'Dress It Up'
};
SCC.VIBES = {
  cute:  'Cute & Feminine',
  sleek: 'Sleek & Confident',
  cozy:  'Cozy & Polished'
};

/* ---- Shuffle color preferences: label + the palette keys each one covers ---- */
SCC.COLOR_GROUPS = {
  'navy':       { label: 'Navy',             colors: ['soft-navy'] },
  'pink-blue':  { label: 'Pink / Blue',      colors: ['icy-pink', 'cool-blush', 'icy-blue', 'sky-blue'] },
  'burgundy':   { label: 'Burgundy / Berry', colors: ['burgundy', 'berry'] },
  'black-gray': { label: 'Black / Gray',     colors: ['soft-black', 'charcoal', 'cool-gray'] }
};

/* ---- Seasonal editorial collections (not moods) ---- */
SCC.COLLECTIONS = {
  'winter-kiss': { label: 'Winter Kiss Office', kicker: 'Seasonal edit' }
};

SCC.CATEGORIES = { tops: 'Tops', bottoms: 'Bottoms', shoes: 'Shoes' };

SCC.PRODUCTS = [
  { id: 'cider-navy-cable-vneck',
    name: 'Cable Knit Stripe V-Neck Long Sleeve Top — Dark Navy',
    retailer: 'cider', price: 37.90,
    url: 'https://www.shopcider.com/product/detail?pid=115076423&style_id=2232447',
    imageUrl: 'https://img1.shopcider.com/product/1761910076000-KfBpYA.jpg', imageUrl2: '',
    category: 'tops', color: 'soft-navy', pattern: true, sizes: [],
    tags: ['cable knit', 'v-neck', 'stripe'],
    occasions: ['everyday', 'friday'],
    vibes: ['cute', 'cozy'],
    fit: ['feminine', 'winter'],
    fitNotes: 'V-neck opens up the neckline on a petite frame. Tuck or half-tuck into a high rise to keep your waist visible.',
    softWinter: { rating: 'good', note: 'Dark navy is a core Soft Winter neutral. The cream stripe adds contrast, though it is softer than black and white: keep everything else dark and quiet.' },
    stylistNote: 'The stripe is the statement: solid bottoms, one delicate necklace.' },

  { id: 'cider-skyblue-cardigan',
    name: 'Cable Knit Wool-Blend V-Neck Solid Button Cardigan — Sky Blue',
    retailer: 'cider', price: 12.87,
    url: 'https://www.shopcider.com/goods/cable-knit-v-neck-solid-button-cardigan-113809232',
    imageUrl: 'https://img1.shopcider.com/product/1728441831000-6ptTrh.jpg', imageUrl2: '',
    category: 'tops', color: 'sky-blue', sizes: [],
    tags: ['cardigan', 'cable knit', 'wool blend'],
    occasions: ['everyday', 'friday', 'dressy'],
    vibes: ['cute', 'cozy'],
    fit: ['feminine', 'winter'],
    fitNotes: 'Wear it buttoned as a top so it ends at the waistband. Leave the top button open for a soft V.',
    softWinter: { rating: 'good', note: 'Sky blue is a little clearer and brighter than the muted icy blue that suits Soft Winter best. It still works because it is cool: soften it with charcoal, soft navy or soft white, and keep stark contrast to a minimum.' },
    stylistNote: 'White-gold jewelry keeps the blue looking icy rather than bright.' },

  { id: 'cider-houndstooth-mini',
    name: 'Tweed High Rise Houndstooth Mini Skirt — Black',
    retailer: 'cider', price: null,
    url: 'https://www.shopcider.com/goods/tweed-high-rise-houndstooth-mini-skirt-114904090',
    imageUrl: 'https://img1.shopcider.com/product/1757320739000-mY3zZH.jpg', imageUrl2: '',
    category: 'bottoms', color: 'soft-black', pattern: true, sizes: [],
    tags: ['houndstooth', 'tweed', 'high rise', 'mini'],
    occasions: ['everyday', 'meeting', 'dressy'],
    vibes: ['cute', 'sleek'],
    fit: ['petite', 'waist', 'feminine', 'winter'],
    fitNotes: 'High rise marks the waist and a mini length keeps petite legs long. Tweed has structure, so it holds its shape. Add tights for the office.',
    softWinter: { rating: 'good', note: 'Houndstooth blends black and light into a soft gray effect from a distance, which is gentler than a solid block of black. Pair it with a soft top rather than stark white.' },
    stylistNote: 'One pattern at a time: keep the top solid and soft.' },

  { id: 'cider-black-mini',
    name: 'Solid Slit Mini Skirt — Black',
    retailer: 'cider', price: 12.90,
    url: 'https://www.shopcider.com/goods/solid-slit-mini-skirt-11',
    imageUrl: 'https://img1.shopcider.com/product/1670466663000-YD8pW5.jpg', imageUrl2: '',
    category: 'bottoms', color: 'soft-black', sizes: [],
    tags: ['mini', 'slit', 'solid'],
    occasions: ['everyday', 'friday', 'dressy'],
    vibes: ['sleek', 'cute'],
    fit: ['petite', 'feminine'],
    fitNotes: 'Short hem suits a petite frame. Opaque tights make the slit and the length office-appropriate.',
    softWinter: { rating: 'neutral', note: 'Black works as a grounding neutral here, worn away from the face. Tights in the same tone make one soft, continuous line.' },
    stylistNote: 'Tuck a fitted knit in fully so the waistband shows.' },

  { id: 'shein-burgundy-wrap',
    name: 'minisummer Slim-Fit Side-Tie Wrap V-Neck Blouse — Burgundy',
    retailer: 'shein', price: 12.36,
    url: 'https://us.shein.com/Women-Elegant-Fall-Winter-Wrap-V-Neck-Long-Sleeve-Top%2C-Side-Tie-Slim-Fitted-Blouse%2C-Office-Coffee-Daily-Outfit-p-581162810.html',
    imageUrl: '', imageUrl2: '',
    category: 'tops', color: 'burgundy', sizes: [],
    tags: ['wrap', 'side tie', 'v-neck', 'slim fit'],
    occasions: ['everyday', 'meeting', 'dressy'],
    vibes: ['sleek', 'cute'],
    fit: ['waist', 'curve', 'fitted', 'feminine'],
    fitNotes: 'Wrap construction with a side tie defines the waist and adjusts to curves. Slim fit, so it tucks cleanly into high-waisted bottoms.',
    softWinter: { rating: 'excellent', note: 'Cool burgundy is one of the most flattering Soft Winter colors: rich, deep and never harsh near the face.' },
    stylistNote: 'A delicate gold necklace inside the V. Tie the side knot at your natural waist.' },

  { id: 'shein-burgundy-notch-knit',
    name: 'Minimalist Notch V-Neck Long Sleeve Knit Top — Burgundy',
    retailer: 'shein', price: 17.59,
    url: 'https://us.shein.com/Fall-Minimalist-Casual-Notch-V-Neck-Solid-Long-Sleeve-Knit-Top-Christmas-Thanksgiving-Office-Burgundy-p-569588258.html',
    imageUrl: '', imageUrl2: '',
    category: 'tops', color: 'burgundy', sizes: [],
    tags: ['notch neck', 'knit', 'long sleeve'],
    occasions: ['everyday', 'friday', 'meeting'],
    vibes: ['cozy', 'sleek'],
    fit: ['feminine', 'winter'],
    fitNotes: 'The notch V gives a little neckline shape without going low. Tuck into a high-rise skirt or pants for waist definition.',
    softWinter: { rating: 'excellent', note: 'Cool burgundy again: a signature Soft Winter color that warms up a cold-office outfit without going warm-toned.' },
    stylistNote: 'Small gold or rose-gold studs and nothing else. The neckline is the detail.' },

  { id: 'shein-black-flare-pants',
    name: 'SHEIN Clasi High-Waisted Flare Dress Pants — Black',
    retailer: 'shein', price: 17.69,
    url: 'https://us.shein.com/goods-p-42036628.html',
    imageUrl: '', imageUrl2: '',
    category: 'bottoms', color: 'soft-black', sizes: [],
    tags: ['flare', 'high-waisted', 'dress pants'],
    occasions: ['everyday', 'meeting', 'friday', 'dressy'],
    vibes: ['sleek', 'cozy'],
    fit: ['waist', 'curve'],
    fitNotes: 'High waist plus a flare balances curves and lengthens the leg. At 5\'2.5", check the inseam on the retailer page; the hem should just skim the floor in your shoes.',
    softWinter: { rating: 'neutral', note: 'Black is a grounding neutral for Soft Winter. Worn on the bottom half it anchors softer colors up top.' },
    stylistNote: 'Fitted top, full tuck. A little height (Mary Jane or ankle boot) keeps the flare from pooling.' },

  { id: 'shein-black-mary-jane',
    name: 'CUCCOO DOLLMOD Round-Toe Mary Jane Flats — Black',
    retailer: 'shein', price: 17.10,
    url: 'https://us.shein.com/Women%27s-Black-Soft-Leather-Mary-Jane-Flats%2C-Round-Toe-Buckle-Slip-On-Shoes%2C-Daily-Commuting-Casual-And-Comfortable-Women%27s-Shoes-p-559177872.html',
    imageUrl: '', imageUrl2: '',
    category: 'shoes', color: 'soft-black', sizes: [],
    tags: ['mary jane', 'round toe', 'flat'],
    occasions: ['everyday', 'friday'],
    vibes: ['cute', 'cozy'],
    fit: ['feminine'],
    fitNotes: 'Round toe reads soft and sweet. Best with tights and a mini.',
    softWinter: { rating: 'neutral', note: 'A black shoe is a grounding neutral. With black tights it blends into one line.' },
    stylistNote: 'Match your tights to the shoe for a longer leg line.' },

  { id: 'shein-black-square-mary-jane',
    name: 'Square-Toe Instep-Strap Mary Jane Flats — Black',
    retailer: 'shein', price: 23.60,
    url: 'https://us.shein.com/Women-Mary-Jane-Flats%2C-Square-Toe%2C-Instep-Strap%2C-Easy-Wear%2C-Daily-Comfort-p-570574905.html',
    imageUrl: '', imageUrl2: '',
    category: 'shoes', color: 'soft-black', sizes: [],
    tags: ['mary jane', 'square toe', 'flat'],
    occasions: ['everyday', 'meeting', 'dressy'],
    vibes: ['sleek', 'cute'],
    fit: ['feminine'],
    fitNotes: 'The square toe is a little sharper and more tailored than the round-toe pair. Good under flare pants.',
    softWinter: { rating: 'neutral', note: 'A black shoe is a grounding neutral that disappears under a black flare hem.' },
    stylistNote: 'The more polished of the two Mary Janes. Reach for these on meeting days.' }
];
