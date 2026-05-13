/**
 * Mirror of the storefront fixtures so the admin can render meaningful UI
 * before the DB is wired up. Replace with tRPC `products` mutations once
 * the @nasij/api product write surface is built out.
 */

export interface AdminProduct {
  id: string;
  slug: string;
  sku: string;
  titleAr: string;
  titleEn: string;
  status: 'draft' | 'active' | 'archived';
  basePriceMinor: number;
  currency: 'EGP';
  category: 'women' | 'men' | 'accessories';
  variantCount: number;
  totalStock: number;
  updatedAt: string;
}

export const adminProducts: readonly AdminProduct[] = [
  {
    id: 'prd_kaftan',
    slug: 'kaftan-amber',
    sku: 'NSJ-KFT-AMB',
    titleAr: 'قفطان عنبري',
    titleEn: 'Amber kaftan',
    status: 'active',
    basePriceMinor: 240_000,
    currency: 'EGP',
    category: 'women',
    variantCount: 10,
    totalStock: 87,
    updatedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'prd_trousers',
    slug: 'linen-trousers',
    sku: 'NSJ-TRS-LIN',
    titleAr: 'بنطلون كتان واسع',
    titleEn: 'Wide-leg linen trousers',
    status: 'active',
    basePriceMinor: 195_000,
    currency: 'EGP',
    category: 'women',
    variantCount: 10,
    totalStock: 42,
    updatedAt: '2026-04-22T14:00:00Z',
  },
  {
    id: 'prd_shirt',
    slug: 'oversized-shirt',
    sku: 'NSJ-SHR-OVR',
    titleAr: 'قميص أوفر سايز',
    titleEn: 'Oversized poplin shirt',
    status: 'active',
    basePriceMinor: 165_000,
    currency: 'EGP',
    category: 'women',
    variantCount: 8,
    totalStock: 31,
    updatedAt: '2026-05-01T09:00:00Z',
  },
  {
    id: 'prd_overshirt',
    slug: 'mens-overshirt',
    sku: 'NSJ-OVS-MEN',
    titleAr: 'قميص رجالي خارجي',
    titleEn: "Men's overshirt",
    status: 'active',
    basePriceMinor: 220_000,
    currency: 'EGP',
    category: 'men',
    variantCount: 12,
    totalStock: 64,
    updatedAt: '2026-05-04T16:00:00Z',
  },
  {
    id: 'prd_scarf',
    slug: 'silk-scarf',
    sku: 'NSJ-ACC-SLK',
    titleAr: 'إيشارب حرير',
    titleEn: 'Silk scarf',
    status: 'draft',
    basePriceMinor: 95_000,
    currency: 'EGP',
    category: 'accessories',
    variantCount: 2,
    totalStock: 15,
    updatedAt: '2026-05-10T08:00:00Z',
  },
];

export const findAdminProductById = (id: string): AdminProduct | undefined =>
  adminProducts.find((p) => p.id === id);
