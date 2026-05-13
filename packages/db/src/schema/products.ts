import { boolean, index, integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, softDelete, timestamps } from './_common.js';
import { productStatusEnum } from './enums.js';

export const categories = pgTable(
  'categories',
  {
    id: idColumn(),
    slug: text('slug').notNull(),
    nameAr: text('name_ar').notNull(),
    nameEn: text('name_en').notNull(),
    descriptionAr: text('description_ar'),
    descriptionEn: text('description_en'),
    parentId: text('parent_id'),
    position: integer('position').notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex('categories_slug_unique').on(t.slug)],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export const products = pgTable(
  'products',
  {
    id: idColumn(),
    slug: text('slug').notNull(),
    sku: text('sku').notNull(),
    titleAr: text('title_ar').notNull(),
    titleEn: text('title_en').notNull(),
    descriptionAr: text('description_ar'),
    descriptionEn: text('description_en'),
    status: productStatusEnum('status').notNull().default('draft'),
    categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
    /** Base price in minor units. Variants may override. */
    basePriceMinor: integer('base_price_minor').notNull(),
    compareAtPriceMinor: integer('compare_at_price_minor'),
    currency: text('currency').notNull().default('EGP'),
    isFeatured: boolean('is_featured').notNull().default(false),
    /** SEO + metadata fields stored as jsonb to allow per-locale enrichment. */
    seo: jsonb('seo').$type<{
      titleAr?: string;
      titleEn?: string;
      descriptionAr?: string;
      descriptionEn?: string;
      ogImage?: string;
    } | null>(),
    publishedAt: text('published_at'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    uniqueIndex('products_slug_unique').on(t.slug),
    uniqueIndex('products_sku_unique').on(t.sku),
    index('products_status_idx').on(t.status),
    index('products_category_idx').on(t.categoryId),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const productImages = pgTable(
  'product_images',
  {
    id: idColumn(),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    altAr: text('alt_ar'),
    altEn: text('alt_en'),
    position: integer('position').notNull().default(0),
    width: integer('width'),
    height: integer('height'),
    ...timestamps,
  },
  (t) => [index('product_images_product_idx').on(t.productId)],
);

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
