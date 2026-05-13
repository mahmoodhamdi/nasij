import { test, expect } from '@playwright/test';

test.describe('cart @a11y', () => {
  test('add to cart from PDP then see line on the cart page', async ({ page }) => {
    await page.goto('/en/p/kaftan-amber');
    await page.getByRole('button', { name: /Add to cart/i }).click();
    await expect(page.getByRole('button', { name: /Added/i })).toBeVisible();
    await page.goto('/en/cart');
    await expect(page.getByText('Amber kaftan')).toBeVisible();
  });

  test('cart route shows empty state when no items', async ({ page }) => {
    await page.goto('/en/cart');
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
  });

  test('checkout shows empty state with no items', async ({ page }) => {
    await page.goto('/en/checkout');
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
  });
});
