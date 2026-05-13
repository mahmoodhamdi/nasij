import { test, expect } from '@playwright/test';

test('admin dashboard renders @a11y', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
