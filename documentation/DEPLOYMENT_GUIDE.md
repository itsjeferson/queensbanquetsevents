# Deployment Guide

## Frontend

1. Set `VITE_API_URL` in `frontend/.env` to production API URL
2. Build: `npm run build`
3. Deploy `frontend/dist/` to static hosting (Netlify, Vercel, Nginx)

## Backend

1. Upload `backend/` to PHP-enabled server (Apache/Nginx)
2. Configure `.env` or server environment variables:
   - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`
   - `JWT_SECRET`
3. Ensure `uploads/` directories are writable
4. Import `database/queens_banquet.sql`

## Apache

Enable `mod_rewrite` and point DocumentRoot to `backend/`.

## Nginx

Proxy `/api` to PHP-FPM and serve React static files separately.
