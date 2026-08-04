import { test, expect } from '@playwright/test';

test.describe('Admin User Profile (/admin/users/[id])', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as superadmin
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('Should navigate to a user profile from the users list', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');

    // Find the first user link and click it
    const firstUserLink = page.locator('table tbody tr:first-child a').first();
    await expect(firstUserLink).toBeVisible();
    
    // Store the href to verify navigation
    const href = await firstUserLink.getAttribute('href');
    expect(href).toContain('/admin/users/');

    await firstUserLink.click();
    await page.waitForLoadState('networkidle');

    // Verify profile page loaded. Give it more time for data to load.
    await expect(page.locator('h1', { hasText: 'User Profile' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('p', { hasText: 'View detailed information and history.' })).toBeVisible();
  });
});
