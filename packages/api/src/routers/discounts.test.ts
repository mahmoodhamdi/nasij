import { describe, it, expect } from 'vitest';

import { evaluateDiscount } from './discounts.js';

type Discount = Parameters<typeof evaluateDiscount>[0];

const base: Discount = {
  id: 'd1',
  code: 'SUMMER',
  name: 'Summer',
  type: 'percentage',
  value: 1000, // 10%
  conditions: null,
  minimumSubtotalMinor: null,
  usageLimit: null,
  usageCount: 0,
  perCustomerLimit: null,
  isActive: true,
  startsAt: null,
  endsAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('evaluateDiscount', () => {
  it('rejects inactive discount', () => {
    const result = evaluateDiscount({ ...base, isActive: false }, 10_000);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('inactive');
  });

  it('rejects future start', () => {
    const future = new Date('2099-01-01T00:00:00Z');
    const result = evaluateDiscount({ ...base, startsAt: future }, 10_000);
    expect(result.reason).toBe('not-yet-started');
  });

  it('rejects past end', () => {
    const past = new Date('2000-01-01T00:00:00Z');
    const result = evaluateDiscount({ ...base, endsAt: past }, 10_000);
    expect(result.reason).toBe('expired');
  });

  it('rejects when usage limit is reached', () => {
    const result = evaluateDiscount({ ...base, usageLimit: 5, usageCount: 5 }, 10_000);
    expect(result.reason).toBe('usage-limit-reached');
  });

  it('rejects when below minimum subtotal', () => {
    const result = evaluateDiscount(
      { ...base, minimumSubtotalMinor: 20_000 },
      10_000,
    );
    expect(result.reason).toBe('minimum-subtotal');
  });

  it('applies 10% percentage discount correctly', () => {
    const result = evaluateDiscount(base, 10_000);
    expect(result.valid).toBe(true);
    expect(result.amountMinor).toBe(1_000);
  });

  it('caps percentage discount at subtotal', () => {
    const result = evaluateDiscount({ ...base, value: 20_000 }, 10_000);
    expect(result.amountMinor).toBe(10_000);
  });

  it('applies fixed-amount discount', () => {
    const result = evaluateDiscount({ ...base, type: 'fixed-amount', value: 500 }, 10_000);
    expect(result.amountMinor).toBe(500);
  });

  it('caps fixed-amount discount at subtotal', () => {
    const result = evaluateDiscount({ ...base, type: 'fixed-amount', value: 100_000 }, 10_000);
    expect(result.amountMinor).toBe(10_000);
  });

  it('returns free-shipping with zero amount', () => {
    const result = evaluateDiscount({ ...base, type: 'free-shipping' }, 10_000);
    expect(result.valid).toBe(true);
    expect(result.amountMinor).toBe(0);
  });

  it('returns zero for bogo (placeholder)', () => {
    const result = evaluateDiscount({ ...base, type: 'bogo' }, 10_000);
    expect(result.valid).toBe(true);
    expect(result.amountMinor).toBe(0);
  });
});
