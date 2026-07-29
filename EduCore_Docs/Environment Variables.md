# 🔧 Environment Variables

Related: [[Home]] | [[Backend Architecture]] | [[Deployment Guide]]

---

## Backend (`Backend/.env`)

> Copy `Backend/.env.example` to `Backend/.env` and fill in values. **Never commit `.env` to git.**

### App Settings
| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Controls synchronize, logging, and error stack traces. Set to `production` on Render |
| `APP_PORT` | `3001` | Local dev port. Render overrides with its own `PORT` variable |

### Database
| Variable | Example | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | **Use this on Render/Neon.** Takes priority over individual DB vars |
| `DB_HOST` | `localhost` | Local Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_USERNAME` | `educore_user` | Postgres user |
| `DB_PASSWORD` | `your_password` | Postgres password |
| `DB_NAME` | `educore_db` | Postgres database name |

### JWT
| Variable | Example | Description |
|---|---|---|
| `JWT_SECRET` | `64-byte hex string` | Sign access tokens. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `15m` | Access token lifetime |
| `JWT_REFRESH_SECRET` | `another 64-byte hex string` | Sign refresh tokens. Must be different from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifetime |

### Cloudinary (File Uploads)
| Variable | Where to find |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | [cloudinary.com](https://cloudinary.com) → Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary → Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary → Dashboard |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload → Upload Presets |

### Email / SMTP
| Variable | Example | Description |
|---|---|---|
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server. Also supports Resend (`smtp.resend.com`) or Mailtrap |
| `MAIL_PORT` | `587` | SMTP port (587 = STARTTLS, 465 = SSL) |
| `MAIL_USER` | `you@gmail.com` | SMTP username |
| `MAIL_PASS` | `xxxx xxxx xxxx xxxx` | Gmail: use App Password, not your real password |
| `MAIL_FROM` | `"EduCore LMS" <noreply@educore.com>` | Sender display name and address |

### CORS
| Variable | Default | Description |
|---|---|---|
| `FRONTEND_URL` | `http://localhost:3000` | Whitelisted in CORS policy. Set to your Vercel URL in production |

---

## Frontend (`Frontend/.env.local`)

> Create `Frontend/.env.local` for local dev. Set variables in the Vercel dashboard for production.

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api/v1` | Points the frontend to the backend. Set to your Render URL in production, e.g. `https://your-app.onrender.com/api/v1` |

---

## Render Production Variables Checklist

Set these in **Render → Your Service → Environment**:

- [x] `NODE_ENV=production`
- [x] `DATABASE_URL` ← from your Neon or Render Postgres instance
- [x] `JWT_SECRET`
- [x] `JWT_EXPIRES_IN=15m`
- [x] `JWT_REFRESH_SECRET`
- [x] `JWT_REFRESH_EXPIRES_IN=7d`
- [x] `CLOUDINARY_CLOUD_NAME`
- [x] `CLOUDINARY_API_KEY`
- [x] `CLOUDINARY_API_SECRET`
- [x] `CLOUDINARY_UPLOAD_PRESET`
- [x] `MAIL_HOST`
- [x] `MAIL_PORT`
- [x] `MAIL_USER`
- [x] `MAIL_PASS`
- [x] `MAIL_FROM`
- [x] `FRONTEND_URL` ← your Vercel URL

## Vercel Production Variables Checklist

Set these in **Vercel → Your Project → Settings → Environment Variables**:

- [x] `NEXT_PUBLIC_API_URL` ← your Render backend URL + `/api/v1`
