# 🧪 Testing Guide

Related: [[Home]] | [[QA Audit Log]] | [[Backend Architecture]] | [[Frontend Architecture]]

---

## Backend: Unit Tests (Jest)

### Running Tests

```bash
cd Backend

# Run all unit tests
npm test

# Run with coverage report
npm run test:cov

# Watch mode during development
npm run test:watch
```

### Test Structure

```
Backend/src/
├── app.controller.spec.ts     ← Tests for GET / and GET /health
└── [module]/
    └── [module].service.spec.ts
```

### Example: AppController Tests

```typescript
// Tests GET /health
it('should return status ok with a timestamp', () => {
  const result = appController.getHealth();
  expect(result.status).toBe('ok');
  expect(typeof result.timestamp).toBe('string');
});
```

---

## Frontend: E2E Tests (Playwright)

### Setup

```bash
cd Frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests (requires backend + frontend to be running)
npx playwright test

# Run in headed mode (see the browser)
npx playwright test --headed

# Run a specific spec file
npx playwright test e2e/student.spec.ts
```

### Test Files

| File | Description |
|---|---|
| `e2e/student.spec.ts` | Tests for the Student Portal |

### Student E2E Test Cases

1. **Login as student** — fills email/password, clicks submit, expects redirect to `/student`
2. **View courses** — navigates to `/student/courses`, checks for `h1: "My Courses"`
3. **View assignments** — navigates to `/student/assignments`, checks for `h1: "Assignments"`
4. **View transcript** — navigates to `/student/transcript`, checks for `h1: "Unofficial Transcript"` *(fixed in QA H-02)*, verifies PDF download button

### Configuration (`playwright.config.ts`)

```typescript
{
  testDir: './e2e',
  baseURL: 'http://localhost:3000',
  use: { trace: 'on-first-retry' }
}
```

### Known Gotchas

- E2E tests require **both** the backend and frontend to be running
- Tests use the **seeded student account**: `student@educore.com` / `Student@123!`
- Playwright saves test artifacts (`test-results/`, `playwright-report/`) — these are gitignored

---

## Manual API Testing (Swagger)

Swagger UI is available at `http://localhost:3001/api/docs`

1. Click **Authorize** (top right)
2. Call `POST /auth/login` to get your access token
3. Paste the token in the Authorize dialog
4. All subsequent requests will include `Authorization: Bearer <token>`

---

## Manual API Testing (curl)

```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@educore.com","password":"Admin@123!"}'

# Use the returned accessToken for subsequent calls
TOKEN="<paste_access_token_here>"

# Get current user
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# List all courses
curl http://localhost:3001/api/v1/courses \
  -H "Authorization: Bearer $TOKEN"

# Health check (no auth needed)
curl http://localhost:3001/api/v1/health
```

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@educore.com` | `Admin@123!` |
| Instructor | `teacher@educore.com` | `Teacher@123!` |
| Student | `student@educore.com` | `Student@123!` |
