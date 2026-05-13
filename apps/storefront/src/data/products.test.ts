import { describe, it, expect } from 'vitest';

import { findProductBySlug, fixtureProducts, listProducts } from './products.js';

describe('fixtureProducts', () => {
  it('exposes at least the seeded products', () => {
    expect(fixtureProducts.length).toBeGreaterThanOrEqual(5);
  });

  it('every product has a unique slug', () => {
    const slugs = new Set(fixtureProducts.map((p) => p.slug));
    expect(slugs.size).toBe(fixtureProducts.length);
  });

  it('every product has at least one variant', () => {
    for (const product of fixtureProducts) {
      expect(product.variants.length).toBeGreaterThan(0);
    }
  });
});

describe('findProductBySlug', () => {
  it('returns the product when it exists', () => {
    expect(findProductBySlug('kaftan-amber')?.slug).toBe('kaftan-amber');
  });

  it('returns undefined for unknown slug', () => {
    expect(findProductBySlug('nope')).toBeUndefined();
  });
});

describe('listProducts', () => {
  it('returns everything by default', () => {
    expect(listProducts()).toHaveLength(fixtureProducts.length);
  });

  it('filters by category', () => {
    const men = listProducts({ category: 'men' });
    expect(men.every((p) => p.category === 'men')).toBe(true);
  });

  it('filters by search across English title', () => {
    const results = listProducts({ search: 'kaftan' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.slug).toBe('kaftan-amber');
  });

  it('filters by search across Arabic title', () => {
    const results = listProducts({ search: 'قفطان' });
    expect(results.length).toBeGreaterThan(0);
  });

  it('sorts by price ascending', () => {
    const results = listProducts({ sort: 'price-asc' });
    const prices = results.map((p) => p.basePriceMinor);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by price descending', () => {
    const results = listProducts({ sort: 'price-desc' });
    const prices = results.map((p) => p.basePriceMinor);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('returns empty for impossible search', () => {
    expect(listProducts({ search: 'no-match-string-zzz' })).toHaveLength(0);
  });
});
