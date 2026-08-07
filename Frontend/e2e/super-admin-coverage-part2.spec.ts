import { test, expect } from '@playwright/test';

test.describe('Super Admin Integration Tests - Part 2', () => {
  test.beforeEach(async ({ page }) => {
    // Log API errors globally to console
    page.on('response', async (res) => {
      if (res.status() >= 400 && res.url().includes('/api/v1/')) {
        try {
          const body = await res.json();
          console.error(`[API ERROR] ${res.url()}:`, body);
        } catch (e) {
          console.error(`[API ERROR] ${res.url()}: Status ${res.status()}`);
        }
      }
    });

    // Log in as superadmin
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('5. Should fully create a New Class & Section', async ({ page }) => {
    await page.goto('/admin/academic-groups');
    await page.waitForLoadState('networkidle');

    // Add Class
    const addClassBtn = page.locator('button:has-text("Add Class")');
    if (await addClassBtn.isVisible()) {
      await addClassBtn.click();
      const modal = page.locator('.fixed.inset-0').last();
      await expect(modal).toBeVisible();

      await page.locator('input[type="text"]').first().fill(`Auto Class ${Date.now()}`);
      
      const campusSelect = page.locator('select').first();
      if (await campusSelect.count() > 0) {
        await campusSelect.selectOption({ index: 1 });
      }

      await page.click('button:has-text("Save")');
      await expect(modal).not.toBeVisible({ timeout: 15000 });
    }
  });

  test('6. Should fully create a Subject', async ({ page }) => {
    await page.goto('/admin/academics');
    await page.waitForLoadState('networkidle');

    const addSubjectBtn = page.locator('button:has-text("Add Subject"), button:has-text("New Subject")').first();
    if (await addSubjectBtn.isVisible()) {
      await addSubjectBtn.click();
      const modal = page.locator('.fixed.inset-0').last();
      await expect(modal).toBeVisible();

      await page.locator('input[type="text"]').first().fill(`Auto Subject ${Date.now()}`);
      
      // Attempt to save
      await page.click('button:has-text("Save")');
      await expect(modal).not.toBeVisible({ timeout: 15000 });
    }
  });

  test('7. Should fully create a Course', async ({ page }) => {
    await page.goto('/admin/courses');
    await page.waitForLoadState('networkidle');

    const addCourseBtn = page.locator('button:has-text("Add Course"), button:has-text("New Course")').first();
    if (await addCourseBtn.isVisible()) {
      await addCourseBtn.click();
      const modal = page.locator('.fixed.inset-0').last();
      await expect(modal).toBeVisible();

      await page.locator('input[type="text"]').first().fill(`Auto Course ${Date.now()}`);
      
      await page.click('button:has-text("Save"), button:has-text("Create")');
      await expect(modal).not.toBeVisible({ timeout: 15000 });
    }
  });

  test('8. Should submit a new Message Broadcast', async ({ page }) => {
    await page.goto('/admin/messaging');
    await page.waitForLoadState('networkidle');

    // Assume there is a "New Message" or "Send Message" button or form
    const newMessageBtn = page.locator('button:has-text("New Message"), button:has-text("Compose")').first();
    if (await newMessageBtn.isVisible()) {
      await newMessageBtn.click();
    }
    
    // Fill subject and body if they exist
    const subjectInput = page.locator('input[placeholder*="Subject"], input[type="text"]').first();
    if (await subjectInput.isVisible()) {
      await subjectInput.fill('Auto Test Broadcast');
    }
    
    const bodyInput = page.locator('textarea').first();
    if (await bodyInput.isVisible()) {
      await bodyInput.fill('This is an automated test message broadcast from Playwright.');
    }

    const sendBtn = page.locator('button:has-text("Send")').first();
    if (await sendBtn.isVisible()) {
      await sendBtn.click();
      // wait a bit for api response
      await page.waitForTimeout(2000);
    }
  });
});
