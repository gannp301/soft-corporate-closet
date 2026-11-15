/* ============================================================
   Soft Corporate Closet — LOOK DATA

   LOOK FIELDS
   id           unique string
   name         display name
   moods        mood keys from MOODS in products.js (first = main mood)
   vibe         one-line description
   productIds   ids of real products from products.js (these are shoppable)
   suggestions  styling ideas that are NOT products: no link, no price.
                { type: 'tights' | 'boots' | 'shoes' | 'denim' | 'bag' | 'jewelry', label }
   formality    casual | polished | business | meeting
   tags         short style tags
   why          why the look works
   stylistNote  one tip
   isNew        true = show in "New Looks"
   ============================================================ */
window.SCC = window.SCC || {};

SCC.LOOKS = [
  { id: 'winter-kiss-office', name: 'Winter Kiss Office', moods: ['winter-kiss', 'cute-polished'], isNew: true,
    vibe: 'Icy blue knit, houndstooth mini, Mary Janes.',
    productIds: ['cider-skyblue-cardigan', 'cider-houndstooth-mini', 'shein-black-mary-jane'],
    suggestions: [
      { type: 'tights', label: 'Sheer or opaque soft-black tights' },
      { type: 'jewelry', label: 'Delicate white-gold huggies or a fine rose-gold chain' },
      { type: 'bag', label: 'Small soft-black shoulder bag' }
    ],
    formality: 'polished', tags: ['cardigan as top', 'houndstooth', 'tights + mini'],
    why: 'A cool blue knit over a houndstooth mini is soft on top and textured below. The houndstooth reads as a gentle gray rather than a hard block of black, which keeps the contrast moderate. The high rise marks your waist and the short hem keeps a petite frame long.',
    stylistNote: 'Button the cardigan and tuck the hem just inside the waistband. Tights and shoes in the same tone.' },

  { id: 'soft-corporate-navy', name: 'Soft Corporate Navy', moods: ['soft-corporate', 'cold'], isNew: true,
    vibe: 'Navy cable knit and long black flares.',
    productIds: ['cider-navy-cable-vneck', 'shein-black-flare-pants', 'shein-black-square-mary-jane'],
    suggestions: [
      { type: 'jewelry', label: 'Fine white-gold or rose-gold pendant necklace' },
      { type: 'bag', label: 'Cool burgundy shoulder bag' },
      { type: 'boots', label: 'Sleek black ankle boots on colder days' }
    ],
    formality: 'business', tags: ['v-neck knit', 'flare pants', 'tailored'],
    why: 'Navy with black is a low-contrast, deep pairing that suits Soft Winter better than black and white. The V-neck opens the neckline and high-waisted flares lengthen the leg.',
    stylistNote: 'Half-tuck the knit at the front so the high waistband shows.' },

  { id: 'office-baddie-lite', name: 'Office Baddie Lite', moods: ['baddie-lite', 'soft-corporate'], isNew: true,
    vibe: 'Burgundy wrap, black flares. Quietly confident.',
    productIds: ['shein-burgundy-wrap', 'shein-black-flare-pants'],
    suggestions: [
      { type: 'boots', label: 'Sleek black ankle boots with a slim heel' },
      { type: 'jewelry', label: 'Delicate gold layered necklace and small hoops' },
      { type: 'bag', label: 'Structured soft-black shoulder bag' }
    ],
    formality: 'business', tags: ['wrap top', 'flare pants', 'gold jewelry'],
    why: 'The side-tie wrap defines your waist and follows curves, and the flare balances it below. Cool burgundy with black is rich and deep without being stark.',
    stylistNote: 'Gold against burgundy. Keep the necklace inside the V of the wrap.' },

  { id: 'cold-office', name: 'Cold Office', moods: ['cold', 'cute-polished'],
    vibe: 'Burgundy knit, black mini, opaque tights.',
    productIds: ['shein-burgundy-notch-knit', 'cider-black-mini', 'shein-black-mary-jane'],
    suggestions: [
      { type: 'tights', label: 'Opaque soft-black or charcoal tights' },
      { type: 'jewelry', label: 'Small gold or rose-gold studs' },
      { type: 'bag', label: 'Charcoal or soft-black shoulder bag' }
    ],
    formality: 'polished', tags: ['knit', 'mini + tights', 'mary janes'],
    why: 'A long-sleeve knit and opaque tights keep you warm while the mini keeps it youthful. Skirt, tights and shoes in one dark tone make a single line under the burgundy.',
    stylistNote: 'Full tuck, and choose tights opaque enough for the office.' },

  { id: 'cute-and-polished', name: 'Cute & Polished', moods: ['cute-polished', 'soft-corporate'],
    vibe: 'Soft blue cardigan with tailored flares.',
    productIds: ['cider-skyblue-cardigan', 'shein-black-flare-pants', 'shein-black-square-mary-jane'],
    suggestions: [
      { type: 'jewelry', label: 'White-gold huggies and a fine chain' },
      { type: 'bag', label: 'Soft-white or cool-gray mini bag' }
    ],
    formality: 'business', tags: ['cardigan as top', 'flare pants', 'square-toe'],
    why: 'The cardigan worn as a top ends at the high waistband, so your waist stays defined. A light, cool color near your face with black grounding the lower half is polished and easy.',
    stylistNote: 'A soft-white or gray bag softens the jump from blue to black.' },

  { id: 'friday-casual', name: 'Friday Casual', moods: ['friday', 'cute-polished'],
    vibe: 'Navy knit, straight jeans, pink boots.',
    productIds: ['cider-navy-cable-vneck'],
    suggestions: [
      { type: 'denim', label: 'High-waisted straight-leg jeans in a mid or dark wash' },
      { type: 'shoes', label: 'Pink Dr. Martens' },
      { type: 'jewelry', label: 'Fine rose-gold necklace' },
      { type: 'bag', label: 'Small soft-white crossbody' }
    ],
    formality: 'casual', tags: ['denim day', 'pink docs', 'v-neck knit'],
    why: 'Navy and denim are a cool, low-contrast base, so the pink boots become the one soft accent. A front tuck into high-waisted straight jeans keeps your shape.',
    stylistNote: 'Cuff the jeans once so the boots show. Rose gold picks up the pink.' }
];
