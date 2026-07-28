# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication and Navigation >> User can log in as Admin and see dashboard
- Location: e2e\auth.spec.ts:4:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1').first()
Expected substring: "Admin Dashboard"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1').first()

```

```yaml
- navigation:
  - button
  - text: JD
  - link "EduCore LMS":
    - /url: /
  - text: Admin Dashboard
  - list:
    - listitem:
      - link "Dashboard":
        - /url: /admin
    - listitem:
      - link "Course Catalog":
        - /url: /admin/courses
    - listitem:
      - link "Users & Roles":
        - /url: /admin/users
    - listitem:
      - link "Timetable":
        - /url: /admin/timetable
    - listitem:
      - link "Enrollments":
        - /url: /admin/enrollments
    - listitem:
      - link "Applications":
        - /url: /admin/applications
    - listitem:
      - link "Fees":
        - /url: /admin/fees
    - listitem:
      - link "Reports":
        - /url: /admin/reports
    - listitem:
      - link "Profile Settings":
        - /url: /admin/profile
  - text: Theme
  - button "Toggle theme"
  - text: Notifications
  - button
  - button "Generate Report"
  - button "Logout"
- main:
  - heading "Dashboard" [level=2]
  - text: Tuesday, July 28, 2026
  - img
  - img
  - paragraph: Total Students
  - paragraph: "2"
  - img
  - img
  - paragraph: Active Courses
  - paragraph: "1"
  - img
  - img
  - paragraph: Pending Applications
  - paragraph: "0"
  - img
  - img
  - paragraph: Fees Collected
  - paragraph: $0
  - paragraph: Total Students
  - heading "2" [level=3]
  - paragraph: Active enrollments
  - paragraph: Active Courses
  - heading "1" [level=3]
  - paragraph: Current semester
  - paragraph: Pending Applications
  - heading "0" [level=3]
  - paragraph: Needs review
  - paragraph: Fees Collected
  - heading "$0" [level=3]
  - paragraph: Total received
  - heading "Pending Enrollments" [level=3]
  - link "View All":
    - /url: /admin/enrollments
  - table:
    - rowgroup:
      - row "Name Program Date Status Action":
        - columnheader "Name"
        - columnheader "Program"
        - columnheader "Date"
        - columnheader "Status"
        - columnheader "Action"
    - rowgroup:
      - row "No pending applications":
        - cell "No pending applications":
          - paragraph: No pending applications
  - heading "Quick Actions" [level=3]
  - link "Enrollments":
    - /url: /admin/enrollments
  - link "Courses":
    - /url: /admin/courses
  - link "Users":
    - /url: /admin/users
  - link "Reports":
    - /url: /admin/reports
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
> 24 |     await expect(page.locator('h1').first()).toContainText('Admin Dashboard');
     |                                              ^ Error: expect(locator).toContainText(expected) failed
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
  42 |     await expect(page.locator('h1').first()).toContainText('Student Dashboard');
  43 |   });
  44 | });
  45 | 
```