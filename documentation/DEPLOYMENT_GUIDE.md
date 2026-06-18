# Deployment Guide

Deploy Queen's Banquet as **Vercel (frontend)** + **Render (backend + PostgreSQL)**.

Repository files included for deployment:

| File | Purpose |
|------|---------|
| `Dockerfile` | PHP 8.2 + Apache + PostgreSQL PDO for Render |
| `docker/apache-entrypoint.sh` | Binds Apache to Render's `PORT` |
| `.dockerignore` | Keeps Docker image lean |
| `render.yaml` | Blueprint: API web service + PostgreSQL database |
| `database/queens_banquet.sql` | PostgreSQL schema + seed data |
| `frontend/vercel.json` | Vite build settings for Vercel |
| `frontend/.env.example` | Frontend env var template |

---

## Architecture

```text
Vercel (React)  ──HTTPS──►  Render Web Service (PHP API)
                                    │
                                    ▼
                            Render PostgreSQL
                                    │
                              DATABASE_URL (auto-wired)
```

---

## Phase 1 — Deploy backend + database on Render

### Option A: Blueprint (recommended)

1. Push this repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Blueprint**.
3. Connect the `queens-banquet-events` repository.
4. Render creates:
   - **queens-banquet-db** — PostgreSQL database
   - **queens-banquet-api** — Docker web service
5. `DATABASE_URL` and `JWT_SECRET` are wired automatically from `render.yaml`.
6. Wait for both services to finish deploying.
7. Copy the API URL, e.g. `https://queens-banquet-api.onrender.com`.

### Option B: Manual setup

1. **New +** → **PostgreSQL** → name it `queens-banquet-db`, database `queens_banquet`.
2. **New +** → **Web Service** → repo → Runtime: **Docker**.
3. Add environment variable `DATABASE_URL` from the database **Internal Connection String**.
4. Add `JWT_SECRET` (generate a long random string).
5. Deploy and copy the service URL.

### Import the schema

After the PostgreSQL database is created, run the schema once.

**From Render Dashboard (easiest):**

1. Open **queens-banquet-db** → **Connect** tab.
2. Copy the **PSQL Command** (external) and run it in your terminal, or use the **Web Shell** if available.
3. Paste and run the contents of `database/queens_banquet.sql`.

**Using psql locally:**

```bash
psql "postgresql://USER:PASSWORD@HOST/queens_banquet?sslmode=require" -f database/queens_banquet.sql
```

Use the **External Database URL** from Render → Database → Connect.

Default seeded accounts (included in the schema):

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `queensbanquet@gmail.com` | `QueensAdmin2026!` |
| Client | `client@queensbanquetevents.ph` | `ClientDemo2026!` |

Change these after first login in production.

### Verify API

```bash
curl https://queens-banquet-api.onrender.com
```

Expected:

```json
{"message":"Queen's Banquet Digital Invitation Management System API","version":"1.0.0","status":"running"}
```

---

## Phase 2 — Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **General**.
2. Confirm:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

3. **Settings** → **Environment Variables** → add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://queens-banquet-api.onrender.com` |

Use your actual Render URL with **no trailing slash**.

4. **Deployments** → **Redeploy** (Vite bakes env vars at build time).

---

## Phase 3 — End-to-end test

1. Open your Vercel URL and log in as admin.
2. Confirm dashboard data loads (Network tab → requests to your Render URL).
3. Create or publish an invitation and open the public link.
4. Test a file upload (gallery or profile photo).

---

## How to access and inspect PostgreSQL

### On Render (production database)

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **queens-banquet-db** (your PostgreSQL instance).
3. Open the **Connect** tab. You will see:
   - **Internal Database URL** — used by the API on Render (already set as `DATABASE_URL`)
   - **External Database URL** — use this from your computer
   - **PSQL Command** — copy-paste into terminal to open an interactive shell

Example using the PSQL command Render provides:

```bash
psql postgresql://queens_banquet:PASSWORD@dpg-xxxxx-a.singapore-postgres.render.com/queens_banquet
```

Useful commands once connected:

```sql
\dt                          -- list all tables
SELECT * FROM users;         -- view users
SELECT * FROM events;         -- view events
SELECT COUNT(*) FROM rsvps;   -- count RSVPs
\q                           -- quit
```

### GUI tools (connect from your PC)

Use the **External Database URL** from Render with any of these:

| Tool | Download |
|------|----------|
| [pgAdmin](https://www.pgadmin.org/download/) | Free, full-featured |
| [DBeaver](https://dbeaver.io/download/) | Free, works with many DBs |
| [TablePlus](https://tableplus.com/) | Clean UI (free tier available) |
| [Beekeeper Studio](https://www.beekeeperstudio.io/) | Free, simple |

Connection settings:

| Field | Value |
|-------|-------|
| Host | From External URL (e.g. `dpg-xxxxx-a.singapore-postgres.render.com`) |
| Port | `5432` |
| Database | `queens_banquet` |
| Username | `queens_banquet` |
| Password | From Render Connect tab |
| SSL | **Required** (enable SSL / `sslmode=require`) |

### Local PostgreSQL (development)

Install PostgreSQL locally, then:

```bash
createdb queens_banquet
psql queens_banquet -f database/queens_banquet.sql
```

Set local env vars (or use defaults in `backend/config/database.php`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=queens_banquet
DB_USER=postgres
DB_PASS=your_local_password
```

---

## Environment variables reference

### Vercel

```env
VITE_API_URL=https://queens-banquet-api.onrender.com
```

### Render (auto-set by Blueprint)

```env
DATABASE_URL=postgresql://...   # wired from queens-banquet-db
JWT_SECRET=auto-generated
```

### Local backend (optional fallback if DATABASE_URL is not set)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=queens_banquet
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=local-dev-secret
```

---

## Production notes

### File uploads

Uploads are stored in `backend/uploads/`. On Render's free tier the filesystem is **ephemeral** — files are lost on redeploy or restart. For production, use a Render Persistent Disk (paid) or cloud storage (S3, Cloudinary).

### Free tier cold starts

Render free services spin down after ~15 minutes of inactivity. The first request may take 30–60 seconds.

### Auto-deploy

Both Vercel and Render redeploy on push to `main` when connected to GitHub.

---

## Local development

```bash
# Database
createdb queens_banquet
psql queens_banquet -f database/queens_banquet.sql

# Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev

# Backend
cd backend
php -S localhost:8000
```

---

## Deployment order

```text
1. Push repo to GitHub
2. Render Blueprint  →  creates API + PostgreSQL
3. Import database/queens_banquet.sql into PostgreSQL
4. Verify API health endpoint
5. Set Vercel VITE_API_URL  →  redeploy frontend
6. Test login + invitations
7. Change default passwords
```
