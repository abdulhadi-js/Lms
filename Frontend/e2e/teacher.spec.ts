import { test, expect } from '@playwright/test';

test.describe('Teacher Portal', () => {
  test.setTimeout(120000);
  test.beforeEach(async ({ page }) => {
    // Login as teacher before each test
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/teacher/, { timeout: 60000 });
  });

  test('Teacher can view their courses', async ({ page }) => {
    await page.click('a[data-testid="nav-my-courses"]');
    await expect(page).toHaveURL(/\/teacher\/courses/, { timeout: 45000 });
    await expect(page.locator('h2').first()).toContainText('My Courses', { timeout: 15000 });
  });

  test('Teacher can view gradebook', async ({ page }) => {
    await page.click('a[data-testid="nav-marks---grading"]');
    await expect(page).toHaveURL(/\/teacher\/gradebook/, { timeout: 45000 });
    await expect(page.locator('h2').first()).toContainText('Gradebook', { timeout: 15000 });
  });

  test('Teacher can navigate to exams and quizzes', async ({ page }) => {
    await page.click('a[data-testid="nav-cbt-exams"]');
    await expect(page).toHaveURL(/\/teacher\/exams/, { timeout: 45000 });
    await expect(page.locator('h2').first()).toContainText('Examination & CBT', { timeout: 15000 });
  });

  test('Teacher can open attendance tracking', async ({ page }) => {
    await page.click('a[data-testid="nav-attendance"]');
    await expect(page).toHaveURL(/\/teacher\/attendance/, { timeout: 45000 });
    await expect(page.locator('h2').first()).toContainText('Attendance', { timeout: 15000 });
  });
});
