export interface FixtureReview {
  productSlug: string;
  authorName: string;
  rating: number;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
}

export const fixtureReviews: readonly FixtureReview[] = [
  {
    productSlug: 'kaftan-amber',
    authorName: 'Amina S.',
    rating: 5,
    titleAr: 'مريح جدًا في الحر',
    titleEn: 'So breezy in summer',
    bodyAr: 'الكتان خفيف والتطريز اليدوي صمد بعد ٣ غسلات. لبسته كل أغسطس.',
    bodyEn: 'Linen is light and the embroidery survived three machine washes. Lived in it all August.',
    createdAt: '2026-04-22T10:00:00Z',
  },
  {
    productSlug: 'kaftan-amber',
    authorName: 'Sara F.',
    rating: 4,
    titleAr: 'القماش رائع، المقاس أكبر قليلًا',
    titleEn: 'Great fabric, runs a touch big',
    bodyAr: 'أخذت مقاسًا أصغر وكان أفضل، السدلة تستاهل.',
    bodyEn: 'Sized down. The drape is worth it.',
    createdAt: '2026-05-01T15:30:00Z',
  },
  {
    productSlug: 'linen-trousers',
    authorName: 'Omar K.',
    rating: 5,
    titleAr: 'استبدلت كل البناطيل التانية',
    titleEn: 'Replaced every other pair I own',
    bodyAr: 'الحزام المطاطي عبقري. حرية حركة بدون شكل رياضي.',
    bodyEn: 'Hidden elastic is genius. Movement without looking like joggers.',
    createdAt: '2026-04-28T09:15:00Z',
  },
  {
    productSlug: 'ribbed-tank',
    authorName: 'Hana M.',
    rating: 4,
    titleAr: 'طبقة مثالية',
    titleEn: 'Perfect layering piece',
    bodyAr: 'تحت المعطف ممتاز. أتمنى لو كان فيه لون أسود.',
    bodyEn: 'Wears well under the wool coat. Wish there was a black option.',
    createdAt: '2026-04-15T11:00:00Z',
  },
  {
    productSlug: 'wool-coat',
    authorName: 'Layla H.',
    rating: 5,
    titleAr: 'قطعة استثمار',
    titleEn: 'Investment piece',
    bodyAr: 'بناء الكتف حقيقي. هتعيش أكتر من البدائل الرخيصة.',
    bodyEn: 'Shoulder construction is real. Will outlast cheaper alternatives.',
    createdAt: '2026-03-12T16:45:00Z',
  },
  {
    productSlug: 'mens-overshirt',
    authorName: 'Tarek G.',
    rating: 4,
    titleAr: 'تشطيب نظيف بسعر معقول',
    titleEn: 'Solid build for the price',
    bodyAr: 'التويل ثقيل بشكل لطيف. الجيوب عملية فعلًا.',
    bodyEn: 'Twill is heavy in a good way. Pockets are practical.',
    createdAt: '2026-04-05T14:00:00Z',
  },
  {
    productSlug: 'mens-tee',
    authorName: 'Youssef A.',
    rating: 5,
    titleAr: 'أفضل تيشيرت في خزانتي',
    titleEn: 'Best heavyweight tee I own',
    bodyAr: 'يسدل بنظافة، الحاشية مش بتلتف.',
    bodyEn: 'Hangs cleanly, no curl at the hem.',
    createdAt: '2026-04-20T13:20:00Z',
  },
  {
    productSlug: 'silk-scarf',
    authorName: 'Noor I.',
    rating: 5,
    titleAr: 'الطباعة رائعة',
    titleEn: 'The print is gorgeous',
    bodyAr: 'لبسته في حفل زواج. اتنين قالولي عليه قبل ما الحفل يبدأ.',
    bodyEn: 'Wore it to a wedding. Two compliments before the ceremony.',
    createdAt: '2026-03-25T19:00:00Z',
  },
  {
    productSlug: 'leather-belt',
    authorName: 'Youssef A.',
    rating: 5,
    titleAr: 'الإبزيم هو التفصيلة',
    titleEn: 'Buckle is the detail',
    bodyAr: 'نحاس صافي، مفيش طلاء يتقشر.',
    bodyEn: 'Solid brass, no plating to chip.',
    createdAt: '2026-02-18T12:30:00Z',
  },
  {
    productSlug: 'canvas-tote',
    authorName: 'Hana M.',
    rating: 4,
    titleAr: 'حقيبة يومية ممتازة',
    titleEn: 'Great daily tote',
    bodyAr: 'تشيل لابتوب وكراسة بمساحة كافية.',
    bodyEn: 'Holds a laptop and a notebook with room to spare.',
    createdAt: '2026-04-30T08:00:00Z',
  },
];

export const reviewsForProduct = (slug: string): FixtureReview[] =>
  fixtureReviews.filter((r) => r.productSlug === slug);

export const averageRatingFor = (slug: string): { average: number; count: number } => {
  const list = reviewsForProduct(slug);
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / list.length, count: list.length };
};
