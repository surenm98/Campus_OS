# Campus OS

> An AI-powered campus platform that brings student progress, wellbeing, safety, and role-based coordination into one experience.

Campus OS is a full-stack web application for campus communities. It provides secure accounts and tailored dashboards for students, faculty, parents, security teams, and administrators, with AI-assisted insights and campus safety tools.

## Live demo

The frontend is deployed on Railway: [frontend-production-0039.up.railway.app](https://frontend-production-0039.up.railway.app/)

## Highlights

- Secure registration and sign-in with JWT authentication and hashed passwords
- Role-based access for students, faculty, parents, security personnel, and administrators
- Student academic snapshot, attendance, CGPA, and wellbeing tools
- Faculty class console and student intelligence features
- Parent academic overview and support features
- Security command center, safety alerts, night-walk tools, and 3D campus visualisation
- Admin user management and operational dashboards
- AI-assisted analysis powered by Gemini and Groq

## What makes Campus OS different

Campus OS combines workflows that are usually scattered across separate academic, wellbeing, parent-communication, and safety systems. Rather than showing every user the same portal, it delivers focused, role-specific views while preserving a shared picture of campus operations:

- **Student-first support:** Academic performance, attendance, wellbeing signals, and AI assistance are presented together so students can act on their progress early.
- **Connected stakeholders:** Faculty and parents can view the information relevant to supporting a student without navigating a generic one-size-fits-all dashboard.
- **Safety built into the platform:** The security experience includes alerts, incident triage, guard deployment, night-walk support, and a 3D campus heatmap—not an afterthought bolted onto an academic portal.
- **Actionable administration:** Administrators can manage users, review attendance and wellbeing trends, and coordinate emergency broadcasts from one operational view.
- **AI with a practical purpose:** Gemini and Groq integrations support guided analysis and chat-based help, complementing the platform's structured dashboard data.

## Architecture

```text
React + Vite frontend
        |
        v
Express REST API ───── MySQL database
        |
        ├── Gemini AI
        └── Groq AI chat service
```

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS |
| UI and data visualisation | Framer Motion, Lucide, Recharts |
| 3D experience | Three.js, React Three Fiber, Drei |
| Backend | Node.js, Express |
| Database | MySQL, Sequelize |
| Security | JSON Web Tokens, bcryptjs, CORS |
| AI | Google Gemini, Groq |

## Project structure

```text
Campus_OS/
├── frontend-app/          # React/Vite client application
│   ├── src/components/    # Shared and role-specific UI components
│   ├── src/pages/         # Login and dashboard pages
│   └── src/utils/         # Authentication, API, and AI helpers
└── backend/               # Express API and AI services
    ├── src/controllers/   # Authentication, dashboard, admin, and AI logic
    ├── src/models/        # Sequelize models
    ├── src/routes/        # REST API routes
    └── src/services/      # Gemini and Groq integrations
```

## Run locally

### Prerequisites

- Node.js 18 or later
- MySQL 8 or later
- A Gemini and/or Groq API key for AI features

### 1. Configure the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set the database credentials, `JWT_SECRET`, and optional AI keys in `backend/.env`.

### 2. Configure and start the frontend

```bash
cd frontend-app
cp .env.example .env
npm install
npm run dev
```

The frontend is available at `http://localhost:5173` and the main API runs at `http://localhost:5000` by default.

### 3. Optional: start the standalone AI chat service

```bash
cd backend
node server.js
```

This service runs on port `3001` by default. Set `VITE_AI_API_URL` in `frontend-app/.env` to its `/api/ai/chat` endpoint.

## Environment variables

### `backend/.env`

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=campusbridge
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=5000
JWT_SECRET=use_a_long_random_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=
GEMINI_API_KEY=
```

### `frontend-app/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_API_URL=http://localhost:3001/api/ai/chat
```

Never commit `.env` files or provider keys. Use the included `.env.example` files as templates.

## API endpoints

| Area | Base path |
| --- | --- |
| Authentication | `/api/auth` |
| Dashboards | `/api/dashboard` |
| Administration | `/api/admin` |
| AI analysis | `/api/ai` |

## Deployment

Deploy the React app as a static site, the main API and AI chat service as Node web services, and use a managed MySQL database. In production, configure:

```env
# Frontend
VITE_API_URL=https://your-api-domain/api
VITE_AI_API_URL=https://your-ai-domain/api/ai/chat

# Main API
CLIENT_URL=https://your-frontend-domain
```

### Railway frontend

The current frontend deployment is available at `https://frontend-production-0039.up.railway.app/`.

When deploying a new frontend build, set `VITE_API_URL` and (if the AI chat service is deployed separately) `VITE_AI_API_URL` in Railway before building. On the backend, set `CLIENT_URL` to the Railway frontend URL so browser requests are accepted by CORS. Do not add database credentials, JWT secrets, or AI-provider keys to the repository; store them as Railway service variables instead.

### Suggested production services

| Service | Responsibility |
| --- | --- |
| Railway static frontend | React/Vite client application |
| Node API service | Authentication, dashboard, admin, and AI-analysis API routes |
| AI chat service | Optional standalone Groq chat endpoint |
| Managed MySQL | Persistent user and dashboard data |

## License

This project is currently intended for educational and hackathon use. Add a license before distributing it as an open-source project.
