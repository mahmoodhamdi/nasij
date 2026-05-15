import { generateId } from '../ids.js';

import { customersSeed } from './customers.js';
import { variantsSeed, _seedSpec as productSpec } from './products.js';
import { locationsSeed } from './inventory.js';
import { usersSeed } from './users.js';

interface SeedOrderLine {
  variantIndex: number;
  quantity: number;
}

interface SeedOrder {
  number: string;
  customerIndex: number;
  channel: 'storefront' | 'pos' | 'admin';
  status: 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled' | 'returned';
  placedDaysAgo: number;
  shippingMinor: number;
  discountMinor: number;
  lines: SeedOrderLine[];
  staffIndex?: number;
  locationIndex?: number;
}

const productByVariantIndex = (variantIndex: number) => {
  const v = variantsSeed[variantIndex];
  if (!v) throw new Error(`No variant at ${variantIndex}`);
  const product = productSpec.find((p) => p.productId === v.productId);
  if (!product) throw new Error('Product missing');
  return { variant: v, product };
};

const orderSpec: SeedOrder[] = [
  {
    number: 'NSJ-100001',
    customerIndex: 0,
    channel: 'storefront',
    status: 'delivered',
    paymentStatus: 'captured',
    fulfillmentStatus: 'fulfilled',
    placedDaysAgo: 14,
    shippingMinor: 5_000,
    discountMinor: 0,
    lines: [
      { variantIndex: 0, quantity: 1 },
      { variantIndex: 5, quantity: 1 },
    ],
  },
  {
    number: 'NSJ-100002',
    customerIndex: 1,
    channel: 'storefront',
    status: 'shipped',
    paymentStatus: 'captured',
    fulfillmentStatus: 'fulfilled',
    placedDaysAgo: 7,
    shippingMinor: 5_000,
    discountMinor: 2_000,
    lines: [{ variantIndex: 12, quantity: 2 }],
  },
  {
    number: 'NSJ-100003',
    customerIndex: 2,
    channel: 'storefront',
    status: 'paid',
    paymentStatus: 'captured',
    fulfillmentStatus: 'unfulfilled',
    placedDaysAgo: 3,
    shippingMinor: 0,
    discountMinor: 0,
    lines: [
      { variantIndex: 20, quantity: 1 },
      { variantIndex: 25, quantity: 1 },
    ],
  },
  {
    number: 'NSJ-100004',
    customerIndex: 3,
    channel: 'pos',
    status: 'fulfilled',
    paymentStatus: 'captured',
    fulfillmentStatus: 'fulfilled',
    placedDaysAgo: 2,
    shippingMinor: 0,
    discountMinor: 0,
    lines: [{ variantIndex: 30, quantity: 1 }],
    staffIndex: 2,
    locationIndex: 1,
  },
  {
    number: 'NSJ-100005',
    customerIndex: 4,
    channel: 'pos',
    status: 'fulfilled',
    paymentStatus: 'captured',
    fulfillmentStatus: 'fulfilled',
    placedDaysAgo: 1,
    shippingMinor: 0,
    discountMinor: 0,
    lines: [
      { variantIndex: 35, quantity: 1 },
      { variantIndex: 40, quantity: 2 },
    ],
    staffIndex: 2,
    locationIndex: 1,
  },
  {
    number: 'NSJ-100006',
    customerIndex: 5,
    channel: 'storefront',
    status: 'pending',
    paymentStatus: 'pending',
    fulfillmentStatus: 'unfulfilled',
    placedDaysAgo: 0,
    shippingMinor: 5_000,
    discountMinor: 0,
    lines: [{ variantIndex: 45, quantity: 1 }],
  },
  {
    number: 'NSJ-100007',
    customerIndex: 6,
    channel: 'storefront',
    status: 'cancelled',
    paymentStatus: 'refunded',
    fulfillmentStatus: 'unfulfilled',
    placedDaysAgo: 5,
    shippingMinor: 5_000,
    discountMinor: 0,
    lines: [{ variantIndex: 50, quantity: 1 }],
  },
  {
    number: 'NSJ-100008',
    customerIndex: 7,
    channel: 'storefront',
    status: 'delivered',
    paymentStatus: 'captured',
    fulfillmentStatus: 'fulfilled',
    placedDaysAgo: 21,
    shippingMinor: 5_000,
    discountMinor: 5_000,
    lines: [
      { variantIndex: 4, quantity: 1 },
      { variantIndex: 18, quantity: 1 },
      { variantIndex: 55, quantity: 1 },
    ],
  },
  {
    number: 'NSJ-100009',
    customerIndex: 0,
    channel: 'storefront',
    status: 'paid',
    paymentStatus: 'captured',
    fulfillmentStatus: 'partial',
    placedDaysAgo: 1,
    shippingMinor: 5_000,
    discountMinor: 0,
    lines: [{ variantIndex: 8, quantity: 2 }],
  },
  {
    number: 'NSJ-100010',
    customerIndex: 1,
    channel: 'pos',
    status: 'fulfilled',
    paymentStatus: 'captured',
    fulfillmentStatus: 'fulfilled',
    placedDaysAgo: 0,
    shippingMinor: 0,
    discountMinor: 0,
    lines: [
      { variantIndex: 60, quantity: 1 },
      { variantIndex: 22, quantity: 1 },
    ],
    staffIndex: 2,
    locationIndex: 1,
  },
];

const dayInMs = 86_400_000;
const now = Date.now();

const computeLines = (lines: SeedOrderLine[]) =>
  lines.map((line) => {
    const { variant, product } = productByVariantIndex(line.variantIndex);
    const unitPriceMinor = variant.priceMinor;
    const totalMinor = unitPriceMinor * line.quantity;
    return {
      variantId: variant.id,
      sku: variant.sku,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      quantity: line.quantity,
      unitPriceMinor,
      totalMinor,
    };
  });

const built = orderSpec.map((spec) => {
  const orderId = generateId('ord');
  const placedAt = new Date(now - spec.placedDaysAgo * dayInMs);
  const customer = customersSeed[spec.customerIndex];
  if (!customer) throw new Error(`No customer at ${spec.customerIndex}`);
  const staff = spec.staffIndex !== undefined ? usersSeed[spec.staffIndex] : undefined;
  const location =
    spec.locationIndex !== undefined ? locationsSeed[spec.locationIndex] : locationsSeed[0];
  if (!location) throw new Error('Location missing in seed');
  const lines = computeLines(spec.lines);
  const subtotalMinor = lines.reduce((acc, l) => acc + l.totalMinor, 0);
  const taxMinor = Math.round(subtotalMinor * 0.14);
  const totalMinor = subtotalMinor + spec.shippingMinor + taxMinor - spec.discountMinor;

  const paidAt =
    spec.paymentStatus === 'captured' || spec.paymentStatus === 'refunded'
      ? placedAt
      : null;
  const shippedAt =
    spec.status === 'shipped' || spec.status === 'delivered'
      ? new Date(placedAt.getTime() + dayInMs)
      : null;
  const deliveredAt =
    spec.status === 'delivered' ? new Date(placedAt.getTime() + 3 * dayInMs) : null;
  const cancelledAt = spec.status === 'cancelled' ? placedAt : null;

  return {
    order: {
      id: orderId,
      number: spec.number,
      customerId: customer.id,
      staffId: staff?.id ?? null,
      locationId: location.id,
      channel: spec.channel,
      status: spec.status,
      paymentStatus: spec.paymentStatus,
      fulfillmentStatus: spec.fulfillmentStatus,
      currency: 'EGP',
      subtotalMinor,
      discountMinor: spec.discountMinor,
      shippingMinor: spec.shippingMinor,
      taxMinor,
      totalMinor,
      placedAt,
      paidAt,
      shippedAt,
      deliveredAt,
      cancelledAt,
      notesCustomer: null,
      notesInternal: null,
      shippingAddress:
        spec.channel === 'storefront'
          ? {
              line1: `${1 + spec.customerIndex} Nile St`,
              city: 'Cairo',
              country: 'EG',
              postcode: '11211',
            }
          : null,
      billingAddress:
        spec.channel === 'storefront'
          ? {
              line1: `${1 + spec.customerIndex} Nile St`,
              city: 'Cairo',
              country: 'EG',
              postcode: '11211',
            }
          : null,
    },
    items: lines.map((line) => ({
      id: generateId('oit'),
      orderId,
      variantId: line.variantId,
      titleAr: line.titleAr,
      titleEn: line.titleEn,
      sku: line.sku,
      quantity: line.quantity,
      unitPriceMinor: line.unitPriceMinor,
      discountMinor: 0,
      totalMinor: line.totalMinor,
    })),
    payment:
      spec.paymentStatus === 'pending'
        ? null
        : {
            id: generateId('pay'),
            orderId,
            provider: spec.channel === 'pos' ? 'cash' : 'paymob',
            providerRef: spec.channel === 'pos' ? null : `paymob_${spec.number}`,
            status: spec.paymentStatus,
            amountMinor: totalMinor,
            currency: 'EGP',
          },
  };
});

export const ordersSeed = built.map((b) => b.order);
export const orderItemsSeed = built.flatMap((b) => b.items);
export const paymentsSeed = built.flatMap((b) => (b.payment ? [b.payment] : []));
