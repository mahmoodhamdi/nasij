import { describe, it, expect } from 'vitest';

import { formatMinorUnits, fromMinorUnits, toMinorUnits } from './money.js';

describe('toMinorUnits', () => {
  it('converts EGP 1.25 to 125 piastres', () => {
    expect(toMinorUnits(1.25)).toBe(125);
  });

  it('rounds to the nearest minor unit', () => {
    expect(toMinorUnits(1.234)).toBe(123);
    expect(toMinorUnits(1.236)).toBe(124);
  });

  it('respects an explicit minor unit exponent', () => {
    expect(toMinorUnits(1, 3)).toBe(1000);
  });
});

describe('fromMinorUnits', () => {
  it('converts 125 piastres back to 1.25', () => {
    expect(fromMinorUnits(125)).toBe(1.25);
  });

  it('respects a custom minor unit exponent', () => {
    expect(fromMinorUnits(1000, 3)).toBe(1);
  });
});

describe('formatMinorUnits', () => {
  it('formats EGP for en-US', () => {
    const result = formatMinorUnits(12_345, 'EGP', 'en-US');
    expect(result).toContain('123.45');
  });

  it('respects custom exponent', () => {
    const result = formatMinorUnits(12_345, 'BHD', 'en-US', 3);
    expect(result).toContain('12.345');
  });
});
