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
];

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
