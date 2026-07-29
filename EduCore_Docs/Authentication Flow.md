# 🔐 Authentication Flow

Related: [[Home]] | [[Backend Architecture]] | [[Role-Based Access Control]] | [[API Endpoints]]

---

## Overview

EduCore uses a **dual-token JWT strategy**:
- **Access Token** — Short-lived (`15m`), used in `Authorization: Bearer` header for every API call
- **Refresh Token** — Long-lived (`7d`), used to silently get a new access token when the current one expires

---

## Login Flow

```
User submits email + password
         │
         ▼
POST /api/v1/auth/login
         │
         ▼
AuthService.login()
  1. Find user by email (UsersService.findByEmail)
  2. If not found OR status != ACTIVE → throw 401 UnauthorizedException
  3. bcrypt.compare(password, user.passwordHash)
  4. If mismatch → throw 401
  5. Generate accessToken (JWT_SECRET, 15m)
  6. Generate refreshToken (JWT_REFRESH_SECRET, 7d)
  7. Return { accessToken, refreshToken, user: { id, email, role, firstName, lastName } }
         │
         ▼
Frontend (auth-context.tsx)
  1. Stores accessToken in localStorage as 'lms_access_token'
  2. Stores refreshToken in localStorage as 'lms_refresh_token'
  3. Sets user state
  4. Routes to role dashboard (ADMIN→/admin, INSTRUCTOR→/teacher, STUDENT→/student)
```

---

## Token Refresh Flow

```
scheduleRefresh() timer fires 60s before token expiry
         │
         ▼
POST /api/v1/auth/refresh
  Header: Authorization: Bearer <refreshToken>
         │
         ▼
JwtRefreshGuard validates the refresh token
  - Strategy: passport-jwt using JWT_REFRESH_SECRET
  - Extracts payload: { sub, email, role }
         │
         ▼
AuthService.refresh(userId)
  - Re-generates a fresh accessToken + refreshToken
  - Returns { accessToken, refreshToken, user }
         │
         ▼
Frontend updates localStorage with new tokens
```

> If refresh fails → `tokens.clear()` → `window.location.href = '/login'`

---

## Password Reset Flow

```
User clicks "Forgot Password"
         │
         ▼
POST /api/v1/auth/forgot-password  { email }
         │
         ▼
AuthService.forgotPassword(email)
  1. Find user by email
  2. If not found → silently return (no email enumeration)
  3. Generate a short-lived reset token (JWT signed with JWT_SECRET, 15m)
  4. Call MailService.sendPasswordReset(email, name, token, frontendUrl)
  5. Email contains link: {FRONTEND_URL}/reset-password?token=<jwt>
         │
         ▼
User clicks link in email → goes to /reset-password?token=...
         │
         ▼
POST /api/v1/auth/reset-password  { token, newPassword }
         │
         ▼
AuthService.resetPassword(token, newPassword)
  1. Verify & decode token with JWT_SECRET
  2. Find user by decoded userId
  3. Hash newPassword with bcrypt (rounds=10)
  4. Update user.passwordHash
  5. Return { success: true }
```

---

## JWT Payload Structure

```typescript
// Access Token payload
{
  sub: string,       // user.id (UUID)
  email: string,
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT',
  iat: number,       // issued at
  exp: number        // expires at
}
```

---

## Guards Explained

| Guard | Strategy | When used |
|---|---|---|
| `JwtAuthGuard` | `jwt` strategy (JWT_SECRET) | All protected routes |
| `JwtRefreshGuard` | `jwt-refresh` strategy (JWT_REFRESH_SECRET) | Only `POST /auth/refresh` |
| `RolesGuard` | Reads `@Roles()` decorator | Routes with specific role restrictions |

---

## Frontend Token Storage

| Key | Value |
|---|---|
| `lms_access_token` | The JWT access token |
| `lms_refresh_token` | The JWT refresh token |

> Stored in `localStorage`. On logout, both are cleared. On 401 from any API call, both are cleared and user is redirected to `/login`.

---

## Default Seeded Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@educore.com` | `Admin@123!` |
| Instructor | `teacher@educore.com` | `Teacher@123!` |
| Student | `student@educore.com` | `Student@123!` |

> Seed is run via `ts-node src/seed.ts` from the Backend directory.
