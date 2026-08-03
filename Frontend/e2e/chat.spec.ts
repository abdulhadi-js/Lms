import { test, expect } from '@playwright/test';

test.describe('Real-Time Chat App UI', () => {
  test('Student can access chat application', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/student/, { timeout: 60000 });

    // Click on Chat/Messages link
    await page.click('a[data-testid="nav-messages"]');
    await expect(page).toHaveURL(/\/student\/chat/, { timeout: 45000 });
    
    // Check for chat UI elements
    await expect(page.locator('h1').filter({ hasText: 'Messages' }).first()).toBeVisible({ timeout: 15000 });
    
    // The contacts list should be visible
    await expect(page.locator('.chat-contacts, [class*="overflow-y-auto"]').first()).toBeVisible();
  });

  test('Teacher can access chat application', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/teacher/, { timeout: 60000 });

    // Click on Chat/Messages link
    await page.click('a[data-testid="nav-chat"]');
    await expect(page).toHaveURL(/\/teacher\/chat/, { timeout: 45000 });
    
    // Check for chat UI elements
    await expect(page.locator('h1').filter({ hasText: 'Messages' }).first()).toBeVisible({ timeout: 15000 });
    
    // The contacts list should be visible
    await expect(page.locator('.chat-contacts, [class*="overflow-y-auto"]').first()).toBeVisible();
  });
});
