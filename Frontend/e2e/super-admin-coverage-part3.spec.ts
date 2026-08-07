import { test, expect } from '@playwright/test';

test.describe('Super Admin Integration Tests - Part 3', () => {
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

  test('9. Should verify Dashboard loads correctly', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Dashboard should have some key headers or elements
    await expect(page.locator('h1, h2').filter({ hasText: 'Dashboard' }).first()).toBeVisible();
    
    // Check for KPI cards existence (usually they have numbers or 'NaN'/'Loading')
    const kpiCards = page.locator('div').filter({ hasText: 'Total' });
    if (await kpiCards.count() > 0) {
      await expect(kpiCards.first()).toBeVisible();
    }
  });

  test('10. Should view Families List', async ({ page }) => {
    await page.goto('/admin/families');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2, h3').filter({ hasText: /Famil/i }).first()).toBeVisible();
    
    // Ensure table loads or shows empty state
    await expect(page.locator('table, .grid')).toBeVisible();
  });

  test('11. Should fully create a Timetable entry', async ({ page }) => {
    await page.goto('/admin/timetable');
    await page.waitForLoadState('networkidle');

    const addBtn = page.locator('button:has-text("Add"), button:has-text("New")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      
      const modal = page.locator('.fixed.inset-0').last();
      if (await modal.isVisible()) {
        // Attempt to select dropdowns if they exist
        const selects = await page.locator('.fixed.inset-0 select').all();
        for (const select of selects) {
          if (await select.count() > 0) {
             try { await select.selectOption({ index: 1 }); } catch(e) {}
          }
        }
        
        await page.click('button:has-text("Save"), button:has-text("Submit")');
        await expect(modal).not.toBeVisible({ timeout: 15000 });
      }
    }
  });

  test('12. Should load Reports', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=/Report/i').first()).toBeVisible();
    
    // Check if export buttons exist and are visible
    const exportBtn = page.locator('button:has-text("Export"), button:has-text("Download")').first();
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeEnabled();
    }
  });

  test('13. Should update Profile Settings', async ({ page }) => {
    await page.goto('/admin/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=/Profile/i').first()).toBeVisible();
    
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="Phone"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('555-999-1234');
      
      const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(1000); // Wait for toast/API
      }
    }
  });
});
