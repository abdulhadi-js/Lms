# 🛡️ Role-Based Access Control

Related: [[Home]] | [[Authentication Flow]] | [[API Endpoints]] | [[Backend Architecture]]

---

## Roles

| Role | Enum Value | Description |
|---|---|---|
| Administrator | `ADMIN` | Full system access. Manages users, academics, enrollments, fees, reports |
| Instructor | `INSTRUCTOR` | Manages own sections, grades assignments, marks attendance |
| Student | `STUDENT` | Views their sections, submits assignments, sees grades and fees |

---

## How RBAC Works in NestJS

We use a **Matrix-based RBAC system with granular module permissions**. 

1. A route is decorated with `@UseGuards(JwtAuthGuard, PermissionsGuard)` (or `RolesGuard` for legacy/simple checks).
2. `JwtAuthGuard` validates the Bearer token → sets `req.user = { id, email, role }`
3. `PermissionsGuard` checks the action and module against the user's role and granular permissions matrix.
4. If the user lacks the required permission → throws `403 ForbiddenException`.
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

### Academics Module (Classes, Subjects, Sections)

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View academics | ✅ All | ✅ Assigned sections | ✅ Enrolled sections |
| Create class/subject/section | ✅ | ❌ | ❌ |
| Update class/subject/section | ✅ | ❌ | ❌ |
| Archive class/subject/section | ✅ | ❌ | ❌ |

### Timetable Module (Teacher & Room Assignment)

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View timetable | ✅ All | ✅ Own schedule | ✅ Enrolled sections schedule |
| Assign teacher to subject/section | ✅ | ❌ | ❌ |
| Book rooms | ✅ | ❌ | ❌ |
| Update schedule | ✅ | ❌ | ❌ |

### Enrollments Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View enrollments | ✅ All | ❌ | ✅ Own only |
| Direct enroll a student | ✅ | ❌ | ❌ |
| Request section drop | ✅ (admin drop) | ❌ | ✅ Own only |
| Approve/reject drop | ✅ | ❌ | ❌ |
| View applications | ✅ | ❌ | ❌ |
| Review application | ✅ | ❌ | ❌ |

### Assignments Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View assignments | ✅ All | ✅ Assigned sections | ✅ Enrolled sections |
| Create assignment | ✅ | ✅ Assigned sections | ❌ |
| Update/delete assignment | ✅ | ✅ Assigned sections | ❌ |
| Submit assignment | ❌ | ❌ | ✅ |
| View submissions | ✅ | ✅ Assigned sections | ✅ Own only |
| Grade submission | ✅ | ✅ Assigned sections | ❌ |

### Marks Module

| Action | ADMIN | INSTRUCTOR | STUDENT |
|---|---|---|---|
| View gradebook | ✅ | ✅ Assigned sections | ✅ Own marks only |
| Enter mark | ✅ | ✅ Assigned sections | ❌ |
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
| Performance report | ✅ | ✅ Assigned sections | ❌ |
| Attendance report | ✅ | ✅ Assigned sections | ❌ |
| At-risk students | ✅ | ✅ Assigned sections | ❌ |

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
