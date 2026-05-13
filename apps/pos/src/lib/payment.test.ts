import { describe, it, expect } from 'vitest';

import { computeCashChange, normalizeCardOutcome, validateSplitTender } from './payment.js';

describe('computeCashChange', () => {
  it('returns zero change when exact', () => {
    expect(computeCashChange(1000, 1000).changeMinor).toBe(0);
  });

  it('returns positive change when over-tendered', () => {
    expect(computeCashChange(1000, 1500).changeMinor).toBe(500);
  });

  it('throws when under-tendered', () => {
    expect(() => computeCashChange(1000, 999)).toThrow();
  });

  it('throws on negative inputs', () => {
    expect(() => computeCashChange(-1, 100)).toThrow();
    expect(() => computeCashChange(100, -1)).toThrow();
  });
});

describe('normalizeCardOutcome', () => {
  it.each(['approved', 'Success', 'AUTHORIZED'])('maps %p to approved', (raw) => {
    expect(normalizeCardOutcome(raw)).toBe('approved');
  });

  it.each(['declined', 'denied'])('maps %p to declined', (raw) => {
    expect(normalizeCardOutcome(raw)).toBe('declined');
  });

  it.each(['cancelled', 'canceled', 'aborted'])('maps %p to cancelled', (raw) => {
    expect(normalizeCardOutcome(raw)).toBe('cancelled');
  });

  it.each(['timeout', 'timed-out'])('maps %p to timeout', (raw) => {
    expect(normalizeCardOutcome(raw)).toBe('timeout');
  });

  it('falls back to declined for unknown strings', () => {
    expect(normalizeCardOutcome('mystery')).toBe('declined');
  });
});

describe('validateSplitTender', () => {
  it('accepts a sum that meets the total', () => {
    expect(validateSplitTender(1000, { cashMinor: 400, cardMinor: 600 })).toBe(true);
  });

  it('accepts a sum that exceeds the total (cash change)', () => {
    expect(validateSplitTender(1000, { cashMinor: 1500, cardMinor: 0 })).toBe(true);
  });

  it('rejects insufficient tender', () => {
    expect(validateSplitTender(1000, { cashMinor: 300, cardMinor: 600 })).toBe(false);
  });

  it('rejects negative amounts', () => {
    expect(validateSplitTender(1000, { cashMinor: -1, cardMinor: 1001 })).toBe(false);
    expect(validateSplitTender(1000, { cashMinor: 1001, cardMinor: -1 })).toBe(false);
  });
});
