import { test, expect } from '@playwright/test';

test.describe('POS sale flow @a11y', () => {
  test('takes cash payment from start to receipt', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open register/i }).click();
    await page.getByRole('button', { name: /Amber kaftan/i }).first().click();
    await page.getByRole('button', { name: /Take payment/i }).click();
    await page.getByLabel(/Cash tendered/i).fill('3000');
    await page.getByRole('button', { name: /Take cash/i }).click();
    await expect(page.getByRole('heading', { name: /Sale complete/i })).toBeVisible();
  });

  test('cancels back to register from payment', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open register/i }).click();
    await page.getByRole('button', { name: /Linen trousers/i }).first().click();
    await page.getByRole('button', { name: /Take payment/i }).click();
    await page.getByRole('button', { name: /^Cancel$/i }).click();
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });
});
