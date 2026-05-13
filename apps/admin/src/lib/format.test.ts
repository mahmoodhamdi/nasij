import { describe, it, expect } from 'vitest';

import { formatDateShort, formatPriceEgp } from './format.js';

describe('formatPriceEgp', () => {
  it('formats minor units as EGP currency', () => {
    expect(formatPriceEgp(24_000)).toContain('240.00');
    expect(formatPriceEgp(24_000)).toContain('EGP');
  });
});

describe('formatDateShort', () => {
  it('accepts an ISO string', () => {
    expect(formatDateShort('2026-05-13T00:00:00Z')).toMatch(/2026/);
  });

  it('accepts a Date instance', () => {
    expect(formatDateShort(new Date('2026-05-13T00:00:00Z'))).toMatch(/2026/);
  });
});
