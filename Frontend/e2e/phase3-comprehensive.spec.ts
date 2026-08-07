import { test, expect } from '@playwright/test';

test.describe('Phase 3: Teacher Portal Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    await page.waitForURL('http://localhost:3000/teacher', { timeout: 10000 }).catch(() => {});
  });

  test('TC-TCH-01: Verify Annual Term subtitle', async ({ page }) => {
    await page.goto('http://localhost:3000/teacher');
    await expect(page.locator('text=Annual Term')).toBeVisible();
  });

  test('TC-TCH-02: Verify Grade Distribution uses Matric Scale', async ({ page }) => {
    await page.route('**/api/courses*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 'mock-1', title: 'Mock Course' }])
    }));
    await page.goto('http://localhost:3000/teacher/analytics');
    await expect(page.locator('text=A+ (90-100)')).toBeVisible();
    await expect(page.locator('text=F (<40)')).toBeVisible();
  });

  test('TC-TCH-03: Verify Gradebook modes toggle', async ({ page }) => {
    await page.goto('http://localhost:3000/teacher/gradebook');
    await expect(page.locator('text=Exam Result Entry')).toBeVisible();
  });

  test('TC-TCH-06: Verify Daily Attendance mode toggle', async ({ page }) => {
    await page.goto('http://localhost:3000/teacher/attendance');
    await expect(page.locator('text=Daily (School Mode)')).toBeVisible();
  });
});
