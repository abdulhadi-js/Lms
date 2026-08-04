import { test, expect } from '@playwright/test';

test.describe('Admin Campuses Management (/admin/campuses)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('Should navigate to campuses page and render elements', async ({ page }) => {
    await page.goto('/admin/campuses');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2', { hasText: 'Campus Management' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Add New Campus' })).toBeVisible();
  });

  test('Should open the Add New Campus modal', async ({ page }) => {
    await page.goto('/admin/campuses');
    await page.click('button:has-text("Add New Campus")');
    
    await expect(page.locator('h3', { hasText: 'Register New Campus' })).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. DHA Phase 1 Campus"]')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Save Campus")')).toBeVisible();
  });
});
