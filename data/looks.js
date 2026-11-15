/* ============================================================
   Soft Corporate Closet — LOOK DATA

   LOOK FIELDS
   id           unique string
   name         display name
   style        key from STYLES in products.js (the look's category)
   occasions    keys from OCCASIONS (first = main occasion)
   vibe         key from VIBES
   blurb        one-line description
   productIds   ids of real products from products.js, in display order
                (the first four photos make the look's collage)
   suggestions  optional styling ideas that are NOT products: no link, no price.
                { type, label }
   stylistNote  one short tip
   isNew        true = show in "New this week"
   ============================================================ */
window.SCC = window.SCC || {};

SCC.LOOKS = [
  /* ---------- Winter Kiss Office ---------- */
  { id: 'winter-kiss-office', name: 'Winter Kiss Office', style: 'winter-kiss', occasions: ['everyday', 'dressy'], vibe: 'cute', isNew: true,
    blurb: 'Icy blue knit, houndstooth mini, Mary Janes.',
    productIds: ['cider-skyblue-cardigan', 'cider-houndstooth-mini', 'cider-black-mary-jane', 'cider-silver-tulip-necklace', 'cider-black-tights'],
    stylistNote: 'Button the cardigan and tuck the hem just inside the waistband. Tights and shoes in the same tone.' },
  { id: 'icy-pink-pleats', name: 'Icy Pink Pleats', style: 'winter-kiss', occasions: ['everyday', 'friday'], vibe: 'cute', isNew: true,
    blurb: 'Blush tee, navy pleats, pink Mary Janes.',
    productIds: ['cider-pink-round-tee', 'cider-navy-pleated-mini', 'cider-pink-mary-jane', 'cider-rosegold-wing-necklace', 'cider-black-tights'],
    stylistNote: 'Pink at the top and the toe, navy and black in between. Rose gold ties it together.' },

  /* ---------- Soft Corporate ---------- */
  { id: 'soft-corporate-navy', name: 'Soft Corporate Navy', style: 'soft-corporate', occasions: ['everyday'], vibe: 'cozy', isNew: true,
    blurb: 'Striped navy knit with belted navy trousers.',
    productIds: ['cider-navy-cable-vneck', 'cider-navy-belted-trousers', 'cider-black-bow-flats', 'cider-gold-heart-necklace'],
    stylistNote: 'Half-tuck the knit at the front so the belt shows. The stripe is the only statement.' },
  { id: 'dusty-blue-and-gray', name: 'Dusty Blue & Gray', style: 'soft-corporate', occasions: ['everyday', 'meeting'], vibe: 'cozy',
    blurb: 'Shawl-collar knit and soft gray trousers.',
    productIds: ['cider-blue-shawl-sweater', 'cider-gray-belted-trousers', 'cider-black-mary-jane', 'cider-silver-tulip-necklace'],
    stylistNote: 'Low contrast head to toe. Let the shawl collar be the neckline detail.' },

  /* ---------- Office Baddie Lite ---------- */
  { id: 'office-baddie-lite', name: 'Office Baddie Lite', style: 'baddie-lite', occasions: ['meeting', 'dressy'], vibe: 'sleek', isNew: true,
    blurb: 'Wine ruched V-neck and sharp black pants.',
    productIds: ['cider-wine-vneck-ruched', 'cider-black-petite-pants', 'cider-black-bow-flats', 'cider-gold-heart-hoops', 'cider-burgundy-bag'],
    suggestions: [{ type: 'boots', label: 'Sleek black ankle boots with a slim heel as a shoe swap' }],
    stylistNote: 'Gold against wine. Full tuck so the ruching ends at your waist.' },
  { id: 'wine-knit-dress', name: 'The Wine Knit Dress', style: 'baddie-lite', occasions: ['dressy', 'meeting'], vibe: 'sleek',
    blurb: 'One fitted knit dress, tights, done.',
    productIds: ['cider-wine-knit-dress', 'cider-burgundy-mary-jane', 'cider-gold-heart-necklace', 'cider-burgundy-bag', 'cider-black-tights'],
    stylistNote: 'Opaque tights make the hem office-ready. Shoes in the same wine lengthen the line.' },

  /* ---------- Cold Office ---------- */
  { id: 'cold-office', name: 'Cold Office', style: 'cold', occasions: ['everyday'], vibe: 'cozy',
    blurb: 'Wine sweater, black mini, opaque tights.',
    productIds: ['cider-wine-shawl-sweater', 'cider-black-mini', 'cider-black-mary-jane', 'cider-burgundy-bag', 'cider-black-tights'],
    stylistNote: 'Skirt, tights and shoes in one dark tone make a single line under the sweater.' },
  { id: 'gray-on-gray', name: 'Gray on Gray', style: 'cold', occasions: ['everyday', 'friday'], vibe: 'cozy', isNew: true,
    blurb: 'Ruched gray knit over soft flare pants.',
    productIds: ['cider-gray-vneck-ruched', 'cider-gray-flare-knit-pants', 'cider-black-bow-flats', 'cider-silver-tulip-necklace'],
    stylistNote: 'Tonal gray feels like loungewear and reads as tailored. The V-neck keeps it from looking heavy.' },

  /* ---------- Cute & Polished ---------- */
  { id: 'cute-and-polished', name: 'Cute & Polished', style: 'cute-polished', occasions: ['everyday', 'dressy'], vibe: 'cute',
    blurb: 'Sky blue cardigan with a belted black skort.',
    productIds: ['cider-skyblue-cardigan', 'cider-black-belted-skort', 'cider-black-bow-flats', 'cider-rosegold-wing-necklace', 'cider-black-tights'],
    stylistNote: 'The cardigan worn as a top ends right at the belt, so your waist stays defined.' },
  { id: 'cape-day', name: 'Cape Day', style: 'cute-polished', occasions: ['meeting', 'dressy'], vibe: 'cute', isNew: true,
    blurb: 'A wine cape dress that needs almost nothing else.',
    productIds: ['cider-wine-cape-dress', 'cider-burgundy-mary-jane', 'cider-gold-heart-hoops', 'cider-burgundy-bag', 'cider-black-tights'],
    stylistNote: 'The cape is the layer. Small hoops, tights, and you are dressed.' },
  { id: 'berry-pleats', name: 'Berry Pleats', style: 'cute-polished', occasions: ['everyday', 'friday'], vibe: 'cute',
    blurb: 'Navy scoop tee tucked into a wine pleated mini.',
    productIds: ['cider-navy-scoop-tee', 'cider-wine-pleated-mini', 'cider-burgundy-mary-jane', 'cider-gold-heart-necklace', 'cider-black-tights'],
    stylistNote: 'Navy and wine are both deep and cool, so the pairing looks rich rather than loud.' },

  /* ---------- Friday Casual ---------- */
  { id: 'friday-casual', name: 'Friday Casual', style: 'friday', occasions: ['friday'], vibe: 'cute',
    blurb: 'Striped knit, straight jeans, pink sneakers.',
    productIds: ['cider-navy-cable-vneck', 'cider-straight-jeans', 'cider-pink-satin-sneakers', 'cider-rosegold-wing-necklace'],
    suggestions: [{ type: 'shoes', label: 'Pink Dr. Martens as a shoe swap' }],
    stylistNote: 'Front-tuck the knit and cuff the jeans once so the shoes show.' },
  { id: 'pink-tee-flares', name: 'Pink Tee & Flares', style: 'friday', occasions: ['friday'], vibe: 'cute', isNew: true,
    blurb: 'Icy pink V-neck with high-waisted flare jeans.',
    productIds: ['cider-pink-vneck-tee', 'cider-flare-jeans', 'cider-pink-mary-jane', 'cider-rosegold-wing-necklace'],
    stylistNote: 'Tuck the tee fully. A flare this strong wants a fitted top.' },
  { id: 'denim-dress-friday', name: 'Denim Dress Friday', style: 'friday', occasions: ['friday', 'everyday'], vibe: 'cute',
    blurb: 'Dark denim mini dress and satin sneakers.',
    productIds: ['cider-navy-denim-dress', 'cider-pink-satin-sneakers', 'cider-burgundy-bag', 'cider-rosegold-wing-necklace', 'cider-black-tights'],
    stylistNote: 'Swap the sneakers for Mary Janes and it works Monday to Thursday too.' }
];
