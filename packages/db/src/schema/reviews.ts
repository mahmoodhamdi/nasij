import { boolean, index, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { idColumn, timestamps } from './_common.js';

import { customers } from './customers.js';
import { products } from './products.js';

export const reviews = pgTable(
  'reviews',
  {
    id: idColumn(),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    /** Rating 1-5. */
    rating: integer('rating').notNull(),
    title: text('title'),
    body: text('body'),
    isApproved: boolean('is_approved').notNull().default(false),
    helpfulCount: integer('helpful_count').notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index('reviews_product_idx').on(t.productId),
    index('reviews_approved_idx').on(t.isApproved),
  ],
);

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
