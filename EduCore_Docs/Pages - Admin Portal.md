# 🖥️ Pages - Admin Portal

> Route prefix: `/admin/*`  
> Access: `ADMIN` role only

Related: [[Home]] | [[Frontend Architecture]] | [[Role-Based Access Control]]

---

## `/admin` — Dashboard

**File:** `Frontend/app/admin/page.tsx`

The main admin dashboard displaying:
- **Stats cards:** Total students, total instructors, total classes, total enrollments, pending applications
- **Revenue summary:** Total collected fees and outstanding balance
- **Quick actions:** Links to manage users, academics, applications
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

## `/admin/academics` — Academics Management

**File:** `Frontend/app/admin/academics/`

Features:
- List all academic entities with status badges (ACTIVE / ARCHIVED)
- **Manage AcademicClasses** — create class levels (e.g., Grade 10, Computer Science 101)
- **Manage Subjects** — set subject code, title, description, credits, and assign a teacher
- **Manage Sections** — create sections within classes and assign subjects to them
- **Dynamic 7-Day Schedule** — Select multiple days and assign specific timeslots per day for sections
- **Strict Validation** — Teacher assignment, room, credits, and schedule are all strictly required
- **Module management** — add/edit/remove modules and lessons inside a subject

API calls: `academicsApi.listClasses()`, `academicsApi.createClass()`, `academicsApi.listSubjects()`, `academicsApi.createSubject()`, `academicsApi.createSection()`, `academicsApi.getModules()`, `academicsApi.createModule()`

---

## `/admin/enrollments` — Enrollment Management

**File:** `Frontend/app/admin/enrollments/`

Features:
- List all enrollments with status indicators
- **Bulk enroll** — quickly select multiple students and enroll them in a single AcademicClass or Section at once
- **Direct enroll** — immediately enroll a single student in a class (bypass application)
- **Manage drops** — review and approve/reject drop requests from students
- **Remove enrollment** — hard remove an enrollment record

API calls: `enrollmentsApi.list()`, `enrollmentsApi.bulkEnroll()`, `enrollmentsApi.directEnroll()`, `enrollmentsApi.update()`, `enrollmentsApi.remove()`

---

## `/admin/applications` — Admissions

**File:** `Frontend/app/admin/applications/`

Features:
- List all public enrollment applications (from `/apply` page)
- View dynamic class titles mapped from the public active classes catalog
- Filter by status: `PENDING_REVIEW`, `APPROVED`, `REJECTED`
- **Review application** — approve or reject with optional notes
- **Automated Provisioning** — Approved applications automatically provision a new `STUDENT` user account with a default password and directly create the corresponding enrollment record.

API calls: `enrollmentsApi.getApplications(status)`, `enrollmentsApi.reviewApplication(id, status, notes)`

---

## `/admin/fees` — Fee Management

**File:** `Frontend/app/admin/fees/`

Features:
- List all student fee records
- **Create invoice** — assign a fee to a student for an AcademicClass
- **Record payment** — log a payment against an invoice
- **Update fee** — edit amount, due date, description
- Fee status automatically updates: `PENDING → PARTIAL → PAID`

API calls: `feesApi.list()`, `feesApi.create()`, `feesApi.pay()`, `feesApi.update()`

---

## `/admin/reports` — Analytics

**File:** `Frontend/app/admin/reports/`

Features:
- **Overview panel** — system-wide stats
- **Performance report** — average grades per subject
- **Attendance report** — attendance percentages by subject/section
- **At-risk report** — students below configurable grade threshold

API calls: `reportsApi.overview()`, `reportsApi.performance()`, `reportsApi.attendance()`, `reportsApi.atRisk(threshold)`

---

## `/admin/timetable` — Schedule

**File:** `Frontend/app/admin/timetable/`

Features:
- View all scheduled class slots
- **Create slot** — assign a Subject/Section to a day/time/room
- **Edit/delete slots**

API calls: `timetableApi.list()`, `timetableApi.create()`, `timetableApi.update()`, `timetableApi.remove()`

---

## `/admin/hr` — HR Profile Management

**File:** `Frontend/app/admin/hr/`

Features:
- Manage staff HR profiles (Instructors and Admins)
- **Dynamic Allowances/Deductions** — Uses dynamic key-value inputs instead of raw JSON strings for easier editing of staff Allowances and Deductions.
- Update payroll information and employment status

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
