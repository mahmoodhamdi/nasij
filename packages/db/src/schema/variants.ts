import { index, integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, softDelete, timestamps } from './_common.js';

import { products } from './products.js';

export const variants = pgTable(
  'variants',
  {
    id: idColumn(),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: text('sku').notNull(),
    size: text('size'),
    color: text('color'),
    /** Free-form attribute key/value map for non-size/color attributes. */
    attributes: jsonb('attributes').$type<Record<string, string>>().notNull().default({}),
    /** Price override in minor units (NULL means use product's basePrice). */
    priceMinor: integer('price_minor'),
    compareAtPriceMinor: integer('compare_at_price_minor'),
    weightGrams: integer('weight_grams'),
    barcode: text('barcode'),
    imageUrl: text('image_url'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    uniqueIndex('variants_sku_unique').on(t.sku),
    index('variants_product_idx').on(t.productId),
    index('variants_barcode_idx').on(t.barcode),
  ],
);

export type Variant = typeof variants.$inferSelect;
export type NewVariant = typeof variants.$inferInsert;
