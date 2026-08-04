import { test, expect } from '@playwright/test';

test.describe('Admin Fees Management (/admin/fees)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('Should navigate to fees page and verify headers', async ({ page }) => {
    await page.goto('/admin/fees');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2', { hasText: 'Fee Management' })).toBeVisible();
    await expect(page.locator('button:has-text("Create Invoice")')).toBeVisible();
    await expect(page.locator('button:has-text("Bulk Generate")')).toBeVisible();
  });

  test('Should open Create Invoice modal', async ({ page }) => {
    await page.goto('/admin/fees');
    await page.click('button:has-text("Create Invoice")');
    
    await expect(page.locator('h3', { hasText: 'Create New Invoice' })).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Create Invoice")').last()).toBeVisible();
  });

  test('Should open Bulk Generate modal', async ({ page }) => {
    await page.goto('/admin/fees');
    await page.click('button:has-text("Bulk Generate")');
    
    await expect(page.locator('h3', { hasText: 'Bulk Generate Fees' })).toBeVisible();
    await expect(page.locator('button:has-text("Generate Bulk Fees")')).toBeVisible();
  });
});
