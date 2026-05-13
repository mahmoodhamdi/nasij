import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { idColumn, timestamps } from './_common.js';

export const sessions = pgTable(
  'sessions',
  {
    id: idColumn(),
    /** References either users.id or customers.id depending on subject_kind. */
    subjectId: text('subject_id').notNull(),
    subjectKind: text('subject_kind').notNull(),
    tokenHash: text('token_hash').notNull(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'date' }),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (t) => [
    index('sessions_subject_idx').on(t.subjectId, t.subjectKind),
    index('sessions_token_idx').on(t.tokenHash),
    index('sessions_expires_idx').on(t.expiresAt),
  ],
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
