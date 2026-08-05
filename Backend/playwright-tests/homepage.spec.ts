import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and show the hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EduCore|LMS/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have a navigation bar', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have a login link in navigation', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('a[href="/login"]').first();
    await expect(loginLink).toBeVisible();
  });

  test('should navigate to login page from homepage', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/login"]').first().click();
    await expect(page).toHaveURL(/\/login/);
  });
});
