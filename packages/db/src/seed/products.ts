import { generateId } from '../ids.js';

const categoryIds = {
  women: generateId('cat'),
  men: generateId('cat'),
  accessories: generateId('cat'),
  tops: generateId('cat'),
  bottoms: generateId('cat'),
  outerwear: generateId('cat'),
};

export const categoriesSeed = [
  {
    id: categoryIds.women,
    slug: 'women',
    nameAr: 'النساء',
    nameEn: 'Women',
    position: 0,
  },
  {
    id: categoryIds.men,
    slug: 'men',
    nameAr: 'الرجال',
    nameEn: 'Men',
    position: 1,
  },
  {
    id: categoryIds.accessories,
    slug: 'accessories',
    nameAr: 'إكسسوارات',
    nameEn: 'Accessories',
    position: 2,
  },
  {
    id: categoryIds.tops,
    slug: 'tops',
    nameAr: 'القطع العلوية',
    nameEn: 'Tops',
    parentId: categoryIds.women,
    position: 0,
  },
  {
    id: categoryIds.bottoms,
    slug: 'bottoms',
    nameAr: 'القطع السفلية',
    nameEn: 'Bottoms',
    parentId: categoryIds.women,
    position: 1,
  },
  {
    id: categoryIds.outerwear,
    slug: 'outerwear',
    nameAr: 'الملابس الخارجية',
    nameEn: 'Outerwear',
    parentId: categoryIds.women,
    position: 2,
  },
];

interface SeedProduct {
  productId: string;
  slug: string;
  sku: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: string;
  basePriceMinor: number;
  sizes: string[];
  colors: string[];
}

const seedSpec: SeedProduct[] = [
  {
    productId: generateId('prd'),
    slug: 'kaftan-amber',
    sku: 'NSJ-KFT-AMB',
    titleAr: 'قفطان عنبري',
    titleEn: 'Amber kaftan',
    descriptionAr: 'قفطان كتان واسع بطرز يدوي خفيف على الحاشية، يعمل في حر الصيف.',
    descriptionEn: 'A relaxed-fit linen kaftan with light hand embroidery along the hem, built for hot summers.',
    categoryId: categoryIds.women,
    basePriceMinor: 240_000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['amber', 'stone'],
  },
  {
    productId: generateId('prd'),
    slug: 'linen-trousers',
    sku: 'NSJ-TRS-LIN',
    titleAr: 'بنطلون كتان واسع',
    titleEn: 'Wide-leg linen trousers',
    descriptionAr: 'قصة واسعة بحزام مطاطي مخفي ولمسة هادئة.',
    descriptionEn: 'Wide-leg cut with a concealed elastic waist and a quiet finish.',
    categoryId: categoryIds.women,
    basePriceMinor: 195_000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['stone', 'terracotta'],
  },
  {
    productId: generateId('prd'),
    slug: 'oversized-shirt',
    sku: 'NSJ-SHR-OVR',
    titleAr: 'قميص أوفر سايز',
    titleEn: 'Oversized poplin shirt',
    descriptionAr: 'قطن مصري ١٠٠٪ بقصة واسعة وأزرار مخفية.',
    descriptionEn: '100% Egyptian cotton poplin in an oversized cut with hidden buttons.',
    categoryId: categoryIds.women,
    basePriceMinor: 165_000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['stone', 'sage'],
  },
  {
    productId: generateId('prd'),
    slug: 'mens-overshirt',
    sku: 'NSJ-OVS-MEN',
    titleAr: 'قميص رجالي خارجي',
    titleEn: "Men's overshirt",
    descriptionAr: 'تويل قطن ثقيل بأربعة جيوب أمامية.',
    descriptionEn: 'Heavy cotton twill with four front pockets.',
    categoryId: categoryIds.men,
    basePriceMinor: 220_000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['stone', 'sage', 'terracotta'],
  },
  {
    productId: generateId('prd'),
    slug: 'silk-scarf',
    sku: 'NSJ-ACC-SLK',
    titleAr: 'إيشارب حرير',
    titleEn: 'Silk scarf',
    descriptionAr: 'حرير ٩٠×٩٠ سم بطباعة محدودة.',
    descriptionEn: '90×90 cm silk with a limited-run print.',
    categoryId: categoryIds.accessories,
    basePriceMinor: 95_000,
    sizes: ['one-size'],
    colors: ['stone', 'amber'],
  },
];

export const productsSeed = seedSpec.map((p) => ({
  id: p.productId,
  slug: p.slug,
  sku: p.sku,
  titleAr: p.titleAr,
  titleEn: p.titleEn,
  descriptionAr: p.descriptionAr,
  descriptionEn: p.descriptionEn,
  status: 'active' as const,
  categoryId: p.categoryId,
  basePriceMinor: p.basePriceMinor,
  currency: 'EGP',
  isFeatured: true,
}));

export const variantsSeed = seedSpec.flatMap((p) =>
  p.sizes.flatMap((size) =>
    p.colors.map((color) => ({
      id: generateId('var'),
      productId: p.productId,
      sku: `${p.sku}-${size.toUpperCase()}-${color.toUpperCase()}`,
      size,
      color,
      priceMinor: p.basePriceMinor,
    })),
  ),
);

export { seedSpec as _seedSpec };
