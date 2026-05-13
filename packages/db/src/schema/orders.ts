import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, timestamps } from './_common.js';
import { channelEnum, fulfillmentStatusEnum, orderStatusEnum, paymentStatusEnum } from './enums.js';

import { customers } from './customers.js';
import { variants } from './variants.js';
import { locations } from './inventory.js';
import { users } from './users.js';

export const orders = pgTable(
  'orders',
  {
    id: idColumn(),
    /** Public order number visible to customers, e.g. "NSJ-100023". */
    number: text('number').notNull(),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    /** For POS: the staff that rang up the sale; for storefront, null. */
    staffId: text('staff_id').references(() => users.id, { onDelete: 'set null' }),
    locationId: text('location_id').references(() => locations.id, { onDelete: 'set null' }),
    channel: channelEnum('channel').notNull().default('storefront'),
    status: orderStatusEnum('status').notNull().default('pending'),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
    fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status').notNull().default('unfulfilled'),
    currency: text('currency').notNull().default('EGP'),
    subtotalMinor: integer('subtotal_minor').notNull(),
    discountMinor: integer('discount_minor').notNull().default(0),
    shippingMinor: integer('shipping_minor').notNull().default(0),
    taxMinor: integer('tax_minor').notNull().default(0),
    totalMinor: integer('total_minor').notNull(),
    notesInternal: text('notes_internal'),
    notesCustomer: text('notes_customer'),
    shippingAddress: jsonb('shipping_address').$type<Record<string, string>>(),
    billingAddress: jsonb('billing_address').$type<Record<string, string>>(),
    placedAt: timestamp('placed_at', { withTimezone: true, mode: 'date' }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true, mode: 'date' }),
    shippedAt: timestamp('shipped_at', { withTimezone: true, mode: 'date' }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true, mode: 'date' }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('orders_number_unique').on(t.number),
    index('orders_customer_idx').on(t.customerId),
    index('orders_status_idx').on(t.status),
    index('orders_placed_at_idx').on(t.placedAt),
  ],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export const orderItems = pgTable(
  'order_items',
  {
    id: idColumn(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    variantId: text('variant_id').references(() => variants.id, { onDelete: 'set null' }),
    titleAr: text('title_ar').notNull(),
    titleEn: text('title_en').notNull(),
    sku: text('sku').notNull(),
    quantity: integer('quantity').notNull(),
    unitPriceMinor: integer('unit_price_minor').notNull(),
    discountMinor: integer('discount_minor').notNull().default(0),
    totalMinor: integer('total_minor').notNull(),
    ...timestamps,
  },
  (t) => [index('order_items_order_idx').on(t.orderId)],
);

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export const payments = pgTable(
  'payments',
  {
    id: idColumn(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    /** Provider: 'stripe' | 'paymob' | 'cash' | 'gift-card' | 'store-credit'. */
    provider: text('provider').notNull(),
    providerRef: text('provider_ref'),
    status: paymentStatusEnum('status').notNull().default('pending'),
    amountMinor: integer('amount_minor').notNull(),
    currency: text('currency').notNull().default('EGP'),
    payload: jsonb('payload'),
    ...timestamps,
  },
  (t) => [
    index('payments_order_idx').on(t.orderId),
    index('payments_provider_ref_idx').on(t.providerRef),
  ],
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
