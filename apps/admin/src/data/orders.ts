export interface AdminOrder {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'captured' | 'failed' | 'refunded';
  channel: 'storefront' | 'pos' | 'admin';
  totalMinor: number;
  itemCount: number;
  placedAt: string;
  shippingAddress?: { city: string; line1: string };
  lines: ReadonlyArray<{
    sku: string;
    titleEn: string;
    quantity: number;
    unitPriceMinor: number;
  }>;
}

export const adminOrders: readonly AdminOrder[] = [
  {
    id: 'ord_001',
    number: 'NSJ-100001',
    customerName: 'Amina Salah',
    customerEmail: 'amina.salah@example.com',
    status: 'paid',
    paymentStatus: 'captured',
    channel: 'storefront',
    totalMinor: 245_000,
    itemCount: 1,
    placedAt: '2026-05-12T10:30:00Z',
    shippingAddress: { city: 'Cairo', line1: 'Zamalek' },
    lines: [
      { sku: 'NSJ-KFT-AMB-M-AMBER', titleEn: 'Amber kaftan (M)', quantity: 1, unitPriceMinor: 240_000 },
    ],
  },
  {
    id: 'ord_002',
    number: 'NSJ-100002',
    customerName: 'Omar Khaled',
    customerEmail: 'omar.khaled@example.com',
    status: 'shipped',
    paymentStatus: 'captured',
    channel: 'storefront',
    totalMinor: 425_000,
    itemCount: 2,
    placedAt: '2026-05-11T14:45:00Z',
    shippingAddress: { city: 'Alexandria', line1: 'Sidi Gaber' },
    lines: [
      { sku: 'NSJ-OVS-MEN-L-STONE', titleEn: "Men's overshirt (L)", quantity: 1, unitPriceMinor: 220_000 },
      { sku: 'NSJ-OVS-MEN-M-SAGE', titleEn: "Men's overshirt (M)", quantity: 1, unitPriceMinor: 220_000 },
    ],
  },
  {
    id: 'ord_003',
    number: 'NSJ-100003',
    customerName: 'Sara Farouk',
    customerEmail: 'sara.farouk@example.com',
    status: 'pending',
    paymentStatus: 'pending',
    channel: 'storefront',
    totalMinor: 195_000,
    itemCount: 1,
    placedAt: '2026-05-13T08:15:00Z',
    lines: [
      { sku: 'NSJ-TRS-LIN-S-STONE', titleEn: 'Wide-leg trousers (S)', quantity: 1, unitPriceMinor: 195_000 },
    ],
  },
  {
    id: 'ord_004',
    number: 'NSJ-100004',
    customerName: 'In-store (POS)',
    customerEmail: '',
    status: 'delivered',
    paymentStatus: 'captured',
    channel: 'pos',
    totalMinor: 95_000,
    itemCount: 1,
    placedAt: '2026-05-13T11:00:00Z',
    lines: [
      { sku: 'NSJ-ACC-SLK-STONE', titleEn: 'Silk scarf', quantity: 1, unitPriceMinor: 95_000 },
    ],
  },
];

export const findAdminOrderById = (id: string): AdminOrder | undefined =>
  adminOrders.find((o) => o.id === id);
