export interface CartItem {
  sku: string;
  unitPriceMinor: number;
  quantity: number;
  /** Optional line discount in minor units, applied after subtotal. */
  lineDiscountMinor?: number;
}

export interface CartTotalsOptions {
  /** Percentage in basis points: 1000 = 10%. */
  taxRateBasisPoints?: number;
  /** Cart-level discount in minor units. Applied after line discounts, before tax. */
  cartDiscountMinor?: number;
  /** Shipping in minor units. Added after tax. */
  shippingMinor?: number;
  /** Rounding mode for derived values. Default: half-up to nearest integer minor unit. */
  rounding?: 'half-up' | 'floor';
}

export interface CartTotals {
  subtotalMinor: number;
  discountMinor: number;
  taxableMinor: number;
  taxMinor: number;
  shippingMinor: number;
  totalMinor: number;
  itemCount: number;
}

const round = (value: number, mode: 'half-up' | 'floor'): number =>
  mode === 'half-up' ? Math.round(value) : Math.floor(value);

/**
 * Pure cart calculator. All math happens in minor units (no floating point error).
 * Throws on negative quantities or prices.
 */
export const computeCartTotals = (
  items: readonly CartItem[],
  options: CartTotalsOptions = {},
): CartTotals => {
  const {
    taxRateBasisPoints = 0,
    cartDiscountMinor = 0,
    shippingMinor = 0,
    rounding = 'half-up',
  } = options;

  if (taxRateBasisPoints < 0) throw new Error('taxRateBasisPoints must be non-negative.');
  if (cartDiscountMinor < 0) throw new Error('cartDiscountMinor must be non-negative.');
  if (shippingMinor < 0) throw new Error('shippingMinor must be non-negative.');

  let subtotalMinor = 0;
  let lineDiscountTotalMinor = 0;
  let itemCount = 0;

  for (const item of items) {
    if (item.quantity < 0) throw new Error('Item quantity must be non-negative.');
    if (item.unitPriceMinor < 0) throw new Error('Item unitPriceMinor must be non-negative.');
    const lineDiscount = item.lineDiscountMinor ?? 0;
    if (lineDiscount < 0) throw new Error('Item lineDiscountMinor must be non-negative.');
    subtotalMinor += item.unitPriceMinor * item.quantity;
    lineDiscountTotalMinor += lineDiscount;
    itemCount += item.quantity;
  }

  const discountMinor = Math.min(subtotalMinor, lineDiscountTotalMinor + cartDiscountMinor);
  const taxableMinor = Math.max(0, subtotalMinor - discountMinor);
  const taxMinor = round((taxableMinor * taxRateBasisPoints) / 10_000, rounding);
  const totalMinor = taxableMinor + taxMinor + shippingMinor;

  return {
    subtotalMinor,
    discountMinor,
    taxableMinor,
    taxMinor,
    shippingMinor,
    totalMinor,
    itemCount,
  };
};
