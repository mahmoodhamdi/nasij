export interface AdminDiscount {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed-amount' | 'free-shipping' | 'bogo';
  value: number;
  minimumSubtotalMinor: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
}

export const adminDiscounts: readonly AdminDiscount[] = [
  {
    id: 'dsc_001',
    code: 'WELCOME10',
    name: 'First-order 10%',
    type: 'percentage',
    value: 1000,
    minimumSubtotalMinor: 100_000,
    usageLimit: null,
    usageCount: 247,
    perCustomerLimit: 1,
    isActive: true,
  },
  {
    id: 'dsc_002',
    code: 'SUMMER25',
    name: 'Summer collection 25%',
    type: 'percentage',
    value: 2500,
    minimumSubtotalMinor: 200_000,
    usageLimit: 500,
    usageCount: 184,
    perCustomerLimit: null,
    isActive: true,
    startsAt: '2026-05-01T00:00:00Z',
    endsAt: '2026-07-31T23:59:59Z',
  },
  {
    id: 'dsc_003',
    code: 'FREESHIP',
    name: 'Free shipping',
    type: 'free-shipping',
    value: 0,
    minimumSubtotalMinor: 300_000,
    usageLimit: null,
    usageCount: 612,
    perCustomerLimit: null,
    isActive: true,
  },
  {
    id: 'dsc_004',
    code: 'EID50',
    name: 'Eid promo — 50 EGP off',
    type: 'fixed-amount',
    value: 5_000,
    minimumSubtotalMinor: 150_000,
    usageLimit: 200,
    usageCount: 158,
    perCustomerLimit: 1,
    isActive: true,
    endsAt: '2026-06-15T23:59:59Z',
  },
];

const formatPercent = (basisPoints: number) => `${(basisPoints / 100).toFixed(0)}%`;
const formatEgp = (minor: number) => `EGP ${(minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDiscountValue = (d: AdminDiscount): string => {
  if (d.type === 'percentage') return formatPercent(d.value);
  if (d.type === 'fixed-amount') return formatEgp(d.value);
  if (d.type === 'free-shipping') return 'Free shipping';
  return 'BOGO';
};
