import { generateId } from '../ids.js';

export const discountsSeed = [
  {
    id: generateId('dsc'),
    code: 'WELCOME10',
    name: 'First-order 10%',
    type: 'percentage' as const,
    value: 1000, // 10% in basis points
    minimumSubtotalMinor: 100_000,
    usageLimit: null,
    perCustomerLimit: 1,
    isActive: true,
  },
  {
    id: generateId('dsc'),
    code: 'SUMMER25',
    name: 'Summer collection 25%',
    type: 'percentage' as const,
    value: 2500,
    minimumSubtotalMinor: 200_000,
    usageLimit: 500,
    perCustomerLimit: null,
    isActive: true,
  },
  {
    id: generateId('dsc'),
    code: 'FREESHIP',
    name: 'Free shipping',
    type: 'free-shipping' as const,
    value: 0,
    minimumSubtotalMinor: 300_000,
    usageLimit: null,
    perCustomerLimit: null,
    isActive: true,
  },
  {
    id: generateId('dsc'),
    code: 'EID50',
    name: 'Eid promo — 50 EGP off',
    type: 'fixed-amount' as const,
    value: 5_000,
    minimumSubtotalMinor: 150_000,
    usageLimit: 200,
    perCustomerLimit: 1,
    isActive: true,
  },
];
