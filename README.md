# Teachify Web

Next.js frontend for Teachify (Teacher, Student, and Admin experiences).

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- ESLint (Next.js config)

## Quick Start
```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts
- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - serve production build
- `npm run lint` - lint codebase
- `npm run typecheck` - TypeScript type-check

## Environment
Create `.env.local` for local development.

Common variables:
- `NEXT_PUBLIC_API_BASE_URL` - REST API base URL
- `LARAVEL_BACKEND_URL` - backend origin for Next.js rewrites
- `AI_PROVIDER`
- `AI_BASE_URL`
- `AI_MODEL`
- `AI_API_KEY`

Do not commit `.env*` files with real secrets.

## Project Structure
```txt
app/          # route segments, pages, layouts, API route handlers
components/   # reusable UI and domain components
lib/          # shared utilities, API client, auth/session helpers
public/       # static assets
```

Domain organization pattern:
- `components/teacher/*`, `components/student/*`, `components/admin/*`
- `app/teacher/*`, `app/student/*`, `app/admin/*`

## Current Conventions
- Prefer absolute imports via `@/*`.
- Keep side effects in page/container components; keep presentational components mostly pure.
- Keep API calls in `lib/api/client.ts` (or split by domain as it grows).
- Prefer typed payloads/responses over untyped objects.
- Run `npm run lint` and `npm run typecheck` before pushing.

## Best-Practice Notes (Current Repo)
- Some files are large and should be incrementally split:
  - `app/teacher/generate/page.tsx`
  - `lib/api/client.ts`
  - `components/teacher/generate/file-upload-workspace.tsx`
- Quiz data is currently local-storage based while classes/lessons use backend APIs. Long-term, moving quizzes to backend persistence will improve reliability across devices/sessions.
