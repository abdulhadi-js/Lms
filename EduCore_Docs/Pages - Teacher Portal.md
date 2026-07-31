# 👨‍🏫 Pages - Teacher Portal

> Route prefix: `/teacher/*`  
> Access: `INSTRUCTOR` role only

Related: [[Home]] | [[Frontend Architecture]] | [[Role-Based Access Control]]

---

## `/teacher` — Dashboard

**File:** `Frontend/app/teacher/page.tsx`

The main instructor dashboard showing:
- **My subjects** — list of assigned subjects based on timetable with student counts
- **Upcoming assignments** — assignments with approaching due dates
- **Recent submissions** — latest student submissions awaiting grading
- **Gradebook quick view** — recent grade entries
- **At-risk students widget** — students in your subjects below threshold

---

## `/teacher/subjects` — My Subjects

**File:** `Frontend/app/teacher/subjects/`

Features:
- List all subjects assigned to the current instructor (via timetable)
- **View subject details** — description, credits, enrolled students
- **Manage modules** — add, edit, reorder modules within a subject
- **Manage lessons** — add video/PDF/link/text lessons inside modules
- **Edit subject info** — update title and description (cannot change code)

API calls: `timetableApi.getTeacherTimetable()`, `academicsApi.getSubject()`, `academicsApi.getModules()`, `academicsApi.createModule()`, `academicsApi.updateModule()`, `academicsApi.removeModule()`

---

## `/teacher/assignments` — Assignment Management

**File:** `Frontend/app/teacher/assignments/`

Features:
- List all assignments for instructor's subjects
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
- Select a subject → view the full student gradebook
- **Enter marks** — enter scores for midterms, finals, quizzes, projects
- **Edit marks** — update previously entered marks
- Calculates and displays average and grade letters

API calls: `marksApi.getGradebook(subjectId)`, `marksApi.enterMark()`, `marksApi.updateMark()`

---

## `/teacher/attendance` — Attendance Marking

**File:** `Frontend/app/teacher/attendance/`

Features:
- Select subject and date → mark each enrolled student as `PRESENT`, `ABSENT`, `LATE`, or `EXCUSED`
- View attendance history for a subject
- Attendance summary stats per student

API calls: `attendanceApi.get()`, `attendanceApi.mark()`, `attendanceApi.getSummary()`

---

## `/teacher/analytics` — Subject Analytics

**File:** `Frontend/app/teacher/analytics/`

Features:
- Grade distribution charts (bar, pie)
- Attendance trend over time
- At-risk student list (below configurable threshold)
- Submission rates per assignment

API calls: `reportsApi.performance(subjectId)`, `reportsApi.attendance(subjectId)`, `reportsApi.atRisk(threshold)`

---

## `/teacher/chat` — Messaging

**File:** `Frontend/app/teacher/chat/`

Features:
- View conversations with students
- Send and receive messages in real-time (WebSocket + REST fallback)
- Subject group chats

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
- Shows subject assignment summary in header
