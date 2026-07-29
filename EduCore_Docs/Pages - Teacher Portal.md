# 👨‍🏫 Pages - Teacher Portal

> Route prefix: `/teacher/*`  
> Access: `INSTRUCTOR` role only

Related: [[Home]] | [[Frontend Architecture]] | [[Role-Based Access Control]]

---

## `/teacher` — Dashboard

**File:** `Frontend/app/teacher/page.tsx`

The main instructor dashboard showing:
- **My courses** — list of assigned courses with student counts
- **Upcoming assignments** — assignments with approaching due dates
- **Recent submissions** — latest student submissions awaiting grading
- **Gradebook quick view** — recent grade entries
- **At-risk students widget** — students in your courses below threshold

---

## `/teacher/courses` — My Courses

**File:** `Frontend/app/teacher/courses/`

Features:
- List all courses assigned to the current instructor
- **View course details** — description, credits, enrolled students
- **Manage modules** — add, edit, reorder modules within a course
- **Manage lessons** — add video/PDF/link/text lessons inside modules
- **Edit course info** — update title and description (cannot change code)

API calls: `coursesApi.list()`, `coursesApi.get()`, `coursesApi.getModules()`, `coursesApi.createModule()`, `coursesApi.updateModule()`, `coursesApi.removeModule()`

---

## `/teacher/assignments` — Assignment Management

**File:** `Frontend/app/teacher/assignments/`

Features:
- List all assignments for instructor's courses
- **Create assignment** — set title, description, max marks, due date, weight percent, rubric
- **Edit assignment** — update any field
- **Delete assignment**
- **View submissions** — see all student submissions for an assignment
- **Grade submission** — enter a score and feedback for each submission

API calls: `assignmentsApi.list()`, `assignmentsApi.create()`, `assignmentsApi.update()`, `assignmentsApi.remove()`, `assignmentsApi.submit()` (for viewing submissions: directly via `fetchAuthApi`)

---

## `/teacher/gradebook` — Grade Entry

**File:** `Frontend/app/teacher/gradebook/`

Features:
- Select a course → view the full student gradebook
- **Enter marks** — enter scores for midterms, finals, quizzes, projects
- **Edit marks** — update previously entered marks
- Calculates and displays average and grade letters

API calls: `marksApi.getGradebook(courseId)`, `marksApi.enterMark()`, `marksApi.updateMark()`

---

## `/teacher/attendance` — Attendance Marking

**File:** `Frontend/app/teacher/attendance/`

Features:
- Select course and date → mark each enrolled student as `PRESENT`, `ABSENT`, `LATE`, or `EXCUSED`
- View attendance history for a course
- Attendance summary stats per student

API calls: `attendanceApi.get()`, `attendanceApi.mark()`, `attendanceApi.getSummary()`

---

## `/teacher/analytics` — Course Analytics

**File:** `Frontend/app/teacher/analytics/`

Features:
- Grade distribution charts (bar, pie)
- Attendance trend over time
- At-risk student list (below configurable threshold)
- Submission rates per assignment

API calls: `reportsApi.performance(courseId)`, `reportsApi.attendance(courseId)`, `reportsApi.atRisk(threshold)`

---

## `/teacher/chat` — Messaging

**File:** `Frontend/app/teacher/chat/`

Features:
- View conversations with students
- Send and receive messages in real-time (WebSocket + REST fallback)
- Course group chats

API calls: `chatApi.getConversations()`, `chatApi.getMessages()`, `chatApi.sendMessage()`

---

## `/teacher/profile` — Instructor Profile

**File:** `Frontend/app/teacher/profile/`

Features:
- View and edit own profile info
- Update phone number and profile picture

---

## Teacher Layout (`app/teacher/layout.tsx`)

- Sidebar with navigation links
- Shows notification count
- Shows course assignment summary in header
