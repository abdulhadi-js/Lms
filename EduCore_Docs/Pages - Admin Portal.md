# 🖥️ Pages - Admin Portal

> Route prefix: `/admin/*`  
> Access: `ADMIN` role only

Related: [[Home]] | [[Frontend Architecture]] | [[Role-Based Access Control]]

---

## `/admin` — Dashboard

**File:** `Frontend/app/admin/page.tsx`

The main admin dashboard displaying:
- **Stats cards:** Total students, total instructors, total courses, total enrollments, pending applications
- **Revenue summary:** Total collected fees and outstanding balance
- **Quick actions:** Links to manage users, courses, applications
- **At-risk students widget:** Students below 50% average mark
- **Recent activity feed**

Data comes from: `reportsApi.overview()` → `GET /api/v1/reports/overview`

---

## `/admin/users` — User Management

**File:** `Frontend/app/admin/users/`

Features:
- List all users with role filter tabs (All / Admins / Instructors / Students)
- **Create user** modal — creates Admin, Instructor, or Student accounts
- **Edit user** — update name, email, phone, status
- **Deactivate user** — soft-delete (sets status to INACTIVE)
- **Reset password** — admin can reset any user's password

API calls: `usersApi.list(role?)`, `usersApi.create()`, `usersApi.update()`, `usersApi.remove()`

---

## `/admin/courses` — Course Management

**File:** `Frontend/app/admin/courses/`

Features:
- List all courses with status badges (ACTIVE / ARCHIVED)
- **Create course** — set code, title, description, credits
- **Assign teacher** — link an Instructor to a course
- **Edit course** — update metadata or archive
- **Module management** — add/edit/remove modules and lessons inside a course

API calls: `coursesApi.list()`, `coursesApi.create()`, `coursesApi.update()`, `coursesApi.remove()`, `coursesApi.getModules()`, `coursesApi.createModule()`, `coursesApi.updateModule()`, `coursesApi.removeModule()`

---

## `/admin/enrollments` — Enrollment Management

**File:** `Frontend/app/admin/enrollments/`

Features:
- List all enrollments with status indicators
- **Direct enroll** — immediately enroll a student in a course (bypass application)
- **Manage drops** — review and approve/reject drop requests from students
- **Remove enrollment** — hard remove an enrollment record

API calls: `enrollmentsApi.list()`, `enrollmentsApi.directEnroll()`, `enrollmentsApi.update()`, `enrollmentsApi.remove()`

---

## `/admin/applications` — Admissions

**File:** `Frontend/app/admin/applications/`

Features:
- List all public enrollment applications (from `/apply` page)
- Filter by status: `PENDING_REVIEW`, `APPROVED`, `REJECTED`
- **Review application** — approve or reject with optional notes
- Approved applications trigger a welcome email to the student

API calls: `enrollmentsApi.getApplications(status)`, `enrollmentsApi.reviewApplication(id, status, notes)`

---

## `/admin/fees` — Fee Management

**File:** `Frontend/app/admin/fees/`

Features:
- List all student fee records
- **Create invoice** — assign a fee to a student for a course
- **Record payment** — log a payment against an invoice
- **Update fee** — edit amount, due date, description
- Fee status automatically updates: `PENDING → PARTIAL → PAID`

API calls: `feesApi.list()`, `feesApi.create()`, `feesApi.pay()`, `feesApi.update()`

---

## `/admin/reports` — Analytics

**File:** `Frontend/app/admin/reports/`

Features:
- **Overview panel** — system-wide stats
- **Performance report** — average grades per course
- **Attendance report** — attendance percentages by course
- **At-risk report** — students below configurable grade threshold

API calls: `reportsApi.overview()`, `reportsApi.performance()`, `reportsApi.attendance()`, `reportsApi.atRisk(threshold)`

---

## `/admin/timetable` — Schedule

**File:** `Frontend/app/admin/timetable/`

Features:
- View all scheduled class slots
- **Create slot** — assign a course to a day/time/room
- **Edit/delete slots**

API calls: `timetableApi.list()`, `timetableApi.create()`, `timetableApi.update()`, `timetableApi.remove()`

---

## `/admin/profile` — Admin Profile

**File:** `Frontend/app/admin/profile/`

Features:
- View and update own profile (name, phone)
- Change own password

---

## Admin Layout (`app/admin/layout.tsx`)

- Renders a persistent **sidebar** with navigation links to all admin pages
- Shows notification bell with unread count
- Shows logged-in admin name and avatar
- Handles logout
