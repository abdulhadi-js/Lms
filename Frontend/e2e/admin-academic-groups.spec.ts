import { test, expect } from '@playwright/test';

test.describe('Admin Academic Groups (/admin/academic-groups)', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as superadmin
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('Should navigate to academic groups page and verify elements', async ({ page }) => {
    await page.goto('/admin/academic-groups');
    await page.waitForLoadState('networkidle'); await page.screenshot({ path: 'test-failure.png', fullPage: true });

    await expect(page.locator('h1', { hasText: 'Academic Groups (Streams)' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Add Group' })).toBeVisible();
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('Should open the Add Group modal', async ({ page }) => {
    await page.goto('/admin/academic-groups');
    await page.click('button:has-text("Add Group")');
    await expect(page.locator('h2', { hasText: 'New Academic Group' })).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. Pre-Engineering"]')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
  });
});
