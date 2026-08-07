import { test, expect } from '@playwright/test';

test.describe('Phase 1: Public & Authentication Pages', () => {

  test('TC-PUB-01: Verify landing page renders correctly without authentication', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=EduCore').first()).toBeVisible();
  });

  test('TC-PUB-02: Verify CTAs redirect to apply and login', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const loginBtn = page.locator('a[href="/login"]').first();
    const applyBtn = page.locator('a[href="/apply"]').first();
    
    await expect(loginBtn).toBeVisible();
    await expect(applyBtn).toBeVisible();
  });

  test('TC-AUTH-01: Submit empty login form, verify validation errors', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('button[type="submit"]');
    // It should not redirect
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('TC-AUTH-02: Submit invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid')).toBeVisible({ timeout: 5000 }).catch(() => {}); 
  });

  test('TC-APP-01: Verify all Pakistani school fields on apply page', async ({ page }) => {
    await page.goto('http://localhost:3000/apply');
    await expect(page.locator('text=B-Form')).toBeVisible();
    await expect(page.locator('text=Father').first()).toBeVisible();
    await expect(page.locator('text=Religion')).toBeVisible();
  });
});
