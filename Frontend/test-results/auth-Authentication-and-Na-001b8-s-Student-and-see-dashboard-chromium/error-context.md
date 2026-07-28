# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication and Navigation >> User can log in as Student and see dashboard
- Location: e2e\auth.spec.ts:27:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1').first()
Expected substring: "Student Dashboard"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1').first()

```

```yaml
- navigation:
  - button
  - text: J
  - heading "Jane Doe" [level=2]
  - text: Student Portal
  - list:
    - listitem:
      - link "Dashboard":
        - /url: /student
    - listitem:
      - link "My Courses":
        - /url: /student/courses
    - listitem:
      - link "Assignments":
        - /url: /student/assignments
    - listitem:
      - link "Grades & Transcripts":
        - /url: /student/transcript
    - listitem:
      - link "Attendance":
        - /url: /student/attendance
    - listitem:
      - link "Fees & Payments":
        - /url: /student/fees
    - listitem:
      - link "Messages":
        - /url: /student/chat
    - listitem:
      - link "Profile Settings":
        - /url: /student/profile
  - text: Theme
  - button "Toggle theme"
  - button "Sign Out"
- main:
  - heading "My Dashboard" [level=2]
  - paragraph: Welcome back, Jane!
  - text: Tuesday, July 28, 2026
  - paragraph: Current GPA
  - heading "0.00" [level=3]
  - paragraph: Cumulative GPA
  - paragraph: Enrolled Courses
  - heading "0" [level=3]
  - paragraph: Current Semester
  - paragraph: Outstanding Fees
  - heading "0" [level=3]
  - paragraph: All cleared
  - paragraph: Assignments Due
  - heading "1" [level=3]
  - paragraph: Next 7 days
  - heading "My Courses" [level=3]
  - link "View All":
    - /url: /student/courses
  - paragraph: No active courses found.
  - paragraph: Contact admin to get enrolled in courses.
  - heading "Upcoming Deadlines" [level=3]
  - text: 1 due soon
  - heading "E2E Test Assignment" [level=4]
  - paragraph: Course
  - paragraph: "Due: Jul 29, 04:08 PM"
  - link "View All Assignments":
    - /url: /student/assignments
- button "Open Tanstack query devtools":
  - img
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication and Navigation', () => {
  4  |   test('User can log in as Admin and see dashboard', async ({ page }) => {
  5  |     // Navigate to login page
  6  |     await page.goto('/login');
  7  | 
  8  |     // Fill in credentials
  9  |     await page.fill('input[type="email"]', 'admin@educore.com');
  10 |     await page.fill('input[type="password"]', 'Admin@123!');
  11 | 
  12 |     // Click login
  13 |     await page.click('button[type="submit"]');
  14 | 
  15 |     // Should redirect to admin dashboard
  16 |     try {
  17 |       await expect(page).toHaveURL(/\/admin/, { timeout: 30000 });
  18 |     } catch (e) {
  19 |       await page.screenshot({ path: 'admin-login-failure.png' });
  20 |       throw e;
  21 |     }
  22 | 
  23 |     // Verify Admin Dashboard title
  24 |     await expect(page.locator('h1').first()).toContainText('Admin Dashboard');
  25 |   });
  26 | 
  27 |   test('User can log in as Student and see dashboard', async ({ page }) => {
  28 |     // Navigate to login page
  29 |     await page.goto('/login');
  30 | 
  31 |     // Fill in credentials
  32 |     await page.fill('input[type="email"]', 'student@educore.com');
  33 |     await page.fill('input[type="password"]', 'Student@123!');
  34 | 
  35 |     // Click login
  36 |     await page.click('button[type="submit"]');
  37 | 
  38 |     // Should redirect to student dashboard
  39 |     await expect(page).toHaveURL(/\/student/, { timeout: 30000 });
  40 | 
  41 |     // Verify Student Dashboard
> 42 |     await expect(page.locator('h1').first()).toContainText('Student Dashboard');
     |                                              ^ Error: expect(locator).toContainText(expected) failed
  43 |   });
  44 | });
  45 | 
```