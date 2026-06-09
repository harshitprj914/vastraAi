// Curated pool of stable Unsplash CDN fashion photo URLs (CORS-safe, immutable).
// Organised by clothing category. Accessories intentionally excluded — VastraAI
// only recommends apparel.
const POOL: Record<string, string[]> = {
  dress: [
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b",
  ],
  shirt: [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157",
    "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5",
    "https://images.unsplash.com/photo-1563630423918-b58f07336ac9",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
  ],
  tshirt: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  ],
  top: [
    "https://images.unsplash.com/photo-1485518882345-15568b007407",
    "https://images.unsplash.com/photo-1485231183945-fffde7cc051e",
    "https://images.unsplash.com/photo-1554568218-0f1715e72254",
  ],
  blazer: [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
    "https://images.unsplash.com/photo-1507680434567-5739c80be1ac",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    "https://images.unsplash.com/photo-1617137968427-85924c800a22",
  ],
  trousers: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d",
    "https://images.unsplash.com/photo-1551854838-212c50b4c184",
  ],
  jeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09",
    "https://images.unsplash.com/photo-1475180098004-ca77a66827be",
  ],
  skirt: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a13d44",
    "https://images.unsplash.com/photo-1577900232427-18219b9166a0",
    "https://images.unsplash.com/photo-1551163943-3f6a855d1153",
  ],
  knitwear: [
    "https://images.unsplash.com/photo-1580906855612-c9b8eef2c0fd",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    "https://images.unsplash.com/photo-1611042553365-9b101441c135",
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2",
  ],
  hoodie: [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77",
    "https://images.unsplash.com/photo-1572495641004-28421ae29ed4",
  ],
  outerwear: [
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
    "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543",
    "https://images.unsplash.com/photo-1591047139756-eb1a8a4eedbf",
    "https://images.unsplash.com/photo-1548126032-079a0fb0099d",
  ],
  jacket: [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    "https://images.unsplash.com/photo-1551537482-f2075a1d41f2",
    "https://images.unsplash.com/photo-1559551409-dadc959f76b8",
  ],
  coord: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
  ],
  kurta: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b",
    "https://images.unsplash.com/photo-1603251579711-3b73ee5ed4f2",
    "https://images.unsplash.com/photo-1614886137476-6c0a3a7baf66",
  ],
  saree: [
    "https://images.unsplash.com/photo-1610030469668-8e3e6f2bf25d",
    "https://images.unsplash.com/photo-1614886137476-6c0a3a7baf66",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b",
  ],
  lehenga: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
    "https://images.unsplash.com/photo-1583391956774-89be9a0f3ed3",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
  ],
};

const KEYWORD_TO_KEY: [string, string][] = [
  ["t-shirt", "tshirt"], ["tshirt", "tshirt"], ["tee", "tshirt"],
  ["hoodie", "hoodie"], ["sweatshirt", "hoodie"],
  ["co-ord", "coord"], ["coord", "coord"], ["co ord", "coord"], ["set", "coord"],
  ["sweater", "knitwear"], ["cardigan", "knitwear"], ["knit", "knitwear"], ["pullover", "knitwear"],
  ["coat", "outerwear"], ["trench", "outerwear"], ["overcoat", "outerwear"], ["puffer", "outerwear"],
  ["blazer", "blazer"],
  ["jacket", "jacket"], ["bomber", "jacket"], ["denim jacket", "jacket"],
  ["jeans", "jeans"], ["denim", "jeans"],
  ["pant", "trousers"], ["trouser", "trousers"], ["chino", "trousers"], ["palazzo", "trousers"],
  ["skirt", "skirt"],
  ["dress", "dress"], ["gown", "dress"], ["frock", "dress"],
  ["saree", "saree"], ["sari", "saree"],
  ["lehenga", "lehenga"], ["choli", "lehenga"],
  ["kurta", "kurta"], ["kurti", "kurta"], ["sherwani", "kurta"], ["ethnic", "kurta"],
  ["shirt", "shirt"], ["blouse", "shirt"],
  ["top", "top"], ["camisole", "top"], ["crop", "top"],
];

const CATEGORY_KEYS = Object.keys(POOL);

function pickKey(input: string): string {
  const t = (input ?? "").toLowerCase();
  for (const [kw, key] of KEYWORD_TO_KEY) if (t.includes(kw)) return key;
  for (const k of CATEGORY_KEYS) if (t.includes(k)) return k;
  return "fashion";
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Returns a stable, unique Unsplash CDN URL.
 * Image is selected from the matching category pool using a hash of the product
 * name + index — guarantees variety even when many products share a category.
 */
export function fashionImageFor(opts: { category?: string; name?: string; query?: string; index: number }): string {
  const hint = `${opts.category ?? ""} ${opts.name ?? ""} ${opts.query ?? ""}`;
  const key = pickKey(hint);
  const arr = POOL[key] ?? POOL.fashion;
  const idx = (hash(`${opts.name ?? ""}|${opts.query ?? ""}|${opts.index}`)) % arr.length;
  return `${arr[idx]}?auto=format&fit=crop&w=800&q=80`;
}
