import { index, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, timestamps } from './_common.js';

import { variants } from './variants.js';

export const locations = pgTable(
  'locations',
  {
    id: idColumn(),
    name: text('name').notNull(),
    type: text('type').notNull().default('store'),
    address: text('address'),
    timezone: text('timezone').notNull().default('Africa/Cairo'),
    ...timestamps,
  },
  (t) => [uniqueIndex('locations_name_unique').on(t.name)],
);

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export const inventoryLevels = pgTable(
  'inventory_levels',
  {
    id: idColumn(),
    variantId: text('variant_id')
      .notNull()
      .references(() => variants.id, { onDelete: 'cascade' }),
    locationId: text('location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
    /** Available units across this variant + location. */
    available: integer('available').notNull().default(0),
    /** Reserved by pending orders or POS holds. */
    reserved: integer('reserved').notNull().default(0),
    reorderPoint: integer('reorder_point').notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('inventory_variant_location_unique').on(t.variantId, t.locationId),
    index('inventory_variant_idx').on(t.variantId),
    index('inventory_location_idx').on(t.locationId),
  ],
);

export type InventoryLevel = typeof inventoryLevels.$inferSelect;
export type NewInventoryLevel = typeof inventoryLevels.$inferInsert;

export const stockMovements = pgTable(
  'stock_movements',
  {
    id: idColumn(),
    variantId: text('variant_id')
      .notNull()
      .references(() => variants.id, { onDelete: 'cascade' }),
    locationId: text('location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
    /** Positive = stock added; negative = stock removed. */
    quantity: integer('quantity').notNull(),
    /** Cause: 'order' | 'return' | 'adjust' | 'transfer' | 'restock' */
    reason: text('reason').notNull(),
    referenceId: text('reference_id'),
    note: text('note'),
    occurredAt: timestamp('occurred_at', { withTimezone: true, mode: 'date' }).notNull(),
    ...timestamps,
  },
  (t) => [
    index('stock_movements_variant_idx').on(t.variantId),
    index('stock_movements_location_idx').on(t.locationId),
    index('stock_movements_reason_idx').on(t.reason),
  ],
);

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;
