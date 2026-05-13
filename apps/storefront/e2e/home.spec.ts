import { test, expect } from '@playwright/test';

test.describe('home @a11y', () => {
  test('renders the English hero', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Cloth that knows your shape.');
  });

  test('renders the Arabic hero with RTL', async ({ page }) => {
    await page.goto('/ar');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });
});
