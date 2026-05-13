import { computeCartTotals, type CartTotalsOptions } from '@nasij/api/cart';

export interface Line {
  sku: string;
  titleEn: string;
  unitPriceMinor: number;
  quantity: number;
}

export const addLine = (lines: readonly Line[], product: Omit<Line, 'quantity'>): Line[] => {
  const existing = lines.find((l) => l.sku === product.sku);
  if (existing) {
    return lines.map((l) =>
      l.sku === product.sku ? { ...l, quantity: l.quantity + 1 } : l,
    );
  }
  return [...lines, { ...product, quantity: 1 }];
};

export const removeLine = (lines: readonly Line[], sku: string): Line[] =>
  lines.filter((l) => l.sku !== sku);

export const summarize = (lines: readonly Line[], options: CartTotalsOptions = {}) =>
  computeCartTotals(
    lines.map((l) => ({ sku: l.sku, unitPriceMinor: l.unitPriceMinor, quantity: l.quantity })),
    options,
  );
