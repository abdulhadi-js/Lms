import { test, expect } from '@playwright/test';

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('should display the forgot password form', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error banner when empty email submitted via JS', async ({ page }) => {
    // The form uses native browser validation (type=email, required)
    // To bypass it and test our custom error, we trigger submit via JS
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        // Temporarily remove required/type to test JS validation
        const input = form.querySelector('input') as HTMLInputElement;
        if (input) {
          input.removeAttribute('required');
          input.type = 'text';
        }
      }
    });
    await page.locator('button[type="submit"]').click();
    // Should show our custom error: "Please enter your email address."
    const error = page.locator('span:has-text("Please enter"), span:has-text("email")').first();
    await expect(error).toBeVisible({ timeout: 5000 });
  });

  test('should have a back to login link', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"], a:has-text("login"), a:has-text("Login")').first();
    await expect(loginLink).toBeVisible();
  });

  test('should accept a valid email and attempt submission', async ({ page }) => {
    await page.locator('input[type="email"], input[name="email"]').fill('test@educore.com');
    await page.locator('button[type="submit"]').click();
    // Should not show invalid email error
    await page.waitForTimeout(2000);
    const invalidError = page.locator('text=/valid email/i');
    await expect(invalidError).not.toBeVisible();
  });
});
