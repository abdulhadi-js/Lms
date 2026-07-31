# 🏠 EduCore LMS — Home

> **EduCore** is a full-stack Learning Management System built with **Next.js + NestJS + PostgreSQL**. It supports three distinct user roles — Admin, Instructor, and Student — each with their own dashboard and feature set.

---

## 📂 Vault Index

### 🏗️ Architecture
- [[Backend Architecture]] — NestJS server, modules, guards, and middleware
- [[Frontend Architecture]] — Next.js App Router, role portals, and state management

### 🗃️ Data
- [[Database Schema]] — All tables, columns, relations, and enum values
- [[API Endpoints]] — Every REST endpoint in the system

### 🔐 Security & Auth
- [[Authentication Flow]] — JWT login, refresh tokens, and password reset
- [[Role-Based Access Control]] — ADMIN, INSTRUCTOR, STUDENT permissions

### 📄 Frontend Pages
- [[Pages - Admin Portal]] — All /admin/* pages and their features
- [[Pages - Teacher Portal]] — All /teacher/* pages and their features
- [[Pages - Student Portal]] — All /student/* pages and their features

### ⚙️ Operations
- [[Environment Variables]] — All required env vars for Backend + Frontend
- [[Deployment Guide]] — Render (Backend) + Vercel (Frontend) deployment
- [[Local Development Setup]] — How to run the full stack locally

### 🧪 Quality
- [[QA Audit Log]] — All 19 bugs found and fixed during QA
- [[Testing Guide]] — Running unit tests and Playwright E2E tests

---

## 🚀 Quick Reference

| Thing | Value |
|---|---|
| **Backend Port** | `3001` |
| **Frontend Port** | `3000` |
| **API Prefix** | `/api/v1/` |
| **Swagger Docs** | `http://localhost:3001/api/docs` |
| **Admin Login** | `admin@educore.com` / `Admin@123!` |
| **Teacher Login** | `teacher@educore.com` / `Teacher@123!` |
| **Student Login** | `student@educore.com` / `Student@123!` |
| **GitHub Repo** | `github.com/abdulhadi-js/Lms` |

---

## 🧩 Module Map

```
EduCore LMS
├── Backend (NestJS)
│   ├── AuthModule
│   ├── UsersModule
│   ├── AcademicsModule
│   ├── EnrollmentsModule
│   ├── AssignmentsModule
│   ├── MarksModule
│   ├── AttendanceModule
│   ├── TimetableModule
│   ├── FeesModule
│   ├── ChatModule
│   ├── NotificationsModule
│   └── ReportsModule
└── Frontend (Next.js)
    ├── / (Landing Page)
    ├── /login
    ├── /apply
    ├── /admin/*
    ├── /teacher/*
    └── /student/*
```
