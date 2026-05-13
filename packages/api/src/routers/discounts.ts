import { schema } from '@nasij/db';
import { and, eq, gte, lte, or, isNull } from 'drizzle-orm';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc.js';

const ApplyInput = z.object({
  code: z.string().trim().min(1).max(64),
  subtotalMinor: z.number().int().nonnegative(),
});

export interface DiscountApplyResult {
  valid: boolean;
  reason?:
    | 'not-found'
    | 'inactive'
    | 'not-yet-started'
    | 'expired'
    | 'usage-limit-reached'
    | 'minimum-subtotal';
  amountMinor?: number;
}

export const evaluateDiscount = (
  discount: typeof schema.discounts.$inferSelect,
  subtotalMinor: number,
  now: Date = new Date(),
): DiscountApplyResult => {
  if (!discount.isActive) return { valid: false, reason: 'inactive' };
  if (discount.startsAt && discount.startsAt > now) return { valid: false, reason: 'not-yet-started' };
  if (discount.endsAt && discount.endsAt < now) return { valid: false, reason: 'expired' };
  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
    return { valid: false, reason: 'usage-limit-reached' };
  }
  if (discount.minimumSubtotalMinor !== null && subtotalMinor < discount.minimumSubtotalMinor) {
    return { valid: false, reason: 'minimum-subtotal' };
  }
  if (discount.type === 'percentage') {
    return {
      valid: true,
      amountMinor: Math.min(subtotalMinor, Math.round((subtotalMinor * discount.value) / 10_000)),
    };
  }
  if (discount.type === 'fixed-amount') {
    return { valid: true, amountMinor: Math.min(subtotalMinor, discount.value) };
  }
  if (discount.type === 'free-shipping') {
    return { valid: true, amountMinor: 0 };
  }
  return { valid: true, amountMinor: 0 };
};

export const discountsRouter = router({
  apply: publicProcedure.input(ApplyInput).query(async ({ ctx, input }) => {
    const discount = await ctx.db.query.discounts.findFirst({
      where: and(
        eq(schema.discounts.code, input.code),
        or(isNull(schema.discounts.endsAt), gte(schema.discounts.endsAt, new Date())),
        or(isNull(schema.discounts.startsAt), lte(schema.discounts.startsAt, new Date())),
      ),
    });
    if (!discount) {
      return { valid: false as const, reason: 'not-found' as const };
    }
    return evaluateDiscount(discount, input.subtotalMinor);
  }),
});
