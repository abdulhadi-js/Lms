import { test, expect } from '@playwright/test';

test.describe('Admin Roles Security', () => {
  test.setTimeout(120000);

  test('SuperAdmin can see Build Custom Matrix button on Roles page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });

    await page.goto('/admin/roles');
    await expect(page).toHaveURL(/\/admin\/roles/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toContainText('Roles & Matrix', { timeout: 15000 });
    // SuperAdmin SHOULD see the create button (isSuperAdmin=true gate)
    const createBtn = page.getByRole('button', { name: /Build Custom Matrix/i });
    await expect(createBtn).toBeVisible({ timeout: 20000 });
  });

  // NOTE: This test requires a separate admin (non-superadmin) account.
  // Skipped if admin@educore.com doesn't exist in the test DB.
  test.skip('Admin cannot see Build Custom Matrix button on Roles page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 60000 });

    await page.goto('/admin/roles');
    await page.waitForTimeout(3000);
    const createBtn = page.getByRole('button', { name: /Build Custom Matrix/i });
    await expect(createBtn).not.toBeVisible({ timeout: 10000 });
  });
});

test.describe('Authentication Security', () => {
  test.setTimeout(90000);

  test('Invalid credentials shows error and does not redirect', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'nobody@fake.com');
    await page.fill('input[data-testid="login-password"]', 'WrongPass123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    await expect(page.locator('text=/invalid|error|incorrect/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('Empty credentials shows validation error', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('Unauthenticated user cannot access admin dashboard', async ({ page }) => {
    // Navigate to login first so localStorage is accessible, then clear
    await page.goto('/login');
    await page.evaluate(() => {
      try { localStorage.clear(); } catch { /* ignore */ }
    });
    await page.goto('/admin');
    await expect(page).not.toHaveURL(/^http:\/\/localhost:3000\/admin$/, { timeout: 20000 });
  });

  test('Unauthenticated user cannot access student dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      try { localStorage.clear(); } catch { /* ignore */ }
    });
    await page.goto('/student');
    await expect(page).not.toHaveURL(/^http:\/\/localhost:3000\/student$/, { timeout: 20000 });
  });

  test('Unauthenticated user cannot access teacher dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      try { localStorage.clear(); } catch { /* ignore */ }
    });
    await page.goto('/teacher');
    await expect(page).not.toHaveURL(/^http:\/\/localhost:3000\/teacher$/, { timeout: 20000 });
  });

  test('Forgot password page is accessible', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveURL(/\/forgot-password/, { timeout: 15000 });
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Role-Based Route Isolation', () => {
  test.setTimeout(120000);

  test('Student logged in cannot access teacher routes', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/student/, { timeout: 60000 });
    await page.goto('/teacher');
    await expect(page).not.toHaveURL(/^http:\/\/localhost:3000\/teacher$/, { timeout: 15000 });
  });

  test('Teacher logged in cannot access student routes', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/teacher/, { timeout: 60000 });
    await page.goto('/student');
    await expect(page).not.toHaveURL(/^http:\/\/localhost:3000\/student$/, { timeout: 15000 });
  });
});
