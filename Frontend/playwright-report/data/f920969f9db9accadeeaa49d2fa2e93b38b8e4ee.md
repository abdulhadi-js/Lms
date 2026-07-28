# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student.spec.ts >> Student Portal >> Student can view courses
- Location: e2e\student.spec.ts:13:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/student\/courses/
Received string:  "http://localhost:3000/student"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="en" class="light">…</html>
       - unexpected value "http://localhost:3000/student"

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
  3  | test.describe('Student Portal', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login as student before each test
  6  |     await page.goto('/login');
  7  |     await page.fill('input[type="email"]', 'student@educore.com');
  8  |     await page.fill('input[type="password"]', 'Student@123!');
  9  |     await page.click('button[type="submit"]');
  10 |     await expect(page).toHaveURL(/\/student/, { timeout: 30000 });
  11 |   });
  12 | 
  13 |   test('Student can view courses', async ({ page }) => {
  14 |     // Navigate to courses via sidebar or bottom nav
  15 |     await page.click('a[href="/student/courses"]');
> 16 |     await expect(page).toHaveURL(/\/student\/courses/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  17 |     await expect(page.locator('h1').first()).toContainText('My Courses');
  18 |   });
  19 | 
  20 |   test('Student can navigate to assignments', async ({ page }) => {
  21 |     await page.click('a[href="/student/assignments"]');
  22 |     await expect(page).toHaveURL(/\/student\/assignments/);
  23 |     await expect(page.locator('h1').first()).toContainText('Assignments');
  24 |   });
  25 | 
  26 |   test('Student can view grades and transcript', async ({ page }) => {
  27 |     await page.click('a[href="/student/transcript"]');
  28 |     await expect(page).toHaveURL(/\/student\/transcript/);
  29 |     await expect(page.locator('h1').first()).toContainText('Grades & Transcripts');
  30 |     
  31 |     // Verify download PDF button is present
  32 |     const downloadBtn = page.getByRole('button', { name: /Download PDF/i });
  33 |     await expect(downloadBtn).toBeVisible();
  34 |   });
  35 | });
  36 | 
```