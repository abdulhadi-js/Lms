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

## 📚 Courses (`/api/v1/courses`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/public/courses` | ❌ Public | List active courses (used for student applications) |
| `GET` | `/courses` | ✅ JWT | List courses (scoped by role) |
| `POST` | `/courses` | ADMIN | Create a new course |
| `GET` | `/courses/:id` | ✅ JWT | Get a course with its modules |
| `PATCH` | `/courses/:id` | ADMIN / INSTRUCTOR | Update course details |
| `DELETE` | `/courses/:id` | ADMIN | Archive a course |
| `POST` | `/courses/:id/assign-teacher` | ADMIN | Assign an instructor to a course |
| `GET` | `/courses/:id/modules` | ✅ JWT | Get all modules (with lessons) for a course |
| `POST` | `/courses/:id/modules` | ADMIN / INSTRUCTOR | Add a module to a course |
| `PATCH` | `/courses/:courseId/modules/:moduleId` | ADMIN / INSTRUCTOR | Update a module |
| `DELETE` | `/courses/:courseId/modules/:moduleId` | ADMIN / INSTRUCTOR | Delete a module |
| `POST` | `/modules/:moduleId/lessons` | ADMIN / INSTRUCTOR | Add a lesson to a module |

---

## 📋 Enrollments (`/api/v1/enrollments`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/enrollments` | ✅ JWT | List enrollments (scoped by role) |
| `POST` | `/enrollments` | ADMIN | Directly enroll a student in a course |
| `POST` | `/enrollments/bulk` | ADMIN | Bulk enroll multiple students in a single course |
| `PATCH` | `/enrollments/:id` | ADMIN | Update an enrollment record |
| `DELETE` | `/enrollments/:id` | ADMIN | Remove an enrollment record |
| `POST` | `/enrollments/:id/drop` | ✅ JWT | Student or admin requests a course drop |
| `PATCH` | `/enrollments/:id/drop/review` | ADMIN | Admin approves or rejects a drop request |

---

## 📑 Applications (`/api/v1/applications`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/applications?status=PENDING_REVIEW` | ADMIN | List all public enrollment applications |
| `PATCH` | `/applications/:id/review` | ADMIN | Approve or reject an application |

---

## 📝 Assignments (`/api/v1`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/assignments` | ✅ JWT | List assignments (scoped by role — students see only enrolled courses) |
| `GET` | `/assignments/:id` | ✅ JWT | Get a single assignment |
| `POST` | `/courses/:courseId/assignments` | ADMIN / INSTRUCTOR | Create an assignment |
| `PATCH` | `/assignments/:id` | ADMIN / INSTRUCTOR | Update an assignment |
| `DELETE` | `/assignments/:id` | ADMIN / INSTRUCTOR | Delete an assignment |
| `POST` | `/assignments/:id/submissions` | STUDENT | Submit an assignment (supports file upload via `multipart/form-data`) |
| `GET` | `/assignments/:id/submissions` | ✅ JWT | Get submissions for an assignment |
| `PATCH` | `/submissions/:id/grade` | ADMIN / INSTRUCTOR | Grade a submission |

---

## 📊 Marks (`/api/v1/marks`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/marks?studentId=&courseId=` | ✅ JWT | Get marks by student or course |
| `GET` | `/marks/gradebook?courseId=` | ✅ JWT | Get full gradebook for a course |
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
| `GET` | `/attendance?courseId=&studentId=&startDate=&endDate=` | Get attendance records with filters |
| `GET` | `/attendance/summary?courseId=&studentId=` | Get attendance summary stats |
| `POST` | `/attendance` | Mark attendance for a class session |

---

## 🗓️ Timetable (`/api/v1/timetable`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/timetable` | Get all scheduled slots |
| `POST` | `/timetable` | Create a new scheduled slot |
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
| `GET` | `/chat/messages?partnerId=&courseId=` | Get messages for a conversation |
| `POST` | `/chat/messages` | Send a message `{ receiverId?, courseId?, body }` |

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
| `GET` | `/reports/performance?courseId=` | Grade performance report |
| `GET` | `/reports/attendance?courseId=` | Attendance report |
| `GET` | `/reports/at-risk?threshold=50` | Students below a grade threshold |

---

## ❤️ Health (`/api/v1`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ Public | Returns `{ status: "ok", timestamp: "..." }` — used by Render health checks |
