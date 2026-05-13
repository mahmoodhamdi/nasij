import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, timestamps } from './_common.js';
import { discountTypeEnum } from './enums.js';

export const discounts = pgTable(
  'discounts',
  {
    id: idColumn(),
    code: text('code').notNull(),
    name: text('name').notNull(),
    type: discountTypeEnum('type').notNull(),
    /** Percentage 0–10000 (basis points) for percentage; minor units for fixed-amount. */
    value: integer('value').notNull(),
    /** Stringified conditions / rules tree. */
    conditions: jsonb('conditions'),
    minimumSubtotalMinor: integer('minimum_subtotal_minor'),
    usageLimit: integer('usage_limit'),
    usageCount: integer('usage_count').notNull().default(0),
    perCustomerLimit: integer('per_customer_limit'),
    isActive: boolean('is_active').notNull().default(true),
    startsAt: timestamp('starts_at', { withTimezone: true, mode: 'date' }),
    endsAt: timestamp('ends_at', { withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('discounts_code_unique').on(t.code),
    index('discounts_active_idx').on(t.isActive),
  ],
);

export type Discount = typeof discounts.$inferSelect;
export type NewDiscount = typeof discounts.$inferInsert;
