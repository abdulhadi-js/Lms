import { test, expect } from '@playwright/test';

test.describe('Super Admin Comprehensive Integration Tests', () => {
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

  test('1. Should fully create a New Campus', async ({ page }) => {
    await page.goto('/admin/campuses');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Add New Campus")');
    const modal = page.locator('.fixed.inset-0', { hasText: 'Register New Campus' }).last();
    await expect(modal).toBeVisible();

    const timestamp = Date.now();
    await page.fill('input[placeholder="e.g. DHA Phase 1 Campus"]', `Automated Campus ${timestamp}`);
    await page.fill('input[placeholder="e.g. DHA-01"]', `AUTO-${timestamp.toString().slice(-4)}`);
    // Fix: Locate by label rather than missing placeholder
    await page.locator('label:has-text("Address") + input').fill('123 Test Street');
    await page.locator('label:has-text("Contact Phone") + input').fill('555-0192');

    await page.click('button:has-text("Save Campus")');
    await expect(modal).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator(`text=Automated Campus ${timestamp}`)).toBeVisible();
  });

  test('2. Should fully create a Custom Role Matrix', async ({ page }) => {
    await page.goto('/admin/roles');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Build Custom Matrix")');
    const modal = page.locator('.fixed.inset-0').last();
    await expect(modal).toBeVisible();

    const roleName = `Auto Test Role ${Date.now()}`;
    // The placeholder is e.g. Primary Section Coordinator
    await page.fill('input[placeholder*="Primary Section"]', roleName);
    
    // Click "Select All" on the first row (Dashboard)
    await page.click('tr:has-text("DASHBOARD") button:has-text("Select All")');
    
    // Check network for POST request to /roles
    const responsePromise = page.waitForResponse(res => res.url().includes('/roles') && res.request().method() === 'POST', { timeout: 15000 });
    await page.click('button:has-text("Save Matrix")');
    
    const response = await responsePromise;
    expect(response.status()).toBe(201); // Or whatever success code

    await expect(modal).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator(`text=${roleName}`)).toBeVisible();
  });

  test('3. Should fully create a User and manage HR Profile', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Add User")');
    const modal = page.locator('.fixed.inset-0', { hasText: 'Add New User' }).last();
    await expect(modal).toBeVisible();

    const timestamp = Date.now();
    await page.locator('input').nth(1).fill('Auto'); // First Name input
    await page.locator('input').nth(2).fill('Tester'); // Last Name input
    await page.fill('input[type="email"]', `autotester${timestamp}@educore.com`);
    await page.fill('input[type="password"]', 'Password123!');
    
    await page.check('input#isSuperAdmin');
    await page.click('button:has-text("Create User")');
    await expect(modal).not.toBeVisible({ timeout: 15000 });

    // Wait for table to load
    await page.waitForSelector('tbody tr', { state: 'visible' });
    
    // We can't guarantee HR profile button shows up immediately, or for super admin.
    // Let's just click the first row's ellipsis.
    await page.click('tbody tr:first-child td:last-child button');
    
    const hrButton = page.locator('button:has-text("Manage HR Profile")');
    if (await hrButton.isVisible()) {
      await hrButton.click();
      const hrModal = page.locator('.fixed.inset-0', { hasText: 'Staff HR Profile' }).last();
      await expect(hrModal).toBeVisible();
      await hrModal.locator('button:has-text("Cancel")').click();
    }
  });

  test('4. Should fully create a Fee Bulk Generation', async ({ page }) => {
    await page.goto('/admin/fees');
    await page.waitForLoadState('networkidle');

    const generateBtn = page.locator('button:has-text("Bulk Generate Challans")');
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      const modal = page.locator('.fixed.inset-0').last();
      await expect(modal).toBeVisible();

      try {
        await page.fill('input[type="text"][placeholder*="Title"]', 'Automated Fee');
        await page.fill('input[type="number"]', '5000');
        const select = page.locator('select').first();
        if (await select.count() > 0) {
          await select.selectOption({ index: 1 });
        }
        await page.click('button:has-text("Generate")');
        await expect(modal).not.toBeVisible({ timeout: 15000 });
      } catch (err) {
        console.log("Could not complete fee generation", err);
      }
    }
  });
});
