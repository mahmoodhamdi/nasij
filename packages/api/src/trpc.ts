import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';

import type { Permission, Role } from '@nasij/auth';
import { can } from '@nasij/auth';

import type { TrpcContext } from './context.js';

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not signed in.' });
  }
  return next({ ctx });
});

export const protectedProcedure = t.procedure.use(requireAuth);

export const requirePermission = (permission: Permission) =>
  t.procedure.use(requireAuth).use(({ ctx, next }) => {
    const role = ctx.session?.role as Role | undefined;
    if (!role || !can(role, permission)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Missing permission.' });
    }
    return next({ ctx });
  });
