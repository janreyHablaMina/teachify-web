# Teachify Project Handoff (Web + API)

## 1) What This Project Is
Teachify is a role-based learning platform with three user experiences:
- Teacher: create lessons/quizzes, manage classrooms, assign work, monitor notifications.
- Student: join classrooms, take assigned quizzes, submit answers.
- Admin: manage users and access admin dashboards/pages.

The project is split into two repositories/services:
- Frontend: `teachify-web` (Next.js 16, React 19, TypeScript)
- Backend: `teachify-api` (Laravel API + Sanctum auth + PostgreSQL)

## 2) Current Local URLs
- Web: `http://localhost:3000`
- API: `http://localhost:8000`

## 3) Tech Stack
### Frontend (`teachify-web`)
- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Fetch-based API client in `lib/api/client.ts`

### Backend (`teachify-api`)
- Laravel
- Laravel Sanctum (token auth)
- PostgreSQL
- REST API under `/api/*`

## 4) Main Features
### Teacher Features
- Register/login and profile management
- Generate summaries and quizzes (including file-upload based quiz generation)
- Manage quizzes (create/list/view/delete/duplicate/export)
- Manage classrooms (create/update/delete)
- Invite/join flow with join code and student approval/rejection/status
- Create and view assignments
- View and manage notifications

### Student Features
- Register/login
- Student invite registration flow (`/student/register`)
- Join class by code
- View classes and assignments
- Open assigned quiz and submit answers

### Admin Features
- User management endpoints
- Admin dashboard pages (`/admin/*`) for users, subscriptions, revenue, system, etc.

## 5) Important Frontend Routes
- Public/Auth: `/`, `/login`, `/register`, `/forgot-password`
- Teacher: `/teacher`, `/teacher/generate`, `/teacher/lessons`, `/teacher/quizzes`, `/teacher/classes`, `/teacher/profile`, `/teacher/notifications`
- Student: `/student`, `/student/register`, `/student/classes`, `/student/quizzes`
- Admin: `/admin`, `/admin/users`, `/admin/subscriptions`, `/admin/revenue`, `/admin/system`, etc.

## 6) Important API Endpoints
### Auth
- `POST /api/register`
- `POST /api/register-student`
- `POST /api/login`
- `POST /api/logout` (auth required)
- `GET /api/me` (auth required)

### Teacher/Classroom/Quiz/Assignment
- `GET|POST /api/summaries`, `DELETE /api/summaries/{id}`
- `POST /api/summaries/generate`
- `POST /api/generation-usage/consume`
- `GET|POST /api/quizzes`, `GET|DELETE /api/quizzes/{id}`
- `POST /api/quizzes/{id}/duplicate`
- `POST /api/quizzes/generate-from-upload`
- `GET|POST /api/classrooms`, `GET|PUT|DELETE /api/classrooms/{id}`
- `POST /api/classrooms/join-by-code`
- `POST /api/classrooms/{id}/students/{student}/approve|reject`
- `PATCH /api/classrooms/{id}/students/{student}/status`
- `GET|POST /api/assignments`, `GET /api/assignments/{id}`
- `POST /api/assignments/{id}/submit`

### Profile/Notifications
- `PUT /api/profile`
- `POST /api/profile/avatar`
- `PUT /api/profile/password`
- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/{id}/read`
- `DELETE /api/notifications/{id}`

### Admin
- `GET /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`

## 7) Database (PostgreSQL)
Current key tables/migrations indicate these entities:
- users (roles, plans, advanced settings)
- personal_access_tokens
- summaries
- quizzes
- questions
- classrooms
- classroom_student (join/status flow)
- assignments/submissions related flow
- teacher_notifications

## 8) Local Run Guide (No Docker)
### API
1. Go to API repo:
   - `cd C:\Users\AMD\Workspace\Teachify\teachify-api`
2. Ensure `.env` has PostgreSQL settings:
   - `DB_CONNECTION=pgsql`
   - `DB_HOST=127.0.0.1`
   - `DB_PORT=5432`
   - `DB_DATABASE=teachify_db`
   - `DB_USERNAME=postgres`
   - `DB_PASSWORD=janreyMina17!`
3. Run migrations if needed:
   - `php artisan migrate`
4. Start API:
   - `php artisan serve`

### Web
1. Go to web repo:
   - `cd C:\Users\AMD\Workspace\Teachify\teachify-web`
2. Ensure `.env.local` has:
   - `LARAVEL_BACKEND_URL=http://localhost:8000`
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
3. Start web:
   - `npm run dev`

## 9) Critical Config Note
In frontend, `lib/api/client.ts` already appends `/api` to requests.
So `NEXT_PUBLIC_API_BASE_URL` must be:
- `http://localhost:8000`
Not:
- `http://localhost:8000/api`

Otherwise routes become duplicated like `/api/api/register`.

## 10) Known Gotchas
- If Next.js says lock file is in use, stop old Node processes and clear `.next/dev/lock`.
- If CORS errors occur, verify API `.env`:
  - `FRONTEND_URL=http://localhost:3000`
  - `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- AI features require a valid `AI_API_KEY` in both projects.

## 11) Suggested Next Handoff Items
- Add seeded demo accounts for teacher/student/admin.
- Add a Postman/Insomnia collection for top API flows.
- Add a one-click start script for both services.
