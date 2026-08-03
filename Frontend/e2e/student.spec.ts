import { test, expect } from '@playwright/test';

test.describe('Student Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student before each test
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    // Dev server can be slow to compile the dashboard
    await expect(page).toHaveURL(/\/student/, { timeout: 60000 });
  });

  test('Student can view courses', async ({ page }) => {
    await page.click('a[data-testid="nav-my-courses"]');
    await expect(page).toHaveURL(/\/student\/courses/, { timeout: 45000 });
    await expect(page.locator('h1').first()).toContainText('My Courses', { timeout: 15000 });
  });

  test('Student can navigate to assignments', async ({ page }) => {
    await page.click('a[data-testid="nav-assignments"]');
    await expect(page).toHaveURL(/\/student\/assignments/, { timeout: 45000 });
    await expect(page.locator('h1').first()).toContainText('Assignments', { timeout: 15000 });
  });

  test('Student can view grades and transcript', async ({ page }) => {
    await page.click('a[data-testid="nav-grades-transcripts"]');
    await expect(page).toHaveURL(/\/student\/transcript/, { timeout: 45000 });
    await expect(page.locator('h1').first()).toContainText('Unofficial Transcript', { timeout: 15000 });
    
    // Verify download PDF button is present
    const downloadBtn = page.getByRole('button', { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible({ timeout: 15000 });
  });
});
