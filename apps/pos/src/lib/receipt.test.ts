import { describe, it, expect } from 'vitest';

import { renderReceiptEscPos, renderReceiptHtml, type ReceiptInput } from './receipt.js';

const baseInput: ReceiptInput = {
  storeName: 'Nasij',
  storeLine1: 'Zamalek, Cairo',
  receiptNumber: 'R-001',
  cashier: 'Sales Staff',
  registerName: 'Front 1',
  placedAt: new Date('2026-05-13T10:00:00Z'),
  locale: 'en',
  lines: [
    { titleEn: 'Kaftan', titleAr: 'قفطان', quantity: 1, unitPriceMinor: 240_000, lineTotalMinor: 240_000 },
  ],
  subtotalMinor: 240_000,
  discountMinor: 0,
  taxMinor: 33_600,
  totalMinor: 273_600,
  paymentMethod: 'cash',
  tenderedMinor: 300_000,
  changeMinor: 26_400,
};

describe('renderReceiptHtml', () => {
  it('renders LTR English receipt', () => {
    const html = renderReceiptHtml(baseInput);
    expect(html).toContain('lang="en"');
    expect(html).toContain('dir="ltr"');
    expect(html).toContain('Nasij');
    expect(html).toContain('R-001');
    expect(html).toContain('Kaftan');
    expect(html).toContain('Tendered');
  });

  it('renders RTL Arabic receipt with Arabic title', () => {
    const html = renderReceiptHtml({ ...baseInput, locale: 'ar' });
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('قفطان');
    expect(html).toContain('شكرًا');
  });

  it('shows discount row when present', () => {
    const html = renderReceiptHtml({ ...baseInput, discountMinor: 5000 });
    expect(html).toMatch(/Discount/);
  });

  it('falls back to English title when titleAr missing in Arabic mode', () => {
    const html = renderReceiptHtml({
      ...baseInput,
      locale: 'ar',
      lines: [{ titleEn: 'Scarf', quantity: 1, unitPriceMinor: 9500, lineTotalMinor: 9500 }],
    });
    expect(html).toContain('Scarf');
  });

  it('escapes HTML metacharacters', () => {
    const html = renderReceiptHtml({
      ...baseInput,
      storeName: '<script>alert(1)</script>',
    });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('uses the footerNote when provided', () => {
    const html = renderReceiptHtml({ ...baseInput, footerNote: 'See you soon' });
    expect(html).toContain('See you soon');
  });

  it('omits tendered/change when undefined', () => {
    const html = renderReceiptHtml({
      ...baseInput,
      tenderedMinor: undefined,
      changeMinor: undefined,
    });
    expect(html).not.toContain('Tendered');
    expect(html).not.toContain('Change');
  });
});

describe('renderReceiptEscPos', () => {
  it('returns a Uint8Array with initialization bytes', () => {
    const bytes = renderReceiptEscPos(baseInput);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes[0]).toBe(0x1b);
    expect(bytes[1]).toBe(0x40);
  });

  it('includes total line bytes', () => {
    const bytes = renderReceiptEscPos(baseInput);
    const ascii = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join('');
    expect(ascii).toContain('TOTAL');
  });
});
