# 🏗️ Backend Architecture

> **Stack:** NestJS · TypeScript · TypeORM · PostgreSQL · Passport JWT · Swagger · Helmet · Throttler

Related: [[Home]] | [[Database Schema]] | [[API Endpoints]] | [[Authentication Flow]]

---

## Bootstrap (`src/main.ts`)

The server entry point configures the following global middleware:

| Feature | Config |
|---|---|
| **Static files** | Serves `uploads/` folder at `/uploads/` prefix |
| **Helmet** | Adds secure HTTP headers (XSS, MIME sniffing, etc.) |
| **Global prefix** | All routes prefixed with `/api/v1` |
| **Validation pipe** | `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` — strips unknown request properties and auto-casts DTOs |
| **Exception filter** | `AllExceptionsFilter` — returns structured JSON errors, hides stack traces in production |
| **CORS** | Origin whitelist read from `FRONTEND_URL` env var (defaults to `http://localhost:3000`) |
| **Rate limiting** | 100 requests per minute per IP via `ThrottlerModule` |
| **Swagger UI** | Available at `/api/docs` with persistent Bearer auth |
| **Port** | Reads `PORT` env var (Render sets this automatically) |
| **Binding** | `0.0.0.0` — required for Render to expose the service publicly |

---

## Module Registry (`src/app.module.ts`)

### Infrastructure Modules (Global)
| Module | Purpose |
|---|---|
| `ConfigModule` | Loads `.env` file, available globally |
| `TypeOrmModule` | Connects to PostgreSQL via `getDatabaseConfig()` |
| `ThrottlerModule` | Rate limiting: 100 req/60s |
| `CloudinaryModule` | File upload service (global) |
| `MailModule` | Transactional email via `@nestjs-modules/mailer` (global) |

### Feature Modules
| Module | Route Prefix | Description |
|---|---|---|
| `AuthModule` | `/api/v1/auth` | Login, JWT, password reset |
| `UsersModule` | `/api/v1/users` | User CRUD (Admin only) |
| `CoursesModule` | `/api/v1/courses` | Courses, modules, lessons |
| `EnrollmentsModule` | `/api/v1/enrollments` | Student enrollments & drop requests |
| `AssignmentsModule` | `/api/v1/assignments` | Assignments & submissions |
| `MarksModule` | `/api/v1/marks` | Gradebook & transcripts |
| `AttendanceModule` | `/api/v1/attendance` | Attendance records |
| `TimetableModule` | `/api/v1/timetable` | Schedule management |
| `FeesModule` | `/api/v1/fees` | Invoices & payments |
| `ChatModule` | `/api/v1/chat` | REST messaging + WebSocket |
| `NotificationsModule` | `/api/v1/notifications` | Announcements & alerts |
| `ReportsModule` | `/api/v1/reports` | Analytics & overviews |

---

## Common Utilities (`src/common/`)

### Guards
| Guard | File | Description |
|---|---|---|
| `JwtAuthGuard` | `auth/guards/jwt-auth.guard.ts` | Validates the `Authorization: Bearer <token>` header |
| `JwtRefreshGuard` | `auth/guards/jwt-refresh.guard.ts` | Validates the refresh token (uses a separate `JWT_REFRESH_SECRET`) |
| `RolesGuard` | `common/guards/roles.guard.ts` | Checks `@Roles()` decorator on routes |

### Decorators
| Decorator | Description |
|---|---|
| `@CurrentUser()` | Extracts `req.user` from the JWT payload |
| `@Roles(...roles)` | Restricts a route to specific roles |

### Enums
```typescript
// src/common/enums/roles.enum.ts
enum Role { ADMIN = 'ADMIN', INSTRUCTOR = 'INSTRUCTOR', STUDENT = 'STUDENT' }

// src/common/enums/status.enum.ts
enum UserStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE', SUSPENDED = 'SUSPENDED' }
```

---

## Auth Module Detail (`src/auth/`)

See [[Authentication Flow]] for the full flow diagram.

**Key files:**
- `auth.service.ts` — `login()`, `refresh()`, `logout()`, `forgotPassword()`, `resetPassword()`
- `auth.controller.ts` — HTTP handlers for `/auth/*` routes
- `strategies/jwt.strategy.ts` — Validates access tokens using `JWT_SECRET`
- `strategies/jwt-refresh.strategy.ts` — Validates refresh tokens using `JWT_REFRESH_SECRET`
- `dto/login.dto.ts` — `{ email: string, password: string }`
- `dto/forgot-password.dto.ts` — `{ email: string }`
- `dto/reset-password.dto.ts` — `{ token: string, newPassword: string }`

---

## Mail Module (`src/mail/`)

> **Note:** Originally used `BullModule` + Redis for queuing. **Removed in QA fix C-01** to enable free-tier Render deployment. Now sends emails synchronously via `MailerService`.

**Email templates** (Handlebars, in `src/mail/templates/`):
- `password-reset.hbs` — Password reset link email
- `welcome.hbs` — New student welcome email  
- `application-approved.hbs` — Enrollment approval notification
- `application-rejected.hbs` — Enrollment rejection notification
- `fee-reminder.hbs` — Fee due date reminder

**Methods in `MailService`:**
- `sendPasswordReset(email, name, token, frontendUrl)`
- `sendWelcome(email, name, tempPassword)`
- `sendApplicationApproved(email, name, courseName)`
- `sendApplicationRejected(email, name, courseName, reason)`
- `sendFeeReminder(email, name, amount, dueDate)`

> Failures are logged but do **not** throw — email errors won't break the core app flow.

---

## Database Config (`src/config/database.config.ts`)

Logic:
1. If `DATABASE_URL` env var exists → use PostgreSQL with SSL (Render/Neon cloud)
2. Else if `DB_HOST` is not localhost → use PostgreSQL with SSL (remote host)
3. Else → use local PostgreSQL without SSL

```typescript
// Safety guard added in QA fix H-03
synchronize: configService.get<string>('NODE_ENV') === 'development'
// Only auto-migrates schema in local dev — NEVER in staging/production
```
