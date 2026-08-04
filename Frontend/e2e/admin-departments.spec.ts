import { test, expect } from '@playwright/test';

test.describe('Admin Departments Management (/admin/departments)', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as superadmin
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('Should navigate to departments page and verify elements', async ({ page }) => {
    await page.goto('/admin/departments');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Departments' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Add Department' })).toBeVisible();
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('Should open the Add Department modal', async ({ page }) => {
    await page.goto('/admin/departments');
    await page.click('button:has-text("Add Department")');
    await expect(page.locator('h2', { hasText: 'New Department' })).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. Science Department"]')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
  });
});
