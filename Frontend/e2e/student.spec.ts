import { test, expect } from '@playwright/test';

test.describe('Student Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'student@educore.com');
    await page.fill('input[type="password"]', 'Student@123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/student/, { timeout: 30000 });
  });

  test('Student can view courses', async ({ page }) => {
    // Navigate to courses via sidebar or bottom nav
    await page.click('a[href="/student/courses"]');
    await expect(page).toHaveURL(/\/student\/courses/);
    await expect(page.locator('h1').first()).toContainText('My Courses');
  });

  test('Student can navigate to assignments', async ({ page }) => {
    await page.click('a[href="/student/assignments"]');
    await expect(page).toHaveURL(/\/student\/assignments/);
    await expect(page.locator('h1').first()).toContainText('Assignments');
  });

  test('Student can view grades and transcript', async ({ page }) => {
    await page.click('a[href="/student/transcript"]');
    await expect(page).toHaveURL(/\/student\/transcript/);
    await expect(page.locator('h1').first()).toContainText('Grades & Transcripts');
    
    // Verify download PDF button is present
    const downloadBtn = page.getByRole('button', { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible();
  });
});
