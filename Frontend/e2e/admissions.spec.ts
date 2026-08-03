import { test, expect } from '@playwright/test';

test.describe('Admissions Page (/apply)', () => {
  test('Should render the admission form and interact with submit button', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1').filter({ hasText: 'Start Your Journey with EduCore' })).toBeVisible();

    const submitBtn = page.locator('button:has-text("Submit Admission Form")');
    await expect(submitBtn).toBeVisible();

    await page.fill('input[name="studentFirstName"]', 'Test');
    await page.fill('input[name="studentLastName"]', 'Student');
    await page.fill('input[name="dob"]', '2010-01-01');

    await submitBtn.click();
    
    // It should either show errors or proceed, but not crash.
    const hasErrors = await page.locator('.text-error').count() > 0;
    expect(hasErrors).toBe(true); // Since we didn't fill father CNIC, it should have validation errors
  });
});
