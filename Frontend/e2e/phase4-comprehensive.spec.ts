import { test, expect } from '@playwright/test';

test.describe('Phase 4: Student Portal Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    await page.waitForURL('http://localhost:3000/student', { timeout: 10000 }).catch(() => {});
  });

  test('TC-STU-01: Verify dashboard Session subtitle', async ({ page }) => {
    await page.goto('http://localhost:3000/student');
    await expect(page.locator('text=Current Session')).toBeVisible();
  });

  test('TC-STU-02: Verify Assignments page renders', async ({ page }) => {
    await page.goto('http://localhost:3000/student/assignments');
    await expect(page.locator('text=My Assignments')).toBeVisible();
  });

  test('TC-STU-03: Verify Exams page renders', async ({ page }) => {
    await page.goto('http://localhost:3000/student/exams');
    await expect(page.locator('text=Exam Schedule')).toBeVisible();
  });

  test('TC-STU-04: Verify Nateeja (Result Card) renders print layout', async ({ page }) => {
    await page.goto('http://localhost:3000/student/report-card');
    await expect(page.locator('text=Progress Report Card').first()).toBeVisible();
  });

  test('TC-STU-05: Verify fees display Rs currency', async ({ page }) => {
    await page.goto('http://localhost:3000/student/fees');
    await expect(page.locator('text=PKR').first()).toBeVisible();
  });
});
