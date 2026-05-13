import { generateId } from '../ids.js';

export const customersSeed = [
  {
    id: generateId('cus'),
    email: 'amina.salah@example.com',
    firstName: 'Amina',
    lastName: 'Salah',
    phone: '+201000000001',
    locale: 'ar',
    marketingOptIn: true,
  },
  {
    id: generateId('cus'),
    email: 'omar.khaled@example.com',
    firstName: 'Omar',
    lastName: 'Khaled',
    phone: '+201000000002',
    locale: 'ar',
    marketingOptIn: false,
  },
  {
    id: generateId('cus'),
    email: 'sara.farouk@example.com',
    firstName: 'Sara',
    lastName: 'Farouk',
    phone: '+201000000003',
    locale: 'en',
    marketingOptIn: true,
  },
];
