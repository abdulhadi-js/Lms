import { test, expect } from '@playwright/test';

test.describe('Student Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student before each test
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/student/, { timeout: 30000 });
  });

  test('Student can view courses', async ({ page }) => {
    // Navigate to courses via sidebar or bottom nav
    await page.click('a[data-testid="nav-my-courses"]');
    await expect(page).toHaveURL(/\/student\/courses/);
    await expect(page.locator('h1').first()).toContainText('My Courses');
  });

  test('Student can navigate to assignments', async ({ page }) => {
    await page.click('a[data-testid="nav-assignments"]');
    await expect(page).toHaveURL(/\/student\/assignments/);
    await expect(page.locator('h1').first()).toContainText('Assignments');
  });

  test('Student can view grades and transcript', async ({ page }) => {
    await page.click('a[data-testid="nav-grades-transcripts"]');
    await expect(page).toHaveURL(/\/student\/transcript/);
    await expect(page.locator('h1').first()).toContainText('Unofficial Transcript');
    
    // Verify download PDF button is present
    const downloadBtn = page.getByRole('button', { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible();
  });
});
