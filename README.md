# ProjectFlow AI

An AI-powered academic project management platform with real-time collaboration, document reviews, performance analytics, and role-based access control.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Socket.io-client |
| Backend | Node.js, Express, TypeScript, MongoDB (Mongoose) |
| Auth | JWT (access + refresh tokens), Google OAuth 2.0 |
| Realtime | Socket.io |
| AI | Simulated AI service (subtask suggestions, document analysis, performance insights) |

## Roles

| Role | Description |
|------|-------------|
| `member` | Regular team member – creates/completes tasks, uploads documents |
| `team_leader` | Leads a project – all member actions + manages team |
| `guide` | Supervisor – reviews and scores documents |
| `panel_member` | External reviewer – creates/manages review slots |

## Quick Start (Docker)

```bash
# Clone the repo
git clone <repo-url> && cd project-ai

# Start all services (MongoDB + backend + frontend)
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

## Manual Setup

### Prerequisites

- Node.js 18+
- MongoDB 7 running locally on port 27017

### Backend

```bash
cd backend
cp .env.example .env          # edit JWT_SECRET and JWT_REFRESH_SECRET
npm install
npm run dev                   # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # adjust if your backend runs on a different port
npm install
npm run dev                        # starts on http://localhost:3000
```

## Project Structure

```
project-ai/
├── backend/
│   ├── src/
│   │   ├── config/        # database, env, socket setup
│   │   ├── controllers/   # request handlers
│   │   ├── middleware/    # auth, RBAC, validation, error handling
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routers
│   │   ├── services/      # business logic + AI service
│   │   └── utils/         # JWT helpers, validators
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable UI + feature components
│   │   ├── context/       # Auth, Theme, Socket contexts
│   │   ├── hooks/         # useProjects, useTasks, etc.
│   │   ├── services/      # Axios API wrappers
│   │   ├── types/         # Shared TypeScript interfaces
│   │   └── utils/         # helpers, validators, constants
│   └── Dockerfile
└── docker-compose.yml
```

## Key Features

- **Projects** – Create and manage projects with status tracking and member invitations
- **Tasks** – Kanban board + list view with priority levels and AI subtask suggestions
- **Documents** – Upload, version, and review documents with AI scoring
- **Performance** – Points system, leaderboard, and AI-generated insights
- **Reviews** – Panel members create review slots; team members book them
- **Notifications** – Real-time updates via Socket.io
- **Dark mode** – Full dark/light theme toggle

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/projects` | List projects |
| POST | `/projects` | Create a project |
| GET | `/tasks` | List tasks (optionally by project) |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id/complete` | Mark task as completed |
| POST | `/documents/upload` | Upload a document |
| PATCH | `/documents/:id/accept` | Accept a document (guide/panel) |
| GET | `/performance/metrics` | Get user performance metrics |
| GET | `/performance/leaderboard` | Get leaderboard |
| GET | `/reviews` | List review slots |
| POST | `/reviews` | Create a review slot (panel_member) |
| POST | `/reviews/:id/book` | Book a review slot |
| GET | `/health` | Health check |
