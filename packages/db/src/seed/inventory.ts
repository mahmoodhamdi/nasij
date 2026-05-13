import { generateId } from '../ids.js';

import { variantsSeed } from './products.js';

export const locationsSeed = [
  {
    id: generateId('loc'),
    name: 'Online',
    type: 'online',
    timezone: 'Africa/Cairo',
  },
  {
    id: generateId('loc'),
    name: 'Cairo Flagship',
    type: 'store',
    address: 'Zamalek, Cairo, Egypt',
    timezone: 'Africa/Cairo',
  },
];

export const inventorySeed = variantsSeed.flatMap((variant) =>
  locationsSeed.map((location) => ({
    id: generateId('inv'),
    variantId: variant.id,
    locationId: location.id,
    available: 10 + Math.floor(Math.random() * 40),
    reserved: 0,
    reorderPoint: 5,
  })),
);
