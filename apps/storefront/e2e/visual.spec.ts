import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
] as const;

test.describe('visual', () => {
  for (const viewport of viewports) {
    test(`home renders at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
    test(`shop renders at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en/shop');
      await expect(page.getByRole('heading', { name: 'Collections' })).toBeVisible();
    });
  }
});
