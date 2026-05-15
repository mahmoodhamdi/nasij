import { generateId } from '../ids.js';

import { customersSeed } from './customers.js';
import { productsSeed } from './products.js';

interface SeedReview {
  productIndex: number;
  customerIndex: number;
  rating: number;
  title: string;
  body: string;
}

const reviewSpec: SeedReview[] = [
  {
    productIndex: 0,
    customerIndex: 0,
    rating: 5,
    title: 'Soft, breezy, perfect for August',
    body: 'Lived in this kaftan all summer. The hand embroidery survived three machine washes.',
  },
  {
    productIndex: 0,
    customerIndex: 2,
    rating: 4,
    title: 'Great fabric, runs a touch big',
    body: 'I sized down. Worth it for the drape.',
  },
  {
    productIndex: 1,
    customerIndex: 1,
    rating: 5,
    title: 'Replaced every other pair',
    body: 'Hidden elastic is genius. Movement without looking like joggers.',
  },
  {
    productIndex: 3,
    customerIndex: 5,
    rating: 4,
    title: 'Layers under everything',
    body: 'Wears well under the wool coat. Wish there was a black option.',
  },
  {
    productIndex: 4,
    customerIndex: 7,
    rating: 5,
    title: 'Investment piece',
    body: 'Shoulder construction is real. Will outlast cheaper alternatives.',
  },
  {
    productIndex: 5,
    customerIndex: 1,
    rating: 4,
    title: 'Good build for the price',
    body: 'Twill is heavy in a good way. Pockets are practical.',
  },
  {
    productIndex: 7,
    customerIndex: 6,
    rating: 5,
    title: 'Best heavyweight tee I own',
    body: 'Hangs cleanly, no curl at the hem.',
  },
  {
    productIndex: 8,
    customerIndex: 3,
    rating: 5,
    title: 'The print is gorgeous',
    body: 'Wore it to a wedding. Two compliments before the ceremony.',
  },
  {
    productIndex: 9,
    customerIndex: 4,
    rating: 5,
    title: 'Buckle is the detail',
    body: 'Solid brass, no plating to chip.',
  },
  {
    productIndex: 10,
    customerIndex: 5,
    rating: 4,
    title: 'Great daily tote',
    body: 'Holds a laptop and a notebook with room to spare.',
  },
];

export const reviewsSeed = reviewSpec
  .map((r) => {
    const product = productsSeed[r.productIndex];
    const customer = customersSeed[r.customerIndex];
    if (!product || !customer) return null;
    return {
      id: generateId('rvw'),
      productId: product.id,
      customerId: customer.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isApproved: true,
      helpfulCount: Math.floor(Math.random() * 25),
    };
  })
  .filter((r): r is NonNullable<typeof r> => r !== null);
