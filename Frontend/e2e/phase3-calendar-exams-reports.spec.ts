import { test, expect } from '@playwright/test';

test.describe('Phase 3 - Academic Calendar, Exam Schedule, Reports, Timetable', () => {
  // Use admin auth state if available, or just mock/bypass
  test.use({ storageState: 'e2e/.auth/admin.json' });

  test('Academic calendar page loads and shows tabs and holidays', async ({ page }) => {
    await page.goto('/admin/academic-calendar');
    await expect(page.locator('h2:has-text("Academic Calendar")')).toBeVisible();
    
    // Check tabs
    await expect(page.locator('button:has-text("Academic Years")')).toBeVisible();
    await expect(page.locator('button:has-text("Terms & Exams")')).toBeVisible();
    await expect(page.locator('button:has-text("Holidays")')).toBeVisible();

    // Click holidays tab
    await page.locator('button:has-text("Holidays")').click();
    await expect(page.locator('h4:has-text("Independence Day")')).toBeVisible();
    await expect(page.locator('h4:has-text("Eid ul Fitr")')).toBeVisible();
  });

  test('Exam schedule page loads and has print button', async ({ page }) => {
    await page.goto('/admin/exam-schedule');
    await expect(page.locator('h2:has-text("Exam Date Sheet")')).toBeVisible();
    await expect(page.locator('button:has-text("Print Date Sheet")')).toBeVisible();
  });

  test('Reports page has Fee Defaulter List and Rs. formatting', async ({ page }) => {
    await page.goto('/admin/reports');
    
    // Check defaulter list section
    await expect(page.locator('h3:has-text("Monthly Fee Defaulter List")')).toBeVisible();
    
    // Check Rs. prefix
    await expect(page.locator('h3', { hasText: /Rs\.\s\d+/ }).first()).toBeVisible();
  });

  test('Timetable page shows period reference card', async ({ page }) => {
    await page.goto('/admin/timetable');
    await expect(page.locator('h3:has-text("Period Reference")')).toBeVisible();
    await expect(page.locator('span:has-text("Period 1:")')).toBeVisible();
    await expect(page.locator('span:has-text("Friday Schedule:")')).toBeVisible();
  });
});
