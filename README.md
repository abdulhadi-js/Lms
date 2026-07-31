<div align="center">
  <h1>🎓 EduCore LMS</h1>
  <p><strong>A True Enterprise-Grade School ERP & Learning Management System</strong></p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-Next.js_15-black?logo=next.js)](https://lms-theta-sooty.vercel.app)
  [![Backend](https://img.shields.io/badge/Backend-NestJS_11-ea2845?logo=nestjs)](https://educore-backend-sde8.onrender.com)
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)](#)
  [![Testing](https://img.shields.io/badge/Testing-TestSprite_AI-blue)](#)
</div>

<br/>

EduCore LMS is a comprehensive, multi-tenant (multi-campus) Learning Management System architected specifically for modern schooling models (e.g., the Pakistani School ERP model). It bridges the gap between academics, human resources, finance, and student management in a single, cohesive platform.

---

## ✨ Core Modules & Features

### 🏫 Academics & Timetable
- **Section-Based Learning:** Replaces generic "courses" with a strict `Class ➔ Section ➔ Subject` hierarchy.
- **Dynamic Timetabling:** Teachers are assigned to subjects within specific sections. The timetable manages room allocations and prevents double-booking.
- **Session Rollover Engine:** Seamlessly promote students from one academic year to the next with a single click.

### 🔐 Matrix-Based RBAC (Role-Based Access Control)
- **Dynamic Permissions:** Granular control over modules (e.g., `ACADEMICS`, `FEES`, `USERS_STAFF`) with specific `VIEW`, `ADD`, `EDIT`, and `DELETE` flags.
- **Multi-Campus Isolation:** Users and Admins are scoped to their respective campuses. Super Admins have global oversight.

### 💰 Finance & Fee Management
- **Bulk Challan Generation:** Automatically generate fee records for entire sections or classes.
- **Family Consolidated Billing:** Families can view a single, consolidated fee voucher for all their enrolled children.
- **Dynamic Discounts:** Automated discount application engine (e.g., Merit-based discounts for 'A' grade students).

### 👥 HR & Payroll
- **Dynamic Profiles:** Key-value based HR profiles for staff members handling dynamic Allowances and Deductions.
- **Payroll Automation:** Automated monthly salary generation based on attendance and dynamic HR rules.

### 📝 Examinations & CBT (Computer-Based Testing)
- **Question Banks:** Build categorized question banks (MCQ, True/False, Essay).
- **Automated Grading:** Auto-grading for objective questions.
- **Advanced Report Cards:** Aggregate reporting engine that generates standard school report cards with automated remarks ("Excellent", "Needs Improvement", etc.).

---

## 🛠️ Technology Stack

### 🖥️ Frontend (Web App)
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Forest Green brand palette)
- **State Management & Fetching:** [React Query](https://tanstack.com/query/latest) & Context API
- **Icons:** [Lucide React](https://lucide.dev/)
- **Hosting:** [Vercel](https://lms-theta-sooty.vercel.app/)

### ⚙️ Backend (API)
- **Framework:** [NestJS 11](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [TypeORM](https://typeorm.io/)
- **Security:** Helmet, Throttler (Rate Limiting), JWT (Access + Refresh tokens), bcrypt.
- **Hosting:** [Render](https://educore-backend-sde8.onrender.com)

---

## 🚀 Live Demo
- **Frontend (Vercel):** [https://lms-theta-sooty.vercel.app](https://lms-theta-sooty.vercel.app)
- **Backend API (Render):** [https://educore-backend-sde8.onrender.com/api/v1](https://educore-backend-sde8.onrender.com/api/v1)

---

## 💻 Local Development Setup

### 1. Database Setup
The backend requires a PostgreSQL instance.
- Ensure PostgreSQL is running.
- Create a database named `educore_lms`.
- The application will auto-sync the TypeORM entities on startup in dev mode.

### 2. Backend Setup
```bash
cd Backend
npm install

# Set environment variables
cp .env.example .env
# Ensure DB credentials and JWT secrets are set

npm run start:dev
```
The backend API will run at `http://localhost:3001/api/v1`.

### 3. Frontend Setup
```bash
cd Frontend
npm install

# Set environment variables
# Note: NEXT_PUBLIC_API_URL must point to your backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

npm run dev
```
The web application will run at `http://localhost:3000`.

---

## 🧪 Testing

EduCore LMS utilizes **TestSprite AI** for automated UI and End-to-End testing.
- Playwright runs silently in the background, executing comprehensive UI workflows (like login, CRUD operations, and permission checks).
- Test plans and execution reports are generated dynamically via the **TestSprite MCP Tool**.

---

## 📚 Documentation
Comprehensive documentation for the database schema, architecture, APIs, and deployment guides can be found in the `EduCore_Docs/` directory. These files are formatted for **Obsidian** and contain internal wiki links for easy navigation.

---

<div align="center">
  <i>Built with modern technologies for the future of education management.</i>
</div>
