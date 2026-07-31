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

## Frontend: E2E Tests (TestSprite)

We now use **TestSprite** for E2E Automated UI Testing (which runs Playwright in the background). 

### Setup & Execution

We use the TestSprite MCP tool for testing workflows. You do not need to run Playwright manually.

- **Generate Test Plans**: Use the TestSprite MCP tool to generate structured test plans for the frontend.
- **Execute Tests**: The tool executes tests automatically in the background using Playwright.
- **Test Reports**: Test results and dashboards are accessible via the tool (e.g. `testsprite_open_test_result_dashboard`).

### E2E Test Cases Overview

Typical test scenarios include:
1. **Login as student** — verifies authentication flows and redirects.
2. **View courses** — checks for course listing page and headers.
3. **View assignments** — ensures assignment tables render correctly.
4. **View transcript** — verifies the Unofficial Transcript and PDF download functionality.

### Known Gotchas

- E2E tests require **both** the backend and frontend to be running.
- Tests use the **seeded accounts** (e.g., `student@educore.com` / `Student@123!`).
- Test artifacts and reports are managed by TestSprite, but any local Playwright artifacts (`test-results/`, `playwright-report/`) remain gitignored.

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
