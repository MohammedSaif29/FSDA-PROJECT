# EduVault Frontend

Vite + React frontend prepared for Vercel deployment.

## Run locally

1. Copy `.env.example` to `.env`
2. Point `VITE_API_BASE_URL` to your backend `/api` URL
3. Run `npm install`
4. Run `npm run dev`

## Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set these Vercel variables:

- `VITE_API_BASE_URL=https://your-backend.up.railway.app/api`
- `VITE_BACKEND_ORIGIN=https://your-backend.up.railway.app`
- `VITE_AUTH_API_URL=https://your-backend.up.railway.app/api/auth`
- `VITE_RECAPTCHA_SITE_KEY` if reCAPTCHA is enabled

Google OAuth callbacks on the backend should use the deployed frontend URLs for login and auth callback routes.
