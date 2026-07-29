# 🛡️ Role-Based Access Control

Related: [[Home]] | [[Authentication Flow]] | [[API Endpoints]] | [[Backend Architecture]]

---

## Roles

| Role | Enum Value | Description |
|---|---|---|
| Administrator | `ADMIN` | Full system access. Manages users, courses, enrollments, fees, reports |
| Instructor | `INSTRUCTOR` | Manages own courses, grades assignments, marks attendance |
| Student | `STUDENT` | Views their courses, submits assignments, sees grades and fees |

---

## How RBAC Works in NestJS

1. A route is decorated with `@UseGuards(JwtAuthGuard, RolesGuard)` 
2. `JwtAuthGuard` validates the Bearer token → sets `req.user = { id, email, role }`
3. `RolesGuard` reads `@Roles(Role.ADMIN)` metadata from the handler
4. If the `req.user.role` doesn't match → throws `403 ForbiddenException`
5. Controllers may also do inline checks: `if (req.user.role !== 'ADMIN') throw new ForbiddenException()`

---

## Permission Matrix

### Users Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| List all users | ✅ | ❌ | ❌ |
| View any user | ✅ | ❌ | ❌ |
| Create user | ✅ | ❌ | ❌ |
| Update user | ✅ | ❌ | ❌ |
| Deactivate user | ✅ | ❌ | ❌ |
| Reset any password | ✅ | ❌ | ❌ |

### Courses Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View courses | ✅ All | ✅ Assigned only | ✅ Enrolled only |
| Create course | ✅ | ❌ | ❌ |
| Update course | ✅ | ✅ Own courses only | ❌ |
| Archive course | ✅ | ❌ | ❌ |
| Assign teacher | ✅ | ❌ | ❌ |
| Manage modules/lessons | ✅ | ✅ Own courses | ❌ |

### Enrollments Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View enrollments | ✅ All | ❌ | ✅ Own only |
| Direct enroll a student | ✅ | ❌ | ❌ |
| Request course drop | ✅ (admin drop) | ❌ | ✅ Own only |
| Approve/reject drop | ✅ | ❌ | ❌ |
| View applications | ✅ | ❌ | ❌ |
| Review application | ✅ | ❌ | ❌ |

### Assignments Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View assignments | ✅ All | ✅ Own courses | ✅ Enrolled courses |
| Create assignment | ✅ | ✅ | ❌ |
| Update/delete assignment | ✅ | ✅ | ❌ |
| Submit assignment | ❌ | ❌ | ✅ |
| View submissions | ✅ | ✅ Own courses | ✅ Own only |
| Grade submission | ✅ | ✅ | ❌ |

### Marks Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View gradebook | ✅ | ✅ Own courses | ✅ Own marks only |
| Enter mark | ✅ | ✅ | ❌ |
| Update mark | ✅ | ✅ Own entries | ❌ |
| View transcript | ✅ Any student | ✅ Own students | ✅ Own only |
| Download PDF | ✅ | ✅ | ✅ Own only |

### Fees Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View fees | ✅ All | ❌ | ✅ Own only |
| Create invoice | ✅ | ❌ | ❌ |
| Record payment | ✅ | ❌ | ❌ |
| Update/delete | ✅ | ❌ | ❌ |

### Reports Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| System overview | ✅ | ❌ | ❌ |
| Performance report | ✅ | ✅ Own courses | ❌ |
| Attendance report | ✅ | ✅ Own courses | ❌ |
| At-risk students | ✅ | ✅ Own courses | ❌ |

---

## Frontend Route Guards

Each portal layout (`app/admin/layout.tsx`, `app/teacher/layout.tsx`, `app/student/layout.tsx`) checks the user's role from `AuthContext` and redirects unauthorized users to `/login`.

```typescript
// Pseudocode of how layouts protect routes
const { user, isLoading } = useAuth();
if (!isLoading && (!user || user.role !== 'ADMIN')) {
  router.push('/login');
}
```
