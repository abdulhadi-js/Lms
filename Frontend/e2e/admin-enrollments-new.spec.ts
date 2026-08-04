import { test, expect } from '@playwright/test';

test.describe('Admin New Admission Wizard (/admin/enrollments/new)', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as superadmin
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  test('Should navigate the multi-step admission wizard', async ({ page }) => {
    await page.goto('/admin/enrollments/new');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'New Admission' })).toBeVisible();
    
    // Step 1: Student Details
    await expect(page.locator('h2', { hasText: 'Student Personal Details' })).toBeVisible();
    await page.fill('input[placeholder="First Name"]', 'John');
    await page.fill('input[placeholder="Last Name"]', 'Doe');
    await page.fill('input[placeholder="student@example.com"]', 'john.doe.test@educore.com');
    await page.selectOption('select', 'Male');
    await page.click('button:has-text("Next Step")');

    // Step 2: Guardian Details
    await expect(page.locator('h2', { hasText: 'Guardian & Additional Details' })).toBeVisible();
    await page.fill('input[placeholder="Father Name"]', 'Richard Doe');
    await page.click('button:has-text("Next Step")');

    // Step 3: Academic Placement
    await expect(page.locator('h2', { hasText: 'Academic Placement' })).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('button:has-text("Complete Admission")')).toBeVisible();
  });
});
