import { z } from 'zod';

import { computeCartTotals } from '../cart.js';
import { publicProcedure, router } from '../trpc.js';

const CartItemInput = z.object({
  sku: z.string().min(1),
  unitPriceMinor: z.number().int().nonnegative(),
  quantity: z.number().int().nonnegative(),
  lineDiscountMinor: z.number().int().nonnegative().optional(),
});

const TotalsInput = z.object({
  items: z.array(CartItemInput),
  taxRateBasisPoints: z.number().int().nonnegative().optional(),
  cartDiscountMinor: z.number().int().nonnegative().optional(),
  shippingMinor: z.number().int().nonnegative().optional(),
});

export const cartRouter = router({
  totals: publicProcedure.input(TotalsInput).query(({ input }) =>
    computeCartTotals(input.items, {
      taxRateBasisPoints: input.taxRateBasisPoints,
      cartDiscountMinor: input.cartDiscountMinor,
      shippingMinor: input.shippingMinor,
    }),
  ),
});
