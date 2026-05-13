import { generateId } from '../ids.js';

export const usersSeed = [
  {
    id: generateId('usr'),
    email: 'owner@nasij.local',
    name: 'Mahmoud Hamdy',
    role: 'owner' as const,
    passwordHash: '$placeholder$',
    locale: 'ar',
  },
  {
    id: generateId('usr'),
    email: 'manager@nasij.local',
    name: 'Manager One',
    role: 'manager' as const,
    passwordHash: '$placeholder$',
    locale: 'ar',
  },
  {
    id: generateId('usr'),
    email: 'staff@nasij.local',
    name: 'Sales Staff',
    role: 'staff' as const,
    passwordHash: '$placeholder$',
    pinHash: '$placeholder$',
    locale: 'ar',
  },
];
