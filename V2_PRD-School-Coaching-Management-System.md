# Product Requirements Document (PRD)
## M.E Education System — School & Coaching Management Platform

| Field | Detail |
|---|---|
| **Document Type** | Product Requirements Document |
| **Product Name** | M.E Education System (web app: myskool.app-style) |
| **Version** | 1.0 (extracted & structured from source PRD `0-ME_2026_Software.pdf`) |
| **Prepared By** | System Design / Product Analysis |
| **Status** | Draft — pending stakeholder sign-off (see §14 Open Questions) |

---

## 1. Purpose & Background

Schools and coaching centers currently manage admissions, attendance, exams, fees, and communication through a **legacy desktop application** ("Coaching Information System") that is single-machine, not multi-campus, and hard to access remotely. The business is moving to a **cloud-based, multi-campus, role-based web application** that consolidates the full academic-administrative lifecycle into one system, accessible from browser and mobile, with WhatsApp/SMS-based parent communication built in.

This PRD defines the complete feature set, roles, data model, and system behavior required to replace the legacy system and support ongoing multi-campus operation (the source document shows two live campuses: **M.E Foundation School** and **M.E Education Center (Coaching)**).

---

## 2. Goals & Objectives

| Goal | Success looks like |
|---|---|
| Centralize all student lifecycle data | One student record spans admission → attendance → marks → fee → results, viewable as a single "Student File" |
| Support multiple campuses under one account | Admin can switch between campuses; data, classes, and fee structures are scoped per campus |
| Automate performance-linked fee discounts | Monthly fee auto-adjusts from the Grading Policy without manual recalculation |
| Reduce manual reporting effort | Every operational report (attendance, marks, fee, expense) is generated on-demand, printable, and exportable |
| Keep parents informed automatically | Absentee, fee-receipt, and result SMS/WhatsApp messages are queued and sent without manual dispatch |
| Enforce accountability & auditability | Every fee edit/cancel/discount requires a logged reason; role permissions are granular, not all-or-nothing |
| Enable self-serve test practice (MDCAT/ECAT) | Students can register and take timed MCQ tests online, auto-scored |

---

## 3. Scope

### 3.1 In Scope
- Multi-campus setup & role/permission administration
- Admissions, student & sibling/family management
- Staff/HR profile & payroll configuration
- Attendance (students & staff), including biometric device integration
- Examination: manual marks entry, term/annual aggregation, grading & remarks policy, printable report cards
- MCQ-based online test system (question bank + student test runner) for MDCAT/ECAT-style practice
- Fee management: challan generation, collection, concessions, installments, defaulter tracking
- Expense/accounts tracking and profit/loss (closing) reporting
- SMS/WhatsApp templated messaging with outbox/delivery tracking
- Dashboard with real-time KPIs
- Reporting suite across all modules (print + export)

### 3.2 Out of Scope (not evidenced in source document — flag for future phases)
- Online fee payment gateway (only cash/manual receipt collection is shown)
- Timetable/scheduling module
- Library management (a "Library Books" KPI tile appears on the dashboard, but no dedicated module is specified)
- Transport management (a "Transport Members" KPI tile appears, but no dedicated module is specified)
- Learning content delivery (LMS/video lessons) beyond the MCQ test bank
- Native parent-facing mobile app / parent login portal (parents are message *recipients* only, not system users, per current doc)

---

## 4. Target Users & Personas

| Persona | Description | Primary Needs |
|---|---|---|
| **Institute Owner (Admin‑Supreme)** | Owns/oversees one or more campuses | Full visibility & control; configure roles, campuses, fee & grading policy |
| **Front-Office Administrator** | Runs daily operations for a campus | Manage admissions, classes, staff, day-to-day approvals |
| **Assistant** | Junior office staff | Data entry: admissions, attendance, basic profile updates |
| **Accountant** | Manages money | Fee challans, collection, concessions, expense entry, P&L reporting |
| **Teacher** (uses Assistant/Administrator/custom role) | Delivers lessons, evaluates students | Attendance & marks entry for own classes |
| **Student** | Learner | Take MCQ practice tests, receive results |
| **Parent/Guardian** | Message recipient | Receive absentee/fee/result SMS-WhatsApp notices |

---

## 5. Roles & Permission Model

**Confirmed roles** (see prior analysis, corrected):

1. **Admin‑Supreme** — top-level owner; configures the Role & Permission engine itself and grants every other role's access, including to the Attendance and Examination modules.
2. **Administrator** — operational super-user; its own permission set is still editable by Admin‑Supreme.
3. **Assistant** — junior operational role, mostly entry-level (Add/Edit) access.
4. **Accountant** — scoped to Fee, Accounts, and related reporting.

**Attendance** and **Examination** are **permission modules**, not job-title roles — Admin‑Supreme decides which of the roles above can View/Add/Edit/Delete within them. The system supports unlimited **custom roles** via "+ Add Role" for institutes that want dedicated Attendance Officer / Exam Officer / Teacher-specific roles.

**Permission granularity required:** every module in the sidebar (Dashboard, Campuses, Manage Classes, Staff Department, Inquiries, Students, Staff, Fee Structure, Challan, Fee Collection, Student/Staff Attendance, Device Settings, Chart of Accounts, General Entry, Opening Balances, Income, Reports, Subjects, Exam Categories, Grading Policy, Remarks, Marks, Print Result, Question Bank, Templates) must expose **View / Add / Edit / Delete** checkboxes, plus module-specific flags such as:
- Students: *Hide Fee, Edit Campus, Hide Import, Hide Export*
- Staff: *Hide Payroll, Hide Documents, Hide Import, Hide Export*
- Fee Collection: *Receive Fee, Disable Date, Hide History, Disable Receiving*
- Reports: per-report toggles (*Collection Report, Outstanding Report, Students, Staff, Attendance, Accounts, Advance Accounts, Certificates*)

*(Full Feature × Role access matrix is provided as Appendix A.)*

Actors **outside** the RBAC panel: **Teacher** (assigned one of the 4 roles, scoped to own classes), **Student** (row-level self-access to test-taking), **Parent/Guardian** (SMS/WhatsApp recipient only, no login).

---

## 6. Functional Requirements

Each module below is written as a set of capabilities; acceptance-criteria style statements are included where the source doc shows enough detail to specify behavior precisely.

### 6.1 Setup & Administration
- **FR-1.1** System shall allow creating/editing/deleting campuses (name, phone, email, website, address, logo).
- **FR-1.2** System shall allow creating classes with multiple sections per class, per campus, with an enable/disable status toggle and reorder/drag support.
- **FR-1.3** System shall support a "New Session" action that bulk-promotes all active students to their next class & section for a new academic year, while retaining historical class/section/session data per student.
- **FR-1.4** System shall allow creating unlimited roles, each with a per-module View/Add/Edit/Delete permission matrix plus specialized visibility flags (see §5).
- **FR-1.5** System shall allow creating/editing/deleting users and assigning them exactly one role (username, role, actions).
- **FR-1.6** System shall allow defining Staff Departments (e.g., Teaching Staff, Non-Teaching Staff) as groupings for staff records.
- **FR-1.7** System shall allow defining Subjects and Subject Groups (e.g., a combined "Bio/Comp" subject for streaming purposes).
- **FR-1.8** System shall allow defining Exam Categories (e.g., monthly categories Jan–Dec, or MDCAT/ECAT) used to tag test/marks entries.
- **FR-1.9** System shall allow defining a **Grading Policy**: a table of (Percentage-From, Percentage-To) → Grade → Fee-Reward amount, editable/add/remove rows, used to compute performance-linked fee discounts.
- **FR-1.10** System shall allow defining a **Remarks Policy**: (Percentage-From, Percentage-To) → free-text remark, auto-applied to report cards.
- **FR-1.11** System shall allow setting Fee Structure per class (Tuition Fee amount; subject-wise fee entry is *not* required — confirmed by source note — only class-level monthly tuition and MCAT/ECAT package fee with installment support).
- **FR-1.12** System shall allow creating parameterized SMS/WhatsApp **Message Templates** (e.g., Absent SMS, Fee Collection Receipt, Test Result SMS, New Admission Welcome) using placeholders such as `{name}`, `{date}`, `{class}`, `{dues}`, `{amount}`, `{subject}`.

### 6.2 Admissions
- **FR-2.1** System shall provide a digital Admission Form capturing: student record (name, father's name, address, DOB, religion, gender, class, previous school), personal record (father/home/student/WhatsApp cell numbers), sibling linkage (name+class for up to N siblings), educational record (previous school, reason for leaving, previous results, marks in Urdu/English/Math, English command ratings), guardian details, and office-use fields (session, student ID, family code, GR number, admission/monthly/exam/annual/practical fee, remarks) with signature capture fields.
- **FR-2.2** System shall auto-generate or allow manual entry of a **Family Code** to link siblings across records for consolidated billing and messaging.
- **FR-2.3** System shall provide a **Family & Siblings Report**.
- **FR-2.4** System shall provide a consolidated **Student File** view combining attendance, fee history, exam results, and sibling info in one screen/printout.
- **FR-2.5** System shall trigger a "Thanks for Admission" templated message automatically upon successful admission save.

### 6.3 Staff Management
- **FR-3.1** System shall provide a Staff form capturing personal info (gender, marital status, name, D/O, phone, email, DOB, NIC, blood group, photo, address), qualification & experience (qualification level, professional education/experience details), and appointment info (department, designation, appointed-on date, "Will Teach" flag, status: Working/Left, leave date).
- **FR-3.2** System shall capture salary information: pay scale, basic salary, total allowances, last increment amount+date, special bonus, bank account number.
- **FR-3.3** System shall support Security Deposit/Reserve Pay as either a percentage of basic salary or a fixed amount, with an opening balance.
- **FR-3.4** System shall support additional payroll deduction/credit fields: EOBI, Family-Code-for-Kids-Fee (staff-kids tuition offset), Conveyance.
- **FR-3.5** System shall support attendance-linked payroll rules: leave-scale (1 leave = X half-days), daily join time, standard leave time, Friday leave time, annual leave allotment, monthly allowed leaves, and a 100%-attendance bonus (as % of basic salary or fixed amount).
- **FR-3.6** System shall provide Staff Reports (list, filters) and Staff Attendance history/reports per staff member.

### 6.4 Search
- **FR-4.1** System shall provide a global multi-field student search (sort by GR#/Name/Class/DOA/Gender; filter by Father Name, Occupation, DOA, Class, Section, Gender, Left-status).
- **FR-4.2** Search results shall be printable and exportable (e.g., to Excel) with the searched/filtered columns.

### 6.5 Module 1 — Attendance
- **FR-5.1** System shall support marking Student Attendance by: individual row status toggles (Present/Absent/Leave/Late) per class+section+date, or **bulk "Smart Attendance"** entry by pasting a list of GR numbers and setting one status for all of them at once.
- **FR-5.2** System shall support marking a date as a Holiday (excludes it from attendance calculations) and a "Suspended" status.
- **FR-5.3** System shall provide a printable blank attendance sheet in alphabetical student-name order for manual/paper marking.
- **FR-5.4** System shall provide Staff Attendance marking with the same status set.
- **FR-5.5** System shall support integration/settings for biometric attendance devices ("Device Settings").
- **FR-5.6** System shall generate a Daily Attendance Report (per-student status list, split by class) and a Class-wise Attendance Summary (Total/Present/Absent/Leave/New-Admission/Left counts).
- **FR-5.7** System shall automatically send an absentee SMS/WhatsApp to only the students marked Absent for the day, using the Absent SMS template.

### 6.6 Module 2 — Examination
- **FR-6.1** System shall support Marks Entry per class+section+subject+test (Normal Test / Half-Yearly Test / Annual Test / custom exam category), entering Obtained marks against each student's Total marks for that test.
- **FR-6.2** System shall provide a **Subject-wise Marks Sheet**: trend of one subject's test scores over a date range for a single student, with % and grade per test.
- **FR-6.3** System shall provide an **Exam-wise (Student) Marks Sheet**: all subjects for one student across a date range, with per-subject %, grade, rank, and highest-scorer-in-class reference, plus an overall total/percentage/grade/rank and month-by-month attendance % summary.
- **FR-6.4** System shall provide a **Class-wise / Consolidated Marks Sheet**: matrix of all students (rows) × all subjects (columns) with totals, percentage, and rank, sortable by name/percentage/GR number, filterable by gender and date range.
- **FR-6.5** System shall compute an **Annual Aggregated Report** combining three term results using configurable weights (source shows both 20/20/60 and 30/30/40 — **must be a configurable setting per class/session, not hardcoded**), producing a T.M.O. (Total Marks Obtained), aggregate grade, and rank.
- **FR-6.6** System shall support an optional **deduction adjustment** to marks/fee based on Attendance % and/or Copy-Checking flags during a test.
- **FR-6.7** System shall generate printable **Student Progress Reports** (monthly, e.g., September+October combined) showing subject/date/marks/%/grade/highest-scorer, monthly totals, month-by-month percentage & grade trend (Jun–May), attendance (present/total days) trend, and a fee-band statement (e.g., "According to 'C' grade, your monthly fee is Rs. 4,000").
- **FR-6.8** System shall generate printable **Term/Annual Statement of Marks** certificates with subject list, max/obtained/percentage/grade/result-per-subject, total marks, overall result/percentage/grade, rank, attendance, remarks, and signature lines (Teacher/Principal) — and a separate **Annual Progress Report** format showing Term 1/2/3 side-by-side with weighted aggregation.
- **FR-6.9** System shall provide a **Print Result** screen: select Class/Section/Exam-Type/Session → show ranked result list (marks, %, rank, grade, Pass/Fail) → print individual or class-wide result sheets.
- **FR-6.10** System shall automatically send a Test Result SMS/WhatsApp message per the Test Result template upon result publication.

### 6.7 MCQ-Based Online Exam System
- **FR-7.1** System shall provide a **Question Bank** entry form capturing: Class, Subject, Chapter, Topic, Difficulty Level (target distribution Easy 20% / Moderate 60% / Hard 20%), Exam Type (MDCAT/ECAT), Question text, optional Question Image, 4+ Options (A/B/C/D, addable), Correct Answer marker, Explanation text, optional Explanation Media.
- **FR-7.2** System shall list/search/filter existing questions by Level and support Add/Edit/Delete.
- **FR-7.3** System shall provide a **Student Registration** flow for taking a test: for *regular* (existing) students, entering their Student ID auto-fills Name/Father/Class from their profile; for *new/external* students, all fields (Name, Father Name, WhatsApp No., Class, Subject, Exam Type, Number of Questions) must be filled manually, and the Admin issues a **temporary access ID** valid for a limited time.
- **FR-7.4** System shall run a timed **Online Test**: display Exam Type, live question counter (e.g., "0/100"), countdown timer, a per-subject question-number palette for navigation, one question at a time with 4 answer options, and Previous/Next/Finish controls; auto-submit when the timer expires.
- **FR-7.5** System shall auto-score submitted tests against the stored correct answers and feed the score into the results/reporting pipeline.

### 6.8 Module 3 — Fee Collection
- **FR-8.1** System shall support generating fee items of type: Admission Fee, Monthly Tuition Fee, Annual Fee, Practical Fee, Notes Fee, Examination Fee, and MDCAT/ECAT Package Fee (package fee supports installment breakup).
- **FR-8.2** System shall compute the student's **monthly tuition fee automatically** based on the Grading Policy's fee-reward for their last recorded grade, optionally combined with attendance-based and/or copy-checking-based deductions — this computed amount can be overridden via an editable "Change Fee" action, with the discount reason logged.
- **FR-8.3** System shall bulk-generate fee challans for an entire class for a given month, with a toggle to apply/exclude the grading-benefit and attendance-deduction, and shall support printing either one voucher per student or one consolidated voucher per family.
- **FR-8.4** System shall support Fee Voucher printing filtered class-wise, family-wise, or student-wise.
- **FR-8.5** System shall provide a Fee Collection screen searchable by Student ID, Family Code, or Name, displaying an itemized month-by-month balance (Fee, Fine, Fund, Transport-Fee, Admission Fee, Annual, Total, Received, Concession, Balance) with:
  - **FR-8.5.1** Temporary or permanent **concessions/discounts** with a mandatory reason field.
  - **FR-8.5.2** **Installment plans** — user enters the first installment amount; system tracks remaining balance.
  - **FR-8.5.3** **Hold Fee** — postpone a fee item's due date to a specified future month with a note.
  - **FR-8.5.4** Custom/manual one-off fee creation ("Create New Fee") for a single student or all family members at once.
  - **FR-8.5.5** Payment receipt generation with receipt number, amount, welfare-fund split, date, and voucher/slip print; support for **canceling/editing a paid entry** with a mandatory reason prompt (audit trail).
  - **FR-8.5.6** Payment history view per student, filterable by date range, with statuses (Paid/Unpaid), slip numbers, and session tagging.
- **FR-8.6** System shall provide Fee Collection Reports viewable **Slip-wise, Student-wise, Class-wise, and Amount-wise**, showing receipt#, family code, student ID, name, class, description, amount, and date, with sub-totals and a grand total, filterable by collecting user ("Fee User") and date range.
- **FR-8.7** System shall provide an **Accountant-wise Daily Collection Report** and a **Defaulter (Outstanding) Report**.
- **FR-8.8** System shall automatically send Fee-Received and Fee-Dues SMS/WhatsApp messages per templates.

### 6.9 Module 4 — Expense & Accounts
- **FR-9.1** System shall provide Expense Entry: source account ("Spend From" — e.g., Tuition Fee, Notes Fee), expense account/category (Salaries-Teacher, Salaries-Staff, Other Staff Salary, Fixed Expense, Photostat, Publicity & Press, Donations, Teachers Bonus & Extra Salary, Staff Bonus, Variable Expense/Others), Paid-To, Paid-By, Date, Cheque Number (optional), Description, and Amount (supporting multiple line items per entry), with Save and Save-&-Print actions.
- **FR-9.2** System shall provide Chart of Accounts, General Entry, Opening Balances, and Income ledger screens.
- **FR-9.3** System shall generate a **Closing Report** for a date/range showing: Tuition-Fee income breakdown (per student receipt), Notes-Fee income breakdown, Expense Details (voucher#, date, particular, amount), and a summary table per revenue account (Income, Expense, Profit, Reserve, Net Reserve) — enabling the institute to run separate P&L books per fee-income-stream (e.g., Tuition Fee account vs Notes Fee account).
- **FR-9.4** System shall support Payroll extras: Loan tracking, Salary Entry, Bank Reports, Reserve Salary, Cash Book, DCR (Daily Collection Report), Account Heads management.

### 6.10 Messaging
- **FR-10.1** System shall provide a Templates screen to create/edit/delete parameterized SMS/WhatsApp templates.
- **FR-10.2** System shall provide a chat-style **Send Message** composer listing all staff/contacts with the ability to compose and send a new ad-hoc message.
- **FR-10.3** System shall queue all outbound messages in an **Outbox** with status filter (Pending/Sent/Failed), a Refresh/retry action, and bulk delete.
- **FR-10.4** System shall surface SMS usage counters (Today Sent, Monthly Sent, remaining Balance) on the Dashboard.

### 6.11 Dashboard
- **FR-11.1** System shall provide a global Search bar and four quick-action shortcuts: Attendance, Fee Collection, Marks Entry, Expense Entry.
- **FR-11.2** System shall display KPI tiles for: Active Students, Active Staff, Active Families, Fee of Month (with Received/Balance), Salary of Month (with Paid/Payable), Today's Collection, Today's Expenses, Student Birthdays (today), Total Classes, Library Books, Transport Members, SMS Usage (Today/Monthly/Balance), Daily Student Attendance Summary (Present/Half-Day/P-Late/Absent/On-Leave/No-attendance, with %), Daily Staff Attendance Summary, and a Cash In/Out Summary.
- **FR-11.3** System shall display Yesterday / Today / Monthly progress blocks for Attendance (T/P/A/L, New Admissions, Left) and Fee Collection (Total/Received/Dues/Expense).
- **FR-11.4** System shall display Class-wise Dues table, Class-wise Attendance table, Today's-Left-Students list, and Birthday (student & staff) list.

### 6.12 Campus Selection
- **FR-12.1** After login, the system shall present a Campus Selection screen listing all campuses the user has access to (card view: name, phone, email, website, address), with Add/Edit/Delete campus actions available to authorized roles.
- **FR-12.2** All subsequent screens shall be scoped to the selected campus, with a persistent campus switcher in the top navigation.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Multi-tenancy** | Single institute account can operate multiple campuses; data isolated per campus but siblings/family may span campuses (needs confirmation — see Open Questions) |
| **Permission granularity** | Field/action-level (View/Add/Edit/Delete + custom flags), enforced server-side, not just hidden in UI |
| **Auditability** | All fee cancel/edit/discount/hold actions require a logged reason; concession log and deposit history must be retained indefinitely |
| **Print & export** | Every list/report screen must support Print (formatted for A4) and Excel export, gated by the "Hide Export" permission flag |
| **Bulk operation safety** | Session rollover, bulk challan generation, and bulk attendance marking must be transactional/batched and safely re-runnable without duplicating records |
| **Messaging reliability** | Outbound SMS/WhatsApp must be queued asynchronously with visible Pending/Sent/Failed status and manual retry |
| **Data integrity** | Marks/attendance/fee figures fed into automatic calculations (grading, deductions, annual aggregation) must be recalculated live, not cached stale values |
| **Localization** | Must support non-Latin scripts for subjects such as Urdu, Sindhi, Islamiat (Unicode storage & rendering, including in printed PDFs) |
| **Performance** | Class-wise/consolidated marks sheets and dashboard KPIs are heavy aggregate queries — must remain responsive as student counts scale into the thousands |
| **Availability** | Cloud-hosted web app implies standard uptime expectations for a paid SaaS-style product (exact SLA not specified in source — flag for Ops) |
| **Security** | Role-based access control at API layer; user passwords/credentials must be hashed; audit logs for financial transactions |

---

## 8. Data Model (Key Entities)

```
Institute (1) ──< Campus >── (1) Session (Academic Year)
Campus (1) ──< Class >── (1) Section
Class/Section (1) ──< Student >── (1) Family (FamilyCode)
Student (1) ──< Sibling-link (self-referencing via FamilyCode)
Student (1) ──< DailyAttendance >── Date
Student (1) ──< FeeItem (type: Admission/Tuition/Annual/Practical/Notes/Exam/Package) >── Month
FeeItem (1) ──< Installment
FeeItem (1) ──< Transaction (Receipt / Discount / Concession / Hold / Cancel) [audited, reason required]
Class/Section (1) ──< Subject >── (1) ExamCategory (term/month/type)
Student (1) ──< MarksEntry >── Subject × ExamCategory × Date
GradingPolicy: (PercentFrom, PercentTo) → Grade → FeeReward
RemarksPolicy: (PercentFrom, PercentTo) → RemarkText
QuestionBank: Class × Subject × Chapter × Topic × Level × ExamType → Question (+options +answer +explanation)
StudentTestSession (1) ──< TestAttempt >── Answer (per question)
Staff (1) ──< SalaryProfile >── (1) PayrollRules (leave scale, bonus criteria)
Staff (1) ──< DailyAttendance >── Date
Expense: Account(source) × Category × Date × Amount × PaidTo/PaidBy [+ optional cheque#]
User (1) ──< Role >── (1) PermissionMatrix (Module × Action)
MessageTemplate → OutboxMessage → Recipient(Student/Staff) × DeliveryStatus
```

**Design principle:** the monthly Tuition-Fee amount is a **computed value** = `ClassBaseFee − GradingPolicyReward(lastGrade) − AttendanceDeduction − CopyCheckingDeduction +/− ManualConcession`. This must live in a shared "Fee Calculation Service" consumed by both the Fee module and the bulk Challan-generation job, not duplicated logic.

---

## 9. System Architecture (Summary)

```
Web (SPA) / Mobile App
        │  HTTPS
API Gateway → AuthN (session/JWT) → AuthZ (per-module RBAC middleware)
        │
 ┌──────┼───────────┬──────────────┬────────────────┐
 ▼      ▼            ▼              ▼                ▼
Students/  Attendance  Examination   Fee/Accounts   Messaging
Staff Svc     Svc         Svc            Svc           Svc
 └──────┴─────┬──────┴──────────────┴────────────────┘
              ▼
     Core Rules Engine (Grading, Remarks, Fee-Reward,
     Deduction Calculator, Session Rollover, Annual Aggregation)
              ▼
     Primary RDBMS (multi-tenant, scoped by institute_id → campus_id)
              │
   ┌──────────┼───────────────┐
   ▼          ▼                ▼
 Redis     Object Storage   Message Queue (SMS/WhatsApp Outbox worker)
(cache)   (photos, question   │
           images, PDFs)      ▼
                        SMS Gateway / WhatsApp Business API / Biometric SDK
```

Full architecture rationale, tech-stack recommendation, and reporting layer detail are covered in the companion **System Design document** (`School-Coaching-Management-System-Design.md`).

---

## 10. Reporting Requirements Summary

| Report | Trigger/Access | Output |
|---|---|---|
| Dashboard KPIs | On login/home | Live tiles, Yesterday/Today/Monthly blocks |
| Daily/Class-wise Attendance Report | Attendance module | Print, Excel export |
| Subject-wise / Exam-wise / Class-wise / Consolidated Marks Sheets | Examination module | Print, Excel export |
| Student Progress Report (monthly) | Examination module | Printable PDF with trend charts |
| Term/Annual Statement of Marks & Progress Report | Examination module | Certificate-style printable PDF, signature lines |
| Fee Collection Report (slip/student/class/amount-wise) | Fee module | Print, Excel export, filter by user & date |
| Defaulter (Outstanding Dues) Report | Fee module | List with ageing |
| Closing / P&L Report | Accounts/Expense module | Income vs Expense vs Profit/Reserve/Net-cash, per revenue account |
| Family & Siblings Report / Student File | Admissions module | Print |
| Staff Reports | Staff module | List/filter, print |
| SMS Outbox Report | Messaging module | Status log |

---

## 11. Integration Requirements

| Integration | Purpose | Notes |
|---|---|---|
| **SMS Gateway** | Absentee, fee, result, admission-welcome notifications | Must support delivery-status callback for Outbox tracking |
| **WhatsApp Business API** | Same as above, richer formatting | Shown alongside SMS in the UI (green WhatsApp icon in header) |
| **Biometric Attendance Device** | Auto-mark attendance from hardware punch | "Device Settings" screen implies device pairing/config exists |
| **Excel Export** | Reports, search results | Client- or server-side generation (xlsx) |
| **PDF/Print Engine** | Vouchers, report cards, certificates, admission forms | Must support the institute's letterhead/logo branding per campus |

---

## 12. Assumptions

1. Only cash/manual fee receipt is required — no online payment gateway integration is evidenced.
2. Each institute account can host multiple campuses, and users are scoped to one or more campuses via role assignment.
3. Session Rollover assumes a single annual promotion event, not continuous mid-year promotion (though individual student class-transfer edits remain possible via student profile).
4. The Grading-Policy → Fee-Reward link applies automatically each month unless manually overridden.
5. Library and Transport are tracked at a count/KPI level only in this phase; full module functionality is not yet specified.

---

## 13. Success Metrics (Proposed)

| Metric | Target (proposed — confirm with stakeholder) |
|---|---|
| Time to generate a full class's fee challans | < 1 minute for up to 100 students |
| Attendance marking time per class | < 2 minutes using Smart Attendance bulk entry |
| SMS delivery success rate | > 95% |
| Dashboard load time | < 2 seconds with up to 5,000 active students |
| Report generation (marks/fee) | < 5 seconds for a full class |
| Data migration accuracy from legacy desktop app | 100% of active student/fee/marks records reconciled |

---

## 14. Open Questions / Risks

1. **Annual weighting formula conflict:** the source doc shows both `T1×20% + T2×20% + T3×60%` and `T1×30% + T2×30% + T3×40%` in different report samples — must be confirmed and made configurable per class/session rather than hardcoded.
2. **Fee-reward automation:** does the system apply the grade-based fee discount automatically every month at challan generation, or does it require Admin/Accountant approval first?
3. **Cross-campus siblings:** if a family has children in both School and Coaching campuses, should they share one Family Code and consolidated billing, or remain fully independent?
4. **Question Bank scope:** is the MCQ question bank shared globally across all campuses/sessions, or campus-specific?
5. **Session Rollover reversibility:** is there an "undo" window after bulk-promoting all students to a new session, and how are mid-year individual class transfers handled separately from the annual rollover?
6. **Library & Transport modules:** dashboard shows KPI tiles for these, but no functional screens were provided — confirm whether these are planned modules for a later phase or just informational counters fed from elsewhere.
7. **Parent portal:** confirm whether parents will ever get direct login access (view fee status, results) or remain SMS/WhatsApp-only recipients indefinitely.
8. **SLA/hosting requirements:** no uptime, backup, or data-retention policy is specified in the source document — needs Ops/Legal input before go-live.

---

## 15. Appendix A — Feature × Role Access Matrix

*(Reproduced from the companion System Design document — see `School-Coaching-Management-System-Design.md` §9.2 for full detail.)*

| Feature / Module | Admin‑Supreme | Administrator | Assistant | Accountant |
|---|---|---|---|---|
| User Management | F | M | – | – |
| Role & Permission Engine | F | V | – | – |
| Campus / Class / Staff-Dept Management | F | M | V/M | – |
| Admissions (Students) | F | M | M | V |
| Staff Profiles / Payroll | F | M | E / – | V / M |
| Fee Structure / Challan / Collection | F | M | – | F |
| Student & Staff Attendance | F | M | E | – |
| Accounts (Chart/General/Income) | F | V | – | F |
| Examination (Subjects/Grading/Marks/Question Bank) | F | M | E | – |
| Reports (all) | F | V | – | V (Fee/Accounts only) |
| Messages (Templates/Send/Outbox) | F | M | E | E |
| Dashboard KPIs | F | F | V (scoped) | V (fee KPIs) |

Legend: F = Full · M = Manage (no Delete) · E = Entry only · V = View only · – = No access
