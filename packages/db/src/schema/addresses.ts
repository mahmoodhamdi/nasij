import { boolean, index, pgTable, text } from 'drizzle-orm/pg-core';

import { idColumn, timestamps } from './_common.js';
import { addressTypeEnum } from './enums.js';

import { customers } from './customers.js';

export const addresses = pgTable(
  'addresses',
  {
    id: idColumn(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    type: addressTypeEnum('type').notNull(),
    fullName: text('full_name').notNull(),
    company: text('company'),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    region: text('region'),
    postalCode: text('postal_code'),
    countryCode: text('country_code').notNull().default('EG'),
    phone: text('phone'),
    isDefault: boolean('is_default').notNull().default(false),
    ...timestamps,
  },
  (t) => [index('addresses_customer_idx').on(t.customerId)],
);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
