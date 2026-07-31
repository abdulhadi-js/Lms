# 🖥️ Frontend Architecture

> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · React Query · Lucide Icons · Axios · Playwright (E2E)

Related: [[Home]] | [[API Endpoints]] | [[Authentication Flow]] | [[Pages - Admin Portal]] | [[Pages - Teacher Portal]] | [[Pages - Student Portal]]

---

## Directory Structure

```
Frontend/
├── app/                      # Next.js App Router — all pages
│   ├── page.tsx              # Public landing page
│   ├── layout.tsx            # Root layout (fonts, AuthProvider)
│   ├── login/                # /login
│   ├── forgot-password/      # /forgot-password
│   ├── apply/                # /apply — public enrollment application
│   ├── about/                # /about
│   ├── contact/              # /contact
│   ├── admin/                # /admin/* — Admin portal
│   ├── teacher/              # /teacher/* — Instructor portal
│   └── student/              # /student/* — Student portal
├── lib/
│   ├── api.ts                # Central API client (all fetch calls)
│   └── auth-context.tsx      # AuthContext — login state & JWT management
├── components/               # Shared UI components
├── e2e/                      # Playwright end-to-end tests
└── public/                   # Static assets
```

---

## Authentication State (`lib/auth-context.tsx`)

The `AuthProvider` wraps the entire application and exposes:

```typescript
interface AuthContextType {
  user: AuthUser | null;
  login(email, password): Promise<void>;
  logout(): void;
  isLoading: boolean;
}
```

**Login flow:**
1. Calls `authApi.login(email, password)` → `POST /api/v1/auth/login`
2. Stores `accessToken` + `refreshToken` in `localStorage` under keys `lms_access_token` / `lms_refresh_token`
3. Routes user to their portal based on role:
   - `ADMIN` → `/admin`
   - `INSTRUCTOR` → `/teacher`
   - `STUDENT` → `/student`

**Token refresh:**
- A `scheduleRefresh()` timer fires 60 seconds before the access token expires
- Calls `authApi.refresh(refreshToken)` → `POST /api/v1/auth/refresh`
- If refresh fails → clears tokens and redirects to `/login`

**Global 401 handling:**
- Any `fetchAuthApi()` call that returns `401` automatically clears tokens and redirects to `/login`

---

## API Client (`lib/api.ts`)

All backend communication is centralized here. There are two base fetchers:

| Function | Description |
|---|---|
| `fetchApi(endpoint, options)` | Public — no auth header |
| `fetchAuthApi(endpoint, options)` | Adds `Authorization: Bearer <token>` from localStorage |

**Base URL:** `process.env.NEXT_PUBLIC_API_URL` || `http://localhost:3001/api/v1`

**Token management:**
```typescript
export const tokens = {
  getAccessToken: () => localStorage.getItem('lms_access_token'),
  set: (access, refresh) => { ... },
  clear: () => { ... }
};
```

See [[API Endpoints]] for the full list of exported API objects.

---

## Role-Based Routing

```
/               → Public landing page
/login          → Login page (redirects to role dashboard on success)
/apply          → Public application form
/admin/*        → ADMIN only
/teacher/*      → INSTRUCTOR only
/student/*      → STUDENT only
```

Each portal has its own `layout.tsx` that renders the appropriate sidebar/navbar and verifies the user's role. If a user tries to access a portal they don't belong to, they are redirected to `/login`.

---

## Key Config Files

### `next.config.ts`
```typescript
images: {
  remotePatterns: [/* Cloudinary CDN */]
}
// output: 'standalone' is DISABLED — conflicts with Vercel (QA fix M-02)
transpilePackages: ['motion']
```

### `tailwind.config.ts`
- Uses the default Tailwind palette + EduCore custom color tokens

### `tsconfig.json`
- `"baseUrl": "."` and path aliases (`@/*`) for clean imports

### `eslint.config.mjs`
- Flat ESLint v9+ config
- `.eslintrc.json` was removed (QA fix M-06) to eliminate conflict
