# EduCore LMS - Frontend E2E Testing Plan

## 1. Objectives
- Ensure **every page** in the application renders successfully without Hydration Errors or Next.js Error Boundaries.
- Ensure **authentication flows** (Login, Redirects, JWT persistence) work across roles.
- Ensure **critical paths** (Admissions, Dashboard KPIs, Data Tables) have intact UI states.

## 2. Testing Strategy: "The 3-Tier Approach"

To fulfill the requirement of testing "every page and button", we will implement a 3-tier Playwright strategy:

### Tier 1: The Automated Page Crawler (`crawler.spec.ts`)
Instead of manually hardcoding 50+ page routes, we will write a dynamic Playwright crawler that:
1. Logs in as an Admin.
2. Identifies all navigation links in the Sidebar.
3. Visits **every single page**.
4. Asserts that the page title renders, no 500 errors occur, and no React Error Boundaries are triggered.

### Tier 2: Authentication & Role Gateways (`auth.spec.ts`)
- Test `/login` with valid/invalid credentials.
- Test that unauthenticated users are kicked out of `/admin`.
- Test that Teachers are routed to `/teacher` and Students to `/student`.

### Tier 3: Critical User Journeys (CUJs)
Specific tests for the most important interactive forms and buttons:
- **`admissions.spec.ts`**: Tests the `/apply` public form, ensuring the Multi-step form validates inputs correctly.
- **`dashboard.spec.ts`**: Tests the Admin Dashboard KPI tiles and chart rendering.
- **`data-tables.spec.ts`**: Tests the Shadcn/TanStack tables (Pagination, Search filters).

## 3. Execution Plan
1. Ensure `npx playwright install` is executed to provision browsers.
2. Implement the `crawler.spec.ts` to scan every Admin route.
3. Implement `admissions.spec.ts` to test public forms.
4. Execute `npx playwright test` and generate the HTML report.
5. Review results and fix any broken links/buttons.
