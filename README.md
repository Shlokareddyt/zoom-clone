# Zoom Clone

A full-stack Zoom Clone web application built with **Next.js 14** (frontend) and **FastAPI** (backend). Closely mirrors the adrianhajdin zoom-clone UI — dark navy theme, glassmorphism cards, meeting lifecycle management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Python 3.11+, FastAPI, SQLAlchemy (async), Pydantic v2 |
| Database (local) | SQLite via aiosqlite |
| Database (prod) | PostgreSQL via asyncpg |
| HTTP Client | Axios |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

The backend seeds the database automatically on first start (3 upcoming + 3 past + 1 active meeting).

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # or create manually
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`.env`)

```
DATABASE_URL=sqlite+aiosqlite:///./zoom_clone.db
FRONTEND_URL=http://localhost:3000
APP_BASE_URL=http://localhost:8000
```

For production, swap `DATABASE_URL` to:
```
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname
```

---

## Database Schema

```
meetings
  id           TEXT PK         -- "abc-1234-xyz" (Zoom-style)
  title        TEXT NOT NULL
  description  TEXT
  host_name    TEXT NOT NULL    -- defaults to "Default User"
  status       TEXT             -- 'scheduled' | 'active' | 'ended'
  meeting_type TEXT             -- 'instant' | 'scheduled'
  invite_link  TEXT UNIQUE
  scheduled_at DATETIME
  duration_min INTEGER
  started_at   DATETIME
  ended_at     DATETIME
  created_at   DATETIME

participants
  id           INTEGER PK AUTOINCREMENT
  meeting_id   TEXT FK → meetings(id) CASCADE
  display_name TEXT NOT NULL
  joined_at    DATETIME
  left_at      DATETIME
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/meetings` | List all meetings (`?type=upcoming\|previous`) |
| POST | `/meetings` | Create meeting |
| GET | `/meetings/{id}` | Get meeting by ID |
| POST | `/meetings/{id}/join` | Join meeting |
| POST | `/meetings/{id}/end` | End meeting |
| GET | `/meetings/by-link/{token}` | Resolve invite link |
| GET | `/meetings/{id}/participants` | List active participants |
| DELETE | `/meetings/{id}/participants/{pid}` | Remove participant |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Assumptions

- **No real video/WebRTC**: The meeting room page is a UI shell with a mocked participant grid and controls.
- **Default user**: No authentication — all meetings use "Default User" as the host.
- **SQLite locally, PostgreSQL in production**: Only the `DATABASE_URL` environment variable needs to change.
- **No email/notifications**: Invite links are copy-paste only.

---

## Deployment

| Service | URL |
|---|---|
| Frontend (Vercel) | _Add after deploy_ |
| Backend (Render/Railway) | _Add after deploy_ |
