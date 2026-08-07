import { test, expect } from '@playwright/test';

test.describe('PHASE 2 - Pakistani School LMS Features', () => {
  test.setTimeout(120000);

  test('Student detail page shows Pakistani fields (Admin)', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'admin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    
    // Check redirection to admin dashboard
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });

    // Navigate to users and click on the first student or just go directly to students list
    await page.goto('/admin/users');
    await expect(page.locator('h2').first()).toContainText('Users', { timeout: 15000 });
    
    // We'll mock the ID or try to navigate to a known route if possible,
    // since we might not know the exact student ID, let's look for a view button for a student
    // or just assume a student ID from list
    const viewButton = page.locator('a[href^="/admin/students/"]').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      // fallback if list is empty
      await page.goto('/admin/students/123-mock-id');
    }

    // Verify the Official School Record fields exist
    await expect(page.locator('body')).toContainText('Official School Record', { timeout: 15000 });
    await expect(page.locator('body')).toContainText('GR Number', { timeout: 5000 });
    await expect(page.locator('body')).toContainText('B-Form / CNIC', { timeout: 5000 });
    await expect(page.locator('body')).toContainText('Religion', { timeout: 5000 });
  });

  test('Teacher attendance page has Daily Attendance mode', async ({ page }) => {
    // Login as teacher
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    
    await expect(page).toHaveURL(/\/teacher/, { timeout: 60000 });

    await page.click('a[data-testid="nav-attendance"]');
    await expect(page).toHaveURL(/\/teacher\/attendance/, { timeout: 45000 });
    
    // Check for Daily Attendance Mode toggle
    await expect(page.locator('button', { hasText: 'Daily (School Mode)' })).toBeVisible({ timeout: 15000 });
  });

  test('Student portal has Report Card and nav link', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    
    await expect(page).toHaveURL(/\/student/, { timeout: 60000 });

    // Verify Result Card nav item exists
    const navItem = page.locator('a[data-testid="nav-result-card"]');
    await expect(navItem).toBeVisible({ timeout: 15000 });
    await expect(navItem).toContainText('Result Card');

    // Click on Result Card
    await navItem.click();
    await expect(page).toHaveURL(/\/student\/report-card/, { timeout: 45000 });

    // Verify Report Card content
    await expect(page.locator('body')).toContainText('Progress Report Card', { timeout: 15000 });
    
    // Verify Print Button
    const printButton = page.locator('button', { hasText: 'Print Result Card' });
    await expect(printButton).toBeVisible();
  });
});
