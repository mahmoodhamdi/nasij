import { describe, it, expect } from 'vitest';

import { addLine, removeLine, summarize, type Line } from './cart.js';

const PRODUCT = { sku: 'A', titleEn: 'Thing', unitPriceMinor: 1000 };

describe('addLine', () => {
  it('adds a new line with quantity 1', () => {
    expect(addLine([], PRODUCT)).toEqual([{ ...PRODUCT, quantity: 1 }]);
  });

  it('increments quantity when the sku already exists', () => {
    const lines = addLine(addLine([], PRODUCT), PRODUCT);
    expect(lines).toHaveLength(1);
    expect(lines[0]!.quantity).toBe(2);
  });

  it('keeps other lines untouched when adding a new sku', () => {
    const a = addLine([], PRODUCT);
    const b = addLine(a, { sku: 'B', titleEn: 'Other', unitPriceMinor: 500 });
    expect(b).toHaveLength(2);
    expect(b.find((l) => l.sku === 'A')?.quantity).toBe(1);
  });
});

describe('removeLine', () => {
  it('removes the matching sku', () => {
    const lines: Line[] = [{ ...PRODUCT, quantity: 2 }];
    expect(removeLine(lines, 'A')).toEqual([]);
  });

  it('leaves other lines intact', () => {
    const lines: Line[] = [
      { ...PRODUCT, quantity: 1 },
      { sku: 'B', titleEn: 'Other', unitPriceMinor: 500, quantity: 3 },
    ];
    expect(removeLine(lines, 'A')).toHaveLength(1);
  });
});

describe('summarize', () => {
  it('sums quantities and prices', () => {
    const totals = summarize([{ ...PRODUCT, quantity: 3 }]);
    expect(totals.subtotalMinor).toBe(3000);
    expect(totals.itemCount).toBe(3);
  });

  it('applies provided options', () => {
    const totals = summarize([{ ...PRODUCT, quantity: 1 }], { taxRateBasisPoints: 1400 });
    expect(totals.taxMinor).toBe(140);
  });
});
