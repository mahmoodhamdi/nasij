import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const { getTranslator, requireLocale } = await import('./i18n.js');

describe('requireLocale', () => {
  it('returns the locale when valid', () => {
    expect(requireLocale('en')).toBe('en');
    expect(requireLocale('ar')).toBe('ar');
  });

  it('calls notFound() for invalid locale', () => {
    expect(() => requireLocale('fr')).toThrow('NEXT_NOT_FOUND');
    expect(() => requireLocale(undefined)).toThrow('NEXT_NOT_FOUND');
  });
});

describe('getTranslator', () => {
  it('returns a translator that resolves keys in EN', () => {
    const t = getTranslator('en');
    expect(t('common', 'nav.shop')).toBe('Shop');
  });

  it('returns a translator that resolves keys in AR', () => {
    const t = getTranslator('ar');
    expect(t('common', 'nav.shop')).toBe('التسوق');
  });

  it('passes options through', () => {
    const t = getTranslator('en');
    expect(t('common', 'missing', { fallback: '—' })).toBe('—');
  });
});
