import { boolean, index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, softDelete, timestamps } from './_common.js';

export const customers = pgTable(
  'customers',
  {
    id: idColumn(),
    email: text('email').notNull(),
    emailVerifiedAt: text('email_verified_at'),
    passwordHash: text('password_hash'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    phone: text('phone'),
    locale: text('locale').notNull().default('ar'),
    marketingOptIn: boolean('marketing_opt_in').notNull().default(false),
    loyaltyPoints: integer('loyalty_points').notNull().default(0),
    loyaltyTier: text('loyalty_tier').notNull().default('bronze'),
    notes: text('notes'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    uniqueIndex('customers_email_unique').on(t.email),
    index('customers_phone_idx').on(t.phone),
  ],
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
