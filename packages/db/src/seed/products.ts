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
    slug: 'ribbed-tank',
    sku: 'NSJ-TNK-RIB',
    titleAr: 'تانك توب مضلع',
    titleEn: 'Ribbed knit tank',
    descriptionAr: 'تريكو قطني مضلع بقصة قريبة من الجسم تحت أي طبقة.',
    descriptionEn: 'Ribbed cotton knit with a close-to-body cut that layers under anything.',
    categoryId: categoryIds.women,
    basePriceMinor: 85_000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['stone', 'amber', 'sage'],
  },
  {
    productId: generateId('prd'),
    slug: 'wool-coat',
    sku: 'NSJ-COA-WOL',
    titleAr: 'معطف صوف',
    titleEn: 'Long wool coat',
    descriptionAr: 'صوف ميرينو ٧٠٪ بأكمام مرتفعة وبطانة قطن.',
    descriptionEn: '70% merino wool with raised shoulders and a cotton lining.',
    categoryId: categoryIds.women,
    basePriceMinor: 450_000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['stone', 'terracotta'],
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
    slug: 'mens-chino',
    sku: 'NSJ-CHN-MEN',
    titleAr: 'بنطلون شينو رجالي',
    titleEn: "Men's chino trousers",
    descriptionAr: 'تويل قطن متوسط الوزن بحزام طبيعي ولوج جانبي.',
    descriptionEn: 'Mid-weight cotton twill with a natural waistband and side seams.',
    categoryId: categoryIds.men,
    basePriceMinor: 185_000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['stone', 'sage'],
  },
  {
    productId: generateId('prd'),
    slug: 'mens-tee',
    sku: 'NSJ-TEE-MEN',
    titleAr: 'تيشيرت رجالي',
    titleEn: "Men's heavyweight tee",
    descriptionAr: 'قطن ثقيل ٢٤٠ غرام بقصة كلاسيكية.',
    descriptionEn: '240gsm heavyweight cotton with a classic boxy cut.',
    categoryId: categoryIds.men,
    basePriceMinor: 95_000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['stone', 'amber', 'sage'],
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
  {
    productId: generateId('prd'),
    slug: 'leather-belt',
    sku: 'NSJ-ACC-BLT',
    titleAr: 'حزام جلد',
    titleEn: 'Vegetable-tanned leather belt',
    descriptionAr: 'جلد مدبوغ نباتيًا بإبزيم نحاسي يدوي.',
    descriptionEn: 'Vegetable-tanned leather with a hand-finished brass buckle.',
    categoryId: categoryIds.accessories,
    basePriceMinor: 130_000,
    sizes: ['S', 'M', 'L'],
    colors: ['stone', 'amber'],
  },
  {
    productId: generateId('prd'),
    slug: 'canvas-tote',
    sku: 'NSJ-ACC-TOT',
    titleAr: 'حقيبة قماش',
    titleEn: 'Canvas tote bag',
    descriptionAr: 'قماش قطني ثقيل ٤٠×٤٠ سم بحزام طويل.',
    descriptionEn: 'Heavy cotton canvas, 40×40 cm with a long shoulder strap.',
    categoryId: categoryIds.accessories,
    basePriceMinor: 65_000,
    sizes: ['one-size'],
    colors: ['stone', 'sage'],
  },
  {
    productId: generateId('prd'),
    slug: 'cotton-cap',
    sku: 'NSJ-ACC-CAP',
    titleAr: 'كاب قطني',
    titleEn: 'Washed cotton cap',
    descriptionAr: 'قطن مغسول بحزام معدني خلفي.',
    descriptionEn: 'Washed cotton with a back metal strap.',
    categoryId: categoryIds.accessories,
    basePriceMinor: 55_000,
    sizes: ['one-size'],
    colors: ['stone', 'sage', 'terracotta'],
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

const slugToImage: Record<string, string> = {
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

export const productImagesSeed = seedSpec.map((p) => ({
  id: generateId('img'),
  productId: p.productId,
  url: slugToImage[p.slug] ?? `https://picsum.photos/seed/nasij-${p.slug}/800/1067`,
  altAr: p.titleAr,
  altEn: p.titleEn,
  position: 0,
  width: 800,
  height: 1067,
}));

export { seedSpec as _seedSpec };
