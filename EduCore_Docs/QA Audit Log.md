# 🐛 QA Audit Log

> This file tracks all bugs found and fixed during the QA audit session on **2026-07-28**.
> 
> Related: [[Home]] | [[Backend Architecture]] | [[Frontend Architecture]]

---

## Summary

| Severity | Total Found | Fixed |
|---|---|---|
| 🔴 Critical | 2 | ✅ 2 |
| 🟠 High | 5 | ✅ 5 |
| 🟡 Medium | 7 | ✅ 7 |
| 🟢 Low | 5 | ✅ 5 |
| **Total** | **19** | **✅ 19** |

---

## 🔴 Critical Bugs (Fixed)

### C-01 — BullModule crashed Render on startup
- **File:** `Backend/src/app.module.ts`, `Backend/src/mail/mail.module.ts`
- **Root cause:** `BullModule.forRootAsync()` required `REDIS_URL` at startup. No Redis was provisioned on Render's free tier. App crashed immediately.
- **Also affected:** `Backend/src/mail/mail.processor.ts` — used Bull to queue emails.
- **Fix:** 
  - Removed `BullModule` from `app.module.ts`
  - Removed `BullModule.registerQueue('mail')` from `mail.module.ts`
  - Deleted `mail.processor.ts` entirely
  - Rewrote `MailService` to call `MailerService.sendMail()` directly (synchronous)
  - Uninstalled `@nestjs/bull` and `bull` packages
- **Commits:** `fix(C-01)` on 2026-07-28

### C-02 — Instructor login redirected to homepage instead of /teacher
- **File:** `Frontend/lib/auth-context.tsx` L134-141
- **Root cause:** Backend `Role` enum = `INSTRUCTOR`. Frontend redirect map had key `TEACHER` (not `INSTRUCTOR`). Any instructor login fell through to `router.push("/")`.
- **Fix:** Removed dead `TEACHER: "/teacher"` key. Kept `INSTRUCTOR: "/teacher"` which correctly matches the backend JWT payload.
- **Commit:** `fix(C-02)` on 2026-07-28

---

## 🟠 High Bugs (Fixed)

### H-01 — `PATCH /notifications/read-all` returned 404
- **File:** `Backend/src/notifications/notifications.controller.ts`
- **Root cause:** Frontend called `PATCH /api/v1/notifications/read-all` but the route didn't exist in the backend.
- **Fix:**
  - Added `isRead: boolean` column to `Notification` entity
  - Added `markAllRead(currentUser)` method to `NotificationsService` 
  - Added `@Patch('read-all')` handler to `NotificationsController`
- **Commit:** `fix(H-01)` on 2026-07-28

### H-02 — Playwright test always failing (wrong h1 assertion)
- **File:** `Frontend/e2e/student.spec.ts` L29
- **Root cause:** Test expected `h1` to contain `"Grades & Transcripts"` but the actual page renders `"Unofficial Transcript"`.
- **Fix:** Updated assertion to `toContainText('Unofficial Transcript')`.
- **Commit:** `fix(H-02)` on 2026-07-28

### H-03 — TypeORM `synchronize` could run in staging
- **File:** `Backend/src/config/database.config.ts`
- **Root cause:** Condition was `NODE_ENV !== 'production'`. A staging environment with `NODE_ENV=staging` would auto-sync the schema silently.
- **Fix:** Changed to `NODE_ENV === 'development'`. Schema auto-sync now ONLY happens in local development.
- **Commit:** `fix(H-03)` on 2026-07-28

### H-04 — `GET /assignments` returned all data unscoped
- **File:** `Backend/src/assignments/assignments.service.ts`
- **Root cause:** `findAllGlobal()` called `assignmentRepo.find()` with no filtering — any authenticated user received all assignments in the system.
- **Fix:** Added role-based filtering:
  - `ADMIN` → all assignments
  - `INSTRUCTOR` → only assignments from their own courses (join on `courses.teacherId`)
  - `STUDENT` → only assignments from their enrolled courses (join on `enrollments`)
- **Commit:** `fix(H-04)` on 2026-07-28

### H-05 — Nested `Frontend/Frontend/` directory
- **Investigation result:** False positive. The directory did not exist on disk. No fix needed.

---

## 🟡 Medium Bugs (Fixed)

### M-01 — Login errors showed generic "Login failed" message
- **File:** `Frontend/lib/api.ts` (authApi.login)
- **Fix:** Added `err = await res.json()` on non-OK responses. Now surfaces `err?.message` from the backend (e.g., `"Invalid credentials or inactive account"`).
- **Commit:** `fix(M-01)` on 2026-07-28

### M-02 — `output: 'standalone'` conflicted with Vercel
- **File:** `Frontend/next.config.ts`
- **Root cause:** `standalone` mode is for Docker self-hosting. Vercel manages its own output format — enabling this caused unexpected bundle behavior.
- **Fix:** Commented out `output: 'standalone'` with an explanatory note.
- **Commit:** `fix(M-02)` on 2026-07-28

### M-03 — `updateModule`/`removeModule` param mismatch
- **Investigation result:** False positive. Both frontend and backend use `moduleId` consistently. No fix needed.

### M-04 — `enrollmentsApi.update/remove` missing backend routes
- **Investigation result:** `PATCH /enrollments/:id` and `DELETE /enrollments/:id` both exist in the backend. No fix needed.

### M-05 — `GET /marks?studentId=` returned 404
- **File:** `Backend/src/marks/marks.controller.ts`
- **Root cause:** Frontend called `GET /marks?studentId=` but the backend only had `/marks/gradebook`, not a root `GET /marks`.
- **Fix:** Added `@Get()` handler that accepts `studentId` and `courseId` query params, delegating to `getTranscript` or `getGradebook` accordingly.
- **Commit:** `fix(M-05)` on 2026-07-28

### M-06 — Two ESLint configs coexisted
- **File:** `Frontend/.eslintrc.json` (removed), `Frontend/eslint.config.mjs` (kept)
- **Root cause:** Old `.eslintrc.json` left over after migrating to ESLint v9 flat config. Two files created ambiguity.
- **Fix:** Removed `.eslintrc.json` via `git rm`.
- **Commit:** `fix(M-06)` on 2026-07-28

### M-07 — 11 orphaned scripts committed to repo
- **Files:** `Backend/check_db.js`, `debug_relations.js`, `fix_courses.js`, `generate.js`, `reset_db.js`, `seed_applications.js`, `seed_base.js`, `seed_enrollments.js`, `seed_fee.js`, `seed_real_data.js`, `test-profile.js`
- **Also:** `Frontend/admin-login-failure.png` (test failure screenshot)
- **Fix:** Removed all 13 files via `git rm`. Updated `.gitignore` to block future test artifacts.
- **Commit:** `fix(M-07)` on 2026-07-28

---

## 🟢 Low Bugs (Fixed)

### L-01 — `API_BASE` URL duplicated inline in `api.ts`
- **File:** `Frontend/lib/api.ts` L91
- **Fix:** Replaced inline `process.env.NEXT_PUBLIC_API_URL || 'http://...'` with the already-defined `API_BASE` constant.

### L-02 — Test screenshot committed to git
- **Fix:** Removed `Frontend/admin-login-failure.png` via `git rm` (part of M-07 fix).

### L-03 — `app.controller.spec.ts` didn't test the health endpoint
- **File:** `Backend/src/app.controller.spec.ts`
- **Fix:** Added `describe('health')` test block asserting `status === 'ok'` and valid ISO timestamp.

### L-04 — `Frontend/metadata.json` was an AI Studio artifact
- **Fix:** Removed via `git rm`. It was an empty AI Studio scaffold file not used by Next.js or Vercel.

### L-05 — `Backend/.gitignore` was only 33 bytes
- **Fix:** Expanded to exclude: `dist/`, `node_modules/`, `.env`, `*.sqlite`, `uploads/`, `logs/`, `*.tsbuildinfo`.
