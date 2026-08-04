import { test, expect } from '@playwright/test';

test.describe('Student Full Flow', () => {
  test.setTimeout(120000);
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/student/, { timeout: 90000 });
  });

  test('Student dashboard loads with all 4 stat cards', async ({ page }) => {
    await expect(page.locator('text=Current GPA').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=Enrolled Courses').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Outstanding Fees').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Assignments Due').first()).toBeVisible({ timeout: 10000 });
  });

  test('Student stat card GPA navigates to transcript', async ({ page }) => {
    const gpaCard = page.locator('a[href="/student/transcript"]').first();
    await expect(gpaCard).toBeVisible({ timeout: 20000 });
    await gpaCard.click();
    await expect(page).toHaveURL(/\/student\/transcript/, { timeout: 30000 });
  });

  test('Student stat card Fees navigates to fees page', async ({ page }) => {
    const feesCard = page.locator('a[href="/student/fees"]').first();
    await expect(feesCard).toBeVisible({ timeout: 20000 });
    await feesCard.click();
    await expect(page).toHaveURL(/\/student\/fees/, { timeout: 30000 });
  });

  test('Student stat card Assignments navigates to assignments', async ({ page }) => {
    const assignCard = page.locator('a[href="/student/assignments"]').first();
    await expect(assignCard).toBeVisible({ timeout: 20000 });
    await assignCard.click();
    await expect(page).toHaveURL(/\/student\/assignments/, { timeout: 30000 });
  });

  test('Student courses page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-my-courses"]');
    await expect(page).toHaveURL(/\/student\/courses/, { timeout: 30000 });
    await expect(page.locator('h1').first()).toContainText('My Courses', { timeout: 15000 });
  });

  test('Student assignments page loads with sections', async ({ page }) => {
    await page.click('a[data-testid="nav-assignments"]');
    await expect(page).toHaveURL(/\/student\/assignments/, { timeout: 30000 });
    await expect(page.locator('h1').first()).toContainText('Assignments', { timeout: 15000 });
  });

  test('Student transcript page loads with GPA and download button', async ({ page }) => {
    await page.click('a[data-testid="nav-grades-transcripts"]');
    await expect(page).toHaveURL(/\/student\/transcript/, { timeout: 30000 });
    await expect(page.locator('h1').first()).toContainText('Unofficial Transcript', { timeout: 15000 });
    const downloadBtn = page.getByRole('button', { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible({ timeout: 15000 });
  });

  test('Student attendance page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-attendance"]');
    await expect(page).toHaveURL(/\/student\/attendance/, { timeout: 30000 });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Student fees page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-fees-payments"]');
    await expect(page).toHaveURL(/\/student\/fees/, { timeout: 30000 });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Student chat page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-messages"]');
    await expect(page).toHaveURL(/\/student\/chat/, { timeout: 30000 });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Student exams link exists in sidebar', async ({ page }) => {
    const examsLink = page.locator('a[data-testid="nav-exams"]');
    await expect(examsLink).toBeVisible({ timeout: 15000 });
    await examsLink.click();
    await expect(page).toHaveURL(/\/student\/exams/, { timeout: 30000 });
  });

  test('Student profile page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-profile-settings"]');
    await expect(page).toHaveURL(/\/student\/profile/, { timeout: 30000 });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Student cannot access admin routes', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).not.toHaveURL(/\/admin$/, { timeout: 15000 });
  });

  test('Student cannot access teacher routes', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page).not.toHaveURL(/\/teacher$/, { timeout: 15000 });
  });

  test('Student Upcoming Deadlines section shows View All Assignments link', async ({ page }) => {
    // The 'View All Assignments' link is inside the deadline card, not the mobile bottom nav
    const viewAllLink = page.locator('main a[href="/student/assignments"]').last();
    await expect(viewAllLink).toBeVisible({ timeout: 20000 });
  });
});
