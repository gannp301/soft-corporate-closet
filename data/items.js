/* ============================================================
   Soft Corporate Closet — ITEM DATA
   Edit this file to add / change stores, colors and pieces.

   ITEM FIELDS
   id         unique string (used by outfits.js)
   name       display name
   category   tops | bottoms | dresses | outerwear | shoes | bags | accessories
   shape      which illustration to draw (see list at bottom of this comment)
   store      key from STORES below
   price      number in USD (0 = already owned / no price)
   url        >>> PASTE THE REAL PRODUCT LINK HERE <<<
              Leave '' to fall back to a store search for the item name.
   color      key from PALETTE below
   colorSeason  color-season note (all starter pieces are Bright Winter)
   moods      mood keys from MOODS
   fit        fit/style keys from FIT_TAGS
   formality  formality keys this piece can be worn at
   season     seasons it works in
   owned      true if it's already in your closet (can also be toggled in the app)
   image      optional: 'assets/my-photo.jpg' or a full image URL. '' = illustration
   notes      short styling note

   SHAPES: tee, longsleeve, vneck, wrap, cardigan, henley, jacket, straight, flare,
           trousers, skort, skirt, pleated, shorts, dress-ls, dress-ss, boots, docs,
           maryjane, sneaker, heel, flat, bag, hoops, huggies, necklace, layered,
           bracelet, tights
   ============================================================ */
window.SCC = window.SCC || {};

/* ---- STORES: add a new store by adding one line here ----
   search: URL prefix used when an item has no url ('' = no fallback link) */
SCC.STORES = {
  cider:  { name: 'Cider',  search: 'https://www.google.com/search?q=site%3Ashopcider.com+' },
  shein:  { name: 'SHEIN',  search: 'https://us.shein.com/pdsearch/' },
  amazon: { name: 'Amazon', search: 'https://www.amazon.com/s?k=' },
  other:  { name: 'Other',  search: '' }
};

/* ---- BRIGHT WINTER PALETTE (family drives color-matching in Shuffle) ---- */
SCC.PALETTE = {
  'black':       { name: 'Black',        hex: '#17161b', family: 'neutral' },
  'white':       { name: 'Optic white',  hex: '#ffffff', family: 'neutral' },
  'charcoal':    { name: 'Charcoal',     hex: '#474a55', family: 'neutral' },
  'navy':        { name: 'True navy',    hex: '#16234f', family: 'neutral' },
  'dark-denim':  { name: 'Dark denim',   hex: '#27365e', family: 'neutral' },
  'light-denim': { name: 'Light wash',   hex: '#a9c3e6', family: 'neutral' },
  'cobalt':      { name: 'Cobalt',       hex: '#1f4fd8', family: 'blue' },
  'icy-blue':    { name: 'Icy blue',     hex: '#cfe6fb', family: 'blue' },
  'icy-pink':    { name: 'Icy pink',     hex: '#fbd3e4', family: 'pink' },
  'pink':        { name: 'Bright cool pink', hex: '#f77fb5', family: 'pink' },
  'fuchsia':     { name: 'Fuchsia',      hex: '#d81b8c', family: 'pink' },
  'raspberry':   { name: 'Raspberry',    hex: '#c2185b', family: 'berry' },
  'berry':       { name: 'Berry',        hex: '#8e1b55', family: 'berry' },
  'burgundy':    { name: 'Blue-red burgundy', hex: '#6d1232', family: 'berry' },
  'plum':        { name: 'Cool plum',    hex: '#5b2a6e', family: 'berry' },
  'lavender':    { name: 'Icy lavender', hex: '#dcd3f7', family: 'lavender' },
  'emerald':     { name: 'Emerald',      hex: '#0d8a5f', family: 'green' },
  'teal':        { name: 'Cool teal',    hex: '#0f7c8a', family: 'green' },
  'gold':        { name: 'Polished gold', hex: '#e2b53e', family: 'metal' },
  'white-gold':  { name: 'White gold',   hex: '#c9ced8', family: 'metal' },
  'rose-gold':   { name: 'Rose gold',    hex: '#e8a598', family: 'metal' }
};

/* ---- MOODS (formality = default dress code; winter = cold-weather styling) ---- */
SCC.MOODS = {
  'cute-polished':  { label: 'Cute & Polished',    formality: 'polished' },
  'soft-corporate': { label: 'Soft Corporate',     formality: 'business' },
  'baddie-lite':    { label: 'Office Baddie Lite', formality: 'polished' },
  'comfy':          { label: 'Comfy Office',       formality: 'casual' },
  'meeting':        { label: 'Meeting Day',        formality: 'meeting' },
  'friday':         { label: 'Friday Casual',      formality: 'casual' },
  'cold':           { label: 'Cold Office',        formality: 'business', winter: true },
  'icy-girly':      { label: 'Icy Girly',          formality: 'polished', winter: true },
  'winter-kiss':    { label: 'Winter Kiss Office', formality: 'polished', winter: true }
};

/* ---- FORMALITY (ordered least → most formal) ---- */
SCC.FORMALITY = [
  { id: 'casual',   label: 'Casual office' },
  { id: 'polished', label: 'Polished casual' },
  { id: 'business', label: 'Business casual' },
  { id: 'meeting',  label: 'Meeting-ready' }
];

SCC.FIT_TAGS = {
  petite: 'Petite-friendly', curve: 'Curve-friendly', belly: 'Lower-belly-friendly',
  waist: 'Waist-defining', fitted: 'Fitted', feminine: 'Feminine', winter: 'Winter-friendly'
};

SCC.CATEGORIES = {
  tops: 'Tops', bottoms: 'Bottoms', dresses: 'Dresses', outerwear: 'Outerwear',
  shoes: 'Shoes', bags: 'Bags', accessories: 'Accessories'
};

(function () {
  var ALL = ['spring', 'summer', 'fall', 'winter'];
  var COOL = ['fall', 'winter', 'spring'];
  var WARM = ['spring', 'summer', 'fall'];
  var BW = 'Bright Winter';

  SCC.ITEMS = [
    /* ---------------- TOPS ---------------- */
    { id: 'top-black-scoop', name: 'Black Fitted Scoop-Neck Tee', category: 'tops', shape: 'tee', store: 'shein', price: 9.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['baddie-lite', 'comfy', 'friday', 'cute-polished', 'cold'],
      fit: ['petite', 'curve', 'fitted'], formality: ['casual', 'polished', 'business'], season: ALL, owned: false, image: '',
      notes: 'The scoop neck opens up the neckline and layers under everything.' },
    { id: 'top-navy-longsleeve', name: 'Navy Fitted Long-Sleeve Scoop Top', category: 'tops', shape: 'longsleeve', store: 'amazon', price: 18.99,
      url: '',
      color: 'navy', colorSeason: BW, moods: ['friday', 'comfy', 'soft-corporate', 'cold'],
      fit: ['petite', 'curve', 'fitted', 'winter'], formality: ['casual', 'polished', 'business'], season: COOL, owned: false, image: '',
      notes: 'True navy reads crisp, not dull. Tuck it for waist definition.' },
    { id: 'top-icyblue-cardigan', name: 'Icy-Blue Fitted Cardigan', category: 'tops', shape: 'cardigan', store: 'cider', price: 26,
      url: '',
      color: 'icy-blue', colorSeason: BW, moods: ['soft-corporate', 'icy-girly', 'cute-polished', 'cold'],
      fit: ['petite', 'fitted', 'feminine', 'waist', 'winter'], formality: ['polished', 'business'], season: COOL, owned: false, image: '',
      notes: 'Worn buttoned as a top. Cropped length hits right at the waist.' },
    { id: 'top-berry-wrap', name: 'Berry Wrap Top', category: 'tops', shape: 'wrap', store: 'cider', price: 24,
      url: '',
      color: 'berry', colorSeason: BW, moods: ['soft-corporate', 'meeting', 'cute-polished'],
      fit: ['curve', 'waist', 'belly', 'feminine', 'petite'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Wrap construction defines the upper waist and drapes softly below it.' },
    { id: 'top-raspberry-ruched', name: 'Raspberry Ruched V-Neck', category: 'tops', shape: 'vneck', store: 'shein', price: 14.49,
      url: '',
      color: 'raspberry', colorSeason: BW, moods: ['cute-polished', 'baddie-lite', 'friday'],
      fit: ['curve', 'belly', 'fitted', 'feminine', 'waist'], formality: ['casual', 'polished', 'business'], season: ALL, owned: false, image: '',
      notes: 'Ruching is smoothing and comfortable through the middle.' },
    { id: 'top-white-knit', name: 'Optic-White Fitted Knit', category: 'tops', shape: 'longsleeve', store: 'amazon', price: 22.99,
      url: '',
      color: 'white', colorSeason: BW, moods: ['icy-girly', 'winter-kiss', 'meeting', 'soft-corporate', 'cute-polished'],
      fit: ['petite', 'fitted', 'feminine', 'winter'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Crisp white is your highest-contrast partner for black and navy.' },
    { id: 'top-icypink-cropped-cardigan', name: 'Icy-Pink Cropped Cardigan', category: 'tops', shape: 'cardigan', store: 'cider', price: 28,
      url: '',
      color: 'icy-pink', colorSeason: BW, moods: ['winter-kiss', 'icy-girly', 'cute-polished'],
      fit: ['petite', 'fitted', 'feminine', 'waist', 'winter'], formality: ['casual', 'polished', 'business'], season: COOL, owned: false, image: '',
      notes: 'The winter-kiss piece. Button it up and wear it as a top.' },
    { id: 'top-cobalt-fitted', name: 'Cobalt Fitted Square-Neck Top', category: 'tops', shape: 'tee', store: 'shein', price: 12.99,
      url: '',
      color: 'cobalt', colorSeason: BW, moods: ['meeting', 'soft-corporate', 'baddie-lite'],
      fit: ['petite', 'curve', 'fitted'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'One saturated color does all the work on a meeting day.' },
    { id: 'top-charcoal-knit', name: 'Charcoal Fitted Short-Sleeve Knit', category: 'tops', shape: 'tee', store: 'amazon', price: 19.99,
      url: '',
      color: 'charcoal', colorSeason: BW, moods: ['comfy', 'soft-corporate', 'meeting'],
      fit: ['petite', 'curve', 'fitted'], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Thicker knit keeps a clean line. Softer than black, still cool-toned.' },
    { id: 'top-emerald-henley', name: 'Emerald Fitted Henley', category: 'tops', shape: 'henley', store: 'shein', price: 13.49,
      url: '',
      color: 'emerald', colorSeason: BW, moods: ['friday', 'comfy', 'cute-polished'],
      fit: ['petite', 'curve', 'fitted', 'winter'], formality: ['casual', 'polished'], season: COOL, owned: false, image: '',
      notes: 'Henley placket draws the eye up. Emerald glows against dark denim.' },

    /* ---------------- BOTTOMS ---------------- */
    { id: 'bot-dark-flare-jeans', name: 'Dark Curvy High-Waist Flare Jeans', category: 'bottoms', shape: 'flare', store: 'amazon', price: 39.99,
      url: '',
      color: 'dark-denim', colorSeason: BW, moods: ['baddie-lite', 'friday', 'comfy', 'cute-polished'],
      fit: ['curve', 'belly', 'waist', 'petite', 'winter'], formality: ['casual', 'polished'], season: ALL, owned: false, image: '',
      notes: 'Curvy cut with a structured high rise. The flare balances curves and lengthens legs.' },
    { id: 'bot-lightwash-straight', name: 'Light-Wash Curvy Straight Jeans', category: 'bottoms', shape: 'straight', store: 'cider', price: 36,
      url: '',
      color: 'light-denim', colorSeason: BW, moods: ['friday', 'comfy'],
      fit: ['curve', 'waist', 'petite'], formality: ['casual'], season: ALL, owned: false, image: '',
      notes: 'Friday denim. Look for a petite inseam so it hits at the ankle.' },
    { id: 'bot-black-flare-pants', name: 'Black High-Waist Flare Pants', category: 'bottoms', shape: 'flare', store: 'shein', price: 21.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['soft-corporate', 'comfy', 'baddie-lite', 'meeting', 'cold'],
      fit: ['curve', 'belly', 'waist', 'petite', 'winter'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Comfortable stretch, wide waistband, easy fit through the middle.' },
    { id: 'bot-charcoal-trousers', name: 'Charcoal Tailored Trousers', category: 'bottoms', shape: 'trousers', store: 'amazon', price: 34.99,
      url: '',
      color: 'charcoal', colorSeason: BW, moods: ['meeting', 'soft-corporate', 'cold'],
      fit: ['waist', 'belly', 'petite', 'winter'], formality: ['business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Structured high rise with a slim straight leg — tailored, not stiff.' },
    { id: 'bot-black-trousers', name: 'Black High-Waist Tailored Trousers', category: 'bottoms', shape: 'trousers', store: 'amazon', price: 32.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['cold', 'meeting', 'soft-corporate'],
      fit: ['waist', 'belly', 'petite', 'curve', 'winter'], formality: ['business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'The polished base. Petite length keeps the line clean over boots.' },
    { id: 'bot-black-skort', name: 'Black Mini Skort', category: 'bottoms', shape: 'skort', store: 'cider', price: 22,
      url: '',
      color: 'black', colorSeason: BW, moods: ['winter-kiss', 'cute-polished', 'icy-girly', 'friday'],
      fit: ['petite', 'belly', 'waist', 'feminine', 'curve'], formality: ['casual', 'polished', 'business'], season: ALL, owned: false, image: '',
      notes: 'A-line skort shape: comfortable, structured, and desk-chair proof.' },
    { id: 'bot-navy-pleated-skirt', name: 'Navy Pleated Short Skirt', category: 'bottoms', shape: 'pleated', store: 'shein', price: 16.99,
      url: '',
      color: 'navy', colorSeason: BW, moods: ['icy-girly', 'cute-polished', 'friday'],
      fit: ['petite', 'waist', 'feminine', 'belly'], formality: ['casual', 'polished', 'business'], season: ALL, owned: false, image: '',
      notes: 'Preppy without being costume-y. Add tights in winter.' },
    { id: 'bot-black-structured-skirt', name: 'Black Structured Short Skirt', category: 'bottoms', shape: 'skirt', store: 'cider', price: 24,
      url: '',
      color: 'black', colorSeason: BW, moods: ['cute-polished', 'baddie-lite', 'soft-corporate', 'meeting', 'cold'],
      fit: ['petite', 'belly', 'waist', 'curve'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Thicker fabric holds its A-line shape. Smoothing and polished.' },
    { id: 'bot-black-tailored-shorts', name: 'Tailored Black Shorts', category: 'bottoms', shape: 'shorts', store: 'shein', price: 17.49,
      url: '',
      color: 'black', colorSeason: BW, moods: ['cute-polished', 'friday', 'baddie-lite'],
      fit: ['petite', 'waist', 'belly'], formality: ['casual', 'polished'], season: WARM, owned: false, image: '',
      notes: 'High-rise with a pleat front. Reads like a mini skirt, walks like shorts.' },

    /* ---------------- DRESSES ---------------- */
    { id: 'dress-navy-fitflare', name: 'Navy Long-Sleeve Fit-and-Flare Dress', category: 'dresses', shape: 'dress-ls', store: 'amazon', price: 38.99,
      url: '',
      color: 'navy', colorSeason: BW, moods: ['cute-polished', 'soft-corporate', 'meeting', 'cold'],
      fit: ['petite', 'curve', 'waist', 'belly', 'feminine', 'winter'], formality: ['polished', 'business', 'meeting'], season: COOL, owned: false, image: '',
      notes: 'Fitted top, flared skirt — the most flattering shape in the closet.' },
    { id: 'dress-lavender-short', name: 'Icy Lavender Short Dress', category: 'dresses', shape: 'dress-ss', store: 'cider', price: 32,
      url: '',
      color: 'lavender', colorSeason: BW, moods: ['friday', 'cute-polished', 'icy-girly'],
      fit: ['petite', 'waist', 'feminine', 'belly'], formality: ['casual', 'polished'], season: ALL, owned: false, image: '',
      notes: 'Soft color, defined waist, swingy skirt. Sporty-feminine with sneakers.' },
    { id: 'dress-black-fitflare', name: 'Black Fitted-Top Flared-Skirt Dress', category: 'dresses', shape: 'dress-ss', store: 'shein', price: 24.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['meeting', 'baddie-lite', 'cute-polished', 'soft-corporate', 'winter-kiss'],
      fit: ['petite', 'curve', 'waist', 'belly', 'feminine'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'The little black dress that works in a conference room.' },
    { id: 'dress-berry-longsleeve', name: 'Cool Berry Long-Sleeve Dress', category: 'dresses', shape: 'dress-ls', store: 'cider', price: 34,
      url: '',
      color: 'berry', colorSeason: BW, moods: ['cute-polished', 'winter-kiss', 'soft-corporate', 'cold'],
      fit: ['petite', 'curve', 'waist', 'belly', 'feminine', 'winter'], formality: ['polished', 'business'], season: COOL, owned: false, image: '',
      notes: 'Rich cool berry is peak Bright Winter. Great with tights.' },

    /* ---------------- OUTERWEAR ---------------- */
    { id: 'out-cropped-denim', name: 'Cropped Denim Jacket', category: 'outerwear', shape: 'jacket', store: 'amazon', price: 35.99,
      url: '',
      color: 'light-denim', colorSeason: BW, moods: ['friday', 'comfy', 'cute-polished'],
      fit: ['petite', 'waist'], formality: ['casual', 'polished'], season: WARM, owned: false, image: '',
      notes: 'Cropped length keeps petite proportions and shows the waist.' },
    { id: 'out-black-cropped-jacket', name: 'Black Cropped Jacket', category: 'outerwear', shape: 'jacket', store: 'shein', price: 29.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['meeting', 'baddie-lite', 'soft-corporate', 'cold', 'winter-kiss'],
      fit: ['petite', 'waist', 'winter'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'A short structured layer — all the polish of a blazer, none of the HR.' },
    { id: 'out-icypink-cardigan', name: 'Icy-Pink Fitted Cardigan', category: 'outerwear', shape: 'cardigan', store: 'cider', price: 30,
      url: '',
      color: 'icy-pink', colorSeason: BW, moods: ['icy-girly', 'winter-kiss', 'cute-polished', 'cold'],
      fit: ['petite', 'feminine', 'fitted', 'winter'], formality: ['casual', 'polished', 'business'], season: COOL, owned: false, image: '',
      notes: 'Worn open as a layer. Pale pink + white + navy = icy and clean.' },
    { id: 'out-berry-cardigan', name: 'Berry Fitted Cardigan', category: 'outerwear', shape: 'cardigan', store: 'amazon', price: 27.99,
      url: '',
      color: 'berry', colorSeason: BW, moods: ['cold', 'soft-corporate', 'cute-polished'],
      fit: ['petite', 'feminine', 'fitted', 'winter'], formality: ['polished', 'business', 'meeting'], season: COOL, owned: false, image: '',
      notes: 'The answer to freezing office AC.' },

    /* ---------------- SHOES ---------------- */
    { id: 'shoe-pink-docs', name: 'Pink Dr. Martens-Style Boots', category: 'shoes', shape: 'docs', store: 'other', price: 0,
      url: '',
      color: 'pink', colorSeason: BW, moods: ['winter-kiss', 'friday', 'cute-polished', 'icy-girly', 'comfy'],
      fit: ['feminine', 'winter'], formality: ['casual', 'polished'], season: ALL, owned: true, image: '',
      notes: 'Already in your closet! Best with black tights, skorts, short dresses, or straight jeans.' },
    { id: 'shoe-black-ankle-boots', name: 'Sleek Black Ankle Boots', category: 'shoes', shape: 'boots', store: 'amazon', price: 42.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['meeting', 'cold', 'soft-corporate', 'baddie-lite', 'cute-polished', 'friday'],
      fit: ['petite', 'winter'], formality: ['casual', 'polished', 'business', 'meeting'], season: COOL, owned: false, image: '',
      notes: 'Slim shaft and a moderate heel — lengthens under flares and trousers.' },
    { id: 'shoe-black-maryjanes', name: 'Black Mary Janes', category: 'shoes', shape: 'maryjane', store: 'shein', price: 25.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['icy-girly', 'cute-polished', 'soft-corporate', 'winter-kiss'],
      fit: ['feminine', 'petite'], formality: ['casual', 'polished', 'business'], season: ALL, owned: false, image: '',
      notes: 'Sleek, low-profile sole. Perfect with tights.' },
    { id: 'shoe-white-sneakers', name: 'Feminine White Sneakers', category: 'shoes', shape: 'sneaker', store: 'amazon', price: 29.99,
      url: '',
      color: 'white', colorSeason: BW, moods: ['comfy', 'friday'],
      fit: ['feminine'], formality: ['casual', 'polished'], season: WARM, owned: false, image: '',
      notes: 'Slim silhouette, crisp white — sporty-feminine, not gym.' },
    { id: 'shoe-black-heel', name: 'Black Moderate Block Heel', category: 'shoes', shape: 'heel', store: 'shein', price: 27.49,
      url: '',
      color: 'black', colorSeason: BW, moods: ['soft-corporate', 'meeting', 'baddie-lite'],
      fit: ['petite', 'feminine'], formality: ['polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Walkable height, adds length under flare pants.' },
    { id: 'shoe-burgundy-flat', name: 'Burgundy Bow Flat', category: 'shoes', shape: 'flat', store: 'cider', price: 26,
      url: '',
      color: 'burgundy', colorSeason: BW, moods: ['cute-polished', 'soft-corporate', 'comfy'],
      fit: ['feminine'], formality: ['casual', 'polished', 'business'], season: WARM, owned: false, image: '',
      notes: 'Sleek pointed-ish toe with a tiny bow. Never a chunky loafer.' },

    /* ---------------- BAGS ---------------- */
    { id: 'bag-black-shoulder', name: 'Black Shoulder Bag', category: 'bags', shape: 'bag', store: 'amazon', price: 23.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['soft-corporate', 'meeting', 'cold', 'winter-kiss', 'comfy', 'baddie-lite', 'cute-polished'],
      fit: [], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Small, structured, goes with everything.' },
    { id: 'bag-burgundy-shoulder', name: 'Burgundy Shoulder Bag', category: 'bags', shape: 'bag', store: 'shein', price: 15.99,
      url: '',
      color: 'burgundy', colorSeason: BW, moods: ['baddie-lite', 'cute-polished', 'soft-corporate', 'cold'],
      fit: [], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Blue-red burgundy: the pop that makes black outfits look intentional.' },
    { id: 'bag-white-mini', name: 'Crisp White Mini Bag', category: 'bags', shape: 'bag', store: 'cider', price: 18,
      url: '',
      color: 'white', colorSeason: BW, moods: ['friday', 'icy-girly', 'cute-polished', 'winter-kiss'],
      fit: [], formality: ['casual', 'polished', 'business'], season: ALL, owned: false, image: '',
      notes: 'Adds an icy highlight to dark outfits.' },

    /* ---------------- ACCESSORIES ---------------- */
    { id: 'acc-gold-hoops', name: 'Polished Gold Hoops', category: 'accessories', shape: 'hoops', store: 'amazon', price: 12.99,
      url: '',
      color: 'gold', colorSeason: BW, moods: ['baddie-lite', 'soft-corporate', 'cold', 'friday'],
      fit: ['feminine'], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Bright polished gold (never brassy) for black, navy, berry and emerald.' },
    { id: 'acc-whitegold-huggies', name: 'White-Gold Huggies', category: 'accessories', shape: 'huggies', store: 'amazon', price: 13.99,
      url: '',
      color: 'white-gold', colorSeason: BW, moods: ['meeting', 'icy-girly', 'soft-corporate', 'comfy'],
      fit: ['feminine'], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Crisp and cool for high-contrast looks.' },
    { id: 'acc-rosegold-necklace', name: 'Rose-Gold Delicate Necklace', category: 'accessories', shape: 'necklace', store: 'shein', price: 4.99,
      url: '',
      color: 'rose-gold', colorSeason: BW, moods: ['winter-kiss', 'icy-girly', 'cute-polished', 'friday'],
      fit: ['feminine'], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Made for pink and berry looks.' },
    { id: 'acc-layered-necklace', name: 'Delicate Layered Gold Necklace', category: 'accessories', shape: 'layered', store: 'cider', price: 9,
      url: '',
      color: 'gold', colorSeason: BW, moods: ['soft-corporate', 'cute-polished', 'baddie-lite', 'meeting'],
      fit: ['feminine'], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'Fills in scoop, V and wrap necklines.' },
    { id: 'acc-simple-bracelet', name: 'Simple White-Gold Bracelet', category: 'accessories', shape: 'bracelet', store: 'shein', price: 5.49,
      url: '',
      color: 'white-gold', colorSeason: BW, moods: ['friday', 'comfy', 'cute-polished', 'meeting'],
      fit: ['feminine'], formality: ['casual', 'polished', 'business', 'meeting'], season: ALL, owned: false, image: '',
      notes: 'A little sparkle at the wrist with short sleeves.' },
    { id: 'acc-black-tights', name: 'Black Opaque Tights', category: 'accessories', shape: 'tights', store: 'amazon', price: 9.99,
      url: '',
      color: 'black', colorSeason: BW, moods: ['winter-kiss', 'icy-girly', 'cold', 'cute-polished'],
      fit: ['winter', 'belly'], formality: ['casual', 'polished', 'business', 'meeting'], season: COOL, owned: false, image: '',
      notes: 'High-waist control top: smoothing, warm, and makes short hems office-ready.' }
  ];
})();
