# 🚀 Deployment Guide

Related: [[Home]] | [[Environment Variables]] | [[Backend Architecture]] | [[Frontend Architecture]]

---

## Architecture

```
Internet
   │
   ├── Vercel (Frontend — Next.js)
   │     └── NEXT_PUBLIC_API_URL → Render URL
   │
   └── Render (Backend — NestJS)
         └── DATABASE_URL → Neon PostgreSQL
```

---

## Frontend: Vercel

### Auto-Detection
Vercel automatically detects Next.js. No special framework settings needed.

### Build Settings (defaults work)
| Setting | Value |
|---|---|
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### Required Environment Variables
Set in **Vercel → Project → Settings → Environment Variables**:
```
NEXT_PUBLIC_API_URL = https://your-render-app.onrender.com/api/v1
```

### Important Config Note
`output: 'standalone'` in `next.config.ts` is **commented out** (QA fix M-02). Do NOT re-enable it for Vercel — it is only for self-hosted Docker deployments.

### Deploy Steps
1. Push to `main` branch on GitHub
2. Vercel picks up the commit automatically and rebuilds
3. Check the deployment log in Vercel dashboard
4. Visit your Vercel URL to verify

---

## Backend: Render

### Service Type
**Web Service** (not Background Worker or Cron Job)

### Build & Start Commands
| | Command |
|---|---|
| **Build** | `npm install && npm run build` |
| **Start** | `npm run start:prod` |

### Runtime
- **Node.js** — use the version matching `.nvmrc` or default to latest LTS

### Critical Config
| Setting | Why |
|---|---|
| App binds to `0.0.0.0` | Required — Render won't expose the service if bound to `127.0.0.1` |
| App reads `PORT` env var | Render dynamically assigns the port |
| `NODE_ENV=production` | Disables TypeORM auto-sync, hides error stacks |

### Infrastructure as Code (`render.yaml`)
The repo contains a `render.yaml` at the root which defines the web service automatically when you connect the repo to Render.

### Required Environment Variables on Render
See [[Environment Variables]] for the full checklist.

### Health Check
Render pings `GET /api/v1/health` to determine if the service is alive.  
Response: `{ "status": "ok", "timestamp": "2026-07-28T..." }`

### Deploy Steps
1. Push to `main` on GitHub
2. Render auto-deploys from GitHub
3. Watch the deployment log in Render dashboard
4. If healthy, the service shows "Live" status

---

## Database: Neon (Recommended Free Postgres)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **Connection String** (starts with `postgresql://...?sslmode=require`)
3. Paste it as `DATABASE_URL` in Render's env vars
4. On first deploy, TypeORM will auto-create tables (because `synchronize` is `false` in production)

> **Note:** For initial table creation in production, either:
> - Run `synchronize: true` once, then revert (risky)
> - Or use TypeORM migrations: `npm run migration:run`

---

## Common Deployment Failures

| Error | Cause | Fix |
|---|---|---|
| `ECONNREFUSED` on startup | No `DATABASE_URL` set | Add the Neon connection string to Render env |
| `MODULE_NOT_FOUND: dist/main.js` | Rogue `.ts` files in Backend root caused wrong dist structure | Remove orphaned scripts from root (already fixed) |
| `Cannot find module '@nestjs/bull'` | BullModule removed but mail module still imported it | Deleted `mail.processor.ts` and updated `MailModule` (already fixed) |
| App crashes immediately | `PORT` not read or binding to `127.0.0.1` | `main.ts` now reads `PORT` and binds to `0.0.0.0` (already fixed) |
| Vercel build error: peer dependency | `recharts` incompatible with React 19 | Use `--legacy-peer-deps` flag or downgrade recharts |
