import { test, expect } from '@playwright/test';

test.describe('admin products @a11y', () => {
  test('lists products with row links to edit', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByText('Amber kaftan')).toBeVisible();
  });

  test('opens new product form', async ({ page }) => {
    await page.goto('/products/new');
    await expect(page.getByRole('heading', { name: 'New product' })).toBeVisible();
    await expect(page.getByLabel('Title (English)')).toBeVisible();
    await expect(page.getByLabel('Title (Arabic)')).toBeVisible();
  });

  test('opens product detail editor for a known id', async ({ page }) => {
    await page.goto('/products/prd_kaftan');
    await expect(page.getByRole('heading', { name: /Amber kaftan/i })).toBeVisible();
  });
});

test.describe('admin orders', () => {
  test('lists orders and opens detail', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await page.getByRole('link', { name: 'View' }).first().click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('NSJ-');
  });
});

test.describe('admin staff', () => {
  test('shows staff list and invite form', async ({ page }) => {
    await page.goto('/staff');
    await expect(page.getByRole('heading', { name: 'Staff' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });
});
