import { test, expect } from '@playwright/test';

test.describe('Hydration and Loading States (Simulated Slow Network)', () => {
  test('Admin users page renders skeleton during slow data fetch', async ({ page, context }) => {
    // Navigate to login and login first
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });

    // Intercept the /api/v1/users route to delay the response and simulate slow network
    await page.route('**/api/v1/users', async (route) => {
      // Delay the response by 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Continue with standard fetch
      await route.fallback();
    });

    // Start navigation to users page
    await page.goto('/admin/users');

    // As soon as we arrive, the skeleton should be visible
    // We expect an element with animation 'animate-pulse' to indicate a skeleton
    const skeletonRow = page.locator('.animate-pulse').first();
    await expect(skeletonRow).toBeVisible();

    // Verify the dropdowns are explicitly disabled while fetching
    // Our fix in Phase 2 added disabled states to these selects
    const roleSelect = page.locator('select').first();
    await expect(roleSelect).toBeDisabled();

    // After 3 seconds, data resolves and the table should load
    // The skeleton should vanish and standard table row appears
    const actualDataRow = page.locator('table tbody tr:not(.animate-pulse)').first();
    await expect(actualDataRow).toBeVisible({ timeout: 10000 });
    
    // Select should become enabled once data resolves
    await expect(roleSelect).toBeEnabled();
  });
});
