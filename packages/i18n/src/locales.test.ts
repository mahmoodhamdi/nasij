import { describe, it, expect } from 'vitest';

import { defaultLocale, isLocale, locales, oppositeLocale } from './locales.js';

describe('locales', () => {
  it('exposes ar and en in order', () => {
    expect(locales).toEqual(['ar', 'en']);
  });

  it('defaults to ar', () => {
    expect(defaultLocale).toBe('ar');
  });
});

describe('isLocale', () => {
  it('accepts the supported locales', () => {
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it.each(['fr', '', 'AR', null, undefined, 42, {}])(
    'rejects %p as not a supported locale',
    (value) => {
      expect(isLocale(value)).toBe(false);
    },
  );
});

describe('oppositeLocale', () => {
  it('flips ar to en and back', () => {
    expect(oppositeLocale('ar')).toBe('en');
    expect(oppositeLocale('en')).toBe('ar');
  });
});
