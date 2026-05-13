import { boolean, index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { idColumn, softDelete, timestamps } from './_common.js';
import { userRoleEnum } from './enums.js';

export const users = pgTable(
  'users',
  {
    id: idColumn(),
    email: text('email').notNull(),
    emailVerifiedAt: text('email_verified_at'),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('staff'),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    twoFactorSecret: text('two_factor_secret'),
    twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
    pinHash: text('pin_hash'),
    locale: text('locale').notNull().default('ar'),
    locationId: text('location_id'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    uniqueIndex('users_email_unique').on(t.email),
    index('users_role_idx').on(t.role),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
