import { test, expect } from '@playwright/test';

const ADMIN_ROUTES = [
  '/admin',
  '/admin/academics',
  '/admin/accounts',
  '/admin/annual-aggregation',
  '/admin/applications',
  '/admin/campuses',
  '/admin/enrollments',
  '/admin/families',
  '/admin/fees',
  '/admin/messaging',
  '/admin/reports',
  '/admin/roles',
  '/admin/timetable',
  '/admin/users',
  '/admin/profile'
];

test.describe('Comprehensive Page Crawler', () => {
  test.setTimeout(120000);

  let errors: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (err) => {
      errors.push(`Uncaught exception: ${err.message}`);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('Minified React error') || text.includes('Error boundary')) {
          errors.push(`React Error: ${text}`);
        }
      }
    });

    // Login as Admin before visiting pages
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });
  });

  for (const route of ADMIN_ROUTES) {
    test(`Should render ${route} without crashing`, async ({ page }) => {
      await page.goto(route);
      
      // Wait for network idle to ensure data fetched successfully and no hydration errors occur
      await page.waitForLoadState('networkidle', { timeout: 60000 });

      // Check if any error boundary caught an error
      const errorBoundary = await page.locator('text="Something went wrong"').count();
      if (errorBoundary > 0) {
        errors.push(`Error Boundary triggered on ${route}`);
      }

      // Assert no critical errors were captured
      expect(errors, `Errors found on ${route}: ${errors.join(', ')}`).toHaveLength(0);

      // Verify the page actually rendered a main layout structure (header or sidebar is visible)
      await expect(page.locator('main').first()).toBeVisible({ timeout: 15000 });
    });
  }
});
