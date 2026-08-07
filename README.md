# 🎓 EduCore School LMS (Pakistani Standard)

Welcome to **EduCore School LMS**, a comprehensive, modern Educational Resource Planning (ERP) and Learning Management System designed specifically to align with the **Pakistani Schooling System**. 

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Owner](https://img.shields.io/badge/Owner-abdulhadi--js-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 📌 Project Overview
This project is an end-to-end multi-portal School LMS providing distinct interfaces for **Admins, Teachers, and Students**. It digitalizes school operations, integrating everything from admissions, fee management (in PKR), paper-based exam result entry, daily attendance tracking, to generating printable result cards (**Nateeja**) using the standard Pakistani Matric Grading Scale.

**Key Features tailored for Pakistan:**
- ✅ **Matric Grading Scale:** A+, A, B, C, D, E, F standardized grade distributions and reporting.
- ✅ **Local Context Fields:** B-Form / CNIC, Father's CNIC, Domicile, and Religion tracking on student profiles.
- ✅ **Nateeja Generation:** Printable "Result Cards" matching the traditional Pakistani physical progress reports.
- ✅ **PKR Currency:** Complete fee management, challan generation, and payment tracking in Pakistani Rupees (PKR).
- ✅ **Daily School Mode Attendance:** Teacher dashboard optimized for daily class-wise attendance marking (P, A, L, LT) rather than university-style credit-hour tracking.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or pnpm
- Git

### Installation Guide
1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulhadi-js/Lms.git
   cd Lms
   ```

2. **Start the Backend Server**
   Navigate to the backend directory, install dependencies, and start the API server:
   ```bash
   cd Backend
   npm install
   npm run start
   ```
   *(Ensure your database environment variables are configured in the Backend directory before starting)*

3. **Start the Frontend Client**
   Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Next.js app:
   ```bash
   cd Frontend
   npm install
   ```
   Create a `.env.local` file in the `Frontend` directory with the following variable:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```
   Then start the development server:
   ```bash
   npm run dev
   ```
5. **Access the Portals:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. 
   - Public Apply Page: `/apply`
   - Login: `/login` (Roles navigate automatically to `/admin`, `/teacher`, or `/student`)

## 🛠️ Tech Stack & Technologies

**Frontend / Core Framework**
- **[Next.js](https://nextjs.org/)** (React framework with App Router)
- **TypeScript** (Strongly typed JavaScript)
- **Tailwind CSS** (Utility-first styling framework)
- **Lucide React** (Beautiful consistent icons)
- **React Hot Toast** (Toast notifications)

**Testing**
- **[Playwright](https://playwright.dev/)** (End-to-End browser automation testing framework)

**API Integration**
- Built-in `fetch` API wrappers with unified JWT authentication interception handling.

**Deployment**
- **[Vercel](https://vercel.com/)** optimized

## 🌐 API Gateways & Endpoints

The frontend application connects to a backend REST API (default `http://localhost:3001/api/v1`). The API logic is encapsulated in `lib/api.ts` with dedicated gateways:

| Gateway | Description | Main Methods |
|---------|-------------|--------------|
| `authApi` | Authentication & Auth state | `login()`, `register()`, `me()` |
| `usersApi` | User profiles & management | `list()`, `update()`, `getUnifiedProfile()` |
| `enrollmentsApi` | Course enrollments | `list()`, `bulkEnroll()` |
| `feesApi` | Fee challans & payments | `list()`, `pay()`, `bulkGenerate()` |
| `marksApi` | Academic grading & results | `getStudentMarks()`, `enterMark()`, `getTranscript()` |
| `attendanceApi` | Daily & Subject attendance | `get()`, `mark()`, `bulkMark()` |
| `coursesApi` | Subject and Course catalogs | `list()`, `get()` |
| `reportsApi` | Data aggregation & Analytics | `performance()`, `overview()` |

*Other gateways include: `financeApi`, `hrApi`, `academicsApi`, `familiesApi`, `examsApi`, `timetableApi`, `messagingApi`, `chatApi`, and `notificationsApi`.*

## 🧪 Comprehensive E2E Testing (Playwright)

We have implemented a rigorous 4-Phase End-to-End testing suite ensuring platform stability across all user roles. 
*To run tests locally: `npx playwright test`*

### Phase 1: Public Flow (5/5 Passing)
- `TC-PUB-01`: Verify Application Form renders properly.
- `TC-PUB-02`: Verify Form submission with Pakistani standard fields (B-Form, Religion).
- `TC-PUB-03`: Verify Form validation blocks empty submissions.
- `TC-PUB-04`: Verify Login Page renders properly.
- `TC-PUB-05`: Verify invalid login shows error toast.

### Phase 2: Super Admin Operations (3/3 Passing)
- `TC-ADM-01`: Verify Super Admin Dashboard renders System Overview KPIs.
- `TC-ADM-02`: Verify Families page renders Active Families.
- `TC-ADM-03`: Verify Bulk Enroll feature triggers `Enroll by Class` modal successfully.

### Phase 3: Teacher Portal (4/4 Passing)
- `TC-TCH-01`: Verify Dashboard shows Annual Term subtitle.
- `TC-TCH-02`: Verify Grade Distribution chart dynamically scales to Pakistani Matric System.
- `TC-TCH-03`: Verify Gradebook renders "Exam Result Entry" mode.
- `TC-TCH-04`: Verify Attendance module activates "Daily Attendance (School Mode)".

### Phase 4: Student Portal (5/5 Passing)
- `TC-STU-01`: Verify Student Dashboard renders correct Session details.
- `TC-STU-02`: Verify Assignments page renders.
- `TC-STU-03`: Verify Exams view displays "Exam Schedule" successfully.
- `TC-STU-04`: Verify Nateeja (Result Card) renders print-ready layout safely despite API delays.
- `TC-STU-05`: Verify Financial Fees display exact outstanding amounts in **PKR**.

---

<div align="center">
  <b>Owned and Maintained by <a href="https://github.com/abdulhadi-js">abdulhadi-js</a></b>
  <br />
  <i>Empowering Pakistani Education through Technology.</i>
</div>
