# EduCore LMS — Complete Setup Guide

> Follow these steps **in order**. Each section tells you exactly what to do, what credentials to copy, and where to paste them.

---

## Step 0 — Prerequisites

Install these on your machine if not already installed:

| Tool | Download | Check |
|---|---|---|
| Node.js 20+ | https://nodejs.org | `node -v` |
| PostgreSQL 15+ | https://www.postgresql.org/download/ | `psql --version` |
| Redis 7+ | https://redis.io/download OR use Upstash (cloud) | `redis-cli ping` |
| Git | https://git-scm.com | `git --version` |

---

## Step 1 — PostgreSQL Database Setup

### Option A: Local PostgreSQL

1. Open **pgAdmin** or **psql**
2. Create a new database:
   ```sql
   CREATE DATABASE educore_db;
   CREATE USER educore_user WITH PASSWORD 'your_strong_password';
   GRANT ALL PRIVILEGES ON DATABASE educore_db TO educore_user;
   ```
3. Note down your credentials:
   - Host: `localhost`
   - Port: `5432`
   - Database: `educore_db`
   - Username: `educore_user`
   - Password: `your_strong_password`

### Option B: Cloud PostgreSQL (Neon — Free)

1. Go to https://neon.tech → Sign up
2. Click **New Project** → Name it `educore`
3. Copy the **Connection string** shown (looks like `postgresql://user:pass@host/dbname`)
4. Parse it into individual parts for your `.env` file

---

## Step 2 — Redis Setup

### Option A: Local Redis (Windows)

Redis doesn't run natively on Windows. Use WSL2 or Docker:
```bash
# Using Docker (easiest):
docker run -d -p 6379:6379 --name educore-redis redis:7-alpine
```
- Host: `localhost`
- Port: `6379`
- Password: (none for local)

### Option B: Upstash Redis (Free Cloud — Recommended)

1. Go to https://upstash.com → Sign up
2. Click **Create Database** → Name: `educore-redis` → Region: closest to you
3. After creation, go to **Details** tab
4. Copy:
   - **UPSTASH_REDIS_REST_URL** → use as `REDIS_HOST` (just the hostname part)
   - **UPSTASH_REDIS_REST_TOKEN** → use as `REDIS_PASSWORD`
   - Port: `6379`

> **Tip**: For development you can skip Redis entirely — the app will fall back to in-memory storage. Only needed for production token blacklisting and job queues.

---

## Step 3 — Cloudinary Setup (File Uploads)

1. Go to https://cloudinary.com → **Sign up free**
2. After login, go to your **Dashboard**
3. You'll see three values at the top:
   - **Cloud Name** (e.g. `dxyz1234`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (e.g. `abcdefghij1234567890`)
4. Go to **Settings → Upload** → scroll to **Upload presets**
5. Click **Add upload preset**:
   - Preset name: `educore_assignments`
   - Signing mode: **Unsigned** (for direct frontend uploads)
   - Folder: `assignments`
   - Click **Save**
6. Create another preset:
   - Preset name: `educore_profiles`
   - Signing mode: **Unsigned**
   - Folder: `profiles`
   - Click **Save**

Copy these 3 values into your `.env` file (see Step 6).

---

## Step 4 — Email (SMTP) Setup

### Option A: Resend (Recommended — 100 free emails/day)

1. Go to https://resend.com → Sign up
2. Go to **API Keys** → **Create API Key** → Name: `educore`
3. Copy the API key (starts with `re_`)
4. In your `.env`:
   ```
   MAIL_HOST=smtp.resend.com
   MAIL_PORT=465
   MAIL_USER=resend
   MAIL_PASS=re_your_api_key_here
   MAIL_FROM=noreply@yourdomain.com
   ```

### Option B: Gmail SMTP (simplest for testing)

1. Go to https://myaccount.google.com → Security
2. Enable **2-Step Verification**
3. Go to **App Passwords** → Generate one for "Mail"
4. Copy the 16-character password
5. In your `.env`:
   ```
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=yourgmail@gmail.com
   MAIL_PASS=xxxx xxxx xxxx xxxx
   MAIL_FROM=yourgmail@gmail.com
   ```

### Option C: Mailtrap (development only — emails go to inbox, never sent)

1. Go to https://mailtrap.io → Sign up free
2. Go to **Email Testing → Inboxes → SMTP Settings**
3. Copy the SMTP credentials shown

---

## Step 5 — JWT Secret Keys

Generate strong random secrets. Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it **twice** — one for `JWT_SECRET`, one for `JWT_REFRESH_SECRET`.

---

## Step 6 — Create the `.env` file

Create this file at: `Backend/.env`

```env
# ── App ──────────────────────────────────────────────────────
NODE_ENV=development
APP_PORT=3001

# ── PostgreSQL ───────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=educore_user
DB_PASSWORD=your_strong_password
DB_NAME=educore_db

# ── JWT ──────────────────────────────────────────────────────
JWT_SECRET=paste_your_64_byte_hex_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=paste_your_second_64_byte_hex_here
JWT_REFRESH_EXPIRES_IN=7d

# ── Redis ────────────────────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ── Cloudinary ───────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=educore_assignments

# ── Email (SMTP) ─────────────────────────────────────────────
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=youremail@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=EduCore LMS <noreply@educore.com>

# ── Frontend URL (for CORS) ──────────────────────────────────
FRONTEND_URL=http://localhost:3000
```

Create this file at: `Frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=educore_assignments
```

---

## Step 7 — Seed the Database (First-Time Admin Account)

After the backend starts for the first time (TypeORM will auto-create all tables), create the admin user manually:

```bash
# Option A: Via the API (run in Postman or curl)
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@educore.com",
    "password": "Admin@123!",
    "role": "ADMIN",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Or add a seed script. Create `Backend/src/seed.ts`:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  
  await usersService.create({
    email: 'admin@educore.com',
    password: 'Admin@123!',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User',
  });

  await usersService.create({
    email: 'teacher@educore.com',
    password: 'Teacher@123!',
    role: 'TEACHER',
    firstName: 'John',
    lastName: 'Smith',
  });

  await usersService.create({
    email: 'student@educore.com',
    password: 'Student@123!',
    role: 'STUDENT',
    firstName: 'Jane',
    lastName: 'Doe',
  });

  console.log('✅ Seed complete!');
  await app.close();
}

seed();
```

Run it:
```bash
cd Backend
npx ts-node -r tsconfig-paths/register src/seed.ts
```

---

## Step 8 — Start the Application

### Start Backend:
```bash
cd Backend
npm run start:dev
```
- Backend runs at: **http://localhost:3001**
- Swagger API docs: **http://localhost:3001/api/v1/docs**

### Start Frontend:
```bash
cd Frontend
npm run dev
```
- Frontend runs at: **http://localhost:3000**

---

## Step 9 — Verify Everything Works

Open your browser and check each:

| Check | URL | Expected |
|---|---|---|
| Frontend loads | http://localhost:3000 | Landing page |
| Backend health | http://localhost:3001/api/v1 | JSON response |
| Swagger docs | http://localhost:3001/api/v1/docs | API documentation |
| Login works | http://localhost:3000/login | Login with admin@educore.com |
| Notifications | Open app → Bell icon | Dropdown appears |
| File upload | Submit an assignment | Cloudinary URL in response |

---

## Step 10 — Production Deployment (Optional)

### Frontend → Vercel

1. Go to https://vercel.com → New Project → Import your GitHub repo
2. Set **Root Directory** to `Frontend`
3. Add Environment Variables (from `Frontend/.env.local`)
4. Deploy

### Backend → Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Set **Root Directory** to `Backend`
3. Add a **PostgreSQL** plugin (Railway provides one)
4. Add a **Redis** plugin
5. Add all environment variables from `Backend/.env`
6. Set start command: `npm run start:prod`

---

## 🔴 Common Errors & Fixes

| Error | Fix |
|---|---|
| `ECONNREFUSED 5432` | PostgreSQL not running. Start it: `pg_ctl start` |
| `ECONNREFUSED 6379` | Redis not running. Start with Docker: `docker start educore-redis` |
| `Invalid JWT token` | Check JWT_SECRET in `.env` matches on both sign and verify |
| `Cloudinary upload failed` | Check CLOUD_NAME, API_KEY, API_SECRET are correct |
| `SMTP connection refused` | Check MAIL_HOST/PORT. For Gmail use port 587 + TLS |
| `relation does not exist` | TypeORM didn't sync. Set `synchronize: true` in DB config for dev |
| `Cannot find module '@nestjs/bull'` | Run `npm install` in Backend folder again |
| CORS error in browser | Add `FRONTEND_URL=http://localhost:3000` to `.env` |

---

## 📋 Quick Credential Checklist

- [ ] PostgreSQL database created
- [ ] `Backend/.env` file created with all values filled in
- [ ] `Frontend/.env.local` file created
- [ ] Cloudinary account → Cloud Name, API Key, API Secret copied
- [ ] Cloudinary upload presets created (`educore_assignments`, `educore_profiles`)
- [ ] SMTP credentials (Gmail App Password OR Resend API key)
- [ ] Two JWT secrets generated (64-byte hex each)
- [ ] Redis running (local Docker OR Upstash account)
- [ ] Admin user seeded into database
- [ ] Both servers started and verified
