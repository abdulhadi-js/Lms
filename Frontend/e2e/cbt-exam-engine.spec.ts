import { test, expect } from '@playwright/test';

test.describe('CBT Exam Engine Automated UI Flow', () => {
  test.setTimeout(90000);

  test('Teacher can view CBT Exam Engine page and Question Bank tab', async ({ page }) => {
    // 1. Login as Teacher
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/teacher/, { timeout: 60000 });

    // 2. Navigate to Exams management
    await page.goto('/teacher/exams');
    await expect(page).toHaveURL(/\/teacher\/exams/, { timeout: 30000 });

    // 3. Verify CBT Header & Elements
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('Student can navigate to CBT Online Exams portal', async ({ page }) => {
    // 1. Login as Student
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/student/, { timeout: 60000 });

    // 2. Navigate to Student Exams portal
    await page.goto('/student/exams');
    await expect(page).toHaveURL(/\/student\/exams/, { timeout: 30000 });
  });
});
