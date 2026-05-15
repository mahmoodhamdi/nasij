import { sql } from 'drizzle-orm';

import { createClient } from '../client.js';
import * as schema from '../schema/index.js';

import { categoriesSeed, productsSeed, productImagesSeed, variantsSeed } from './products.js';
import { locationsSeed, inventorySeed } from './inventory.js';
import { customersSeed } from './customers.js';
import { usersSeed } from './users.js';
import { discountsSeed } from './discounts.js';
import { ordersSeed, orderItemsSeed, paymentsSeed } from './orders.js';
import { reviewsSeed } from './reviews.js';

const url = process.env['DATABASE_URL'];
if (!url) {
  throw new Error('DATABASE_URL is required to run the seed.');
}

const db = createClient({ url });

console.warn('Seeding…');

await db.transaction(async (tx) => {
  await tx.execute(sql`SET CONSTRAINTS ALL DEFERRED`);

  await tx.insert(schema.locations).values(locationsSeed);
  await tx.insert(schema.users).values(usersSeed);
  await tx.insert(schema.customers).values(customersSeed);
  await tx.insert(schema.categories).values(categoriesSeed);
  await tx.insert(schema.products).values(productsSeed);
  await tx.insert(schema.variants).values(variantsSeed);
  await tx.insert(schema.productImages).values(productImagesSeed);
  await tx.insert(schema.inventoryLevels).values(inventorySeed);
  await tx.insert(schema.discounts).values(discountsSeed);
  await tx.insert(schema.orders).values(ordersSeed);
  await tx.insert(schema.orderItems).values(orderItemsSeed);
  if (paymentsSeed.length > 0) {
    await tx.insert(schema.payments).values(paymentsSeed);
  }
  await tx.insert(schema.reviews).values(reviewsSeed);
});

console.warn('Seed complete.');
process.exit(0);
