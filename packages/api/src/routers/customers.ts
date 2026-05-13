import { schema } from '@nasij/db';
import { eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

import { requirePermission, router } from '../trpc.js';

const SearchInput = z.object({
  query: z.string().min(1).max(120).optional(),
  limit: z.number().int().min(1).max(100).default(25),
});

const ByIdInput = z.object({ id: z.string().min(1) });

export const customersRouter = router({
  search: requirePermission('customers:read').input(SearchInput).query(({ ctx, input }) => {
    const term = input.query?.trim() ?? '';
    const where = term
      ? or(
          ilike(schema.customers.email, `%${term}%`),
          ilike(schema.customers.firstName, `%${term}%`),
          ilike(schema.customers.lastName, `%${term}%`),
          ilike(schema.customers.phone, `%${term}%`),
        )
      : undefined;
    return ctx.db.query.customers.findMany({
      where,
      limit: input.limit,
      orderBy: (customers, { desc }) => [desc(customers.createdAt)],
    });
  }),
  byId: requirePermission('customers:read').input(ByIdInput).query(({ ctx, input }) =>
    ctx.db.query.customers.findFirst({
      where: eq(schema.customers.id, input.id),
    }),
  ),
});
