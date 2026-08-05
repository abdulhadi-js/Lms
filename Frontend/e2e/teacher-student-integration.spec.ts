import { test, expect } from '@playwright/test';

test.describe('Teacher-Student Assignment Integration Flow', () => {
  // Use a slower timeout for complex E2E flows
  test.setTimeout(120000);

  const timestamp = Date.now();
  const assignmentTitle = `E2E Integration Assignment ${timestamp}`;
  const submissionText = `This is my integration test submission text at ${timestamp}`;

  test.describe.configure({ mode: 'serial' });

  test('1. Teacher can create a new assignment', async ({ page }) => {
    // Login as teacher
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    
    // Wait for teacher dashboard
    await expect(page).toHaveURL(/\/teacher/);
    
    // Navigate to assignments page
    await page.goto('/teacher/assignments');
    
    // Wait for loading to finish
    await expect(page.locator('text=Loading assignments...')).not.toBeVisible({ timeout: 15000 });

    // Click Create Assignment
    await page.click('button:has-text("Create Assignment")');
    
    // Fill assignment form
    await page.fill('input[type="text"]', assignmentTitle);
    
    // Set a due date in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    await page.fill('input[type="date"]', futureDate.toISOString().split('T')[0]);
    
    await page.fill('label:has-text("Max Marks") + input', '100');
    
    // Submit form
    await page.click('button:has-text("Create Assignment")');
    
    // Verify it was added to the list
    await expect(page.locator(`text=${assignmentTitle}`).first()).toBeVisible({ timeout: 15000 });
  });

  test('2. Student can view and submit the assignment', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    
    // Wait for student dashboard
    await expect(page).toHaveURL(/\/student/);
    
    // Navigate to assignments page
    await page.goto('/student/assignments');
    
    // Wait for loading to finish
    await expect(page.locator('text=Loading assignments...')).not.toBeVisible({ timeout: 15000 });

    // Find the assignment created by the teacher
    const assignmentCard = page.locator(`text=${assignmentTitle}`).first();
    await expect(assignmentCard).toBeVisible({ timeout: 15000 });
    
    // Click on the assignment to view details (we can find the link that contains the title text parent)
    // Actually, on the student side, the card itself might be a link or have a "Submit Assignment" button.
    // For safety, let's just click the title itself if it's wrapped in a Link, or find the parent card.
    await page.locator(`h3:has-text("${assignmentTitle}")`).click();
    
    // Check we are on the assignment detail page
    await expect(page.locator(`h1:has-text("${assignmentTitle}")`)).toBeVisible({ timeout: 15000 });
    
    // Verify it says "Not Submitted" or shows the submission form
    
    // Find the text area for submission
    await page.fill('textarea[placeholder="Type your submission here..."]', submissionText);
    
    // Submit
    await page.click('button:has-text("Submit Text")');
    
    // Wait for success
    await expect(page.locator('text=Submission successful')).toBeVisible({ timeout: 10000 });
    
    // Verify the page now shows the submitted text
    await expect(page.locator(`text=${submissionText}`)).toBeVisible({ timeout: 10000 });
  });

  test('3. Teacher can view the submission and grade it', async ({ page }) => {
    // Login as teacher
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'teacher@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Teacher@123!');
    await page.click('button[data-testid="login-submit"]');
    
    // Navigate to assignments page
    await page.goto('/teacher/assignments');
    
    // Wait for loading
    await expect(page.locator('text=Loading assignments...')).not.toBeVisible({ timeout: 15000 });
    
    // Click 'View Submissions' for the created assignment
    // Find the row with the assignment title, then click the View Submissions link in that row
    const row = page.locator('tr').filter({ hasText: assignmentTitle });
    await row.locator('a[title="View Submissions"]').click();
    
    // We should be on the Submissions viewer page
    await expect(page.locator(`h1:has-text("${assignmentTitle}")`)).toBeVisible({ timeout: 15000 });
    
    // Verify we see the student's submitted text
    await expect(page.locator(`text=${submissionText}`)).toBeVisible();
    
    // Give the student a grade of 95
    await page.fill('input[type="number"]', '95');
    
    // Save grades
    await page.click('button:has-text("Save All Grades")');
    
    // Wait for success toast
    await expect(page.locator('text=grade(s) saved successfully')).toBeVisible({ timeout: 10000 });
  });

  test('4. Student can view their grade', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'student@educore.com');
    await page.fill('input[data-testid="login-password"]', 'Student@123!');
    await page.click('button[data-testid="login-submit"]');
    
    // Navigate to assignments page
    await page.goto('/student/assignments');
    
    // Click the assignment
    await page.locator(`h3:has-text("${assignmentTitle}")`).click();
    
    // Wait for detail page
    await expect(page.locator(`h1:has-text("${assignmentTitle}")`)).toBeVisible({ timeout: 15000 });
    
    // Verify the grade is displayed
    await expect(page.locator('text=95 / 100')).toBeVisible();
  });
});
