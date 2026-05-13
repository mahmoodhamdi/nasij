import { index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { idColumn } from './_common.js';

export const auditLog = pgTable(
  'audit_log',
  {
    id: idColumn(),
    actorId: text('actor_id'),
    actorKind: text('actor_kind').notNull().default('user'),
    action: text('action').notNull(),
    resource: text('resource').notNull(),
    resourceId: text('resource_id'),
    diff: jsonb('diff'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    occurredAt: timestamp('occurred_at', { withTimezone: true, mode: 'date' }).notNull(),
  },
  (t) => [
    index('audit_actor_idx').on(t.actorId),
    index('audit_resource_idx').on(t.resource, t.resourceId),
    index('audit_occurred_idx').on(t.occurredAt),
  ],
);

export type AuditEntry = typeof auditLog.$inferSelect;
export type NewAuditEntry = typeof auditLog.$inferInsert;
