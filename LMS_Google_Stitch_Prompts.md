# 🎨 Google Stitch AI — Complete LMS Prototype Prompts
## Learning Management System for Schools & Colleges
### Derived from LMS_PRD.md + design.md | Version 1.0 | July 2026

---

> **How to use these prompts:** Copy each prompt block into Google Stitch AI individually, one page at a time. Each prompt is self-contained and references the same design system, so Stitch will generate consistent screens across the entire product.

---

## 🌐 GLOBAL DESIGN SYSTEM CONTEXT
*(Paste this block at the START of every Stitch session, or save as a "Base Style" reference)*

```
DESIGN SYSTEM — always apply these rules to every screen generated in this session:

BRAND IDENTITY: LMS platform for schools and colleges. Clean, trustworthy, academic yet modern. Inspired by nature (deep forest greens).

COLOR PALETTE:
- Evergreen #132a13 — darkest brand, primary headings, footer background
- Hunter Green #31572c — primary brand, nav bars, primary buttons, links
- Fern #4f772d — secondary brand, secondary buttons, teacher accent
- Palm Leaf #90a955 — accent, badges, enrolled status, student accent
- Lime Cream #ecf39e — highlight backgrounds, notification badges

NEUTRALS:
- White #ffffff — card backgrounds, input backgrounds
- #f4f4f4 — page background (neutral)
- #fefef9 — page background (lime tint, preferred)
- #e4e4e4 — borders, disabled states
- #c6c6c6 — dividers
- #a4a4a4 — placeholder text
- #818181 — inactive icons
- #5f5f5f — secondary body text
- #444444 — primary body text
- #323232 — headings on light backgrounds

SEMANTIC COLORS:
- Success #4f772d (= Fern) with bg #e6ece2
- Warning #d9a441 with bg #faf1de
- Error #b3423a with bg #f5e2e0
- Info #3d6b8c with bg #e2ebf0

KEY GRADIENTS:
- Hero/Login bg: linear-gradient(135deg, #132a13, #31572c, #4f772d)
- Dashboard header (fresh): linear-gradient(135deg, #4f772d, #90a955, #ecf39e)
- Primary button: linear-gradient(180deg, #3a6633, #31572c)
- Card accent top border: linear-gradient(90deg, #90a955, #ecf39e)
- Sidebar (dark): linear-gradient(180deg, #132a13, #0d1d0d)
- Progress bars: linear-gradient(90deg, #90a955, #4f772d)
- Image overlays: linear-gradient(180deg, transparent, rgba(19,42,19,0.85))

TYPOGRAPHY:
- Font family: Inter (primary), fallback system-ui
- H1: 32–40px, weight 700, color #132a13
- H2: 24–28px, weight 600, color #132a13
- H3: 18–20px, weight 600, color #323232
- Body: 14–16px, weight 400, color #444444
- Captions/labels: 12px, weight 500, color #5f5f5f
- Links: #31572c, hover #436526

COMPONENT RULES:
- Primary buttons: gradient(180deg, #3a6633, #31572c), white text, 8px border-radius, hover darkens to #2a4a25
- Secondary buttons: #4f772d background, white text
- Outline buttons: transparent bg, #31572c border and text
- Destructive buttons: #b3423a background, white text
- Cards: white bg #ffffff, 1px border #c6c6c6, border-radius 12px, shadow rgba(19,42,19,0.08)
- Input fields: white bg, 1px border #c6c6c6, focus border #31572c, 8px radius
- Tables: header bg #31572c with white text, alternate rows #fcfdf1, hover row #eff3e7
- Status badges: Enrolled = bg #eff3e7 text #4f5d2f | Pending = bg #faf1de text #8a6521 | Dropped = bg #e4e4e4 text #5f5f5f | Rejected = bg #f5e2e0 text #b3423a
- Nav bar: #31572c background, white icons and text
- Sidebar (admin): dark gradient #132a13 → #0d1d0d, active item palm leaf #90a955 on #223d1f bg
- Role gradient badges: Admin = #132a13→#31572c | Teacher = #31572c→#4f772d | Student = #4f772d→#90a955
```

---

## PROMPT 01 — PUBLIC LANDING PAGE

```
Design a stunning public-facing landing/marketing page for an LMS (Learning Management System) called "EduCore" built for schools and colleges. This is a desktop web page, 1440px wide.

HERO SECTION:
- Full-width hero with background gradient: linear-gradient(135deg, #132a13 0%, #31572c 45%, #4f772d 100%)
- Centered layout: large H1 headline "Empower Every Learner. Manage Every Classroom." in white, weight 700, 48px
- Subtitle text below in #e4e4e4, 18px: "A complete Learning Management System for schools and colleges — courses, attendance, grading, fees, and more in one place."
- Two CTA buttons side by side: Primary button "Get Started" with gradient(180deg, #3a6633, #31572c) background, white text, 48px height, 12px radius. Secondary outline button "Learn More" with transparent bg and #ecf39e border and text.
- Below buttons, small trust line in #90a955: "Trusted by 200+ institutions nationwide"
- Right side of hero: isometric illustration of a digital classroom dashboard (greens + lime accents) floating with subtle drop shadow

NAVIGATION BAR (top, fixed):
- Background: #31572c (Hunter Green)
- Left: "EduCore" logo in white bold with a small leaf/academic cap icon in #ecf39e
- Center: nav links — Features, Courses, Pricing, About, Contact — all in white, 14px, hover underline in #ecf39e
- Right: "Login" outline button (white border, white text) and "Apply Now" solid button (gradient #3a6633→#31572c) 

FEATURES SECTION:
- Background: #fefef9 (Lime-50)
- Section heading "Everything Your Institution Needs" centered, #132a13, 32px bold
- 3-column card grid with 6 feature cards:
  1. "Course Management" — book icon in #31572c, description in #444444
  2. "Attendance Tracking" — calendar-check icon in #4f772d
  3. "Marks & Grading" — chart icon in #90a955
  4. "Fee Management" — credit-card icon in #31572c
  5. "Smart Scheduling" — clock icon in #4f772d
  6. "Real-time Chat" — chat-bubble icon in #90a955
- Each card: white #ffffff bg, 1px border #c6c6c6, 12px radius, 4px top accent gradient (linear-gradient(90deg, #90a955, #ecf39e)), shadow rgba(19,42,19,0.08), icon 32px, H3 #132a13 18px, body #444444 14px

ROLES SECTION:
- Background: linear-gradient(135deg, #4f772d, #90a955, #ecf39e)
- Heading "Built for Every Role" white, centered, 32px bold
- 3 role cards side by side:
  - Admin card: bg linear-gradient(135deg, #132a13, #31572c), white icon (shield/settings), "Admin" label, description of admin superpowers
  - Teacher card: bg linear-gradient(135deg, #31572c, #4f772d), white icon (chalkboard), "Teacher" label, description
  - Student card: bg linear-gradient(135deg, #4f772d, #90a955), white icon (graduation cap), "Student" label, description
- Each card 12px radius, white text, subtle white border rgba(255,255,255,0.2)

STATS BANNER:
- Background: #31572c (Hunter Green)
- 4 stats in a row, white numbers 48px bold, labels in #ecf39e 14px:
  "5,000+ Students" | "200+ Courses" | "50+ Schools" | "99% Satisfaction"

TESTIMONIALS:
- Background: #f4f4f4
- 3 quote cards, white bg, italic quote text #444444, bold name #132a13, role badge below name using role gradients
- Subtle left border 4px in #90a955 (palm leaf)

CTA FOOTER SECTION:
- Background: linear-gradient(135deg, #132a13, #31572c)
- Large centered text "Ready to Transform Your Institution?" white 36px bold
- "Apply for Free Trial" button: gradient(180deg, #3a6633, #31572c) bg with #ecf39e border for contrast, white text

FOOTER:
- Background: #132a13 (Evergreen)
- 4-column layout: Logo+tagline, Quick Links, Features, Contact
- All text: #e4e4e4, links hover to #ecf39e
- Bottom bar: thin #31572c divider line, copyright text #818181
- Overall vertical rhythm: 80px section padding, generous whitespace
```

---

## PROMPT 02 — LOGIN / SIGN IN PAGE

```
Design a split-layout Login page for an LMS called "EduCore" for schools and colleges. Desktop screen 1440px wide.

LAYOUT: Two-column split — left 55% visual panel, right 45% login form.

LEFT PANEL:
- Full-height background gradient: linear-gradient(135deg, #132a13 0%, #31572c 45%, #4f772d 100%)
- Large "EduCore" wordmark at top-left in white bold with small leaf icon in #ecf39e
- Center: a hero illustration — stylized academic dashboard on a floating screen/tablet, glowing with subtle lime-cream #ecf39e highlights
- Bottom-left: 3 trust badges (white icons on semi-transparent #ffffff20 bg pill shapes): "🎓 200+ Institutions" | "📚 5,000+ Students" | "🔒 Secure & Compliant"
- Subtle animated floating dots/particles in #90a955 (low opacity 20%) across the left panel
- Decorative curved white divider on the right edge of the left panel blending into the right form panel

RIGHT PANEL:
- Background: #fefef9 (Lime-50)
- Vertically and horizontally centered content, max-width 380px
- Top: small "EduCore" logo in #31572c
- H2 heading "Welcome Back" in #132a13, 28px bold, margin below 4px
- Subtitle "Sign in to your account to continue" in #5f5f5f, 14px

LOGIN FORM:
- Email field: label "Email Address" #132a13 12px medium, input white bg #ffffff, border #c6c6c6 1px, radius 8px, 48px height, focus border #31572c, placeholder "you@school.edu" in #a4a4a4
- Password field: same styling, label "Password", with show/hide eye icon in #818181 on the right inside the field
- "Forgot Password?" link aligned right, #31572c color, 13px
- "Sign In" CTA button: full-width, 52px height, 10px radius, background gradient(180deg, #3a6633, #31572c), white text 16px semibold, hover state darkens to #2a4a25
- Below button: "Don't have an account? Apply Now" text in #5f5f5f with "Apply Now" link in #31572c

ROLE SELECTOR (above form, optional visual):
- 3 pill tabs: "Admin" | "Teacher" | "Student"
- Active pill: #31572c background white text
- Inactive: white bg #c6c6c6 border #444444 text
- Used to switch context (visual only for prototype)

ERROR STATE (show as variant):
- Email field border turns #b3423a, error message below in #b3423a 12px "Invalid email or password. Please try again." with small x-circle icon in #b3423a
- Field background tints slightly #f5e2e0

BOTTOM: 
- "By signing in you agree to our Terms & Privacy Policy" in #a4a4a4 12px centered
- Accessibility: high-contrast labels, visible focus rings in #31572c
```

---

## PROMPT 03 — ADMIN DASHBOARD (HOME)

```
Design a comprehensive Admin Dashboard for an LMS web application called "EduCore". This is the main home screen for the Admin role. Desktop 1440px wide.

GLOBAL LAYOUT:
- Left sidebar: 240px wide, dark gradient background linear-gradient(180deg, #132a13, #0d1d0d)
- Main content: remaining width, page background #fefef9
- Top header bar: white #ffffff bg, height 64px, shadow rgba(19,42,19,0.08)

SIDEBAR:
- Top: "EduCore" logo in white with leaf icon in #ecf39e
- Below logo: Admin avatar circle (dark gradient #132a13→#31572c), admin name "Dr. Sarah Ahmed" in white 14px semibold, "Administrator" label in #90a955 12px
- Navigation items (each 44px height, left-padding 20px, left 4px accent bar):
  - 🏠 Dashboard (active — background #223d1f, text #90a955, left bar #90a955)
  - 👥 User Management (text #e4e4e4, hover #fefef9)
  - 📚 Courses (text #e4e4e4)
  - 🎓 Enrollment
  - 📋 Attendance
  - 📊 Gradebook
  - 💳 Fees & Payments
  - 🗓️ Timetable
  - 💬 Chat Monitor
  - 📣 Notifications
  - 📈 Reports
  - ⚙️ Settings
- All icons in #90a955, inactive text #dee1de, section divider lines in #31572c at 40% opacity
- Bottom of sidebar: "Logout" item with door-exit icon in #b3423a

HEADER BAR:
- Left: "Dashboard" breadcrumb H2 #132a13 20px bold
- Center: Search bar (width 320px), white bg, #c6c6c6 border, magnifier icon in #818181, placeholder "Search students, courses..." in #a4a4a4
- Right: Notification bell with #ecf39e badge showing "3", Admin avatar, Settings gear icon — all in #31572c

STAT CARDS (top row, 4 cards):
- Each card: white bg #ffffff, 12px radius, shadow rgba(19,42,19,0.08), 4px top accent gradient(90deg, #90a955, #ecf39e)
  1. "Total Students" — large number 1,248 in #132a13 36px bold, subtitle "↑ 12 new this month" in #4f772d 13px, person-group icon #90a955
  2. "Active Courses" — number 42 in #132a13, subtitle "5 sections starting soon" in #5f5f5f, book-open icon #31572c
  3. "Pending Applications" — number 18 in #d9a441 (warning amber), subtitle "Needs review" in #8a6521, clock icon #d9a441
  4. "Fees Collected (Jul)" — "PKR 2.4M" in #132a13, subtitle "86% collection rate" in #4f772d, credit-card icon #90a955
- Cards sit in a 4-column grid with 16px gap

AT-RISK STUDENTS ALERT BANNER (below stat cards):
- Background: #faf1de (warning-100), left border 4px solid #d9a441, border-radius 8px
- Warning icon #d9a441, text "8 students are at-risk due to low attendance or failing grades. Review now →" in #8a6521 14px
- "View At-Risk Report" link in #31572c

MAIN CONTENT AREA (two columns, 60/40 split):

LEFT COLUMN:
1. "Recent Enrollment Applications" card:
   - Card header: "Pending Enrollments" #132a13 16px bold, "View All" link #31572c right-aligned
   - Table: header row bg #31572c white text — columns: Name | Program | Applied Date | Status | Action
   - 5 rows, alternating white and #fcfdf1 rows
   - Status badges: "Pending Review" bg #faf1de text #8a6521 | "Approved" bg #eff3e7 text #4f5d2f
   - Action buttons: "Approve" small solid #31572c | "Reject" small outline #b3423a border text
   - Row hover: #eff3e7

2. "Attendance Overview" chart card (below):
   - Horizontal bar chart per class/section
   - Bars use gradient(90deg, #90a955, #4f772d)
   - Chart bg white, gridlines #c6c6c6, text labels #444444
   - Threshold line at 75% in #d9a441 dashed

RIGHT COLUMN:
1. "Quick Actions" card:
   - "Enroll Student" button: full-width, gradient bg, white text, person-plus icon
   - "Create Course" button: full-width, secondary #4f772d bg, white text
   - "Post Announcement" button: full-width, outline #31572c border
   - "Generate Report" button: full-width, outline #31572c border

2. "Upcoming Schedule" card:
   - Mini timetable list: time slot | course name | teacher | room
   - Today's items highlighted with left border #90a955
   - Header gradient: linear-gradient(135deg, #4f772d, #90a955, #ecf39e), white text

3. "Notifications" card:
   - Notification items: icon (color-coded: blue #3d6b8c for info, amber for warning), message text #444444, timestamp #818181 12px
   - Unread items have left border #90a955 and bg #eff3e7

BOTTOM SECTION: "Institution Performance" full-width chart card:
- Line chart showing 6-month trend: attendance %, avg grades, fee collection
- Series 1 #31572c (attendance), Series 2 #4f772d (grades), Series 3 #90a955 (fees)
- White bg, gridlines #c6c6c6, labeled x-axis (months)
```

---

## PROMPT 04 — ADMIN: USER MANAGEMENT PAGE

```
Design the User Management page for the Admin in an LMS called "EduCore". Desktop 1440px wide. Same sidebar and header as Admin Dashboard.

PAGE HEADER:
- Breadcrumb: "Admin > User Management" in #5f5f5f 13px
- H1 "User Management" #132a13 28px bold
- Right-aligned: "Add New User" button gradient(180deg, #3a6633, #31572c) white text, + icon | "Import Users (CSV)" outline button #31572c border

TAB BAR:
- 3 tabs: "All Users" | "Teachers" | "Students"
- Active tab: #31572c bg white text, 8px radius top corners
- Inactive: white bg #444444 text, bottom border #c6c6c6
- Tab counts in pill badges: "All (312)" | "Teachers (64)" | "Students (248)"
- Badge bg #eff3e7, text #4f5d2f

FILTER & SEARCH BAR (below tabs):
- Left: Search input (320px wide, white bg, #c6c6c6 border, 8px radius, magnifier icon #818181)
- Dropdowns row: "Role" | "Status" | "Department/Course" — each white bg, border #c6c6c6, chevron icon #818181
- Right: "Export" button outline #31572c

USER TABLE:
- Table container: white bg, 12px radius, shadow rgba(19,42,19,0.08)
- Header row: bg #31572c, text white, 14px semibold — columns: ☐ Checkbox | Avatar+Name | Role Badge | Email | Status | Enrolled Courses | Date Added | Actions
- Role badges (pill shape, 6px radius):
  - Admin: gradient(135deg, #132a13, #31572c) white text
  - Teacher: gradient(135deg, #31572c, #4f772d) white text
  - Student: gradient(135deg, #4f772d, #90a955) white text
- Status badges:
  - Active: bg #eff3e7 text #4f5d2f
  - Inactive: bg #e4e4e4 text #5f5f5f
  - Pending: bg #faf1de text #8a6521
- Alternating rows: white and #fcfdf1
- Row hover: #eff3e7 bg
- Actions column: "Edit" icon (pencil) #31572c | "View" icon (eye) #4f772d | "Deactivate" icon (user-x) #b3423a — tooltip on hover
- Bulk actions bar (appears when rows checked): orange-ish bar #31572c bg, white text "3 selected — Deactivate | Delete | Export"

PAGINATION:
- Bottom: "Showing 1–20 of 248 users" #5f5f5f
- Page numbers: current page #31572c bg white text 8px radius, others white bg #c6c6c6 border
- Previous/Next arrows

ADD USER MODAL (overlay variant):
- Modal overlay: rgba(19,42,19,0.6) backdrop blur
- Modal card: white bg, 12px radius, shadow rgba(19,42,19,0.22), max-width 520px
- Header: "Add New User" #132a13 20px bold, × close button #818181
- Divider line #c6c6c6
- Form fields (full-width stacked):
  - First Name + Last Name (two-column row)
  - Email Address
  - Role selector (3 pill toggle: Admin / Teacher / Student)
  - Password (auto-generate toggle)
  - Department/Course Assignment (multi-select dropdown with #ecf39e tag chips)
- Footer: "Cancel" outline button | "Create User" gradient primary button
- All inputs: white bg, #c6c6c6 border, focus #31572c border, 8px radius
```

---

## PROMPT 05 — ADMIN: COURSE MANAGEMENT PAGE

```
Design the Course Management page for the Admin in an LMS called "EduCore". Desktop 1440px wide. Same global sidebar (#132a13→#0d1d0d gradient) and header bar.

PAGE HEADER:
- Breadcrumb: "Admin > Courses"
- H1 "Course & Curriculum Management" #132a13 28px bold
- Right: "Create New Course" button gradient(180deg, #3a6633, #31572c) white text, + icon

STATS ROW (4 mini-stat chips):
- "42 Total Courses" | "18 Active" | "8 Draft" | "4 Archived"
- Each chip: white bg, #c6c6c6 border, 20px radius, number bold #132a13, label #5f5f5f

FILTER BAR:
- Search input | Department dropdown | Status filter | Semester dropdown
- "View: Grid / List" toggle buttons aligned right (#31572c active, outline inactive)

COURSE GRID VIEW (3-column cards):
Each course card:
- Thumbnail image area (160px height) with overlay gradient(180deg, transparent, rgba(19,42,19,0.85))
- Overlay text bottom-left: Course name white 16px bold, Department tag in #ecf39e small pill
- Card body below image: white bg, 12px radius bottom corners
- Course title #132a13 16px semibold
- Teacher assigned row: small avatar + "Taught by [Name]" in #5f5f5f 13px
- Meta row: "📚 6 Modules" | "👥 32 Students" | "🗓️ Sem 1 2026" in #818181 12px
- 4px top gradient accent: linear-gradient(90deg, #90a955, #ecf39e)
- Status badge top-right corner: "Active" bg #eff3e7 text #4f5d2f | "Draft" bg #e4e4e4 text #5f5f5f
- Action row (card footer): "Edit" link #31572c | "Assign Teacher" link #4f772d | "Archive" link #b3423a | "View" link #31572c

COURSE DETAIL PANEL (right drawer, slide-in overlay variant):
- Width 480px, slides in from right
- Header: Course title #132a13 20px, close ×
- Divider
- Sections accordion:
  - "Course Info" — code, semester, credits, department
  - "Curriculum" — module list with drag handles (reorder), each module shows # of lessons
  - "Assigned Teacher" — avatar + name + reassign button
  - "Enrolled Students" — count with "View All" link
  - "Grading Criteria" — weighting breakdown table: Midterm 30% | Final 50% | Assignments 20%
- All inputs editable inline with #31572c focus rings
- Footer: "Save Changes" gradient button | "Delete Course" destructive #b3423a outline button
```

---

## PROMPT 06 — ADMIN: ENROLLMENT MANAGEMENT PAGE

```
Design the Enrollment Management page for the Admin in an LMS called "EduCore". Desktop 1440px wide. Same global sidebar and header.

PAGE HEADER:
- H1 "Enrollment & Admissions" #132a13 28px bold
- Two action buttons: "Enroll Student Directly" gradient #31572c→#3a6633 | "Review Applications" outline #31572c

STATS ROW:
- 4 stat chips: "18 Pending Applications" (text #d9a441) | "248 Enrolled Students" (#4f772d) | "5 Rejected" (#b3423a) | "12 Drop Requests" (#d9a441)

TAB BAR:
- Tabs: "Pending Applications" | "Enrolled Students" | "Drop Requests" | "Rejected"
- Active: #31572c bg, white text. Inactive: white bg, #444444 text, #c6c6c6 bottom border

PENDING APPLICATIONS TAB (default view):
- Table: white bg card, 12px radius, shadow rgba(19,42,19,0.08)
- Header row: #31572c bg, white text — columns: ☐ | Applicant Name | Program Applied | Applied Date | Documents | Status | Actions
- 8 rows: alternating white / #fcfdf1, hover #eff3e7
- "Documents" column: green checkmark icon #4f772d if uploaded, warning icon #d9a441 if missing
- Status badges: "Pending Review" bg #faf1de text #8a6521
- Actions: "Approve" solid small button #31572c | "Reject" outline small #b3423a | "View Details" eye icon

APPLICATION DETAIL MODAL (on click):
- Modal: white bg, 12px radius, shadow rgba(19,42,19,0.22), width 640px
- Header gradient linear-gradient(135deg, #132a13, #31572c), white title "Application Review", × close
- Body sections:
  - Personal Info: Name, DOB, Contact, Photo avatar
  - Academic Background: Previous school, GPA, uploaded certificates (small file cards #eff3e7 bg)
  - Desired Program: Course + section selector dropdown
  - Admin Notes field: white bg, #c6c6c6 border, area for reason text
- Footer: "Approve & Enroll" gradient button #31572c | "Reject" button #b3423a | "Hold for Review" outline #d9a441 border

DIRECT ENROLLMENT PANEL (separate tab or modal):
- "Enroll Student Directly" form:
  - Search existing student or "Create New Account" toggle
  - Student name, email, program
  - Section/class assignment dropdown
  - Enrollment date picker
  - "Generate Fee Record" checkbox (auto on)
  - "Enroll Now" gradient button

DROP REQUESTS TAB:
- Similar table: Student Name | Course | Request Date | Reason | Status | Action
- Status badges: "Drop Requested" #faf1de text #8a6521 | "Approved" #eff3e7 | "Rejected" #f5e2e0
- Actions: "Approve Drop" #31572c | "Reject" outline #b3423a | "View Student Record" eye icon
```

---

## PROMPT 07 — ADMIN: GRADEBOOK & MARKS OVERVIEW PAGE

```
Design the Admin Gradebook & Marks Overview page for an LMS called "EduCore". Desktop 1440px wide. Global sidebar and header same as before.

PAGE HEADER:
- H1 "Gradebook & Academic Records" #132a13 28px bold
- Right: "Export Gradebook (CSV/PDF)" outline button #31572c | "View Transcripts" outline button #4f772d

COURSE/CLASS FILTER ROW:
- Dropdowns: "Select Course" | "Select Section" | "Semester" | "Grading Component" (Midterm / Final / Assignments / All)
- All dropdowns: white bg, #c6c6c6 border, 8px radius, chevron #818181

GRADING CRITERIA CARD (collapsible):
- Card: white bg, 4px top accent gradient(90deg, #90a955, #ecf39e), 12px radius
- Header: "Grading Criteria — [Course Name]" #132a13 16px semibold, expand/collapse chevron
- When expanded: weight breakdown table:
  Component | Weight | Current Avg
  Midterm Exam | 30% | 72%
  Final Exam | 50% | 68%
  Assignments | 20% | 85%
- Row alternating white / #fcfdf1, header #31572c white text
- Below table: Grade scale reference: A (90–100%) | B (80–89%) | C (70–79%) | D (60–69%) | F (<60%)
- Grade labels use color coding: A = #e6ece2 bg #4f772d text | B = #eff3e7 bg #4f5d2f text | C = #faf1de bg #8a6521 | F = #f5e2e0 bg #b3423a

GRADEBOOK TABLE (main area):
- Full-width table card, white bg, 12px radius, shadow rgba(19,42,19,0.08)
- Sticky header row: bg #31572c, white text, 14px semibold
- Columns: Student Name | Midterm /100 | Assignments /100 | Final /100 | Weighted Total | Letter Grade | GPA
- 20 rows: alternating white / #fcfdf1, hover #eff3e7
- Grade cells color-coded:
  - 90+ : bg #e6ece2, text #375320 (fern-700)
  - 80–89: bg #eff3e7, text #4f5d2f
  - 70–79: bg #faf1de, text #8a6521
  - 60–69: bg #faf1de with orange text
  - Below 60: bg #f5e2e0, text #b3423a bold
- Letter Grade column: pill badges — A in #e6ece2/#375320, B in #eff3e7/#4f5d2f, F in #f5e2e0/#b3423a
- Admin override: clicking a marks cell shows inline edit input with #31572c border + audit note field
- "Admin Override" edited cells show small pencil icon and "(edited)" tag in #d9a441

CLASS PERFORMANCE SUMMARY (below table):
- 3 cards in a row:
  1. "Class Average" — donut chart in #31572c/Palm-leaf gradient, center text "72%"
  2. "Grade Distribution" — bar chart: A/B/C/D/F bars in spectrum from #4f772d to #b3423a
  3. "At-Risk Students" — number "4" in #b3423a large, list of 4 names with "View" link in #31572c
```

---

## PROMPT 08 — ADMIN: ATTENDANCE MANAGEMENT PAGE

```
Design the Attendance Management page for the Admin in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Attendance Management" #132a13 28px bold
- Right: "Export Attendance Report" outline button #31572c | "Generate Warnings" button #d9a441 bg white text (amber warning color)

FILTER ROW:
- Course dropdown | Section dropdown | Date Range picker (from/to) | Attendance threshold slider ("Flag below X%")
- "Apply Filters" button gradient #31572c

INSTITUTION OVERVIEW CARD:
- Full-width card, 4px top accent gradient(90deg, #90a955, #ecf39e), white bg, 12px radius
- 3 columns:
  - "Overall Attendance Rate" — large donut chart, arc filled with gradient(90deg, #90a955, #4f772d), center "87%" #132a13 32px bold
  - "Classes This Week" — bar chart by day (Mon–Fri), bars #31572c, text #444444
  - "Attendance Alerts" — list: 3 students with low attendance (below 75%), each row shows name, course, rate in #b3423a, "Notify" link #31572c

COURSE-BY-COURSE ACCORDION:
Each accordion item (per course/section):
- Header: Course name #132a13 16px bold | Teacher name #5f5f5f | "Avg 89%" progress pill #eff3e7 text #4f5d2f | Expand chevron
- Expanded body shows a student attendance table:
  - Columns: Student Name | Total Classes | Present | Absent | Late | Attendance % | Status
  - % column: inline progress bar gradient(90deg, #90a955, #4f772d), text overlay
  - Status badge: "Good" #eff3e7/#4f5d2f | "Warning" #faf1de/#8a6521 | "At Risk" #f5e2e0/#b3423a
  - Row alternating white / #fcfdf1, hover #eff3e7, header #31572c white
- Accordion header hover: left border 4px #90a955, bg #eff3e7

CALENDAR VIEW TOGGLE (tab):
- Monthly calendar grid, each day cell shows attendance summary
- Days with full attendance: #eff3e7 cell bg
- Days with absences: color coded — minor (1–2) #faf1de, major (5+) #f5e2e0
- Today's cell: #31572c bg white text
- Cell click opens a class-day detail popover
```

---

## PROMPT 09 — ADMIN: FEE MANAGEMENT PAGE

```
Design the Fee Management page for the Admin in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Fees & Payments" #132a13 28px bold
- Right: "Set Fee Structure" button gradient #31572c | "Process Refund" outline #4f772d | "Export Report" outline #31572c

SUMMARY STATS ROW (4 cards):
1. "Total Fees Due (July)" — "PKR 2,800,000" #132a13 28px bold, subtitle "Across 248 students"
2. "Collected" — "PKR 2,408,000 (86%)" #4f772d 28px bold
3. "Outstanding" — "PKR 392,000 (14%)" #d9a441 28px bold with warning icon
4. "Overdue (>30 days)" — "PKR 120,000" #b3423a 28px bold with error icon
- Each card: white bg, 12px radius, shadow, 4px top accent gradient(90deg, #90a955, #ecf39e)

FEE COLLECTION PROGRESS BAR:
- Full-width card: white bg, label "Collection Rate This Month: 86%"
- Thick progress bar (20px height), filled gradient(90deg, #90a955, #4f772d), bg #e4e4e4, 10px radius
- Milestone markers at 75% (warning amber dashed line) and 100%

FEE STRUCTURE TABLE (collapsible card):
- Header "Current Fee Structure" with Edit button outline #31572c
- Table: Course/Program | Semester | Tuition | Lab Fee | Library Fee | Total | Edit
- Header row #31572c white text, alt rows white/#fcfdf1

STUDENT PAYMENT TABLE (main table):
- Filter: search by name | Course | Payment Status dropdown
- Table: Student Name | Course | Semester | Amount Due | Amount Paid | Balance | Due Date | Status | Action
- Status badges: "Paid" #eff3e7/#4f5d2f | "Partial" #faf1de/#8a6521 | "Unpaid" #f5e2e0/#b3423a | "Overdue" #f5e2e0 bg #b3423a bold
- Row hover: #eff3e7
- Action: "Send Reminder" mail icon #31572c | "Record Payment" + icon #4f772d | "Waive" outline #818181
- Overdue rows get subtle left border 3px #b3423a

PAYMENT DETAIL MODAL:
- White bg, 12px radius, 560px wide, shadow rgba(19,42,19,0.22)
- Header gradient #132a13→#31572c, white title "Payment Record — [Student Name]"
- Fee breakdown table, payment history list (date, amount, method, receipt number)
- "Record New Payment" form: amount field, payment method selector (Cash/Bank Transfer/Online), date, receipt upload
- Footer: "Save Payment" gradient button | "Cancel" outline
```

---

## PROMPT 10 — ADMIN: TIMETABLE / SCHEDULING PAGE

```
Design the Timetable & Scheduling page for the Admin in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Timetable & Scheduling" #132a13 28px bold
- Right: "Add New Class Slot" button gradient #31572c | "Publish Timetable" button #4f772d | "Export PDF" outline

WEEK VIEW CALENDAR (main area):
- Full-width card: white bg, 12px radius, shadow rgba(19,42,19,0.08)
- Column headers: Mon–Fri (Sat optional) — header bg #31572c, white text 14px semibold
- Row headers: time slots 8:00 AM – 6:00 PM in 1-hour increments, text #5f5f5f 13px
- Each scheduled class block:
  - Rounded 8px block inside the cell
  - Admin-created blocks: bg #31572c, white text (course name 13px semibold, teacher name 11px, room #)
  - Hover state: bg #2a4a25, subtle scale 1.02 animation hint
  - Click: opens detail popover
- Empty time slots: bg #fefef9, dashed border #e4e4e4 on hover turns to #eff3e7 bg with "+" add icon in #31572c

CLASS SLOT POPOVER (on click):
- Small card popover, white bg, shadow, 12px radius
- Course name bold #132a13 | Section | Teacher | Room | Duration
- Edit icon (pencil) #31572c | Delete icon (trash) #b3423a
- "Edit Slot" opens inline form

SECTION SWITCHER (top-left of calendar):
- Dropdown "View: All Sections / Section A / Section B..." — white bg, #c6c6c6 border
- Teacher filter dropdown
- Room utilization toggle button

ADD/EDIT CLASS SLOT MODAL:
- White bg, 520px wide
- Form fields: Course, Teacher (dropdown with avatar), Section/Class, Room, Day(s) — multi checkbox, Start Time, End Time, Repeat (weekly toggle)
- Conflict detection: if a teacher or room is double-booked, show inline warning banner bg #faf1de border #d9a441 "Conflict detected: [Teacher Name] is already scheduled at this time."
- Footer: "Save Slot" gradient #31572c | "Cancel" outline
```

---

## PROMPT 11 — ADMIN: REPORTS & ANALYTICS PAGE

```
Design the Reports & Analytics page for the Admin in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Reports & Analytics" #132a13 28px bold
- Right: "Download Report" button gradient #31572c | Date range picker (from–to)

REPORT TYPE TABS:
- "Performance Overview" | "Attendance Trends" | "At-Risk Students" | "Fee Collection" | "Enrollment Stats"
- Active tab: #31572c bg white text | Inactive: white bg #444444 text | active underline/border

PERFORMANCE OVERVIEW TAB:
Top row — 3 KPI cards:
- "Institution-wide Average Grade: 74%" — donut chart half-filled, arc #31572c/fern gradient
- "Pass Rate: 91%" — circular progress, arc #90a955
- "At-Risk Students: 8" — number in #b3423a large, warning icon #d9a441

MAIN CHART — Line chart (full-width card):
- "Grade Trends Over 6 Months" — 3 series:
  - Average Grade %: #31572c solid line with dots
  - Pass Rate %: #4f772d dashed
  - At-Risk Count: #b3423a solid (right axis)
- Chart bg white, gridlines #c6c6c6, x-axis month labels #5f5f5f, y-axis 0–100%, legend below
- Tooltip cards: white bg, shadow, rounded 8px, showing value for each hovered series

COURSE PERFORMANCE TABLE (below chart):
- Table: Course | Teacher | Enrolled | Avg Grade | Pass Rate | At-Risk Count | Trend Arrow
- Trend arrow: ↑ green #4f772d | ↓ red #b3423a
- Alternating rows white/#fcfdf1, header #31572c white, hover #eff3e7
- "At-Risk Count" column highlighted in #faf1de if > 0

ATTENDANCE TRENDS TAB:
- Area chart: weekly attendance % over semester, filled area gradient(180deg, rgba(49,87,44,0.3), transparent), line #31572c
- Below: table of sections sorted by attendance %, low sections flagged with #f5e2e0 bg

AT-RISK STUDENTS TAB:
- Alert banner: bg #faf1de, border #d9a441, "8 students flagged as at-risk based on attendance below 75% and grade below 60%."
- Student cards in 2-column grid:
  Each card: white bg, left border 4px #b3423a, student name #132a13 16px bold, Course tags, "Attendance: 65%" warning pill #faf1de text #8a6521, "Grade: 54%" error pill #f5e2e0 text #b3423a, "Contact Student" button outline #31572c, "Notify Teacher" button outline #4f772d
```

---

## PROMPT 12 — TEACHER DASHBOARD (HOME)

```
Design the Teacher Dashboard home screen for an LMS called "EduCore". Desktop 1440px wide.

LAYOUT:
- Left sidebar: 240px, dark gradient background linear-gradient(180deg, #132a13, #0d1d0d)
- Sidebar nav items specific to Teacher role:
  🏠 Dashboard (active — #223d1f bg, #90a955 text)
  📚 My Courses
  📝 Assignments
  📊 Marks & Grading
  📋 Attendance
  📒 Gradebook
  💬 Chat
  📣 Notifications
  📈 My Analytics
- Teacher avatar at top of sidebar with role badge gradient(135deg, #31572c, #4f772d) "Teacher" label in white

HEADER BAR:
- "Good Morning, Prof. Ali Raza 👋" — #132a13 20px bold (personalized greeting)
- Right: notification bell, avatar, settings

DASHBOARD HEADER BANNER:
- Full-width card with background gradient(135deg, #4f772d, #90a955, #ecf39e)
- "Your Teaching Overview — Semester 1, 2026" in white 22px bold
- 4 quick stats in white: "3 Courses Assigned" | "86 Students Total" | "4 Assignments Due This Week" | "12 Submissions to Review"
- Stat numbers 28px bold white, labels 13px rgba(255,255,255,0.8)

MY COURSES ROW (horizontal scroll cards):
- Section heading "My Assigned Courses" #132a13 18px bold, "View All" link #31572c right
- 3–4 course cards (horizontal scroll on overflow):
  Each card 280px wide: thumbnail with overlay gradient(180deg, transparent, rgba(19,42,19,0.85)), course name white 16px bold, section label in #ecf39e pill, "28 Students" and "6 Modules" in white 12px opacity 0.8
  Card bottom: white bg, "Open Course" link #31572c | "View Gradebook" link #4f772d
  Status pill top-right: "Active" #eff3e7 text #4f5d2f

PENDING TASKS CARD:
- White bg, 12px radius, shadow, 4px top accent gradient(90deg, #90a955, #ecf39e)
- "Pending Actions" #132a13 16px bold
- List items with icons and colors:
  🔴 "12 assignment submissions waiting for grading" — #b3423a icon, link #31572c "Review Now"
  🟡 "Mark attendance for CS101 — today 9:00 AM" — #d9a441 icon, link "Mark Now"
  🟢 "3 new messages from students" — #4f772d icon, link "Open Chat"
  🔵 "Upload Week 6 lecture material" — #3d6b8c icon, link "Upload"
- Each item: left border 3px colored, bg tint matching semantic color (light opacity)

TODAY'S SCHEDULE:
- Card: white bg, 12px radius, gradient header (fresh gradient #4f772d→#90a955→#ecf39e)
- Time slots list: 9:00 AM CS101 Room 201 | 11:00 AM CS201 Room 305 | 2:00 PM Office Hours
- Current time slot highlighted: #31572c bg, white text, pulsing left indicator
- Past slots: muted #e4e4e4 text
- Room label: #90a955 small pill

RECENT ACTIVITY FEED:
- Right column: white card
- Timeline list (newest first): dot connector line #c6c6c6, dot color matches action type
  - "Ali Khan submitted Assignment 3" — dot #4f772d — 10 min ago
  - "Marks entered for CS101 Midterm" — dot #31572c — 2 hrs ago
  - "Attendance marked for CS201" — dot #90a955 — Yesterday
- Timestamp #818181 12px, action text #444444 14px, student name link #31572c
```

---

## PROMPT 13 — TEACHER: MY COURSE PAGE (Course Content Management)

```
Design the "My Course" content management page for a Teacher in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- Breadcrumb: "My Courses > CS101 — Introduction to Computer Science"
- H1 "CS101 — Introduction to Computer Science" #132a13 28px bold
- Tags row: "Section A" #eff3e7 text #4f5d2f pill | "28 Students" #e4e4e4 text #444444 pill | "Semester 1, 2026" pill
- Right: "Preview as Student" outline button #31572c | "Course Settings" gear outline button

TWO-COLUMN LAYOUT:
Left (320px): Module navigator tree
Right (remaining): Content editor/viewer

LEFT MODULE TREE:
- Panel bg: #f4f4f4, border-right 1px #c6c6c6
- "Course Modules" heading #132a13 16px bold with "Add Module" + button #31572c
- Module items (accordion style):
  - Module 1: "Introduction to Programming" — expand icon, 4 lessons count, drag handle
    - Lesson 1.1: "What is Programming?" — play icon #31572c, "15 min" #818181
    - Lesson 1.2: "Basic Concepts" — doc icon #4f772d
    - Lesson 1.3 (Add New Lesson): dashed item, + icon #31572c
  - Module 2: "Variables & Data Types" (collapsed)
  - Module 3: "Control Flow" (collapsed, draft badge)
- Active lesson item: bg #eff3e7, left border 4px #31572c
- Hover: bg #f1f6b6 (lime-300)
- "Add New Module" button: dashed border #c6c6c6, full width, + icon #31572c center

RIGHT CONTENT PANEL:
- Current lesson header: "Lesson 1.1: What is Programming?" #132a13 22px bold
- Toolbar row (content editor actions): "Upload Video" | "Upload Document" | "Add SCORM" | "Add H5P" | "Add Text"
  Toolbar: #fefef9 bg, border-bottom #c6c6c6, icon buttons #31572c

VIDEO CONTENT BLOCK:
- 16:9 video player placeholder: dark bg #132a13, centered play button #ecf39e circle, video title in white overlay bottom

DOCUMENT BLOCK:
- File card: #eff3e7 bg, 8px radius, file icon #31572c, file name #132a13, size #818181, "Preview" link + "Delete" icon #b3423a right

TEXT/RICH-TEXT BLOCK:
- White bg, 1px border #c6c6c6, min-height 200px, toolbar strip with formatting icons in #818181, content text #444444

LESSON SETTINGS (side panel or accordion):
- Visibility: Published / Draft toggle (#31572c active)
- Prerequisites: dropdown "None / [Lesson options]"
- Duration: input field
- "Save Lesson" gradient #31572c button | "Delete Lesson" #b3423a outline
```

---

## PROMPT 14 — TEACHER: ASSIGNMENTS PAGE

```
Design the Assignments management page for a Teacher in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Assignments" #132a13 28px bold
- Right: "Create New Assignment" button gradient #31572c

COURSE FILTER:
- Pill tabs for each assigned course: "CS101" | "CS201" | "MATH101"
- Active pill: #31572c bg white text. Inactive: #f4f4f4 bg #444444 text border #c6c6c6

ASSIGNMENT CARDS (list view):
Each assignment card:
- White bg, 12px radius, shadow rgba(19,42,19,0.08), 4px left border #31572c (active) or #c6c6c6 (past/closed)
- Top row: Assignment title #132a13 16px semibold | Course tag pill #eff3e7 text #4f5d2f | Due date #5f5f5f 13px | Status pill
  - Status: "Open" #eff3e7 text #4f5d2f | "Due Soon" #faf1de text #8a6521 | "Closed" #e4e4e4 text #5f5f5f
- Middle row: Description preview #444444 14px 2 lines truncated
- Bottom row: "📎 Rubric Attached" #4f772d icon+text | "👥 28/28 Submitted" (progress) #31572c | "⏱ Due: 28 Jul 2026"
  Submission progress bar: gradient(90deg, #90a955, #4f772d), 8px height, 20px radius
- Action buttons right: "View Submissions" solid #31572c small | "Edit" outline #31572c small | "Delete" icon #b3423a

CREATE ASSIGNMENT MODAL (full):
- Modal: white bg, 600px wide, 12px radius, shadow rgba(19,42,19,0.22)
- Header gradient(135deg, #31572c, #4f772d) white "Create New Assignment"
- Form sections:
  1. Basic Info: Title input, Course selector, Section, Description (rich text area)
  2. Submission Settings: Due Date picker, Allow Late (toggle), Max File Size
  3. Rubric Builder:
     - "Add Rubric Criteria" section: table with rows
     - Row: Criteria name input | Max Marks input | Description input | Delete row #b3423a
     - "Add Criterion" + button outline #31572c
     - Total marks auto-sum shown bold #132a13
  4. Attachments: File upload drop zone (#eff3e7 bg, dashed #c6c6c6 border, center icon #31572c)
- Footer: "Save as Draft" outline | "Publish Assignment" gradient #31572c

SUBMISSION REVIEW PAGE (clicking "View Submissions"):
- Table: Student Name | Submitted Date | File(s) | Rubric Score | Feedback | Grade | Action
- "Not Submitted" rows: #faf1de bg, italic text #8a6521
- "Submitted" rows: white bg #4f772d check icon
- Grading: inline mark input (white bg, #c6c6c6 border 8px radius, focus #31572c), rubric breakdown popover
- Feedback: textarea below each row (collapsible)
- "Save All Marks" sticky footer button gradient #31572c full-width
```

---

## PROMPT 15 — TEACHER: MARKS & GRADING PAGE

```
Design the Marks Entry & Grading page for a Teacher in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Marks & Grading" #132a13 28px bold
- Subtitle: "Enter marks per student per exam or assignment. Grades are calculated automatically." #5f5f5f 14px

COURSE + COMPONENT SELECTOR:
- Row 1: "Course" dropdown (CS101) | "Section" dropdown (A) | "Assessment Component" dropdown (Midterm Exam / Final Exam / Assignment 1 / etc.)
- Row 2 (auto-updates on selection): "Max Marks: 100" #132a13 pill | "Due Date: 20 Jul 2026" | "Weight: 30%" badge #eff3e7 text #4f5d2f
- "Load Students" button gradient #31572c

GRADING CRITERIA REFERENCE PANEL (collapsible):
- Right side collapsible panel (or tooltip icon), shows institution grading scale:
  A: 90–100 | B: 80–89 | C: 70–79 | D: 60–69 | F: <60
  Weighting: Midterm 30% + Final 50% + Assignments 20%
- Panel bg: #132a13, text white, 12px radius left side border radius

MARKS ENTRY TABLE:
- Full-width table, white bg card, 12px radius, shadow
- Header row: #31572c bg white text — Rank | Student Name | Roll No. | Marks Obtained (/100) | Auto Grade | Overall GPA Preview | Save Status
- Entry rows:
  - Marks input cell: white bg, 1px border #c6c6c6, 8px radius, 56px wide, center text, focus border #31572c
  - Empty (unsaved): input shows placeholder "—"
  - Saved: green checkmark icon #4f772d beside value
  - Auto Grade cell: auto-calculated pill badge — A #e6ece2 text #375320 | B #eff3e7 | C #faf1de | F #f5e2e0 text #b3423a
  - GPA Preview: "3.7" text #31572c or "1.0" #b3423a based on grade
  - Save Status: "Saved ✓" #4f772d | "Unsaved" #d9a441 dot
- Alternating rows white/#fcfdf1, hover #eff3e7
- Sorted by roll number, sortable by clicking header

BULK ACTIONS:
- "Enter Marks for Absent Students as 0" toggle
- "Apply Same Mark to All" input field (for quick fill)
- "Save All Marks" large sticky bottom button, gradient #31572c, full-width or fixed bottom bar

SAVE CONFIRMATION TOAST:
- Top-right toast: bg #e6ece2 (#fern-100), border-left 4px #4f772d, text "Marks saved successfully. Students can now view their grades." #375320 14px, checkmark icon

CLASS STATISTICS ROW (below table):
- "Class Average: 71%" | "Highest: 96" | "Lowest: 42" | "Pass Rate: 89%"
- Chips: white bg, border #c6c6c6, number bold #132a13, label #5f5f5f
```

---

## PROMPT 16 — TEACHER: ATTENDANCE MARKING PAGE

```
Design the Attendance Marking page for a Teacher in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Mark Attendance" #132a13 28px bold
- Date display: "Tuesday, 22 July 2026" — #31572c 18px semibold with calendar icon

CLASS SELECTOR ROW:
- "Course" dropdown (CS101) | "Section" (A) | "Date" date picker (defaults to today)
- "Load Class List" button gradient #31572c

TODAY'S STATS CARDS (4 small):
- "28 Total Students" | "24 Present" (bg #e6ece2 text #4f772d) | "3 Absent" (bg #f5e2e0 text #b3423a) | "1 Late" (bg #faf1de text #8a6521)
- Cards: white bg, 12px radius, shadow, compact, number 28px bold color coded

BULK MARK BAR:
- "Mark All Present" button #4f772d solid | "Clear All" outline #818181
- Separator | "Attendance status quick filter: All / Present / Absent / Late" pill tabs

STUDENT ATTENDANCE TABLE/CARDS (two view options):

TABLE VIEW (default):
- Columns: # | Student Avatar+Name | Roll No. | Status Toggle | Notes | Cumulative Attendance %
- Status toggle (3-button segmented): 
  "P" (Present) — active: #31572c bg white text, inactive: white bg #444444 text
  "A" (Absent) — active: #b3423a bg white text
  "L" (Late) — active: #d9a441 bg white text
- Cumulative % column: inline mini progress bar gradient(90deg, #90a955, #4f772d), text overlay, warning if <75% show #d9a441 icon
- Notes: small text input, placeholder "Reason (optional)"
- Alternating rows white/#fcfdf1, currently-marking-row highlighted #eff3e7

CARD VIEW (grid toggle):
- 6-column grid, each card:
  - Student avatar circle (initials based, bg #eff3e7 text #31572c)
  - Name #132a13 14px, Roll number #818181 12px
  - Large P/A/L status button fills card bottom: Present = #31572c | Absent = #b3423a | Late = #d9a441
  - Cumulative: tiny line "89% overall" in #5f5f5f

SUBMIT ATTENDANCE:
- "Submit Attendance" gradient button #31572c, 52px height, right-aligned
- Confirmation modal: "Attendance for CS101 Section A — 22 Jul 2026 marked. 24 Present, 3 Absent, 1 Late. Confirm?" 
  Confirm button gradient | Cancel outline
- Post-submit: success toast bg #e6ece2 border #4f772d "Attendance recorded successfully."
```

---

## PROMPT 17 — TEACHER: CHAT PAGE

```
Design the Chat interface for a Teacher in an LMS called "EduCore". Desktop 1440px wide.

LAYOUT: Three-column — Conversation List (300px) | Chat Window (flex remaining) | Profile/Info Panel (280px, collapsible)

LEFT — CONVERSATION LIST:
- Header: "Messages" #132a13 18px bold | Search icon right
- Search bar: #f4f4f4 bg, no border, #a4a4a4 placeholder "Search conversations..."
- Two sections:
  1. "Class Groups" sub-header #5f5f5f 12px uppercase
     - "CS101 — Section A" group: group icon #31572c, member count "28" #818181, last message preview #5f5f5f 13px italic, unread badge #ecf39e bg circle with #132a13 count text
     - "CS201 — Section B" group
  2. "Direct Messages" sub-header
     - Individual student chats: avatar circle (initials, bg #eff3e7 text #31572c), name #132a13 14px semibold, last message truncated #5f5f5f 13px, timestamp #818181 12px
- Active conversation: bg #eff3e7, left border 4px #31572c
- Hover: bg #f1f6b6 (lime-300)
- Overall bg: white #ffffff, right border 1px #c6c6c6

CENTER — CHAT WINDOW:
- Header: Conversation name #132a13 18px semibold | "28 Members" #818181 | info icon right
- Background: #fefef9 (lime-50)
- Chat messages area:
  - Date separator: centered pill "Today" #e4e4e4 bg #5f5f5f text 12px
  - Other's messages (student): avatar left + bubble bg #e4e4e4 text #323232, 16px 12px radius (rounded-right), max-width 60%, sender name above in #4f772d 12px semibold
  - Teacher's own messages (right): bubble bg #31572c white text, 16px 12px radius (rounded-left), "You" label right
  - Timestamp below each bubble: #818181 11px
  - Unread divider: "3 unread messages" amber banner #faf1de text #8a6521 centered
- Input area (bottom, white bg, border-top #c6c6c6):
  - Attachment icon (clip) #818181 | Emoji icon #818181
  - Text input: #f4f4f4 bg, no border, "Type a message..." placeholder, 8px radius, flex expand
  - Send button: circle 40px gradient #31572c, white arrow icon, hover darken

RIGHT — INFO PANEL (collapsed by default, info icon click):
- "CS101 — Section A" title #132a13 18px
- "28 Members" list: scrollable, each member avatar + name + "Online" dot #4f772d or "Offline" dot #818181
- "Files Shared" section: doc/video icons, file names, date #818181
- "Clear Chat" destructive #b3423a link bottom
```

---

## PROMPT 18 — STUDENT DASHBOARD (HOME)

```
Design the Student Dashboard home screen for an LMS called "EduCore". Desktop 1440px wide.

LAYOUT:
- Left sidebar: 240px, dark gradient linear-gradient(180deg, #132a13, #0d1d0d)
- Sidebar nav items for Student:
  🏠 Dashboard (active — #223d1f bg, #90a955 text)
  📚 My Courses
  📝 Assignments
  📊 My Grades
  📋 Attendance
  📒 Transcript
  💳 Fees
  💬 Chat
  📣 Notifications
  🎓 Enrollment
- Student avatar at top with role badge gradient(135deg, #4f772d, #90a955) "Student" white text

HEADER BANNER (dashboard welcome):
- Full-width card, bg gradient(135deg, #4f772d, #90a955, #ecf39e)
- "Welcome back, Zara Malik! 👋" white 24px bold
- Subtitle: "You have 2 assignments due this week and 1 unread notification." white opacity 0.85 16px
- Right side: student GPA "Current GPA: 3.6" large white badge with gold star icon

QUICK STAT CARDS (row of 4):
1. "Enrolled Courses" — "4" #132a13 36px bold, "Active this semester" #5f5f5f
2. "Assignments Due" — "2" #d9a441 36px (warning), "This week" #5f5f5f
3. "Attendance Rate" — "92%" #4f772d 36px, progress bar gradient(90deg, #90a955, #4f772d) below
4. "Fee Status" — "Paid ✓" #4f772d 20px bold | OR "PKR 15,000 Due" #b3423a 20px bold
- Cards: white bg, 12px radius, shadow rgba(19,42,19,0.08), 4px top gradient(90deg, #90a955, #ecf39e)

MY ENROLLED COURSES (horizontal cards):
- Section heading "My Courses" #132a13 18px bold, "View All" link #31572c
- Horizontal card row (scroll):
  Each 260px wide: course thumbnail + overlay gradient(180deg, transparent, rgba(19,42,19,0.85)), course name white 15px bold, "Section A" #ecf39e pill
  Card body: Teacher name #5f5f5f 13px with small avatar, progress bar (modules completed / total), "Continue Learning" button gradient #31572c small 32px height

UPCOMING ASSIGNMENTS (card):
- White bg, 12px radius, shadow, 4px top accent
- "Upcoming Assignments" #132a13 16px bold
- List of 3 items:
  Each row: colored left border (red #b3423a if <2 days, amber #d9a441 if <7 days, green if more)
  Assignment name #132a13 14px semibold | Course pill | "Due: Sat 26 Jul" #5f5f5f 13px | "Submit" button small gradient #31572c or "View" if submitted

ATTENDANCE MINI-CARD:
- Circular progress meter (SVG arc): filled arc gradient(90deg, #90a955, #4f772d), center "92%" #132a13 32px bold
- Below: small text "Target: ≥75%" #5f5f5f
- At-risk warning if <75%: bg #f5e2e0 text #b3423a "⚠️ Your attendance is below the required threshold."

RECENT NOTIFICATIONS (right card):
- Notification list (5 items):
  - "📣 New lecture video uploaded — CS101" #444444 14px | timestamp #818181 12px | unread: bg #eff3e7 left border #31572c
  - "📝 Assignment 3 due in 2 days" warning amber #faf1de bg
  - "✅ Your Midterm marks are published" success #e6ece2 bg
  - "💳 Fee reminder — July payment due" #faf1de bg
- "View All Notifications" link #31572c 13px
```

---

## PROMPT 19 — STUDENT: MY COURSES & COURSE CONTENT VIEWER

```
Design the Course Content viewer page for a Student in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- Breadcrumb: "My Courses > CS101 — Introduction to Computer Science"
- Course banner: full-width, bg gradient(135deg, #4f772d, #90a955, #ecf39e), height 140px
  - Course title white 26px bold | Section tag "Section A" white pill | Teacher "Prof. Ali Raza" #ecf39e 14px
  - Right: circular progress "5/12 Lessons" donut in white, "42% Complete" white

TWO-COLUMN LAYOUT:
Left (300px): Module / lesson navigator (read-only for student)
Right (remaining): Content viewer

LEFT PANEL (bg #f4f4f4, border-right #c6c6c6):
- "Course Content" heading #132a13 16px bold
- Module 1: "Introduction to Programming" — unlocked, expand
  - ✅ Lesson 1.1 "What is Programming?" — green checkmark #4f772d (completed)
  - ✅ Lesson 1.2 "Basic Concepts" — completed
  - ▶ Lesson 1.3 "Variables" — active, #eff3e7 bg left border #31572c, play icon #31572c
  - ⬜ Lesson 1.4 "Functions" — locked until previous completed, #a4a4a4 text, lock icon
- Module 2: locked until Module 1 completed — header muted #a4a4a4, lock icon
- Progress bar at bottom of left panel: "5 of 12 lessons completed" gradient(90deg, #90a955, #4f772d)

RIGHT CONTENT PANEL:
VIDEO LESSON VIEW:
- Video player (full-width 16:9): dark bg #132a13, play controls, progress bar gradient(90deg, #90a955, #4f772d), volume, full-screen — all controls in white/lime-cream
- Below video: Lesson title "Variables in Python" #132a13 22px bold
- Lesson description text #444444 14px
- Resources section: attached files as cards (bg #eff3e7, 8px radius, file icon #31572c, name, download link)
- "Mark as Complete" button: gradient #31572c white text 44px, checkmark icon — on click turns to "Completed ✓" green #4f772d outline

DOCUMENT LESSON VIEW (alternate):
- PDF viewer embed, full width, with download button outline #31572c top right
- Navigation: Previous Lesson ← | → Next Lesson buttons bottom, gradient #31572c for Next

LESSON COMPLETION CELEBRATION (micro-animation hint):
- On mark complete: brief confetti animation in #ecf39e/#90a955 dots, "Great job! 🎉 Move to the next lesson." toast #e6ece2 bg #4f772d border
```

---

## PROMPT 20 — STUDENT: ASSIGNMENTS SUBMISSION PAGE

```
Design the Assignments page for a Student in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "My Assignments" #132a13 28px bold
- Filter pills: "All" | "Pending" | "Submitted" | "Graded"
- Active pill: #31572c bg white. Inactive: #f4f4f4 #444444 text

ASSIGNMENT CARDS (list):
Each card — white bg, 12px radius, shadow rgba(19,42,19,0.08):
- Left colored stripe (5px): #b3423a if overdue | #d9a441 if due soon | #31572c if upcoming | #4f772d if submitted
- Card header: Assignment title #132a13 16px semibold | Course pill #eff3e7 text #4f5d2f | Due date #5f5f5f 13px
- Description: 2-line truncated #444444 14px
- Status row: "Pending" badge #faf1de text #8a6521 | OR "Submitted" badge #eff3e7 text #4f5d2f | OR "Graded — 78/100" badge #eff3e7 bold text
- Rubric icon + "Rubric Available" #4f772d 13px link
- Action button: "Submit Assignment" gradient #31572c (pending) | "View Submission" outline #31572c (submitted) | "View Feedback" outline #4f772d (graded)

ASSIGNMENT DETAIL + SUBMISSION PAGE (on click):
- Breadcrumb: "Assignments > Assignment 3 — Python Functions"
- Two columns:

LEFT (assignment details, 40%):
- Assignment title H1 #132a13
- Due date: "Due: Sat 26 Jul 2026 11:59 PM" #5f5f5f | Countdown timer if <48 hrs "#b3423a bold"
- Description rich text content #444444
- Rubric table:
  Header: #31572c bg white | Criteria | Description | Max Marks
  Rows alternating white/#fcfdf1
  Total row: bold, #132a13 bg #ecf39e tint, Total /100
- Attachments from teacher: file cards #eff3e7 bg

RIGHT (submission panel, 60%):
- "Submit Your Work" card: white bg, 12px radius, shadow, 4px top accent gradient(90deg, #90a955, #ecf39e)
- File upload zone: #eff3e7 bg, dashed border #90a955 2px, 8px radius, center "Drag & drop or click to upload" #5f5f5f, file icon #31572c, accepted formats note #818181 12px
- Uploaded file preview: file card with filename, size, remove × icon #b3423a
- Notes to teacher: textarea, white bg, #c6c6c6 border, focus #31572c, 8px radius
- "Submit Assignment" button: full-width, gradient #31572c, 52px height

POST-SUBMISSION STATE:
- Card header: bg #e6ece2 (success), checkmark icon #4f772d, "Assignment Submitted Successfully" #375320 bold
- Submitted file shown, submission date/time
- "View Submission" link | "Re-submit (allowed before due date)" outline button

GRADED STATE (after teacher grades):
- Score display: "78 / 100" #132a13 40px bold center, letter grade "B" pill #eff3e7 text #4f5d2f 20px
- Rubric breakdown table showing marks per criterion
- Teacher feedback box: #fefef9 bg, italic quote marks, "Prof. Ali's Feedback:" label #132a13, feedback text #444444, left border 4px #31572c
```

---

## PROMPT 21 — STUDENT: GRADES & TRANSCRIPT PAGE

```
Design the Grades & Transcript page for a Student in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "My Academic Record" #132a13 28px bold
- Right: "Download Transcript (PDF)" button gradient #31572c, download icon

GPA SUMMARY BANNER:
- Full-width card, bg gradient(135deg, #4f772d, #90a955, #ecf39e)
- Left: large "CGPA: 3.62" white 48px bold, "Out of 4.0" white 16px opacity 0.8
- Center: "Semester 1 GPA: 3.75" white 22px | "Total Credits: 18" white 16px
- Right: animated circular GPA gauge (SVG arc), filled gradient(90deg, #90a955, #4f772d), center CGPA value

SEMESTER ACCORDION GRADEBOOK:
Each semester (accordion):
- Header: "Semester 1 — 2026" #132a13 16px semibold | "Semester GPA: 3.75" pill #eff3e7 text #4f5d2f | "18 Credits" | expand chevron
- Expanded table: white bg, 12px radius
  Header row: #31572c bg white — Course | Teacher | Midterm | Assignments | Final | Total | Grade | GPA Points | Credits
  Data rows: alternating white/#fcfdf1, hover #eff3e7
  Grade column badges:
    A = bg #e6ece2 text #375320 bold | B = #eff3e7 #4f5d2f | C = #faf1de #8a6521 | F = #f5e2e0 #b3423a bold
  GPA Points: color-matched to grade
  Row for in-progress course: italic text, "In Progress" badge #faf1de #8a6521

GRADE SCALE REFERENCE (collapsible):
- Small card: "Grade Scale Reference" #5f5f5f 12px label
- 5 grade pills in a row: A (90–100) | B (80–89) | C (70–79) | D (60–69) | F (<60)
- Each pill color-coded as above
- Weighting note: "Midterm 30% + Final 50% + Assignments 20%" #818181 12px

PERFORMANCE CHART:
- Card: white bg, 12px radius, shadow
- Line chart: GPA per semester over time
  Line: #31572c, dots #90a955, area fill gradient(180deg, rgba(49,87,44,0.15), transparent)
  X-axis: semester labels #5f5f5f | Y-axis: 0–4.0 scale
  Target GPA reference line: dashed #d9a441

CURRENT SEMESTER PROGRESS (bottom):
- Card per enrolled course:
  - Course name #132a13 | Component mini-bars (Midterm, Assignments, Final)
  - Each mini-bar: label | fill gradient(90deg, #90a955, #4f772d) | marks value
  - "Final grade pending" italic #818181 if not fully graded
```

---

## PROMPT 22 — STUDENT: FEE PAYMENT PAGE

```
Design the Fee & Payment page for a Student in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "My Fees & Payments" #132a13 28px bold

FEE STATUS OVERVIEW CARD:
- Full-width card, white bg, 12px radius, shadow rgba(19,42,19,0.08)
- Left section (40%): 
  - "Current Balance" label #5f5f5f 14px
  - Amount "PKR 15,000" — if due: #b3423a 40px bold | if paid: #4f772d "PKR 0 — Fully Paid ✓"
  - "Due Date: 31 July 2026" #d9a441 13px if unpaid | overdue date #b3423a bold
  - "Pay Now" button gradient #31572c full-width 52px (visible only if balance due)
- Right section (60%): mini pie chart showing paid vs. outstanding
  - Paid slice: gradient #31572c | Outstanding: #f5e2e0 (error-100)
  - Legend: "Paid PKR 35,000 (70%)" #4f772d | "Outstanding PKR 15,000 (30%)" #b3423a

FEE BREAKDOWN TABLE:
- Card: white bg, 12px radius, shadow
- "Current Semester Fee Structure" #132a13 16px bold
- Table header: #31572c bg white — Fee Type | Amount | Due Date | Status
- Rows:
  - Tuition Fee | PKR 40,000 | 31 Jul | Paid ✓ (#eff3e7 bg #4f772d icon)
  - Lab Fee | PKR 5,000 | 31 Jul | Pending (#faf1de bg #d9a441 icon)
  - Library Fee | PKR 2,000 | 31 Jul | Paid ✓
  - Total row: bold, bg #ecf39e (#lime-500 tint), "PKR 47,000" #132a13 bold
- Alternating white/#fcfdf1, hover #eff3e7

PAYMENT HISTORY TABLE:
- "Payment History" #132a13 16px bold, "Download All Receipts" outline button #31572c right
- Table header: #31572c bg white — Date | Description | Amount | Method | Reference | Receipt
- Rows: alternating white/#fcfdf1
- Amount column: #4f772d text for payments
- Receipt icon: download icon #31572c link
- Hover: #eff3e7

PAYMENT MODAL (Pay Now):
- Modal: white bg, 520px wide, 12px radius, shadow rgba(19,42,19,0.22)
- Header gradient #132a13→#31572c white "Make Payment"
- Summary: "Amount Due: PKR 15,000" #132a13 28px bold
- Fee breakdown (compact) above
- Payment method selector (3 radio cards with icons):
  "Bank Transfer" bank icon | "Cash (In-Person)" cash icon | "Online Payment" card icon
  Selected: #eff3e7 bg, #31572c border 2px
- Upload proof (if bank/cash): upload zone #eff3e7 dashed border #c6c6c6
- Reference number input: white bg, #c6c6c6 border, focus #31572c
- "Confirm Payment" gradient button | "Cancel" outline
- Processing state: loading spinner in #31572c, "Processing your payment..."

PAYMENT SUCCESS:
- Full modal center: checkmark circle gradient #31572c, "Payment Recorded ✓" #132a13 24px bold, "Your payment of PKR 15,000 has been recorded. You'll receive a receipt email shortly." #444444
- "View Receipt" button | "Close" outline
```

---

## PROMPT 23 — STUDENT: ENROLLMENT APPLICATION PAGE

```
Design the Enrollment Application page for a Student (prospective or existing) in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Apply for Enrollment" #132a13 28px bold
- Breadcrumb: "Enrollment > New Application"
- Status indicator (for existing applications): "Application Status: Pending Review" pill #faf1de text #8a6521 | OR "Approved" #eff3e7/#4f5d2f | OR "Rejected" #f5e2e0/#b3423a

MULTI-STEP FORM (stepper at top):
Step indicators (horizontal):
- 4 steps: "1. Personal Info" | "2. Academic Background" | "3. Program Selection" | "4. Documents"
- Active step: circle #31572c filled white text, label #31572c bold
- Completed steps: circle #4f772d with checkmark, label #444444
- Upcoming: circle #c6c6c6 border, label #818181
- Connector line between steps: completed = #4f772d, upcoming = #c6c6c6

STEP 1 — PERSONAL INFORMATION:
- Card: white bg, 12px radius, shadow rgba(19,42,19,0.08)
- Form (2-column grid):
  First Name | Last Name
  Date of Birth | Gender (radio: Male/Female/Other, #31572c checked)
  Email | Phone Number
  Address (full width textarea)
  Profile Photo Upload: circular upload zone, dashed #c6c6c6 border, camera icon #31572c
- All inputs: white bg, #c6c6c6 border 1px, focus #31572c border 2px, 8px radius, 48px height
- Labels: #132a13 12px semibold, 4px margin below

STEP 2 — ACADEMIC BACKGROUND:
- Previous Institution name input
- Previous GPA / Grade (numeric input)
- Year of Graduation (dropdown: year options)
- Academic certificates upload (multiple files):
  Upload zone: dashed #c6c6c6 border, #eff3e7 bg, "Drag & drop certificates here or Browse" #5f5f5f
  Uploaded files: list with filename, size, remove × icon #b3423a

STEP 3 — PROGRAM SELECTION:
- "Select Program/Course" dropdown: grouped by department, white bg, #c6c6c6 border, focus #31572c
- "Preferred Section" radio group: Section A / B / C — #31572c checked
- "Start Semester" dropdown
- Special requirements / notes: textarea white bg, #c6c6c6 border, placeholder "Any special accommodations or notes..."

STEP 4 — DOCUMENTS:
- Drag-drop zone per document type:
  "National ID / CNIC" | "Academic Certificates" | "Passport Photo" | "Recommendation Letter (Optional)"
  Each zone: #eff3e7 bg, 8px radius, dashed #90a955 border, upload icon #31572c, accepted formats note
- Document validation: uploaded = green check #4f772d overlay | missing required = #b3423a border warning

BOTTOM NAV:
- "Back" outline button | "Next" gradient #31572c (steps 1–3) | "Submit Application" gradient #31572c (step 4)
- Submit: confirmation modal "Are you sure you want to submit your application? You cannot edit it after submission." — Confirm gradient | Cancel outline

APPLICATION TRACKING PAGE:
- Application reference "APP-2026-00142" #132a13 16px bold
- Status timeline (vertical steps):
  ✅ "Application Submitted — 15 Jul 2026" #4f772d line
  🟡 "Under Review" — current, #d9a441 pulsing dot
  ⬜ "Decision" — upcoming, #c6c6c6
  ⬜ "Enrolled / Account Created"
- "Contact Admissions" button outline #31572c | "View Application Details" link
```

---

## PROMPT 24 — NOTIFICATIONS PAGE (All Roles)

```
Design the Notifications Center page for an LMS called "EduCore". Works for Admin, Teacher, and Student (role affects what's shown). Desktop 1440px wide.

PAGE HEADER:
- H1 "Notifications" #132a13 28px bold
- Right: "Mark All as Read" link #31572c | "Clear All" destructive link #b3423a

FILTER TABS:
- "All" | "Unread (7)" | "Announcements" | "Alerts" | "Academic"
- Active: #31572c bg white. Inactive: white bg #444444

NOTIFICATION LIST:
Each notification card (full-width stacked list):

UNREAD NOTIFICATION:
- Left 5px border: color based on type (Announcement = #31572c | Alert = #d9a441 | Error = #b3423a | Info = #3d6b8c)
- Card bg: light tint matching type (unread: #eff3e7 for green, #faf1de for amber, #f5e2e0 for error, #e2ebf0 for info)
- Left: icon circle (48px) matching type — filled circle bg type color, white icon inside (megaphone / warning / error / info)
- Content: bold title #132a13 14px semibold | description #444444 14px | timestamp #818181 12px "2 hours ago"
- Right: unread dot (#ecf39e circle with #31572c stroke) | chevron or "View →" link #31572c

READ NOTIFICATION:
- Card bg: white #ffffff, left border #c6c6c6
- Icon circle: muted #e4e4e4 bg, #818181 icon
- Title: #444444 (not bold), timestamp #a4a4a4

NOTIFICATION TYPES SHOWN:
1. 📣 "Mid-term Exam Schedule Released" (Admin announcement) — #31572c border, #eff3e7 bg
2. ⚠️ "Your attendance is below 75% in CS101" (Alert to student) — #d9a441 border, #faf1de bg
3. ✅ "Your Assignment 3 has been graded — 78/100" — #4f772d border, #e6ece2 bg
4. 💳 "Fee Payment Due — July 2026 — PKR 15,000" — #d9a441 border, #faf1de bg
5. 📚 "New lecture uploaded in CS201 — Week 6" — #3d6b8c border, #e2ebf0 bg
6. ❌ "Drop Request Rejected — Please clear outstanding fees" — #b3423a border, #f5e2e0 bg

ADMIN — COMPOSE ANNOUNCEMENT (admin only panel):
- "Broadcast Announcement" card: white bg, 12px radius, 4px top gradient(90deg, #90a955, #ecf39e)
- Title input, Message textarea, Recipient selector (All / Teachers / Students / Specific Course)
- Recipient dropdown: multi-select checkboxes, pill tags appear as selected (#ecf39e bg #132a13 text)
- "Send Announcement" gradient #31572c button | "Schedule for Later" outline #31572c
```

---

## PROMPT 25 — TEACHER: ANALYTICS / CLASS REPORTS PAGE

```
Design the Class Analytics & Reports page for a Teacher in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "My Class Analytics" #132a13 28px bold
- Course selector: pill tabs "CS101 — A" | "CS201 — B" | "MATH101 — A" — active #31572c white
- Right: "Export Report PDF" outline button #31572c

SUMMARY KPI CARDS (row of 4):
1. "Class Average Grade" — "72%" large, donut arc gradient(90deg, #90a955, #4f772d)
2. "Assignment Submission Rate" — "89%" #4f772d, small progress bar
3. "Average Attendance" — "85%" with mini gauge
4. "Students At-Risk" — "3" #b3423a large bold with warning icon

ATTENDANCE TREND CHART (card):
- "Attendance Over Time" — area chart, 12 weeks on x-axis
- Area fill: gradient(180deg, rgba(49,87,44,0.25), transparent), line #31572c
- 75% threshold dashed line: #d9a441, label "Min Required 75%"
- Below-threshold zone: #faf1de tint fill
- x-axis: week labels #5f5f5f, y-axis 0–100%
- Chart bg white, gridlines #c6c6c6, legend

GRADE DISTRIBUTION CHART (card, right of attendance):
- Horizontal bar chart: A / B / C / D / F on y-axis
- Bar lengths represent student count
- Colors: A #4f772d | B #90a955 | C #d9a441 | D #b3423a80 | F #b3423a
- "3 students failing — consider intervention" warning note below in #faf1de border #d9a441

STUDENT PERFORMANCE TABLE (full-width):
- "Individual Student Performance" #132a13 16px bold
- Table: Student | Attendance % | Assignments | Midterm | Overall | Grade | At-Risk?
- At-Risk column: ⚠️ icon #d9a441 if "at-risk", — if fine
- Row color: normal white/#fcfdf1, at-risk rows bg #faf1de subtle tint
- Hover: #eff3e7
- Header: #31572c white

SUBMISSIONS OVERVIEW CARD:
- Horizontal cards (3): "On-time Submissions 78%" #4f772d donut | "Late Submissions 11%" #d9a441 | "Missing 11%" #b3423a
- Each with sparkline mini-chart

AT-RISK STUDENT ALERTS (bottom):
- Alert card: bg #faf1de, border #d9a441, 12px radius
- "3 students need attention — Attendance or Grades below threshold"
- Student name | issue | "Send Notification" button small outline #31572c | "View Profile" link
```

---

## PROMPT 26 — STUDENT: ATTENDANCE RECORD PAGE

```
Design the Attendance Record page for a Student in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "My Attendance" #132a13 28px bold
- Subtitle: "Track your attendance across all enrolled courses." #5f5f5f 14px

OVERALL ATTENDANCE CARD (top, full-width):
- White bg, 12px radius, shadow, 4px top accent gradient(90deg, #90a955, #ecf39e)
- Large circular gauge (SVG): 120px circle, arc fill gradient(90deg, #90a955, #4f772d), gray track #e4e4e4
  Center: "Overall 92%" #132a13 24px bold
- Right of gauge: stat chips: "Present: 44 classes" #4f772d | "Absent: 4" #b3423a | "Late: 2" #d9a441
- Status banner (if OK): bg #e6ece2 left border #4f772d "Your attendance is above the required 75% threshold. Keep it up! ✓" #375320
- Status banner (if at-risk): bg #faf1de left border #d9a441 "⚠️ Your attendance is 68% in CS201 — below the 75% requirement. Contact your teacher."

PER-COURSE ATTENDANCE CARDS (grid 2-column):
Each card:
- Course name #132a13 16px semibold | Section pill | Teacher #5f5f5f 13px
- Attendance progress bar: gradient(90deg, #90a955, #4f772d) filled, gray track
  Percentage text: "89%" #132a13 bold right-aligned
- Threshold marker at 75% on bar: small #d9a441 triangle marker
- Stats row: "Present 32" #4f772d | "Absent 4" #b3423a | "Late 1" #d9a441 | "Total 37"
- Status badge: "Good Standing" #eff3e7 #4f5d2f | "At Risk" #f5e2e0 #b3423a
- "View Details" link #31572c
- At-risk card: left border 4px #b3423a, subtle bg tint #fff8f8

DETAILED ATTENDANCE TABLE (on View Details click — page or drawer):
- Course header with breadcrumb
- Calendar grid (monthly): each cell = a class date
  - Present: bg #eff3e7, checkmark icon #4f772d
  - Absent: bg #f5e2e0, × icon #b3423a
  - Late: bg #faf1de, clock icon #d9a441
  - No class (holiday/weekend): bg #f4f4f4, muted
- List view toggle: table with Date | Day | Status | Notes columns
  Status badges as above, teacher notes if any in #5f5f5f italic
```

---

## PROMPT 27 — ADMIN: DROP & WITHDRAWAL MANAGEMENT PAGE

```
Design the Drop & Withdrawal Management page for the Admin in an LMS called "EduCore". Desktop 1440px wide.

PAGE HEADER:
- H1 "Drop & Withdrawal Management" #132a13 28px bold
- Right: "Directly Drop a Student" destructive button #b3423a bg white text | "Export Records" outline #31572c

SUMMARY CHIPS:
- "12 Pending Requests" (amber) | "8 Approved This Month" (#4f772d) | "3 Rejected" (#b3423a) | "2 Admin-Initiated Drops" (#31572c)

TAB BAR:
- "Student-Requested Drops" | "Admin-Initiated Drops" | "History"
- Active: #31572c bg white | Inactive: white #444444 border #c6c6c6

STUDENT-REQUESTED DROPS TABLE:
- Table card: white bg, 12px radius, shadow
- Header: #31572c bg white — Student Name | Course | Request Type | Request Date | Reason | Fee Status | Action
- Request Type: "Drop Course" pill #e4e4e4/#5f5f5f | "Full Withdrawal" pill #f5e2e0/#b3423a bold
- Fee Status: "Clear" #eff3e7/#4f5d2f | "Outstanding PKR 5,000" #f5e2e0/#b3423a
- Actions: "Approve" gradient small #31572c | "Reject" outline small #b3423a | "Hold" outline #d9a441 | "View Profile" eye icon
- Rows with outstanding fees: subtle #faf1de bg tint to draw admin attention

APPROVE DROP MODAL:
- White bg, 540px wide, shadow rgba(19,42,19,0.22)
- Header gradient #b3423a→#98362f (muted brick-red to signal destructive action), white "Approve Drop Request"
- Student info summary: name, course, request type, reason
- "Effective Drop Date" date picker
- "Refund Policy": radio options "Full Refund / Partial Refund / No Refund" — Partial option shows amount input
- "Admin Note (optional)": textarea
- Confirmation checkbox: "☐ I confirm this action. Enrollment will be updated and the student notified."
- Footer: "Confirm Drop" #b3423a bg white text | "Cancel" outline #818181
- Warning box: bg #f5e2e0 border #b3423a "This action will revoke the student's access to course content and chat. Records will be preserved."

DIRECT ADMIN DROP PANEL:
- Form card: white bg, 12px radius, 4px top border #b3423a
- Student search input (autocomplete)
- Drop Type: radio "Drop Course" / "Full Institutional Withdrawal"
- Course selector (if drop course)
- Reason (required): dropdown: "Non-payment" / "Disciplinary" / "Transfer Out" / "Medical" / "Other"
- Admin note textarea
- "Initiate Drop" button #b3423a bg white text, full-width
```

---

## PROMPT 28 — SHARED: ERROR / EMPTY STATES

```
Design the empty states and error pages for an LMS called "EduCore". Multiple variants in one composition. Desktop 1440px wide.

OVERALL PAGE BG: #fefef9 (lime-50)

VARIANT 1 — No Data / Empty State (e.g. no assignments yet):
- Centered vertical layout, max-width 420px, center of page
- Illustration: flat illustration of an open empty notebook with a plant growing from it — colors: #31572c, #90a955, #ecf39e on white bg
- Headline: "Nothing here yet" #132a13 24px bold, margin-top 24px
- Body: "Your teacher hasn't posted any assignments yet. Check back soon!" #5f5f5f 16px centered
- CTA (optional): "Go to Dashboard" outline button #31572c

VARIANT 2 — 404 Page Not Found:
- Full-page bg gradient: linear-gradient(135deg, #132a13, #31572c)
- Large "404" #ecf39e 120px bold centered
- EduCore logo in top-left white
- Headline: "Page Not Found" white 32px
- Body: "The page you're looking for doesn't exist or has been moved." rgba(255,255,255,0.7) 16px
- "Go Home" button gradient(180deg, #3a6633, #31572c) white border #ecf39e | "Go Back" outline white border

VARIANT 3 — Access Denied / Unauthorized:
- White card centered, 12px radius, shadow rgba(19,42,19,0.22), max-width 460px
- Top: shield-x icon in #b3423a 64px
- Headline: "Access Denied" #132a13 24px bold
- Body: "You don't have permission to view this page. Contact your administrator." #5f5f5f 16px
- "Contact Admin" button gradient #31572c | "Go Back" outline
- Subtle bg: #f5e2e0 page bg, or standard #fefef9

VARIANT 4 — Loading State:
- Centered: EduCore logo with leaf icon animating (subtle pulse in #90a955)
- "Loading your dashboard..." #5f5f5f 14px below
- Skeleton loader cards below: rectangular shapes with shimmer animation bg gradient(90deg, #e4e4e4, #f4f4f4, #e4e4e4) moving left-to-right
- Skeleton: sidebar skeleton | 4 stat card skeletons | 2 large panel skeletons

VARIANT 5 — Success Confirmation Page:
- Full-page center: circle checkmark 96px gradient(135deg, #31572c, #4f772d) white checkmark inside
- "Done! 🎉" #132a13 32px bold
- Message: "Your application has been submitted successfully. You'll receive a confirmation email at zara@email.com" #444444 16px center
- Reference pill: "Application Ref: APP-2026-00142" #eff3e7 bg #4f5d2f text 14px
- "Go to My Dashboard" gradient button | "Start Over" outline
```

---

## 📋 QUICK REFERENCE: COLOR SWATCHES FOR STITCH SESSIONS

| Element | Hex | Use |
|---|---|---|
| Evergreen | `#132a13` | Headers, footer, darkest surfaces |
| Hunter Green | `#31572c` | Primary nav, buttons, links |
| Fern | `#4f772d` | Secondary buttons, teacher accent |
| Palm Leaf | `#90a955` | Badges, accents, student accent |
| Lime Cream | `#ecf39e` | Highlights, notification dots |
| Page Background | `#fefef9` | Default page bg (lime-50) |
| Card Background | `#ffffff` | All card/panel bg |
| Body Text | `#444444` | Main paragraph text |
| Secondary Text | `#5f5f5f` | Captions, meta text |
| Divider | `#c6c6c6` | Borders, lines |
| Warning | `#d9a441` | Fee alerts, attendance warnings |
| Error/Destructive | `#b3423a` | Drop actions, errors, failed |
| Info | `#3d6b8c` | Info banners only |

---

*End of Google Stitch AI Prompt Collection — LMS EduCore | v1.0 | July 2026*
*Total Screens Covered: 28 Prompts → ~40+ unique UI states/variants*
