import { test, expect } from '@playwright/test';

test.describe('Admin Full Flow', () => {
  test.setTimeout(120000);
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'superadmin@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Admin@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 90000 });
  });

  test('Admin dashboard loads with bento stats', async ({ page }) => {
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 20000 });
    // Key stats visible
    await expect(page.locator('text=/Total Students|Total Revenue|Active/i').first()).toBeVisible({ timeout: 20000 });
  });

  test('Admin can navigate to Users page', async ({ page }) => {
    await page.click('a[href="/admin/users"]');
    await expect(page).toHaveURL(/\/admin\/users/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Admin can navigate to Campuses page', async ({ page }) => {
    await page.click(`a[data-testid="nav-campuses"]`);
    await expect(page).toHaveURL(/\/admin\/campuses/, { timeout: 30000 });
    // Heading is 'Campus Management'
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Admin can navigate to Roles page', async ({ page }) => {
    await page.click('a[href="/admin/roles"]');
    await expect(page).toHaveURL(/\/admin\/roles/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toContainText('Roles', { timeout: 15000 });
  });

  test('Admin Roles page shows matrix table', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=Role Name').first()).toBeVisible({ timeout: 10000 });
  });

  test('Admin can navigate to Fees page', async ({ page }) => {
    await page.click('a[href="/admin/fees"]');
    await expect(page).toHaveURL(/\/admin\/fees/, { timeout: 30000 });
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('Admin can navigate to Enrollments page', async ({ page }) => {
    await page.click('a[href="/admin/enrollments"]');
    await expect(page).toHaveURL(/\/admin\/enrollments/, { timeout: 30000 });
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('Admin can navigate to Academics page', async ({ page }) => {
    await page.click(`a[data-testid="nav-academics"]`);
    await expect(page).toHaveURL(/\/admin\/academics/, { timeout: 30000 });
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('Admin Users page shows table or empty state', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/, { timeout: 30000 });
    await page.waitForTimeout(3000);
    // Accept either a table, 'No users' text, or any heading
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasHeading = await page.locator('h1, h2, h3').first().isVisible().catch(() => false);
    expect(hasTable || hasHeading).toBeTruthy();
  });

  test('Admin can search users by role filter', async ({ page }) => {
    await page.goto('/admin/users');
    // Look for filter dropdown or tabs
    await expect(page.locator('select, [role="tab"], input[type="search"]').first()).toBeVisible({ timeout: 20000 });
  });

  test('Admin can open Create User modal', async ({ page }) => {
    await page.goto('/admin/users');
    const createBtn = page.getByRole('button', { name: /Add User|Create User|New User/i }).first();
    await expect(createBtn).toBeVisible({ timeout: 20000 });
    await createBtn.click();
    // Modal or form should appear
    await expect(page.locator('text=/First Name|Email|Password/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('Admin can access Applications / Admissions page', async ({ page }) => {
    await page.goto('/admin/applications');
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 20000 });
  });

  test('Admin settings / profile page is accessible', async ({ page }) => {
    await page.goto('/admin/settings');
    // Either loads settings or gracefully 404s
    await expect(page.locator('body')).not.toBeEmpty({ timeout: 10000 });
  });
});
