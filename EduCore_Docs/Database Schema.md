# 🗃️ Database Schema

> **Database:** PostgreSQL · **ORM:** TypeORM · **Entities path:** `Backend/src/**/entities/*.entity.ts`

Related: [[Home]] | [[Backend Architecture]] | [[API Endpoints]]

---

## Entity Relationship Overview

```
users ──────────┬── courses (teacherId)
                ├── enrollments (studentId)
                ├── fees (studentId)
                └── submissions (studentId)

courses ─────────┬── modules
                 │     └── lessons
                 ├── enrollments (courseId)
                 ├── assignments (courseId)
                 └── fees (courseId)

assignments ─────└── submissions (assignmentId)

marks ────────────── (standalone: studentId, courseId, subject)
notifications ─────── (standalone: audienceRole)
timetable ─────────── (standalone: courseId, day, time)
attendance ────────── (courseId, studentId, date)
chat_messages ─────── (senderId, receiverId / courseId)
```

---

## Table: `users`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | Auto-generated |
| `email` | `varchar` | UNIQUE, INDEX | Used for login |
| `passwordHash` | `varchar` | NOT NULL | bcrypt (rounds=10), excluded from responses |
| `role` | `varchar` | INDEX | `ADMIN`, `INSTRUCTOR`, `STUDENT` |
| `status` | `varchar` | DEFAULT `ACTIVE` | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `firstName` | `varchar` | NOT NULL | |
| `lastName` | `varchar` | NOT NULL | |
| `phone` | `varchar` | NULLABLE | |
| `profilePicture` | `varchar` | NULLABLE | Cloudinary URL |
| `metadata` | `simple-json` | NULLABLE | Flexible extra data |
| `createdAt` | `timestamp` | Auto | |
| `updatedAt` | `timestamp` | Auto | |

**Computed property:** `get fullName() → "${firstName} ${lastName}"`

---

## Table: `courses`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `code` | `varchar` | UNIQUE | e.g., `CS101` |
| `title` | `varchar` | NOT NULL | |
| `description` | `varchar` | NULLABLE | |
| `teacherId` | `uuid` | FK → `users.id` | Nullable — course can be unassigned |
| `credits` | `int` | DEFAULT `3` | |
| `status` | `varchar` | DEFAULT `ACTIVE` | `ACTIVE`, `ARCHIVED` |

**Relations:** `teacher` (ManyToOne → User), `modules` (OneToMany → CourseModule)

---

## Table: `modules`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `courseId` | `uuid` FK | → courses.id |
| `title` | `varchar` | |
| `description` | `varchar` | NULLABLE |
| `order` | `int` | Sort order |

**Relations:** `course` (ManyToOne), `lessons` (OneToMany → Lesson)

---

## Table: `lessons`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `moduleId` | `uuid` FK | → modules.id |
| `title` | `varchar` | |
| `description` | `varchar` | NULLABLE |
| `contentType` | `varchar` | `VIDEO`, `PDF`, `LINK`, `TEXT` |
| `contentUrl` | `varchar` | NULLABLE |
| `order` | `int` | |
| `duration` | `int` | Minutes |

---

## Table: `enrollments`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `studentId` | `uuid` | FK → users.id, INDEX | |
| `courseId` | `uuid` | FK → courses.id, INDEX | |
| `status` | `varchar` | DEFAULT `ENROLLED` | `ENROLLED`, `ACTIVE`, `DROPPED`, `COMPLETED` |
| `dropReason` | `varchar` | NULLABLE | |
| `droppedAt` | `timestamp` | NULLABLE | |
| `createdAt` | `timestamp` | Auto | |

---

## Table: `assignments`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `courseId` | `uuid` FK | → courses.id |
| `title` | `varchar` | |
| `description` | `text` | NULLABLE |
| `rubric` | `text` | NULLABLE — grading criteria |
| `maxMarks` | `int` | |
| `dueDate` | `timestamp` | |
| `weightPercent` | `float` | Grade weight |

---

## Table: `submissions`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `assignmentId` | `uuid` FK | |
| `studentId` | `uuid` FK | |
| `content` | `text` | Written submission text |
| `fileUrl` | `varchar` | NULLABLE — Cloudinary URL |
| `score` | `float` | NULLABLE — filled after grading |
| `feedback` | `text` | NULLABLE — teacher feedback |
| `submittedAt` | `timestamp` | Auto |

---

## Table: `marks`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `studentId` | `uuid` FK | |
| `courseId` | `uuid` FK | |
| `subject` | `varchar` | e.g., `Midterm`, `Assignment 1` |
| `score` | `float` | |
| `maxScore` | `float` | |
| `gradedBy` | `uuid` | Teacher who entered the mark |
| `gradedAt` | `timestamp` | |

---

## Table: `fees`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `studentId` | `uuid` FK | |
| `courseId` | `uuid` FK | |
| `amount` | `decimal` | Total invoice amount |
| `description` | `varchar` | e.g., `"Spring 2026 Tuition"` |
| `dueDate` | `timestamp` | |
| `paidAmount` | `decimal` | DEFAULT `0` |
| `status` | `varchar` | `PENDING`, `PAID`, `OVERDUE`, `PARTIAL` |
| `paidAt` | `timestamp` | NULLABLE |
| `refundReason` | `varchar` | NULLABLE |
| `createdAt` / `updatedAt` | timestamp | Auto |

---

## Table: `notifications`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `title` | `varchar` | Notification headline |
| `body` | `text` | Full message |
| `audienceRole` | `varchar` | NULLABLE — `STUDENT`, `INSTRUCTOR`, `ADMIN` or NULL (all roles) |
| `courseId` | `uuid` | NULLABLE |
| `senderId` | `uuid` | Who created the notification |
| `isRead` | `boolean` | DEFAULT `false` — added in QA fix H-01 |
| `createdAt` | `timestamp` | Auto |

---

## Table: `attendance`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `courseId` | `uuid` FK | |
| `studentId` | `uuid` FK | |
| `date` | `date` | Class date |
| `status` | `varchar` | `PRESENT`, `ABSENT`, `LATE`, `EXCUSED` |
| `markedBy` | `uuid` | Teacher user ID |
| `createdAt` | `timestamp` | Auto |

---

## Enums Reference

```typescript
// Roles (used in users.role and RBAC guards)
ADMIN | INSTRUCTOR | STUDENT

// User status
ACTIVE | INACTIVE | SUSPENDED

// Enrollment status
ENROLLED | ACTIVE | DROPPED | COMPLETED

// Fee status
PENDING | PAID | OVERDUE | PARTIAL | REFUNDED

// Attendance status
PRESENT | ABSENT | LATE | EXCUSED

// Course status
ACTIVE | ARCHIVED

// Content type (lessons)
VIDEO | PDF | LINK | TEXT
```
