import { test, expect } from '@playwright/test';

test('POS shows sign-in then register @a11y', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Nasij POS' })).toBeVisible();
  await page.getByRole('button', { name: 'Open register' }).click();
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
});
