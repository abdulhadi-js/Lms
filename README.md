# EduCore LMS - Full Stack Monorepo

EduCore LMS is a comprehensive Learning Management System designed to handle administrative, teaching, and student workflows seamlessly.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Vanilla CSS (Design Tokens, Forest Green palette)
- **Icons:** Lucide React
- **Architecture:** Client/Server components, dynamic routing, and modular API bindings.

### Backend
- **Framework:** NestJS 11
- **Database:** PostgreSQL (via TypeORM)
- **Security:** Helmet, Throttler (Rate Limiting), JWT Authentication (Access + Refresh tokens), bcrypt password hashing, and Class Validator.
- **API Specs:** Swagger OpenAPI

## 📁 Repository Structure

```
├── Backend/                 # NestJS application and core API services
├── Frontend/                # Next.js web application and UI
├── testsprite_tests/        # TestSprite MCP integration and end-to-end testing
└── README.md
```

## 🛠️ Getting Started

### 1. Database Setup
The backend requires a PostgreSQL instance.
- Ensure PostgreSQL is running.
- Create a database named `educore_lms`.
- (The application will auto-sync the TypeORM entities on startup in dev mode).

### 2. Backend Setup
```bash
cd Backend
npm install
npm run start:dev
```
The backend API will run at `http://localhost:3001/api/v1` and Swagger docs at `http://localhost:3001/api/docs`.

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
The web application will run at `http://localhost:3000`.

## 🛡️ Security Features
- **Helmet HTTP Headers** for XSS, Clickjacking, and Sniffing protection.
- **Throttler Module** limits IP requests to prevent brute force and DDoS.
- **TypeORM** parameterized queries prevent SQL injection.
- **Strict CORS** policies and validation pipes.
- **Stateless Bearer JWT** authentications to naturally immune the app from CSRF attacks.

## 🧪 Testing
We use **TestSprite AI** for automated backend integration testing. Run the testing suite via the TestSprite CLI against the `Backend` codebase.
