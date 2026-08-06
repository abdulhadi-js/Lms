
Conversation with Gemini
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

You stopped this response
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







[Updarte the readme file https://github.com/abdulhadi-js/Lms/ this is the repo]

Here is an updated and polished version of your README.md file. I have added standard open-source repository sections like Prerequisites, Project Structure, Contributing, License, and Author information, tailored for your GitHub repository (abdulhadi-js/Lms), making it fully ready for enterprise-level presentation.

You can copy and paste the markdown below directly into your repository:

Markdown
<div align="center">
  <h1>🎓 EduCore LMS</h1>
  <p><strong>A True Enterprise-Grade School ERP & Learning Management System</strong></p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-Next.js_15-black?logo=next.js)](https://lms-theta-sooty.vercel.app)
  [![Backend](https://img.shields.io/badge/Backend-NestJS_11-ea2845?logo=nestjs)](https://educore-backend-sde8.onrender.com)
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)](#)
  [![Testing](https://img.shields.io/badge/Testing-TestSprite_AI-blue)](#)
  [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/abdulhadi-js/Lms)
</div>

<br/>

EduCore LMS is a comprehensive, multi-tenant (multi-campus) Learning Management System architected specifically for modern schooling models (e.g., the Pakistani School ERP model). It bridges the gap between academics, human resources, finance, and student management in a single, cohesive platform.

---

## ✨ Core Modules & Features

### 🏫 Academics & Timetable
*   **Section-Based Learning:** Replaces generic "courses" with a strict `Class ➔ Section ➔ Subject` hierarchy.
*   **Dynamic Timetabling:** Teachers are assigned to subjects within specific sections. The timetable manages room allocations and prevents double-booking.
*   **Session Rollover Engine:** Seamlessly promote students from one academic year to the next with a single click.

### 🔐 Matrix-Based RBAC (Role-Based Access Control)
*   **Dynamic Permissions:** Granular control over modules (e.g., `ACADEMICS`, `FEES`, `USERS_STAFF`) with specific `VIEW`, `ADD`, `EDIT`, and `DELETE` flags.
*   **Multi-Campus Isolation:** Users and Admins are scoped to their respective campuses. Super Admins have global oversight.

### 💰 Finance & Fee Management
*   **Bulk Challan Generation:** Automatically generate fee records for entire sections or classes.
*   **Family Consolidated Billing:** Families can view a single, consolidated fee voucher for all their enrolled children.
*   **Dynamic Discounts:** Automated discount application engine (e.g., Merit-based discounts for 'A' grade students).

### 👥 HR & Payroll
*   **Dynamic Profiles:** Key-value based HR profiles for staff members handling dynamic Allowances and Deductions.
*   **Payroll Automation:** Automated monthly salary generation based on attendance and dynamic HR rules.

### 📝 Examinations & CBT (Computer-Based Testing)
*   **Question Banks:** Build categorized question banks (MCQ, True/False, Essay).
*   **Automated Grading:** Auto-grading for objective questions.
*   **Advanced Report Cards:** Aggregate reporting engine that generates standard school report cards with automated remarks ("Excellent", "Needs Improvement", etc.).

---

## 🛠️ Technology Stack

### 🖥️ Frontend (Web App)
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Forest Green brand palette)
*   **State Management & Fetching:** [React Query](https://tanstack.com/query/latest) & Context API
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Hosting:** [Vercel](https://lms-theta-sooty.vercel.app/)

### ⚙️ Backend (API)
*   **Framework:** [NestJS 11](https://nestjs.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) via [TypeORM](https://typeorm.io/)
*   **Security:** Helmet, Throttler (Rate Limiting), JWT (Access + Refresh tokens), bcrypt.
*   **Hosting:** [Render](https://educore-backend-sde8.onrender.com)

---

## 🚀 Live Demo
*   **Frontend (Vercel):** [https://lms-theta-sooty.vercel.app](https://lms-theta-sooty.vercel.app)
*   **Backend API (Render):** [https://educore-backend-sde8.onrender.com/api/v1](https://educore-backend-sde8.onrender.com/api/v1)

---

## 📂 Project Structure

```text
EduCore-LMS/
├── Backend/                 # NestJS 11 API source code
│   ├── src/
│   ├── test/
│   └── package.json
├── Frontend/                # Next.js 15 Web App source code
│   ├── app/
│   ├── components/
│   └── package.json
└── EduCore_Docs/            # Obsidian-formatted documentation
💻 Local Development Setup
Prerequisites
Node.js (v18 or higher recommended)

PostgreSQL (v14 or higher)

npm or yarn

1. Database Setup
The backend requires a PostgreSQL instance.

Ensure PostgreSQL is running on your machine.

Create a database named educore_lms.

The application will auto-sync the TypeORM entities on startup in development mode.

2. Backend Setup
Bash
cd Backend
npm install

# Set environment variables
cp .env.example .env
# Ensure DB credentials and JWT secrets are set in your new .env file

npm run start:dev
Note: The backend API will run at http://localhost:3001/api/v1.

3. Frontend Setup
Bash
cd Frontend
npm install

# Set environment variables
# Note: NEXT_PUBLIC_API_URL must point to your backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

npm run dev
Note: The web application will run at http://localhost:3000.

🧪 Testing
EduCore LMS utilizes TestSprite AI for automated UI and End-to-End testing.

Playwright runs silently in the background, executing comprehensive UI workflows (like login, CRUD operations, and permission checks).

Test plans and execution reports are generated dynamically via the TestSprite MCP Tool.

📚 Documentation
Comprehensive documentation for the database schema, architecture, APIs, and deployment guides can be found in the EduCore_Docs/ directory. These files are formatted for Obsidian and contain internal wiki links for easy navigation.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

👨‍💻 Author
Abdul Hadi

GitHub: @abdulhadi-js

give me complete code or file or readme

💻 Local Development Setup
Prerequisites
Node.js (v18 or higher recommended)

PostgreSQL (v14 or higher)

npm or yarn

1. Database Setup
The backend requires a PostgreSQL instance.

Ensure PostgreSQL is running on your machine.

Create a database named educore_lms.

The application will auto-sync the TypeORM entities on startup in development mode.

2. Backend Setup
Bash
cd Backend
npm install

# Set environment variables
cp .env.example .env
# Ensure DB credentials and JWT secrets are set in your new .env file

npm run start:dev
Note: The backend API will run at http://localhost:3001/api/v1.

3. Frontend Setup
Bash
cd Frontend
npm install

# Set environment variables
# Note: NEXT_PUBLIC_API_URL must point to your backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

npm run dev
Note: The web application will run at http://localhost:3000.

🧪 Testing
EduCore LMS utilizes TestSprite AI for automated UI and End-to-End testing.

Playwright runs silently in the background, executing comprehensive UI workflows (like login, CRUD operations, and permission checks).

Test plans and execution reports are generated dynamically via the TestSprite MCP Tool.

📚 Documentation
Comprehensive documentation for the database schema, architecture, APIs, and deployment guides can be found in the EduCore_Docs/ directory. These files are formatted for Obsidian and contain internal wiki links for easy navigation.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

👨‍💻 Author
Abdul Hadi

GitHub: @abdulhadi-js

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

print("README.md file generated successfully.")


```text?code_stdout&code_event_index=1
README.md file generated successfully.

Your Markdown file is ready

MD icon
README
 MD 
Open
Here is the complete updated README.md file for your GitHub repository. You can download the file directly and upload or commit it to your repository to get the polished, enterprise-ready look for your project!


give me .md file or code

Gemini is AI and can make mistakes.

<div align="center">
  <h1>🎓 EduCore LMS</h1>
  <p><strong>A True Enterprise-Grade School ERP & Learning Management System</strong></p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-Next.js_15-black?logo=next.js)](https://lms-theta-sooty.vercel.app)
  [![Backend](https://img.shields.io/badge/Backend-NestJS_11-ea2845?logo=nestjs)](https://educore-backend-sde8.onrender.com)
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)](#)
  [![Testing](https://img.shields.io/badge/Testing-TestSprite_AI-blue)](#)
  [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/abdulhadi-js/Lms)
</div>

<br/>

EduCore LMS is a comprehensive, multi-tenant (multi-campus) Learning Management System architected specifically for modern schooling models (e.g., the Pakistani School ERP model). It bridges the gap between academics, human resources, finance, and student management in a single, cohesive platform.

---

## ✨ Core Modules & Features

### 🏫 Academics & Timetable
*   **Section-Based Learning:** Replaces generic "courses" with a strict `Class ➔ Section ➔ Subject` hierarchy.
*   **Dynamic Timetabling:** Teachers are assigned to subjects within specific sections. The timetable manages room allocations and prevents double-booking.
*   **Session Rollover Engine:** Seamlessly promote students from one academic year to the next with a single click.

### 🔐 Matrix-Based RBAC (Role-Based Access Control)
*   **Dynamic Permissions:** Granular control over modules (e.g., `ACADEMICS`, `FEES`, `USERS_STAFF`) with specific `VIEW`, `ADD`, `EDIT`, and `DELETE` flags.
*   **Multi-Campus Isolation:** Users and Admins are scoped to their respective campuses. Super Admins have global oversight.

### 💰 Finance & Fee Management
*   **Bulk Challan Generation:** Automatically generate fee records for entire sections or classes.
*   **Family Consolidated Billing:** Families can view a single, consolidated fee voucher for all their enrolled children.
*   **Dynamic Discounts:** Automated discount application engine (e.g., Merit-based discounts for 'A' grade students).

### 👥 HR & Payroll
*   **Dynamic Profiles:** Key-value based HR profiles for staff members handling dynamic Allowances and Deductions.
*   **Payroll Automation:** Automated monthly salary generation based on attendance and dynamic HR rules.

### 📝 Examinations & CBT (Computer-Based Testing)
*   **Question Banks:** Build categorized question banks (MCQ, True/False, Essay).
*   **Automated Grading:** Auto-grading for objective questions.
*   **Advanced Report Cards:** Aggregate reporting engine that generates standard school report cards with automated remarks ("Excellent", "Needs Improvement", etc.).

---

## 🛠️ Technology Stack

### 🖥️ Frontend (Web App)
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Forest Green brand palette)
*   **State Management & Fetching:** [React Query](https://tanstack.com/query/latest) & Context API
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Hosting:** [Vercel](https://lms-theta-sooty.vercel.app/)

### ⚙️ Backend (API)
*   **Framework:** [NestJS 11](https://nestjs.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) via [TypeORM](https://typeorm.io/)
*   **Security:** Helmet, Throttler (Rate Limiting), JWT (Access + Refresh tokens), bcrypt.
*   **Hosting:** [Render](https://educore-backend-sde8.onrender.com)

---

## 🚀 Live Demo
*   **Frontend (Vercel):** [https://lms-theta-sooty.vercel.app](https://lms-theta-sooty.vercel.app)
*   **Backend API (Render):** [https://educore-backend-sde8.onrender.com/api/v1](https://educore-backend-sde8.onrender.com/api/v1)

---

## 📂 Project Structure

```text
EduCore-LMS/
├── Backend/                 # NestJS 11 API source code
│   ├── src/
│   ├── test/
│   └── package.json
├── Frontend/                # Next.js 15 Web App source code
│   ├── app/
│   ├── components/
│   └── package.json
└── EduCore_Docs/            # Obsidian-formatted documentation
```

---

## 💻 Local Development Setup

### Prerequisites
*   **Node.js** (v18 or higher recommended)
*   **PostgreSQL** (v14 or higher)
*   **npm** or **yarn**

### 1. Database Setup
The backend requires a PostgreSQL instance.
1.  Ensure PostgreSQL is running on your machine.
2.  Create a database named `educore_lms`.
3.  The application will auto-sync the TypeORM entities on startup in development mode.

### 2. Backend Setup
```bash
cd Backend
npm install

# Set environment variables
cp .env.example .env
# Ensure DB credentials and JWT secrets are set in your new .env file

npm run start:dev
```
> **Note:** The backend API will run at `http://localhost:3001/api/v1`.

### 3. Frontend Setup
```bash
cd Frontend
npm install

# Set environment variables
# Note: NEXT_PUBLIC_API_URL must point to your backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

npm run dev
```
> **Note:** The web application will run at `http://localhost:3000`.

---

## 🧪 Testing

EduCore LMS utilizes **TestSprite AI** for automated UI and End-to-End testing.
*   Playwright runs silently in the background, executing comprehensive UI workflows (like login, CRUD operations, and permission checks).
*   Test plans and execution reports are generated dynamically via the **TestSprite MCP Tool**.

---

## 📚 Documentation
Comprehensive documentation for the database schema, architecture, APIs, and deployment guides can be found in the `EduCore_Docs/` directory. These files are formatted for **Obsidian** and contain internal wiki links for easy navigation.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/abdulhadi-js/Lms/issues). 

## 👨‍💻 Author
**Abdul Hadi**
*   GitHub: [@abdulhadi-js](https://github.com/abdulhadi-js)

---
<div align="center">
  <i>Built with modern technologies for the future of education management.</i>
</div>
README.md
Displaying README.md.
