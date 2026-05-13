import { schema } from '@nasij/db';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc.js';

const ListInput = z.object({
  status: z.enum(['draft', 'active', 'archived']).default('active'),
  limit: z.number().min(1).max(100).default(24),
});

const BySlugInput = z.object({
  slug: z.string().min(1),
});

export const productsRouter = router({
  list: publicProcedure.input(ListInput).query(({ ctx, input }) =>
    ctx.db.query.products.findMany({
      where: eq(schema.products.status, input.status),
      limit: input.limit,
    }),
  ),
  bySlug: publicProcedure.input(BySlugInput).query(({ ctx, input }) =>
    ctx.db.query.products.findFirst({
      where: and(eq(schema.products.slug, input.slug), eq(schema.products.status, 'active')),
    }),
  ),
});
