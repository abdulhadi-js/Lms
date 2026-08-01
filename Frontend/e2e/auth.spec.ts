import { test, expect } from '@playwright/test';

test.describe('Authentication and Navigation', () => {
  test('User can log in as Admin and see dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[data-testid="login-email"]', 'admin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');

    // Click login
    await page.click('button[data-testid="login-submit"]');

    // Should redirect to admin dashboard
    try {
      await expect(page).toHaveURL(/\/admin/, { timeout: 30000 });
    } catch (e) {
      await page.screenshot({ path: 'admin-login-failure.png' });
      throw e;
    }

    // Verify Admin Dashboard title
    await expect(page.locator('h1').first()).toContainText('Admin Dashboard');
  });

  test('User can log in as Student and see dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');

    // Click login
    await page.click('button[data-testid="login-submit"]');

    // Should redirect to student dashboard
    await expect(page).toHaveURL(/\/student/, { timeout: 30000 });

    // Verify Student Dashboard
    await expect(page.locator('h1').first()).toContainText('Student Dashboard');
  });
});
