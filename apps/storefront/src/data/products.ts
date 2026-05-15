/**
 * In-memory storefront fixtures. Mirrors the seed data shipped in
 * `@nasij/db/seed/products.ts` so the storefront renders meaningfully
 * before the database is wired up. Replace with tRPC `products.list`
 * once the API ↔ DB connection is established.
 */

export interface FixtureProduct {
  slug: string;
  sku: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: 'women' | 'men' | 'accessories';
  basePriceMinor: number;
  compareAtPriceMinor?: number;
  currency: 'EGP';
  imageUrl?: string;
  ribbon?: { ar: string; en: string };
  variants: Array<{ size?: string; color: string }>;
}

export const fixtureProducts: readonly FixtureProduct[] = [
  {
    slug: 'kaftan-amber',
    sku: 'NSJ-KFT-AMB',
    titleAr: 'قفطان عنبري',
    titleEn: 'Amber kaftan',
    descriptionAr: 'قفطان كتان واسع بطرز يدوي خفيف على الحاشية، يعمل في حر الصيف.',
    descriptionEn: 'A relaxed-fit linen kaftan with light hand embroidery along the hem, built for hot summers.',
    category: 'women',
    basePriceMinor: 240_000,
    currency: 'EGP',
    ribbon: { ar: 'جديد', en: 'New' },
    variants: [
      { size: 'XS', color: 'amber' },
      { size: 'S', color: 'amber' },
      { size: 'M', color: 'amber' },
      { size: 'L', color: 'amber' },
      { size: 'XL', color: 'amber' },
      { size: 'XS', color: 'stone' },
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XL', color: 'stone' },
    ],
  },
  {
    slug: 'linen-trousers',
    sku: 'NSJ-TRS-LIN',
    titleAr: 'بنطلون كتان واسع',
    titleEn: 'Wide-leg linen trousers',
    descriptionAr: 'قصة واسعة بحزام مطاطي مخفي ولمسة هادئة.',
    descriptionEn: 'Wide-leg cut with a concealed elastic waist and a quiet finish.',
    category: 'women',
    basePriceMinor: 195_000,
    compareAtPriceMinor: 240_000,
    currency: 'EGP',
    ribbon: { ar: 'تخفيض', en: 'Sale' },
    variants: [
      { size: 'XS', color: 'stone' },
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XL', color: 'stone' },
      { size: 'XS', color: 'terracotta' },
      { size: 'S', color: 'terracotta' },
      { size: 'M', color: 'terracotta' },
      { size: 'L', color: 'terracotta' },
      { size: 'XL', color: 'terracotta' },
    ],
  },
  {
    slug: 'oversized-shirt',
    sku: 'NSJ-SHR-OVR',
    titleAr: 'قميص أوفر سايز',
    titleEn: 'Oversized poplin shirt',
    descriptionAr: 'قطن مصري ١٠٠٪ بقصة واسعة وأزرار مخفية.',
    descriptionEn: '100% Egyptian cotton poplin in an oversized cut with hidden buttons.',
    category: 'women',
    basePriceMinor: 165_000,
    currency: 'EGP',
    variants: [
      { size: 'XS', color: 'stone' },
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XS', color: 'sage' },
      { size: 'S', color: 'sage' },
      { size: 'M', color: 'sage' },
      { size: 'L', color: 'sage' },
    ],
  },
  {
    slug: 'ribbed-tank',
    sku: 'NSJ-TNK-RIB',
    titleAr: 'تانك توب مضلع',
    titleEn: 'Ribbed knit tank',
    descriptionAr: 'تريكو قطني مضلع بقصة قريبة من الجسم تحت أي طبقة.',
    descriptionEn: 'Ribbed cotton knit with a close-to-body cut that layers under anything.',
    category: 'women',
    basePriceMinor: 85_000,
    currency: 'EGP',
    variants: [
      { size: 'XS', color: 'stone' },
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XS', color: 'amber' },
      { size: 'S', color: 'amber' },
      { size: 'M', color: 'amber' },
      { size: 'L', color: 'amber' },
      { size: 'XS', color: 'sage' },
      { size: 'S', color: 'sage' },
      { size: 'M', color: 'sage' },
      { size: 'L', color: 'sage' },
    ],
  },
  {
    slug: 'wool-coat',
    sku: 'NSJ-COA-WOL',
    titleAr: 'معطف صوف',
    titleEn: 'Long wool coat',
    descriptionAr: 'صوف ميرينو ٧٠٪ بأكمام مرتفعة وبطانة قطن.',
    descriptionEn: '70% merino wool with raised shoulders and a cotton lining.',
    category: 'women',
    basePriceMinor: 450_000,
    currency: 'EGP',
    ribbon: { ar: 'حصري', en: 'Exclusive' },
    variants: [
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XL', color: 'stone' },
      { size: 'S', color: 'terracotta' },
      { size: 'M', color: 'terracotta' },
      { size: 'L', color: 'terracotta' },
      { size: 'XL', color: 'terracotta' },
    ],
  },
  {
    slug: 'mens-overshirt',
    sku: 'NSJ-OVS-MEN',
    titleAr: 'قميص رجالي خارجي',
    titleEn: "Men's overshirt",
    descriptionAr: 'تويل قطن ثقيل بأربعة جيوب أمامية.',
    descriptionEn: 'Heavy cotton twill with four front pockets.',
    category: 'men',
    basePriceMinor: 220_000,
    currency: 'EGP',
    variants: [
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XL', color: 'stone' },
      { size: 'S', color: 'sage' },
      { size: 'M', color: 'sage' },
      { size: 'L', color: 'sage' },
      { size: 'XL', color: 'sage' },
      { size: 'S', color: 'terracotta' },
      { size: 'M', color: 'terracotta' },
      { size: 'L', color: 'terracotta' },
      { size: 'XL', color: 'terracotta' },
    ],
  },
  {
    slug: 'mens-chino',
    sku: 'NSJ-CHN-MEN',
    titleAr: 'بنطلون شينو رجالي',
    titleEn: "Men's chino trousers",
    descriptionAr: 'تويل قطن متوسط الوزن بحزام طبيعي ولوج جانبي.',
    descriptionEn: 'Mid-weight cotton twill with a natural waistband and side seams.',
    category: 'men',
    basePriceMinor: 185_000,
    currency: 'EGP',
    variants: [
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XL', color: 'stone' },
      { size: 'XXL', color: 'stone' },
      { size: 'S', color: 'sage' },
      { size: 'M', color: 'sage' },
      { size: 'L', color: 'sage' },
      { size: 'XL', color: 'sage' },
      { size: 'XXL', color: 'sage' },
    ],
  },
  {
    slug: 'mens-tee',
    sku: 'NSJ-TEE-MEN',
    titleAr: 'تيشيرت رجالي',
    titleEn: "Men's heavyweight tee",
    descriptionAr: 'قطن ثقيل ٢٤٠ غرام بقصة كلاسيكية.',
    descriptionEn: '240gsm heavyweight cotton with a classic boxy cut.',
    category: 'men',
    basePriceMinor: 95_000,
    currency: 'EGP',
    variants: [
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'XL', color: 'stone' },
      { size: 'XXL', color: 'stone' },
      { size: 'S', color: 'amber' },
      { size: 'M', color: 'amber' },
      { size: 'L', color: 'amber' },
      { size: 'XL', color: 'amber' },
      { size: 'XXL', color: 'amber' },
      { size: 'S', color: 'sage' },
      { size: 'M', color: 'sage' },
      { size: 'L', color: 'sage' },
      { size: 'XL', color: 'sage' },
      { size: 'XXL', color: 'sage' },
    ],
  },
  {
    slug: 'silk-scarf',
    sku: 'NSJ-ACC-SLK',
    titleAr: 'إيشارب حرير',
    titleEn: 'Silk scarf',
    descriptionAr: 'حرير ٩٠×٩٠ سم بطباعة محدودة.',
    descriptionEn: '90×90 cm silk with a limited-run print.',
    category: 'accessories',
    basePriceMinor: 95_000,
    currency: 'EGP',
    variants: [
      { color: 'stone' },
      { color: 'amber' },
    ],
  },
  {
    slug: 'leather-belt',
    sku: 'NSJ-ACC-BLT',
    titleAr: 'حزام جلد',
    titleEn: 'Vegetable-tanned leather belt',
    descriptionAr: 'جلد مدبوغ نباتيًا بإبزيم نحاسي يدوي.',
    descriptionEn: 'Vegetable-tanned leather with a hand-finished brass buckle.',
    category: 'accessories',
    basePriceMinor: 130_000,
    currency: 'EGP',
    variants: [
      { size: 'S', color: 'stone' },
      { size: 'M', color: 'stone' },
      { size: 'L', color: 'stone' },
      { size: 'S', color: 'amber' },
      { size: 'M', color: 'amber' },
      { size: 'L', color: 'amber' },
    ],
  },
  {
    slug: 'canvas-tote',
    sku: 'NSJ-ACC-TOT',
    titleAr: 'حقيبة قماش',
    titleEn: 'Canvas tote bag',
    descriptionAr: 'قماش قطني ثقيل ٤٠×٤٠ سم بحزام طويل.',
    descriptionEn: 'Heavy cotton canvas, 40×40 cm with a long shoulder strap.',
    category: 'accessories',
    basePriceMinor: 65_000,
    currency: 'EGP',
    variants: [
      { color: 'stone' },
      { color: 'sage' },
    ],
  },
  {
    slug: 'cotton-cap',
    sku: 'NSJ-ACC-CAP',
    titleAr: 'كاب قطني',
    titleEn: 'Washed cotton cap',
    descriptionAr: 'قطن مغسول بحزام معدني خلفي.',
    descriptionEn: 'Washed cotton with a back metal strap.',
    category: 'accessories',
    basePriceMinor: 55_000,
    currency: 'EGP',
    variants: [
      { color: 'stone' },
      { color: 'sage' },
      { color: 'terracotta' },
    ],
  },
];

/**
 * Stable per-slug image URL via Unsplash / picsum. Deterministic by slug —
 * same product always renders the same photo. Replace with a CDN-backed
 * product image once tRPC products.list returns hosted assets.
 */
const productImageMap: Readonly<Record<string, string>> = {
  'kaftan-amber': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop',
  'linen-trousers': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80&auto=format&fit=crop',
  'oversized-shirt': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80&auto=format&fit=crop',
  'ribbed-tank': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
  'wool-coat': 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800&q=80&auto=format&fit=crop',
  'mens-overshirt': 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80&auto=format&fit=crop',
  'mens-chino': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80&auto=format&fit=crop',
  'mens-tee': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
  'silk-scarf': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80&auto=format&fit=crop',
  'leather-belt': 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80&auto=format&fit=crop',
  'canvas-tote': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80&auto=format&fit=crop',
  'cotton-cap': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80&auto=format&fit=crop',
};

export const imageFor = (slug: string): string =>
  productImageMap[slug] ?? `https://picsum.photos/seed/nasij-${slug}/800/1067`;

export const findProductBySlug = (slug: string): FixtureProduct | undefined =>
  fixtureProducts.find((p) => p.slug === slug);

export interface ListProductsFilter {
  category?: FixtureProduct['category'];
  sort?: 'newest' | 'price-asc' | 'price-desc';
  search?: string;
}

export const listProducts = (filter: ListProductsFilter = {}): readonly FixtureProduct[] => {
  let out: FixtureProduct[] = [...fixtureProducts];
  if (filter.category) {
    out = out.filter((p) => p.category === filter.category);
  }
  if (filter.search) {
    const needle = filter.search.toLowerCase();
    out = out.filter(
      (p) => p.titleEn.toLowerCase().includes(needle) || p.titleAr.includes(filter.search ?? ''),
    );
  }
  if (filter.sort === 'price-asc') {
    out.sort((a, b) => a.basePriceMinor - b.basePriceMinor);
  } else if (filter.sort === 'price-desc') {
    out.sort((a, b) => b.basePriceMinor - a.basePriceMinor);
  }
  return out;
};
