# 🖥️ Local Development Setup

Related: [[Home]] | [[Environment Variables]] | [[Backend Architecture]] | [[Frontend Architecture]]

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | `>=20` | [nodejs.org](https://nodejs.org) |
| npm | `>=9` | Bundled with Node |
| PostgreSQL | `>=14` | [postgresql.org](https://www.postgresql.org) or use Docker |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## 1. Clone the Repo

```bash
git clone https://github.com/abdulhadi-js/Lms.git
cd Lms
```

---

## 2. Setup the Backend

```bash
cd Backend

# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env
# Open .env and set: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.

# Start in development mode (hot reload)
npm run start:dev
```

> Backend will be running at: `http://localhost:3001/api/v1`  
> Swagger docs at: `http://localhost:3001/api/docs`

### Seed the Database (first time only)

```bash
# From the Backend directory
npx ts-node src/seed.ts
```

This creates:
- `admin@educore.com` / `Admin@123!`
- `teacher@educore.com` / `Teacher@123!`
- `student@educore.com` / `Student@123!`

---

## 3. Setup the Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

# Start development server
npm run dev
```

> Frontend will be running at: `http://localhost:3000`

---

## 4. Run Both Together

Open **two terminals** side by side:

**Terminal 1 — Backend:**
```bash
cd Backend && npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd Frontend && npm run dev
```

Then open `http://localhost:3000` and log in with any of the seeded accounts.

---

## Available npm Scripts

### Backend
| Script | Command | Description |
|---|---|---|
| `start:dev` | `nest start --watch` | Dev mode with hot-reload |
| `build` | `nest build` | Compile TypeScript to `dist/` |
| `start:prod` | `node dist/main` | Production mode |
| `test` | `jest` | Run unit tests |
| `test:e2e` | `jest --config e2e/jest-e2e.json` | Run end-to-end tests |
| `lint` | `eslint "{src,apps}/**/*.ts"` | Lint the source |

### Frontend
| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start dev server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Lint the source |
| `test:e2e` | `playwright test` | Run Playwright E2E tests |

---

## Local Database with Docker (Optional)

If you don't have PostgreSQL installed locally:

```bash
docker run --name educore-db \
  -e POSTGRES_USER=educore_user \
  -e POSTGRES_PASSWORD=educore_pass \
  -e POSTGRES_DB=educore_db \
  -p 5432:5432 \
  -d postgres:16
```

Then set your `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=educore_user
DB_PASSWORD=educore_pass
DB_NAME=educore_db
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `ECONNREFUSED` on port 5432 | PostgreSQL is not running. Start it or use Docker |
| TypeORM schema not updating | In dev, `synchronize: true` auto-updates. If stuck, drop and recreate the database |
| `Cannot find module` in Backend | Run `npm run build` to recompile, or restart `npm run start:dev` |
| Frontend 401 errors on every call | Check that `NEXT_PUBLIC_API_URL` is set correctly in `.env.local` |
| Port 3001 already in use | Change `APP_PORT` in Backend `.env` and update `NEXT_PUBLIC_API_URL` accordingly |
