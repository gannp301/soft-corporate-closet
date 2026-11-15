/* ============================================================
   Soft Corporate Closet — OUTFIT DATA

   OUTFIT FIELDS
   id          unique string
   name        display name
   moods       mood keys from MOODS in items.js (first one is the main mood)
   vibe        one-line mood description
   itemIds     ids of pieces from items.js
   colorStory  palette keys from PALETTE in items.js
   formality   casual | polished | business | meeting
   season      seasons it works in
   tags        short style tags
   why         "why this works" paragraph
   stylistNote sticky-note tip
   featured    true = show on Home
   ============================================================ */
window.SCC = window.SCC || {};

SCC.OUTFITS = [
  { id: 'winter-kiss-office', name: 'Winter Kiss Office', moods: ['winter-kiss', 'icy-girly'], featured: true,
    vibe: 'Icy pink, black tights, pink boots. Bunny-pretty but make it payroll.',
    itemIds: ['top-icypink-cropped-cardigan', 'bot-black-skort', 'acc-black-tights', 'shoe-pink-docs', 'bag-black-shoulder', 'acc-rosegold-necklace'],
    colorStory: ['icy-pink', 'black', 'pink', 'rose-gold'], formality: 'polished', season: ['fall', 'winter'],
    tags: ['icy pink', 'tights + mini', 'pink docs', 'high contrast'],
    why: 'Pale icy pink against true black is a classic Bright Winter contrast. The cropped cardigan ends at your waist, the A-line skort is structured and comfortable, and black tights make one long line into the boots.',
    stylistNote: 'Button the cardigan all the way and let the rose-gold necklace sit just above the top button.' },

  { id: 'bright-winter-meeting', name: 'Bright Winter Meeting Day', moods: ['meeting', 'soft-corporate'], featured: true,
    vibe: 'One hit of cobalt, everything else sharp.',
    itemIds: ['top-cobalt-fitted', 'bot-charcoal-trousers', 'shoe-black-ankle-boots', 'bag-black-shoulder', 'acc-whitegold-huggies'],
    colorStory: ['cobalt', 'charcoal', 'black', 'white-gold'], formality: 'meeting', season: ['spring', 'summer', 'fall', 'winter'],
    tags: ['cobalt', 'tailored', 'presentation-ready'],
    why: 'Saturated cobalt near your face does the talking; charcoal trousers with a structured high rise keep it serious without going stiff. White gold keeps the whole look crisp.',
    stylistNote: 'Full tuck, then pull a tiny bit of fabric loose at the waistband so it skims instead of clings.' },

  { id: 'soft-corporate-berry', name: 'Soft Corporate Berry', moods: ['soft-corporate', 'meeting'], featured: true,
    vibe: 'Romantic wrap top, long-leg flares.',
    itemIds: ['top-berry-wrap', 'bot-black-flare-pants', 'shoe-black-heel', 'bag-black-shoulder', 'acc-layered-necklace'],
    colorStory: ['berry', 'black', 'gold'], formality: 'business', season: ['spring', 'summer', 'fall', 'winter'],
    tags: ['wrap top', 'flare pants', 'gold jewelry'],
    why: 'The wrap defines your upper waist and drapes softly below it, while high-waist flares over a heel lengthen a petite frame. Polished gold warms up cool berry beautifully.',
    stylistNote: 'Layered necklace inside the V of the wrap. Hem the flares to graze the floor in your heels.' },

  { id: 'friday-cute', name: 'Friday Cute', moods: ['friday', 'comfy'], featured: true,
    vibe: 'Navy, light denim and the pink boots.',
    itemIds: ['top-navy-longsleeve', 'bot-lightwash-straight', 'shoe-pink-docs', 'bag-white-mini', 'acc-rosegold-necklace'],
    colorStory: ['navy', 'light-denim', 'pink', 'white'], formality: 'casual', season: ['spring', 'fall', 'winter'],
    tags: ['denim day', 'pink docs', 'scoop neck'],
    why: 'True navy and light wash are a clean cool-toned base, so the pink boots read as the intentional pop. A fitted top tucked into high-waist straight jeans keeps your waist visible.',
    stylistNote: 'Cuff the jeans once so the boots get their moment.' },

  { id: 'office-baddie-lite', name: 'Office Baddie Lite', moods: ['baddie-lite', 'friday'], featured: true,
    vibe: 'Black scoop, dark flares, burgundy bag. Confident, still HR-safe.',
    itemIds: ['top-black-scoop', 'bot-dark-flare-jeans', 'shoe-black-heel', 'bag-burgundy-shoulder', 'acc-gold-hoops'],
    colorStory: ['black', 'dark-denim', 'burgundy', 'gold'], formality: 'polished', season: ['spring', 'summer', 'fall', 'winter'],
    tags: ['curvy flares', 'gold hoops', 'sleek'],
    why: 'A fitted scoop tee into curvy high-rise flares is your most flattering casual formula. Burgundy and polished gold add richness so the black looks deliberate, not basic.',
    stylistNote: 'Hoops + slicked-back hair. Skip the necklace and let the scoop neckline breathe.' },

  { id: 'icy-girly', name: 'Icy Girly', moods: ['icy-girly', 'winter-kiss'], featured: true,
    vibe: 'White knit, pleated navy, pale pink. Preppy snow-day energy.',
    itemIds: ['top-white-knit', 'out-icypink-cardigan', 'bot-navy-pleated-skirt', 'acc-black-tights', 'shoe-black-maryjanes', 'acc-whitegold-huggies'],
    colorStory: ['white', 'icy-pink', 'navy', 'black', 'white-gold'], formality: 'polished', season: ['fall', 'winter'],
    tags: ['pleated mini', 'mary janes', 'layered'],
    why: 'Optic white and icy pink up top, deep navy and black below: light-over-dark contrast that flatters Bright Winter coloring. The pleated skirt sits at the natural waist and swings away from the body.',
    stylistNote: 'Wear the cardigan open or draped on your shoulders. Tuck the knit fully.' },

  { id: 'cold-office', name: 'Cold Office', moods: ['cold', 'soft-corporate'], featured: true,
    vibe: 'For when the AC is personal.',
    itemIds: ['out-berry-cardigan', 'top-black-scoop', 'bot-black-trousers', 'shoe-black-ankle-boots', 'bag-burgundy-shoulder', 'acc-gold-hoops'],
    colorStory: ['berry', 'black', 'burgundy', 'gold'], formality: 'business', season: ['fall', 'winter'],
    tags: ['cozy', 'berry', 'column of black'],
    why: 'A column of black (tee + trousers + boots) is lengthening on a petite frame, and the fitted berry cardigan adds warmth in both senses. Cozy without losing your shape.',
    stylistNote: 'Button just the middle two buttons of the cardigan to mark your waist.' },

  { id: 'navy-darling', name: 'Navy Darling', moods: ['cute-polished', 'soft-corporate'], featured: true,
    vibe: 'One dress, fully dressed.',
    itemIds: ['dress-navy-fitflare', 'acc-black-tights', 'shoe-black-maryjanes', 'bag-burgundy-shoulder', 'acc-layered-necklace'],
    colorStory: ['navy', 'black', 'burgundy', 'gold'], formality: 'business', season: ['fall', 'winter', 'spring'],
    tags: ['fit-and-flare', 'tights', 'mary janes'],
    why: 'The fitted bodice and flared skirt define your waist and skim everything else. Navy with a burgundy bag and gold is rich, cool-toned and very put-together.',
    stylistNote: 'Opaque tights keep the short hem office-appropriate and extra cozy.' },

  { id: 'lavender-latte-run', name: 'Lavender Latte Run', moods: ['friday', 'cute-polished'],
    vibe: 'Sporty-feminine. Dress + sneakers + denim jacket.',
    itemIds: ['dress-lavender-short', 'out-cropped-denim', 'shoe-white-sneakers', 'bag-white-mini', 'acc-simple-bracelet'],
    colorStory: ['lavender', 'light-denim', 'white', 'white-gold'], formality: 'casual', season: ['spring', 'summer'],
    tags: ['spring', 'sneakers', 'cropped jacket'],
    why: 'Icy lavender with crisp white stays cool and fresh. The cropped jacket ends at the waist seam of the dress, so the fit-and-flare shape stays visible.',
    stylistNote: 'Push the jacket sleeves up a little to show the bracelet.' },

  { id: 'comfy-but-cute', name: 'Comfy but Cute', moods: ['comfy', 'friday'],
    vibe: 'Feels like loungewear, reads like you tried.',
    itemIds: ['top-charcoal-knit', 'bot-black-flare-pants', 'shoe-white-sneakers', 'bag-black-shoulder', 'acc-whitegold-huggies'],
    colorStory: ['charcoal', 'black', 'white', 'white-gold'], formality: 'casual', season: ['spring', 'summer', 'fall'],
    tags: ['stretchy', 'sneakers', 'easy'],
    why: 'Stretchy high-waist flares and a thicker fitted knit are comfortable all day. White sneakers and white gold add the crisp contrast.',
    stylistNote: 'French tuck the knit so the wide waistband shows.' },

  { id: 'berry-docs-day', name: 'Berry Docs Day', moods: ['winter-kiss', 'cute-polished'], featured: true,
    vibe: 'Short dress, tights, pink boots.',
    itemIds: ['dress-berry-longsleeve', 'acc-black-tights', 'shoe-pink-docs', 'bag-black-shoulder', 'acc-rosegold-necklace'],
    colorStory: ['berry', 'black', 'pink', 'rose-gold'], formality: 'polished', season: ['fall', 'winter'],
    tags: ['pink docs', 'berry', 'dress + tights'],
    why: 'Berry and pink are neighbors, so the boots look like part of the plan. The dress has a defined waist and an easy skirt; tights ground it for winter.',
    stylistNote: 'Rose gold is the bridge between the berry and the pink.' },

  { id: 'little-black-meeting', name: 'Little Black Meeting', moods: ['meeting', 'baddie-lite'],
    vibe: 'LBD with a cropped jacket. Closing deals, cutely.',
    itemIds: ['dress-black-fitflare', 'out-black-cropped-jacket', 'shoe-black-heel', 'bag-burgundy-shoulder', 'acc-gold-hoops'],
    colorStory: ['black', 'burgundy', 'gold'], formality: 'meeting', season: ['spring', 'summer', 'fall', 'winter'],
    tags: ['LBD', 'cropped jacket', 'heels'],
    why: 'All black is lengthening, and the cropped jacket hits at the waist seam so you keep your shape. Burgundy and gold stop it from feeling severe.',
    stylistNote: 'Add black tights when it is cold. Jacket off for after-work plans.' },

  { id: 'raspberry-skirt-moment', name: 'Raspberry Skirt Moment', moods: ['cute-polished', 'baddie-lite'],
    vibe: 'Ruched raspberry and a sharp little skirt.',
    itemIds: ['top-raspberry-ruched', 'bot-black-structured-skirt', 'acc-black-tights', 'shoe-black-ankle-boots', 'bag-black-shoulder', 'acc-layered-necklace'],
    colorStory: ['raspberry', 'black', 'gold'], formality: 'polished', season: ['fall', 'winter', 'spring'],
    tags: ['ruched', 'structured mini', 'ankle boots'],
    why: 'The ruched V-neck is smoothing and waist-defining, and the thicker A-line skirt holds its shape. Bright raspberry against black is high-contrast Bright Winter.',
    stylistNote: 'The layered necklace fills the V perfectly.' },

  { id: 'icy-blue-monday', name: 'Icy Blue Monday', moods: ['soft-corporate', 'icy-girly'],
    vibe: 'Soft, cool and suspiciously well-rested.',
    itemIds: ['top-icyblue-cardigan', 'bot-charcoal-trousers', 'shoe-black-maryjanes', 'bag-white-mini', 'acc-whitegold-huggies'],
    colorStory: ['icy-blue', 'charcoal', 'black', 'white', 'white-gold'], formality: 'business', season: ['fall', 'winter', 'spring'],
    tags: ['icy blue', 'cardigan as top', 'tailored'],
    why: 'Icy blue lights up your face and charcoal keeps it grounded. A fitted cardigan worn as a top ends right at the high waistband of the trousers.',
    stylistNote: 'Leave the top button open for a soft V neckline.' },

  { id: 'emerald-friday', name: 'Emerald Friday', moods: ['friday', 'comfy'],
    vibe: 'Jewel-tone henley and good jeans.',
    itemIds: ['top-emerald-henley', 'bot-dark-flare-jeans', 'shoe-black-ankle-boots', 'bag-black-shoulder', 'acc-gold-hoops'],
    colorStory: ['emerald', 'dark-denim', 'black', 'gold'], formality: 'casual', season: ['fall', 'winter', 'spring'],
    tags: ['emerald', 'curvy flares', 'gold hoops'],
    why: 'Emerald is one of your strongest colors and looks rich with dark denim and polished gold. Flares over a heeled boot make legs look endless.',
    stylistNote: 'Undo one henley button. Tuck all the way in.' },

  { id: 'warm-day-polished', name: 'Warm Day Polished', moods: ['cute-polished', 'friday'],
    vibe: 'Tailored shorts, bow flats, clean contrast.',
    itemIds: ['top-white-knit', 'bot-black-tailored-shorts', 'shoe-burgundy-flat', 'bag-burgundy-shoulder', 'acc-layered-necklace'],
    colorStory: ['white', 'black', 'burgundy', 'gold'], formality: 'polished', season: ['spring', 'summer'],
    tags: ['tailored shorts', 'bow flats', 'black + white'],
    why: 'Black and optic white is your signature contrast. High-rise pleated shorts are structured and comfortable, and burgundy accents add a romantic touch.',
    stylistNote: 'Match the flats to the bag and keep everything else black and white.' }
];
