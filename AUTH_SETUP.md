# EduVault Auth Setup

## Stack
- Frontend: React + Vite + Tailwind CSS
- Auth backend: Node.js + Express
- Database: MongoDB + Mongoose

## Backend setup
1. Copy `server/.env.example` to `server/.env`.
2. Fill in MongoDB, SMTP, Google OAuth, JWT, session, and reCAPTCHA values.
3. Install packages in `server/`:
   `npm install`
4. Start the auth service:
   `npm run dev --prefix server`

## Frontend setup
1. Copy `frontend/.env.example` to `frontend/.env`.
2. Adjust `VITE_AUTH_BACKEND_ORIGIN` and `VITE_BACKEND_ORIGIN` if your ports differ.
3. Install packages in `frontend/` if needed:
   `npm install`
4. Start the frontend:
   `npm run dev --prefix frontend`

## Required providers
- MongoDB instance for auth persistence and session storage
- SMTP credentials for verification and password reset emails
- Google OAuth web application credentials
- Google reCAPTCHA site key and secret key

## Main auth endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Notes
- Public registrations are created as `STUDENT` by default.
- Emails listed in `ADMIN_EMAILS` are promoted to `ADMIN`.
- Refresh tokens are stored in HTTP-only cookies.
- Access tokens are returned to the frontend and refreshed automatically.
