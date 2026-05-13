import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

const routes = [
  { url: '/en', name: 'home-en' },
  { url: '/ar', name: 'home-ar' },
  { url: '/en/shop', name: 'plp-en' },
  { url: '/ar/shop', name: 'plp-ar' },
  { url: '/en/p/kaftan-amber', name: 'pdp-en' },
  { url: '/ar/p/kaftan-amber', name: 'pdp-ar' },
  { url: '/en/cart', name: 'cart-en' },
  { url: '/en/checkout', name: 'checkout-en' },
] as const;

test.describe('axe @a11y', () => {
  for (const route of routes) {
    test(`${route.name} is axe-clean`, async ({ page }) => {
      await page.goto(route.url);
      await injectAxe(page);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
        axeOptions: { rules: { 'color-contrast': { enabled: true } } },
      });
      expect(true).toBe(true);
    });
  }
});
