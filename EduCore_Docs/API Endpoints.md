# 🔌 API Endpoints

> All routes are prefixed with `/api/v1/`. Authentication uses `Authorization: Bearer <accessToken>`.
> Swagger UI available at: `http://localhost:3001/api/docs`

Related: [[Home]] | [[Backend Architecture]] | [[Authentication Flow]] | [[Role-Based Access Control]]

---

## 🔐 Auth (`/api/v1/auth`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ Public | Login with email + password. Returns `{ accessToken, refreshToken, user }` |
| `POST` | `/auth/refresh` | Refresh Token | Exchange refresh token for a new access token |
| `POST` | `/auth/logout` | ✅ JWT | Invalidate current session |
| `GET` | `/auth/me` | ✅ JWT | Returns the currently authenticated user's profile |
| `POST` | `/auth/forgot-password` | ❌ Public | Send password reset email |
| `POST` | `/auth/reset-password` | ❌ Public | Reset password using token from email |

---

## 👥 Users (`/api/v1/users`) — Admin Only

| Method | Route | Description |
|---|---|---|
| `GET` | `/users?role=STUDENT` | List all users, optionally filter by role |
| `GET` | `/users/:id` | Get single user |
| `POST` | `/users` | Create new user (Admin creates accounts manually) |
| `PATCH` | `/users/:id` | Update user fields |
| `DELETE` | `/users/:id` | Soft-deactivate user (sets status to INACTIVE) |
| `POST` | `/users/:id/reset-password` | Admin resets a user's password |

---

## 📚 Academics (`/api/v1/academics`)

Replaces the old Courses module.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/academics/classes` | ✅ JWT | List all academic classes |
| `POST` | `/academics/classes` | ADMIN | Create an academic class |
| `GET` | `/academics/classes/:id` | ✅ JWT | Get details of an academic class |
| `GET` | `/academics/subjects` | ✅ JWT | List subjects |
| `POST` | `/academics/subjects` | ADMIN | Create a subject |
| `GET` | `/academics/sections` | ✅ JWT | List sections |
| `POST` | `/academics/sections` | ADMIN | Create a section |

---

## 📋 Enrollments (`/api/v1/enrollments`)

Students are now enrolled into Sections.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/enrollments` | ✅ JWT | List enrollments (scoped by role) |
| `POST` | `/enrollments` | ADMIN | Directly enroll a student in a section |
| `POST` | `/enrollments/bulk` | ADMIN | Bulk enroll multiple students in a single section |
| `PATCH` | `/enrollments/:id` | ADMIN | Update an enrollment record |
| `DELETE` | `/enrollments/:id` | ADMIN | Remove an enrollment record |
| `POST` | `/enrollments/:id/drop` | ✅ JWT | Student or admin requests a section drop |
| `PATCH` | `/enrollments/:id/drop/review` | ADMIN | Admin approves or rejects a drop request |

---

## 📑 Applications (`/api/v1/applications`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/applications?status=PENDING_REVIEW` | ADMIN | List all public enrollment applications (to sections) |
| `PATCH` | `/applications/:id/review` | ADMIN | Approve or reject an application |

---

## 📝 Assignments (`/api/v1`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/assignments` | ✅ JWT | List assignments (scoped by role) |
| `GET` | `/assignments/:id` | ✅ JWT | Get a single assignment |
| `POST` | `/academics/subjects/:subjectId/sections/:sectionId/assignments` | ADMIN / INSTRUCTOR | Create an assignment |
| `PATCH` | `/assignments/:id` | ADMIN / INSTRUCTOR | Update an assignment |
| `DELETE` | `/assignments/:id` | ADMIN / INSTRUCTOR | Delete an assignment |
| `POST` | `/assignments/:id/submissions` | STUDENT | Submit an assignment (supports file upload via `multipart/form-data`) |
| `GET` | `/assignments/:id/submissions` | ✅ JWT | Get submissions for an assignment |
| `PATCH` | `/submissions/:id/grade` | ADMIN / INSTRUCTOR | Grade a submission |

---

## 📊 Marks (`/api/v1/marks`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/marks?studentId=&sectionId=&subjectId=` | ✅ JWT | Get marks by student, section, or subject |
| `GET` | `/marks/gradebook?sectionId=&subjectId=` | ✅ JWT | Get full gradebook for a section/subject |
| `POST` | `/marks` | ADMIN / INSTRUCTOR | Enter a mark |
| `PATCH` | `/marks/:id` | ADMIN / INSTRUCTOR | Update a mark |
| `GET` | `/marks/transcript/:studentId` | ✅ JWT | Get full academic transcript |
| `GET` | `/marks/transcript/:studentId/pdf` | ✅ JWT | Download transcript as PDF |
| `GET` | `/marks/grading-criteria` | ✅ JWT | Get grading criteria / rubrics |
| `POST` | `/marks/grading-criteria` | ADMIN | Create grading criteria |

---

## 📅 Attendance (`/api/v1/attendance`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/attendance?sectionId=&studentId=&startDate=&endDate=` | Get attendance records with filters |
| `GET` | `/attendance/summary?sectionId=&studentId=` | Get attendance summary stats |
| `POST` | `/attendance` | Mark attendance for a section session |

---

## 🗓️ Timetable (`/api/v1/timetable`)

Manages room booking, teacher assignments to subjects/sections, and schedules.

| Method | Route | Description |
|---|---|---|
| `GET` | `/timetable?sectionId=&teacherId=` | Get scheduled slots |
| `POST` | `/timetable` | Create a new scheduled slot (assigns a teacher to a subject in a section and books a room) |
| `PATCH` | `/timetable/:id` | Update a slot |
| `DELETE` | `/timetable/:id` | Remove a slot |

---

## 💰 Fees (`/api/v1/fees`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/fees` | List fees (scoped by role) |
| `POST` | `/fees` | Create a fee invoice |
| `PATCH` | `/fees/:id` | Update a fee record |
| `DELETE` | `/fees/:id` | Remove a fee record |
| `POST` | `/fees/:id/pay` | Record a payment `{ amount: number }` |

---

## 💬 Chat (`/api/v1/chat`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/chat/conversations` | List all conversations for current user |
| `GET` | `/chat/messages?partnerId=&sectionId=` | Get messages for a conversation |
| `POST` | `/chat/messages` | Send a message `{ receiverId?, sectionId?, body }` |

> Chat also supports **WebSocket** for real-time messaging.

---

## 🔔 Notifications (`/api/v1/notifications`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/notifications` | List notifications for current user's role |
| `POST` | `/notifications` | Create a notification |
| `PATCH` | `/notifications/read-all` | Mark all notifications as read (QA fix H-01) |
| `GET` | `/notifications/:id` | Get a single notification |

---

## 📈 Reports (`/api/v1/reports`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/reports/overview` | Dashboard stats (counts, revenue, etc.) |
| `GET` | `/reports/performance?sectionId=` | Grade performance report |
| `GET` | `/reports/attendance?sectionId=` | Attendance report |
| `GET` | `/reports/at-risk?threshold=50` | Students below a grade threshold |

---

## ❤️ Health (`/api/v1`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ Public | Returns `{ status: "ok", timestamp: "..." }` — used by Render health checks |
