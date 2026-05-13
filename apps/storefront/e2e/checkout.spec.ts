import { test, expect } from '@playwright/test';

test.describe('checkout flow @a11y', () => {
  test('walks through contact → shipping → payment → success', async ({ page }) => {
    await page.goto('/en/p/kaftan-amber');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.goto('/en/checkout');

    await page.locator('#email').fill('amina@example.com');
    await page.locator('#phone').fill('+201000000001');
    await page.getByRole('button', { name: /Continue/i }).click();

    await page.locator('#name').fill('Amina Salah');
    await page.locator('#line1').fill('Zamalek');
    await page.locator('#city').fill('Cairo');
    await page.getByRole('button', { name: /Continue/i }).click();

    await page.getByRole('button', { name: /Place order/i }).click();
    await expect(page.getByRole('heading', { name: /Order received/i })).toBeVisible();
  });

  test('back navigation moves to previous step', async ({ page }) => {
    await page.goto('/en/p/kaftan-amber');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await page.goto('/en/checkout');
    await page.locator('#email').fill('a@b.com');
    await page.locator('#phone').fill('+200');
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.getByRole('button', { name: /Back/i }).click();
    await expect(page.locator('#email')).toBeVisible();
  });
});
