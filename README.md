IA03 – React Authentication with JWT (Access + Refresh)

Full-stack app implementing secure authentication using:
- Backend: NestJS + JWT + Mongoose (MongoDB)
- Frontend: React + Vite + Tailwind CSS, React Router, React Query, React Hook Form + Zod

## Features
- Access token (in-memory) + Refresh token (localStorage)
- Axios instance attaches access token and auto-refreshes on 401
- React Query for login/logout mutations and fetching protected user data
- React Hook Form + Zod for form validation
- Protected routes with automatic redirect to Login
- Ready for deployment on Netlify/Vercel (set `VITE_API_URL`)

---

## Prerequisites
- Node.js LTS (>= 18)
- MongoDB running locally or a connection string (MongoDB Atlas works too)

---

## Backend (NestJS)

Location: `Backend/`

1) Configure environment variables

Copy `.env.example` to `.env` and adjust values:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ia03
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=dev_access_secret_change_me
JWT_REFRESH_SECRET=dev_refresh_secret_change_me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

2) Install and run

```
cd Backend
npm install
npm run dev
```

The API will listen on `http://localhost:3000`.

Endpoints:
- `POST /user/register` { email, password } → `{ message: string }`
- `POST /auth/login` { email, password } → `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` { refreshToken } → `{ accessToken }`
- `GET /auth/me` Authorization: `Bearer <accessToken>` → `{ id, email }`

---

## Frontend (React + Vite)

Location: `Frontend/`

1) Configure environment variables

Copy `.env.example` to `.env` and adjust values to point to the backend URL:

```
VITE_API_URL=http://localhost:3000
```

2) Install and run

```
cd Frontend
npm install
npm run dev
```

Open the app at the URL printed by Vite (usually `http://localhost:5173`).

Pages:
- `/` Home (public)
- `/register` Sign Up (calls backend)
- `/login` Login (calls backend)
- `/dashboard` Protected – shows user info, requires valid access token (auto-refresh supported)

Auth flow (client):
- On login success, store `accessToken` in memory and `refreshToken` in `localStorage`.
- Axios attaches `Authorization: Bearer <accessToken>` to every request.
- If a request returns 401, Axios tries to refresh using the stored refresh token and then retries.
- On logout or refresh failure, tokens are cleared and the app redirects to `/login`.

---

## Deployment (quick suggestions)

- Backend (NestJS):
	- Render.com → create a Web Service from `Backend/`, set build command `npm ci && npm run build` and start command `npm run start`. Add `MONGODB_URI`, `PORT`, and `CORS_ORIGIN` env vars.
	- Railway or Fly.io are also good options.

- Database:
	- MongoDB Atlas (free tier). Use the connection string in `MONGODB_URI` (remember to whitelist server IPs).

- Frontend (React):
	- Netlify / Vercel → set `VITE_API_URL` as an environment variable pointing to the deployed backend.
	- Build command: `npm ci && npm run build` ; Publish directory: `dist`.

---

## Public demo URL
Deploy the app and paste your public URL here:

Deploy URL: https://ia03-fe-45p9.onrender.com

---

## Notes
- Passwords are hashed with bcrypt before storing.
- Validation uses `class-validator` on the backend and `zod` on the frontend.

---

## Troubleshooting
- If CORS issues appear, verify `CORS_ORIGIN` (backend) matches your frontend URL (e.g., `http://localhost:5173`).
- Ensure MongoDB is running and accessible by the backend.
- On Linux, make sure ports 3000 (backend) and 5173 (frontend) are not blocked by firewall.
