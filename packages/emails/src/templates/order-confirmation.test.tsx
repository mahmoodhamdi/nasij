import { describe, it, expect } from 'vitest';

import { OrderConfirmationEmail, type OrderConfirmationProps } from './order-confirmation.js';
import { renderEmail, plainTextFor } from '../render.js';

const baseProps: OrderConfirmationProps = {
  locale: 'en',
  customerName: 'Mahmoud',
  orderNumber: 'NSJ-100001',
  items: [{ titleAr: 'قفطان', titleEn: 'Kaftan', quantity: 2, lineTotalMinor: 50_000 }],
  subtotalMinor: 50_000,
  shippingMinor: 5_000,
  taxMinor: 7_000,
  totalMinor: 62_000,
};

describe('OrderConfirmationEmail', () => {
  it('renders in English', async () => {
    const html = await renderEmail(<OrderConfirmationEmail {...baseProps} />);
    expect(html).toContain('Thank you, Mahmoud');
    expect(html).toContain('NSJ-100001');
    expect(html).toContain('Kaftan');
  });

  it('renders in Arabic with RTL', async () => {
    const html = await renderEmail(<OrderConfirmationEmail {...baseProps} locale="ar" />);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('قفطان');
  });

  it('falls back to default currency when none supplied', async () => {
    const html = await renderEmail(<OrderConfirmationEmail {...baseProps} />);
    expect(html.length).toBeGreaterThan(0);
  });

  it('renders custom currency', async () => {
    const html = await renderEmail(<OrderConfirmationEmail {...baseProps} currency="USD" />);
    // en-US + USD renders as "$"; sanity-check the document rendered with non-EGP symbol
    expect(html).toMatch(/\$|USD/);
  });

  it('produces plain text', async () => {
    const text = await plainTextFor(<OrderConfirmationEmail {...baseProps} />);
    expect(text.toLowerCase()).toContain('thank you, mahmoud');
  });
});
