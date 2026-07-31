# 🗃️ Database Schema

> **Database:** PostgreSQL · **ORM:** TypeORM · **Entities path:** `Backend/src/**/entities/*.entity.ts`

Related: [[Home]] | [[Backend Architecture]] | [[API Endpoints]]

---

## Entity Relationship Overview

```
users ──────────┬── enrollments (studentId)
                ├── fees (studentId)
                ├── submissions (studentId)
                └── timetable (teacherId)

academic_classes ── sections ── enrollments (sectionId)
                  └── subjects

sections ────────┬── timetable (sectionId)
                 └── attendance (sectionId, studentId, date)

subjects ────────┬── timetable (subjectId)
                 ├── assignments (subjectId, sectionId)
                 └── marks (subjectId, sectionId, studentId)

assignments ─────└── submissions (assignmentId)

fees ────────────── (standalone: studentId, sectionId)
notifications ─────── (standalone: audienceRole)
chat_messages ─────── (senderId, receiverId / sectionId)
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

## Table: `academic_classes`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `name` | `varchar` | UNIQUE | e.g., `Grade 10` |
| `description` | `varchar` | NULLABLE | |
| `status` | `varchar` | DEFAULT `ACTIVE` | `ACTIVE`, `ARCHIVED` |

---

## Table: `subjects`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `classId` | `uuid` | FK → `academic_classes.id` | |
| `name` | `varchar` | NOT NULL | e.g., `Mathematics` |
| `code` | `varchar` | UNIQUE | e.g., `MATH10` |
| `credits` | `int` | DEFAULT `3` | |

---

## Table: `sections`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `classId` | `uuid` | FK → `academic_classes.id` | |
| `name` | `varchar` | NOT NULL | e.g., `Section A` |
| `capacity` | `int` | DEFAULT `30` | |

---

## Table: `enrollments`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `studentId` | `uuid` | FK → users.id, INDEX | |
| `sectionId` | `uuid` | FK → sections.id, INDEX | |
| `status` | `varchar` | DEFAULT `ENROLLED` | `ENROLLED`, `ACTIVE`, `DROPPED`, `COMPLETED` |
| `dropReason` | `varchar` | NULLABLE | |
| `droppedAt` | `timestamp` | NULLABLE | |
| `createdAt` | `timestamp` | Auto | |

---

## Table: `timetable`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `sectionId` | `uuid` | FK → sections.id | |
| `subjectId` | `uuid` | FK → subjects.id | |
| `teacherId` | `uuid` | FK → users.id | Teacher assignment is handled here |
| `room` | `varchar` | NOT NULL | Room booking |
| `day` | `varchar` | NOT NULL | e.g., `Monday` |
| `time` | `varchar` | NOT NULL | e.g., `10:00 AM - 11:30 AM` |

---

## Table: `assignments`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `subjectId` | `uuid` FK | → subjects.id |
| `sectionId` | `uuid` FK | → sections.id |
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
| `sectionId` | `uuid` FK | |
| `subjectId` | `uuid` FK | |
| `assessmentName` | `varchar` | e.g., `Midterm`, `Assignment 1` |
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
| `sectionId` | `uuid` FK | |
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
| `sectionId` | `uuid` | NULLABLE |
| `senderId` | `uuid` | Who created the notification |
| `isRead` | `boolean` | DEFAULT `false` — added in QA fix H-01 |
| `createdAt` | `timestamp` | Auto |

---

## Table: `attendance`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `sectionId` | `uuid` FK | |
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

// Academic status
ACTIVE | ARCHIVED

// Schedule Days
Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday

// Schedule Time
08:00 AM - 09:30 AM | 10:00 AM - 11:30 AM | 12:00 PM - 01:30 PM | 02:00 PM - 03:30 PM | 04:00 PM - 05:30 PM | 06:00 PM - 07:30 PM
```
