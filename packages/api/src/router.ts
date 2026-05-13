import { healthRouter } from './routers/health.js';
import { productsRouter } from './routers/products.js';
import { router } from './trpc.js';

export const appRouter = router({
  health: healthRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
