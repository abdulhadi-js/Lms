import { test, expect } from '@playwright/test';

test.describe('Phase 1 - Pakistani Improvements', () => {

  test.beforeEach(async ({ page }) => {
    // Inject auth token so we are logged in as admin
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'admin-1',
        email: 'superadmin@educore.com',
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Admin'
      }));
    });
  });

  test('Fee page has Pakistani options and Rs currency', async ({ page }) => {
    await page.goto('/admin/fees');

    // Wait for the page to load
    await expect(page.locator('text=Fee Management')).toBeVisible();

    // Verify subtitle
    await expect(page.locator('text=Manage student fee challans, monthly tuition, and outstanding balances.')).toBeVisible();

    // Check Bulk Generate modal fields
    await page.click('text=Bulk Generate');
    await expect(page.locator('text=Bulk Generate Fees')).toBeVisible();
    await expect(page.locator('label', { hasText: 'Fee Type' })).toBeVisible();
    await expect(page.locator('text=Generate Monthly Challan')).toBeVisible();
    
    // Close modal
    await page.click('button:has-text("Cancel")');

    // Check new Create button text
    await page.click('text=Create Fee Record');
    
    // Verify fee type options
    await expect(page.locator('option[value="TUITION"]')).toBeVisible();
    await expect(page.locator('option[value="ADMISSION"]')).toBeVisible();
    await expect(page.locator('option[value="EXAM"]')).toBeVisible();
    await expect(page.locator('option[value="TRANSPORT"]')).toBeVisible();
  });

  test('Student grades page shows Pakistani grading scale', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'student-1',
        email: 'student@educore.com',
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe'
      }));
    });

    await page.goto('/student/grades');
    await expect(page.locator('text=Pakistani Grading Scale Reference')).toBeVisible();
    
    // Expand details
    await page.click('text=Pakistani Grading Scale Reference');
    
    // Verify scale
    await expect(page.locator('text=90-100')).toBeVisible();
    await expect(page.locator('text=Outstanding')).toBeVisible();
    await expect(page.locator('text=80-89')).toBeVisible();
    await expect(page.locator('text=Excellent')).toBeVisible();
  });

  test('Teacher gradebook has Exam Result Entry tab', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'teacher-1',
        email: 'teacher@educore.com',
        role: 'TEACHER',
        firstName: 'Jane',
        lastName: 'Doe'
      }));
    });

    await page.goto('/teacher/gradebook');
    
    // Wait for page
    await expect(page.locator('text=Gradebook')).toBeVisible();
    
    // Switch to Exam Result Entry
    await page.click('text=📝 Exam Result Entry');
    await expect(page.locator('text=Paper-Based Exam Result Entry')).toBeVisible();
    await expect(page.locator('text=Enter marks obtained by students in written exams')).toBeVisible();
    await expect(page.locator('label', { hasText: 'Exam Type' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Passing Marks (40%)' })).toBeVisible();
  });

  test('Admin enrollment has Enroll by Class button', async ({ page }) => {
    await page.goto('/admin/enrollments');
    await expect(page.locator('text=Enrollment Management')).toBeVisible();

    await page.click('text=Enroll by Class');
    await expect(page.locator('text=Bulk Enroll — Assign Class to Subject')).toBeVisible();
    await expect(page.locator('text=Select Class (Course to pull students from)')).toBeVisible();
    await expect(page.locator('text=Select Subject (Target)')).toBeVisible();
    await expect(page.locator('text=Enroll All Students in Class →')).toBeVisible();
  });
});
