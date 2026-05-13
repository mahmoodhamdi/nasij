import { test, expect } from '@playwright/test';

test.describe('shop @a11y', () => {
  test('PLP lists products in English', async ({ page }) => {
    await page.goto('/en/shop');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Collections');
    await expect(page.getByRole('heading', { name: 'Amber kaftan' })).toBeVisible();
  });

  test('PLP filters by category', async ({ page }) => {
    await page.goto('/en/shop?c=men');
    await expect(page.getByRole('heading', { name: "Men's overshirt" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Amber kaftan' })).toHaveCount(0);
  });

  test('PDP renders product details in Arabic with RTL', async ({ page }) => {
    await page.goto('/ar/p/kaftan-amber');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { name: 'قفطان عنبري' })).toBeVisible();
  });

  test('PDP 404 for unknown slug', async ({ page }) => {
    const response = await page.goto('/en/p/does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
