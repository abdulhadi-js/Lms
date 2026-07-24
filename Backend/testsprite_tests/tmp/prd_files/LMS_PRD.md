# Product Requirements Document (PRD)
## Learning Management System (LMS) for Schools & Colleges

**Version:** 1.0
**Prepared:** July 2026
**Document Type:** Functional PRD (technology-agnostic — no tech stack, infrastructure, or implementation architecture is prescribed in this document)

---

## 1. Document Overview

This PRD defines the complete scope, roles, features, access rules, and user flows for a Learning Management System (LMS) built for schools and colleges. It describes a deliberately scoped-down, academic-core system focused on:

- Course delivery
- Chat-based communication
- Manual assessment and configurable grading
- Attendance tracking
- Enrollment and admissions
- Drop / withdrawal management
- Timetable scheduling
- Fee management
- Reporting and notifications

### 1.1 Purpose

To provide a single source of truth describing **what the system must do** and **who can do it**, so design, engineering, and QA teams can build and validate against one unambiguous specification.

### 1.2 Scope Summary

**In scope:**
- Course & curriculum management
- Content delivery (video, docs, SCORM, H5P)
- Chat (1:1 and class-group)
- Assignments & rubrics
- Manual marks entry with configurable grading criteria (auto-calculated grade/GPA, weighted components)
- Gradebook & transcripts
- Attendance tracking
- Enrollment & admissions (including direct Admin enrollment)
- Drop & withdrawal (student-requested and Admin-direct)
- Timetable & scheduling
- Fees & payments
- Reporting & analytics
- Notifications
- User management (Admin-only)

**Out of scope (explicitly excluded from this version):**
- Live/virtual classes
- Automated quiz/exam engine
- Plagiarism detection (e.g., Turnitin-style checks)
- Admin approval workflow for marks (marks are visible to students immediately on save)
- Gamification (badges, leaderboards)
- Mobile app / offline sync
- Calendar integration
- Discussion forums / cohort collaboration
- Certificate / degree issuance

**Roles in scope:** Admin, Teacher, Student only.
**Roles explicitly excluded** as separate roles in this version: Parent/Guardian, Registrar/Academic Staff, Content Author/Instructional Designer, Proctor.

### 1.3 Definitions & Assumptions

- **Institution**: a single school or college using one instance of the LMS.
- **Course** / **Class/Section**: what a Student is enrolled into and what a Teacher is assigned to teach.
- Marks entered by a Teacher are visible to the Student **immediately** upon save/publish — there is no approval gate before students can see their marks.
- **Grading criteria** (grade boundaries) are configurable at the institution level and determine how a numeric mark converts into a letter grade or GPA point.

---

## 2. Roles

The system supports exactly **three roles**. Every user belongs to one role, and every feature's access is scoped accordingly.

### 2.1 Admin
Full institutional control. Responsible for setting up courses, managing enrollment and withdrawal, defining grading criteria, managing fees and timetables, and overseeing all reporting and compliance needs across the whole institution.

### 2.2 Teacher
Scoped to the course(s)/class(es) assigned to them by Admin. Responsible for content delivery, assignments, marks entry, and attendance for their own students only.

### 2.3 Student
Scoped to their own enrollment and records only. Can view content, submit assignments, view marks/attendance/fees, communicate via chat, and request enrollment or withdrawal.

---

## 3. Feature List

### 3.1 Academic Core
1. Course & Curriculum Management — modules, lessons, prerequisites
2. Content Upload — video, documents, SCORM packages, H5P interactive content
3. Chat — 1:1 and class-group messaging between Teachers and Students
4. Assignments & Rubrics — creation, submission, rubric-based feedback
5. Marks Entry & Grading — manual marks entry per exam/assignment, configurable grading criteria, auto-calculated grade/GPA, weighted components (e.g., midterm 30% + final 50% + assignments 20%)
6. Gradebook & Transcripts — running academic record per student, per course
7. Attendance Tracking — per-class attendance marking and records

### 3.2 Administrative
1. Enrollment & Admissions — application intake, review, direct enrollment, section assignment
2. Drop & Withdrawal — student-initiated requests and direct Admin-initiated action
3. Timetable & Scheduling — institution-wide class schedules
4. Fees & Payments — fee structure, payment tracking, student payment
5. Reporting & Analytics — performance, attendance, and at-risk student dashboards
6. Notifications — announcements and academic alerts
7. User Management — creation and management of Teacher and Student accounts (Admin only)

---

## 4. Roles & Feature Access Matrix

This table is the **authoritative access specification** — it defines exactly what each role can do for every feature.

| Feature | Admin | Teacher | Student |
|---|---|---|---|
| Course & Curriculum Management | Create/edit/delete any course; assign teachers to courses | Edit content for own assigned course(s) only | View enrolled courses only (read-only) |
| Content Upload | Upload/manage content for any course | Upload/edit/delete content for own course only | View/download content only |
| Chat | View/monitor all chats (compliance/safeguarding); message any user | Message own students; participate in own class group chat | Message own teachers; participate in own class group chat |
| Assignments & Rubrics | View all assignments institution-wide; override/delete if required | Create, edit, set rubric, delete — own course only | Submit assignments; view own rubric and feedback |
| Marks Entry & Grading | View all students' marks; edit/override any entry (logged for audit) | Enter/edit marks — own students/course only | View own marks and auto-calculated grade only (read-only) |
| Grading Criteria | Define institution-wide grading criteria (grade boundaries, weighting) | View criteria; edit only if explicitly permitted per subject | View grade scale (read-only reference) |
| Gradebook & Transcripts | View/export records for all students | View/export gradebook for own course only | View own academic record only |
| Attendance Tracking | View all attendance records; generate institution-wide reports | Mark/edit attendance for own class only | View own attendance record only |
| Enrollment & Admissions | Full control: review/approve/reject applications; enroll students directly without application; assign sections | View own class roster (read-only) | Submit application; track own application status |
| Drop & Withdrawal | Full control: directly drop/withdraw any student (course-level or full); approve/reject student-initiated drop requests | No access | Request drop/withdrawal (own course or full); self-service request, subject to Admin approval |
| Timetable & Scheduling | Create/edit institution-wide timetable | View own teaching schedule (read-only) | View own class schedule (read-only) |
| Fees & Payments | Set fee structure; view/track all payments; manage refunds | No access | View own fee status; make payments |
| Reporting & Analytics | Full institution-wide dashboards (performance, attendance, at-risk flags) | Own class/course-level analytics only | Own performance dashboard only |
| Notifications | Broadcast announcements to all or selected roles | Send notifications to own class/students only | Receive only (no send access) |
| User Management | Create/manage Teacher and Student accounts | No access | No access |

### Quick Legend
- **Full** = create, edit, delete, view (unrestricted)
- **Scoped** = same actions, but limited to own course/class/students
- **Read-only** = view only, no modification
- **Self-service** = can act, but only on their own record/request
- **No access** = feature not visible/usable for that role

---

## 5. Data States

Two independent status lifecycles govern users and their academic participation.

### 5.1 Student Account Status
```
Pending → Active → Inactive/Withdrawn
        └→ Rejected (if application was never approved)
```

### 5.2 Course Enrollment Status (per course)
```
Enrolled → Dropped / Completed
```

This separation matters because a student can drop a single elective course while remaining **Active** at the institution overall, or withdraw from the institution entirely.

### 5.3 Key Rules
- No role can permanently delete historical academic records (marks, attendance). Records are deactivated/marked as dropped, **never deleted**, for audit and compliance purposes.
- Marks visibility to students is **immediate on save** — there is no approval gate. Admin retains an override/edit capability with an audit log as the safety net.

---

## 6. User Flows

### 6.1 Admin — Primary Flow

```
Login → Admin Dashboard
 ├── Institution Setup
 │     ├── Create courses/subjects
 │     ├── Assign teachers to courses
 │     └── Define institution-wide grading criteria (grade boundaries, weighting)
 ├── Manage Enrollment
 │     ├── Review applications → Approve/Reject
 │     ├── Directly enroll a student without an application (walk-in, transfer, bulk import)
 │     └── Assign students to classes/sections
 ├── Manage Drop/Withdrawal
 │     ├── Review and approve/reject student-initiated drop requests
 │     └── Directly drop/withdraw a student (non-payment, disciplinary) without a student request
 ├── Manage Timetable
 │     └── Build/edit institution-wide schedule
 ├── Manage Fees
 │     ├── Set fee structure per course/term
 │     └── Track payments / process refunds
 ├── Oversight
 │     ├── View all gradebooks, attendance, chats (compliance)
 │     └── Override marks/records if needed (logged)
 ├── Reporting
 │     └── Institution-wide analytics (at-risk students, attendance trends, performance by class)
 └── Notifications
       └── Broadcast announcements to all/selected roles
```

### 6.2 Teacher — Primary Flow

```
Login → Teacher Dashboard (shows only assigned courses/classes)
 ├── Course Management
 │     ├── Upload/edit content (videos, docs, SCORM, H5P) for own course
 │     └── Organize lessons/modules
 ├── Assignments
 │     ├── Create assignment + rubric, set due date
 │     └── Review submissions → give feedback
 ├── Marks & Grading
 │     ├── Enter marks per student per exam/assignment
 │     └── System auto-calculates grade from institution's grading criteria
 │         (weighted components applied automatically, e.g. midterm 30% + final 50% + assignments 20%)
 ├── Attendance
 │     └── Mark daily/per-class attendance
 ├── Gradebook
 │     └── View/export own course's gradebook
 ├── Chat
 │     └── Message individual students or class group
 ├── Class Analytics
 │     └── View own class performance/attendance trends
 └── Notifications
       └── Send updates to own students
```

### 6.3 Student — Primary Flow

```
Login → Student Dashboard (shows only own enrolled courses)
 ├── Courses
 │     └── View/download content for enrolled courses
 ├── Assignments
 │     ├── View assignment + rubric
 │     ├── Submit work
 │     └── View feedback/grade once released
 ├── Marks & Grades
 │     └── View own marks + auto-calculated grade (read-only)
 ├── Attendance
 │     └── View own attendance record
 ├── Gradebook/Transcript
 │     └── View own academic record
 ├── Fees
 │     ├── View fee status
 │     └── Make payment
 ├── Chat
 │     └── Message own teachers / class group chat
 ├── Enrollment
 │     └── Apply for courses/track application status
 └── Notifications
       └── Receive announcements from Admin/Teacher
```

---

## 7. Enrollment Flow (Detailed)

Two entry points exist for a new student: self-service application, or direct Admin enrollment.

### 7.1 Application-Based Enrollment
1. Prospective student fills out an application (personal info, prior academic records, desired course/program) and uploads required documents. Application status = `Pending Review`.
2. Admin reviews the application in a Pending Enrollments queue and verifies documents/eligibility.
3. Admin approves or rejects the application. If rejected, the student is notified with a reason.
4. On approval, a Student account is created and login credentials are sent to the student. Account status = `Active`.
5. Admin assigns the student to a course/class/section, creating an enrollment record: `(student_id, course_id, enrollment_date, status = Enrolled)`.
6. The system generates the applicable fee record based on the course/term fee structure.
7. On first login, the student sees their enrolled course(s), timetable, and fee status.

### 7.2 Direct Admin Enrollment
Admin can bypass the application process entirely and directly create a Student account and enrollment record — used for walk-in admissions, mid-term transfers, or bulk data import from previous records. This path skips steps 1–3 above and proceeds directly to account creation and section assignment.

---

## 8. Drop / Withdrawal Flow (Detailed)

### 8.1 Student-Initiated Drop
1. Student selects "Request Withdrawal/Drop Course" from their dashboard.
2. Student chooses to drop a specific course or withdraw from the institution entirely, and provides a reason.
3. Request is submitted with status `Drop Requested`.
4. Admin reviews the request, checking for outstanding fee dues or obligations.
5. Admin approves (proceeds to deactivation) or rejects/holds the request (e.g., requiring dues to be cleared first), notifying the student either way.

### 8.2 Admin-Initiated Drop
1. Admin opens the student's record and selects "Drop/Deactivate."
2. Admin logs a reason (non-payment, disciplinary action, transfer out, etc.).
3. Action is applied directly — no approval step required, since Admin already holds full authority.

### 8.3 Deactivation Steps (common to both paths)
- Enrollment status is updated: either the specific course is marked `Dropped` (with a drop date), or the full account status is set to `Inactive/Withdrawn`.
- Access to course content, chat, and assignments is revoked or set to read-only, per institution policy.
- Gradebook and attendance records are retained in full for historical/institutional record-keeping — **never deleted**.
- Any outstanding fee record is finalized according to institution refund policy.
- A notification is sent to the student confirming the drop and any next steps.

---

## 9. Open Points for Confirmation

The following decisions are not yet finalized and should be confirmed with stakeholders before development begins:

1. Whether course-level drops should be fully self-service within a defined "drop deadline" window, or always require Admin approval.
2. Whether the Fees module needs to calculate partial refunds automatically based on drop date, or whether refund calculation is handled outside the LMS.
3. Whether Teachers should ever be permitted to edit institution-wide grading criteria per subject, or whether that stays strictly Admin-only.
4. Whether dropped/withdrawn students' historical records need to remain queryable in institution-wide reporting indefinitely, or only for a defined retention period.

---

*End of document.*
