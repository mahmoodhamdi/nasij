import { cartRouter } from './routers/cart.js';
import { customersRouter } from './routers/customers.js';
import { discountsRouter } from './routers/discounts.js';
import { healthRouter } from './routers/health.js';
import { ordersRouter } from './routers/orders.js';
import { productsRouter } from './routers/products.js';
import { router } from './trpc.js';

export const appRouter = router({
  health: healthRouter,
  products: productsRouter,
  cart: cartRouter,
  orders: ordersRouter,
  customers: customersRouter,
  discounts: discountsRouter,
});

export type AppRouter = typeof appRouter;
