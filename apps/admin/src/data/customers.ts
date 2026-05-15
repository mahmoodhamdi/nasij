export interface AdminCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  locale: 'ar' | 'en';
  marketingOptIn: boolean;
  ordersCount: number;
  lifetimeValueMinor: number;
  lastOrderAt?: string;
  createdAt: string;
}

export const adminCustomers: readonly AdminCustomer[] = [
  {
    id: 'cus_001',
    email: 'amina.salah@example.com',
    firstName: 'Amina',
    lastName: 'Salah',
    phone: '+201000000001',
    locale: 'ar',
    marketingOptIn: true,
    ordersCount: 2,
    lifetimeValueMinor: 480_000,
    lastOrderAt: '2026-05-13T10:30:00Z',
    createdAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'cus_002',
    email: 'omar.khaled@example.com',
    firstName: 'Omar',
    lastName: 'Khaled',
    phone: '+201000000002',
    locale: 'ar',
    marketingOptIn: false,
    ordersCount: 2,
    lifetimeValueMinor: 615_000,
    lastOrderAt: '2026-05-13T14:45:00Z',
    createdAt: '2026-02-04T11:30:00Z',
  },
  {
    id: 'cus_003',
    email: 'sara.farouk@example.com',
    firstName: 'Sara',
    lastName: 'Farouk',
    phone: '+201000000003',
    locale: 'en',
    marketingOptIn: true,
    ordersCount: 1,
    lifetimeValueMinor: 285_000,
    lastOrderAt: '2026-05-11T16:00:00Z',
    createdAt: '2026-02-19T08:15:00Z',
  },
  {
    id: 'cus_004',
    email: 'youssef.adel@example.com',
    firstName: 'Youssef',
    lastName: 'Adel',
    phone: '+201000000004',
    locale: 'ar',
    marketingOptIn: true,
    ordersCount: 1,
    lifetimeValueMinor: 130_000,
    lastOrderAt: '2026-05-12T19:00:00Z',
    createdAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'cus_005',
    email: 'noor.ibrahim@example.com',
    firstName: 'Noor',
    lastName: 'Ibrahim',
    phone: '+201000000005',
    locale: 'ar',
    marketingOptIn: false,
    ordersCount: 1,
    lifetimeValueMinor: 245_000,
    lastOrderAt: '2026-05-13T07:30:00Z',
    createdAt: '2026-03-15T10:45:00Z',
  },
  {
    id: 'cus_006',
    email: 'hana.mostafa@example.com',
    firstName: 'Hana',
    lastName: 'Mostafa',
    phone: '+201000000006',
    locale: 'ar',
    marketingOptIn: true,
    ordersCount: 1,
    lifetimeValueMinor: 95_000,
    lastOrderAt: '2026-05-14T09:00:00Z',
    createdAt: '2026-04-02T13:20:00Z',
  },
  {
    id: 'cus_007',
    email: 'tarek.gamal@example.com',
    firstName: 'Tarek',
    lastName: 'Gamal',
    phone: '+201000000007',
    locale: 'en',
    marketingOptIn: false,
    ordersCount: 0,
    lifetimeValueMinor: 0,
    createdAt: '2026-04-18T15:00:00Z',
  },
  {
    id: 'cus_008',
    email: 'layla.hossam@example.com',
    firstName: 'Layla',
    lastName: 'Hossam',
    phone: '+201000000008',
    locale: 'ar',
    marketingOptIn: true,
    ordersCount: 1,
    lifetimeValueMinor: 555_000,
    lastOrderAt: '2026-04-23T11:15:00Z',
    createdAt: '2026-04-23T11:00:00Z',
  },
];

export const findCustomerById = (id: string): AdminCustomer | undefined =>
  adminCustomers.find((c) => c.id === id);
