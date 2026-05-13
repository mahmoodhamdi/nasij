import { describe, it, expect } from 'vitest';

import { localeOf, translate } from './translate.js';

const catalog = {
  common: {
    hello: 'Hello, {name}!',
    bye: 'Goodbye',
  },
  storefront: {},
};

describe('translate', () => {
  it('returns the value when the key exists', () => {
    expect(translate(catalog, 'common', 'bye')).toBe('Goodbye');
  });

  it('interpolates variables', () => {
    expect(translate(catalog, 'common', 'hello', { vars: { name: 'Mahmoud' } })).toBe(
      'Hello, Mahmoud!',
    );
  });

  it('leaves an unresolved placeholder intact when the variable is missing', () => {
    expect(translate(catalog, 'common', 'hello', { vars: {} })).toBe('Hello, {name}!');
  });

  it('falls back to the key when the namespace is missing', () => {
    expect(translate(catalog, 'pos', 'missing')).toBe('missing');
  });

  it('falls back to the provided fallback when the key is missing', () => {
    expect(translate(catalog, 'common', 'missing', { fallback: '—' })).toBe('—');
  });

  it('coerces numeric variables to string', () => {
    expect(translate({ common: { x: '{n} items' }, storefront: {} }, 'common', 'x', { vars: { n: 3 } })).toBe(
      '3 items',
    );
  });
});

describe('localeOf', () => {
  it('returns the catalog unchanged for type tagging', () => {
    expect(localeOf(catalog, 'ar')).toBe(catalog);
  });
});
