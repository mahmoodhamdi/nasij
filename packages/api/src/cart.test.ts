import { describe, it, expect } from 'vitest';

import { computeCartTotals, type CartItem } from './cart.js';

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  sku: 'SKU',
  unitPriceMinor: 10_000,
  quantity: 1,
  ...overrides,
});

describe('computeCartTotals', () => {
  it('handles an empty cart', () => {
    expect(computeCartTotals([])).toEqual({
      subtotalMinor: 0,
      discountMinor: 0,
      taxableMinor: 0,
      taxMinor: 0,
      shippingMinor: 0,
      totalMinor: 0,
      itemCount: 0,
    });
  });

  it('sums items and quantities', () => {
    const totals = computeCartTotals([item({ quantity: 2 }), item({ unitPriceMinor: 5_000 })]);
    expect(totals.subtotalMinor).toBe(25_000);
    expect(totals.itemCount).toBe(3);
  });

  it('applies tax to taxable amount only', () => {
    const totals = computeCartTotals([item({ unitPriceMinor: 100, quantity: 10 })], {
      taxRateBasisPoints: 1400,
    });
    expect(totals.taxMinor).toBe(140);
  });

  it('applies cart-level discount before tax', () => {
    const totals = computeCartTotals([item({ unitPriceMinor: 100, quantity: 10 })], {
      cartDiscountMinor: 200,
      taxRateBasisPoints: 1000,
    });
    expect(totals.discountMinor).toBe(200);
    expect(totals.taxableMinor).toBe(800);
    expect(totals.taxMinor).toBe(80);
  });

  it('clamps discount at subtotal', () => {
    const totals = computeCartTotals([item({ unitPriceMinor: 100, quantity: 1 })], {
      cartDiscountMinor: 10_000,
    });
    expect(totals.discountMinor).toBe(100);
    expect(totals.taxableMinor).toBe(0);
  });

  it('sums line discounts and cart discount', () => {
    const totals = computeCartTotals(
      [item({ unitPriceMinor: 1000, quantity: 1, lineDiscountMinor: 100 })],
      { cartDiscountMinor: 50 },
    );
    expect(totals.discountMinor).toBe(150);
  });

  it('adds shipping after tax', () => {
    const totals = computeCartTotals([item({ unitPriceMinor: 100, quantity: 1 })], {
      shippingMinor: 30,
      taxRateBasisPoints: 1000,
    });
    expect(totals.totalMinor).toBe(140);
  });

  it('rounds tax half-up by default', () => {
    const totals = computeCartTotals([item({ unitPriceMinor: 105, quantity: 1 })], {
      taxRateBasisPoints: 1500,
    });
    expect(totals.taxMinor).toBe(16);
  });

  it('rounds tax with floor when requested', () => {
    const totals = computeCartTotals([item({ unitPriceMinor: 105, quantity: 1 })], {
      taxRateBasisPoints: 1500,
      rounding: 'floor',
    });
    expect(totals.taxMinor).toBe(15);
  });

  it.each([
    ['negative taxRate', () => computeCartTotals([], { taxRateBasisPoints: -1 })],
    ['negative cart discount', () => computeCartTotals([], { cartDiscountMinor: -1 })],
    ['negative shipping', () => computeCartTotals([], { shippingMinor: -1 })],
    ['negative quantity', () => computeCartTotals([item({ quantity: -1 })])],
    ['negative unit price', () => computeCartTotals([item({ unitPriceMinor: -1 })])],
    ['negative line discount', () => computeCartTotals([item({ lineDiscountMinor: -1 })])],
  ])('throws on %s', (_label, fn) => {
    expect(fn).toThrow();
  });
});
