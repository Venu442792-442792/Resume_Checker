# ResumeMatch — Frontend

React (Vite) + Tailwind CSS dashboard for the AI Resume Screening System.

## Prerequisites
- Node.js 18+ and npm

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend isn't running on the default URL:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Run (development)

```bash
npm run dev
```

App runs at **http://localhost:5173**.

> The backend (Spring Boot, port 8080) must be running for login, upload, and matching to work — the frontend is a pure API client with no data of its own.

## Build (production)

```bash
npm run build
npm run preview   # serve the production build locally
```

## What's inside

- `src/context/AuthContext.jsx` — holds the logged-in user + JWT in memory/localStorage
- `src/api/axiosClient.js` — single Axios instance; attaches the JWT to every request, force-logs-out on 401
- `src/services/*` — one file per backend resource (auth, jobs, resumes, applications) — the only places that know API routes
- `src/components/ui/*` — Button, Card, Badge, Loader, and the **ScoreGauge** (the circular match-percentage dial)
- `src/components/shared/SkillChip.jsx` — matched (teal, filled) / missing (red, dashed) / neutral skill tags
- `src/components/shared/ProtectedRoute.jsx` — route guard for auth + role (`ADMIN` / `CANDIDATE`)
- `src/pages/candidate/` — Upload & Apply flow, My Applications history
- `src/pages/admin/` — Create Job, Job List, Applicants ranking table, Applicant detail

## Design tokens

| Token | Value | Use |
|---|---|---|
| `paper` | `#F5F6F3` | page background |
| `indigo` | `#2A2F6B` | brand / primary actions |
| `teal` | `#0E7C6B` | strong match / matched skill |
| `amber` | `#C77D22` | partial match |
| `crimson` | `#B23A3A` | weak match / missing skill |
| Display font | Fraunces | page titles only |
| Body font | Inter | everything else |
| Mono font | IBM Plex Mono | scores, percentages |
