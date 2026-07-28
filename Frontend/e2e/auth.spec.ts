import { test, expect } from '@playwright/test';

test.describe('Authentication and Navigation', () => {
  test('User can log in as Admin and see dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', 'admin@educore.com');
    await page.fill('input[type="password"]', 'admin123');

    // Click login
    await page.click('button[type="submit"]');

    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/);

    // Verify Admin Dashboard title
    await expect(page.locator('h1').first()).toContainText('Admin Dashboard');
  });

  test('User can log in as Student and see dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', 'student@educore.com');
    await page.fill('input[type="password"]', 'student123');

    // Click login
    await page.click('button[type="submit"]');

    // Should redirect to student dashboard
    await expect(page).toHaveURL(/\/student/);

    // Verify Student Dashboard
    await expect(page.locator('h1').first()).toContainText('Student Dashboard');
  });
});
