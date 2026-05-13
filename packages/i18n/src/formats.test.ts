import { describe, it, expect } from 'vitest';

import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from './formats.js';

describe('formatCurrency', () => {
  it('formats EGP for Arabic', () => {
    const result = formatCurrency(12_345, { locale: 'ar' });
    expect(result).toContain('123');
    expect(result).toContain('45');
  });

  it('formats EGP for English', () => {
    const result = formatCurrency(12_345, { locale: 'en' });
    expect(result).toContain('123.45');
  });

  it('respects custom currency', () => {
    const result = formatCurrency(10_000, { locale: 'en', currency: 'USD' });
    expect(result).toContain('100.00');
  });

  it('respects custom minor unit exponent', () => {
    const result = formatCurrency(10_000, { locale: 'en', currency: 'BHD', minorUnitExponent: 3 });
    expect(result).toContain('10.000');
  });

  it('falls back to Arabic when no locale is passed', () => {
    const result = formatCurrency(100);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatNumber', () => {
  it('formats integers without fraction digits by default', () => {
    expect(formatNumber(1234, 'en')).toBe('1,234');
  });

  it('formats with fraction digits', () => {
    expect(formatNumber(1.2345, 'en', 2)).toBe('1.23');
  });
});

describe('formatDate', () => {
  it('formats a Date instance', () => {
    const out = formatDate(new Date('2026-01-15T00:00:00Z'), 'en', { dateStyle: 'short', timeZone: 'UTC' });
    expect(out).toMatch(/2026/);
  });

  it('formats a numeric timestamp', () => {
    const out = formatDate(0, 'en', { year: 'numeric', timeZone: 'UTC' });
    expect(out).toBe('1970');
  });

  it('formats an ISO string', () => {
    const out = formatDate('2026-05-13', 'en', { dateStyle: 'short', timeZone: 'UTC' });
    expect(out).toMatch(/26/);
  });
});

describe('formatRelativeTime', () => {
  const t0 = new Date('2026-01-01T00:00:00Z').getTime();

  it('formats seconds', () => {
    expect(formatRelativeTime(t0, t0 + 5_000, 'en')).toMatch(/5/);
  });

  it('formats minutes', () => {
    expect(formatRelativeTime(t0, t0 + 5 * 60_000, 'en')).toMatch(/5/);
  });

  it('formats hours', () => {
    expect(formatRelativeTime(t0, t0 + 5 * 3_600_000, 'en')).toMatch(/5/);
  });

  it('formats days', () => {
    expect(formatRelativeTime(t0, t0 + 5 * 86_400_000, 'en')).toMatch(/5/);
  });

  it('formats months', () => {
    expect(formatRelativeTime(t0, t0 + 95 * 86_400_000, 'en')).toMatch(/month/i);
  });

  it('formats years', () => {
    expect(formatRelativeTime(t0, t0 + 2 * 365 * 86_400_000, 'en')).toMatch(/year/i);
  });

  it('handles past times (negative diff)', () => {
    expect(formatRelativeTime(t0 + 86_400_000, t0, 'en')).toMatch(/yesterday|day/i);
  });
});
