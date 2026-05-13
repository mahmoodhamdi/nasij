import { sql } from 'drizzle-orm';
import { text, timestamp } from 'drizzle-orm/pg-core';

export const idColumn = (name = 'id') => text(name).primaryKey();

export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .default(sql`now()`),
};

export const softDelete = {
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
};
