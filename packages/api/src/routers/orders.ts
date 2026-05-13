import { schema } from '@nasij/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requirePermission, router } from '../trpc.js';

const ListInput = z.object({
  status: z
    .enum(['pending', 'paid', 'fulfilled', 'shipped', 'delivered', 'returned', 'refunded', 'cancelled'])
    .optional(),
  limit: z.number().int().min(1).max(200).default(50),
});

const ByNumberInput = z.object({
  number: z.string().min(1),
});

const RefundInput = z.object({
  orderId: z.string().min(1),
  amountMinor: z.number().int().positive(),
  reason: z.string().max(500).optional(),
});

export const ordersRouter = router({
  list: requirePermission('orders:read').input(ListInput).query(({ ctx, input }) => {
    const where = input.status ? eq(schema.orders.status, input.status) : undefined;
    return ctx.db.query.orders.findMany({
      where,
      limit: input.limit,
      orderBy: (orders, { desc }) => [desc(orders.placedAt)],
    });
  }),
  byNumber: requirePermission('orders:read').input(ByNumberInput).query(({ ctx, input }) =>
    ctx.db.query.orders.findFirst({
      where: eq(schema.orders.number, input.number),
    }),
  ),
  refund: requirePermission('orders:refund').input(RefundInput).mutation(async ({ ctx, input }) => {
    // Real implementation will call the payment provider then update payment_status.
    // For now, write an audit_log entry and acknowledge.
    await ctx.db.insert(schema.auditLog).values({
      id: `aud_${Date.now().toString(36)}`,
      actorId: ctx.session?.subjectId ?? null,
      actorKind: 'user',
      action: 'order.refund',
      resource: 'order',
      resourceId: input.orderId,
      diff: { amountMinor: input.amountMinor, reason: input.reason ?? null },
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      occurredAt: new Date(),
    });
    return { ok: true as const, orderId: input.orderId, amountMinor: input.amountMinor };
  }),
});
