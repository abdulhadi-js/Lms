# 🎓 Pages - Student Portal

> Route prefix: `/student/*`  
> Access: `STUDENT` role only

Related: [[Home]] | [[Frontend Architecture]] | [[Role-Based Access Control]]

---

## `/student` — Dashboard

**File:** `Frontend/app/student/page.tsx`

The student's home showing:
- **My subjects** — enrolled subjects with progress
- **Upcoming assignments** — deadlines sorted by due date
- **Recent grades** — last few marks entered
- **Fee status** — any pending or overdue invoices
- **Announcements** — latest notifications

---

## `/student/subjects` — My Subjects

**File:** `Frontend/app/student/subjects/`

Features:
- List all subjects the student is enrolled in
- Click a subject to view its full module/lesson tree
- Browse video, PDF, and link content inside lessons

API calls: `enrollmentsApi.getMySubjects()`, `academicsApi.getSubject(id)`, `academicsApi.getModules(subjectId)`

---

## `/student/assignments` — Assignments

**File:** `Frontend/app/student/assignments/`

Features:
- List all assignments from enrolled subjects
- See due date, max marks, and submission status for each
- **Submit assignment** — text submission or file upload (PDF, DOCX)
- Upload progress bar for file submissions
- View own submission + teacher feedback + score after grading

API calls: `assignmentsApi.list()`, `assignmentsApi.get()`, `assignmentsApi.submit(id, data, onUploadProgress)`

> **Note:** File uploads use `axios.post` (not `fetch`) to support `onUploadProgress` callbacks.

---

## `/student/grades` — Grades

**File:** `Frontend/app/student/grades/`

Features:
- View all marks entered for the current student
- Organized by subject
- Shows score, max score, percentage, and letter grade

API calls: `marksApi.getStudentMarks(studentId)` → `GET /marks?studentId=`

---

## `/student/transcript` — Academic Transcript

**File:** `Frontend/app/student/transcript/`

Features:
- Official-style academic transcript view
- Lists all subjects with final grades, GPA, and credit hours
- **Download PDF** button — triggers server-side PDF generation

> **Note:** The page h1 reads `"Unofficial Transcript"` (Playwright test updated to match — QA fix H-02)

API calls: `marksApi.getTranscript(studentId)`, `marksApi.downloadTranscriptPdf(studentId)`

---

## `/student/fees` — Fee Payments

**File:** `Frontend/app/student/fees/`

Features:
- View all invoices assigned to the student
- See status: `PENDING`, `PARTIAL`, `PAID`, `OVERDUE`
- View amount due vs amount paid

API calls: `feesApi.list()`

---

## `/student/attendance` — Attendance Record

**File:** `Frontend/app/student/attendance/`

Features:
- View own attendance records per subject
- Attendance summary: total classes, present count, attendance percentage
- Filter by date range

API calls: `attendanceApi.get(subjectId, studentId)`, `attendanceApi.getSummary(subjectId, studentId)`

---

## `/student/chat` — Messaging

**File:** `Frontend/app/student/chat/`

Features:
- Message instructors directly
- Participate in subject group chats

API calls: `chatApi.getConversations()`, `chatApi.getMessages()`, `chatApi.sendMessage()`

---

## `/student/profile` — Student Profile

**File:** `Frontend/app/student/profile/`

Features:
- View and update own personal information
- Change profile picture

---

## Student Layout (`app/student/layout.tsx`)

- Mobile-friendly bottom navigation bar (Subjects, Assignments, Grades, Profile)
- Notification bell in header
- Logged-in student's name and avatar
