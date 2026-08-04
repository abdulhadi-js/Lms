import { test, expect } from '@playwright/test';

test.describe('Teacher Full Flow', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/teacher/, { timeout: 60000 });
  });

  test('Teacher dashboard loads with stat widgets', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 20000 });
    // Stats block visible
    await expect(page.locator('text=Courses Assigned').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=Students Total').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=Assignments Active').first()).toBeVisible({ timeout: 20000 });
  });

  test('Teacher dashboard pending action cards navigate correctly', async ({ page }) => {
    // Assignments action card
    const assignmentCard = page.locator('a[href="/teacher/assignments"]').first();
    await expect(assignmentCard).toBeVisible({ timeout: 20000 });
    await assignmentCard.click();
    await expect(page).toHaveURL(/\/teacher\/assignments/, { timeout: 30000 });
  });

  test('Teacher courses page displays and is navigable', async ({ page }) => {
    await page.click('a[data-testid="nav-my-courses"]');
    await expect(page).toHaveURL(/\/teacher\/courses/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toContainText('My Courses', { timeout: 15000 });
    // "Create Course" button visible
    await expect(page.getByRole('button', { name: /Create Course/i })).toBeVisible({ timeout: 10000 });
  });

  test('Teacher can open create course modal', async ({ page }) => {
    await page.click('a[data-testid="nav-my-courses"]');
    await expect(page).toHaveURL(/\/teacher\/courses/, { timeout: 30000 });
    await page.getByRole('button', { name: /Create Course/i }).click();
    await expect(page.locator('text=Course Code')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Title')).toBeVisible();
    // Close modal
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.locator('text=Course Code')).not.toBeVisible();
  });

  test('Teacher assignments page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-assignments"]');
    await expect(page).toHaveURL(/\/teacher\/assignments/, { timeout: 30000 });
    await expect(page.locator('h1').first()).toContainText('Assignment Management', { timeout: 15000 });
    // Stat cards
    await expect(page.locator('text=Active Assignments').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Total Created').first()).toBeVisible({ timeout: 15000 });
  });

  test('Teacher can open create assignment modal', async ({ page }) => {
    await page.click('a[data-testid="nav-assignments"]');
    await expect(page).toHaveURL(/\/teacher\/assignments/, { timeout: 30000 });
    await page.getByRole('button', { name: /Create Assignment/i }).click();
    await expect(page.locator('text=Due Date')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Max Marks')).toBeVisible();
    // Close
    await page.getByRole('button', { name: /Cancel/i }).click();
  });

  test('Teacher gradebook loads', async ({ page }) => {
    await page.click('a[data-testid="nav-marks---grading"]');
    await expect(page).toHaveURL(/\/teacher\/gradebook/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toContainText('Gradebook', { timeout: 15000 });
  });

  test('Teacher attendance page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-attendance"]');
    await expect(page).toHaveURL(/\/teacher\/attendance/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toContainText('Attendance', { timeout: 15000 });
  });

  test('Teacher exams page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-cbt-exams"]');
    await expect(page).toHaveURL(/\/teacher\/exams/, { timeout: 30000 });
    await expect(page.locator('h2').first()).toContainText('Examination', { timeout: 15000 });
  });

  test('Teacher analytics page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-analytics"]');
    await expect(page).toHaveURL(/\/teacher\/analytics/, { timeout: 30000 });
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('Teacher profile settings page loads', async ({ page }) => {
    await page.click('a[data-testid="nav-profile-settings"]');
    await expect(page).toHaveURL(/\/teacher\/profile/, { timeout: 30000 });
    await expect(page.locator('h2, h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('Teacher sidebar visible on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);
    // Desktop sidebar nav contains the EduCore LMS link and Teacher Dashboard badge
    const desktopSidebar = page.locator('nav.hidden.md\\:flex, nav').filter({ hasText: 'Teacher Dashboard' });
    await expect(desktopSidebar.first()).toBeVisible({ timeout: 10000 });
  });

  test('Teacher cannot access admin routes', async ({ page }) => {
    await page.goto('/admin');
    // Should be redirected away from admin
    await expect(page).not.toHaveURL(/\/admin$/, { timeout: 15000 });
  });
});
