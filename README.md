# Support Ticket Management System

AI Capability Assessment — Core tier full-stack project (React SPA + Node.js REST API + MongoDB).

> **Layout note:** Assessment template uses root `src/` and `tests/`. This repo uses `backend/` and `frontend/` — see [`src/README.md`](src/README.md) and [`tests/README.md`](tests/README.md).

## Prerequisites

- Node.js **18+**
- MongoDB **6+**
- npm

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env   # set MONGODB_URI
npm install
npm run seed
npm run dev            # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Assessment Artifacts

| Document | Purpose |
|----------|---------|
| [`candidate-info.md`](candidate-info.md) | Candidate metadata |
| [`tool-workflow.md`](tool-workflow.md) | Cursor / AI workflow |
| [`requirements-analysis.md`](requirements-analysis.md) | Requirements |
| [`acceptance-criteria.md`](acceptance-criteria.md) | Verification checklist |
| [`implementation-plan.md`](implementation-plan.md) | Task breakdown |
| [`design-notes.md`](design-notes.md) | Architecture & design |
| [`docs/architecture.md`](docs/architecture.md) | Architecture diagrams (submission) |
| [`api-contract.md`](api-contract.md) | REST API contract |
| [`data-model.md`](data-model.md) | MongoDB design |
| [`ui-flow.md`](ui-flow.md) | UI screens & flows |
| [`test-strategy.md`](test-strategy.md) | Test scope |
| [`ai-prompts/`](ai-prompts/) | Prompt history by activity |

## API

Base path: `/api` — see [`api-contract.md`](api-contract.md)

## Testing

Requires **Node.js 18+** (Node 20+ recommended for frontend Vitest).

```bash
# Backend — integration + unit tests
cd backend && npm test

# Frontend — unit tests
cd frontend && npm test
```

The frontend dev server proxies API requests to the backend (default `http://localhost:3001`). Override with `VITE_API_PROXY_TARGET` in `frontend/.env` if your API runs on another port (e.g. `5000`).

See [`test-strategy.md`](test-strategy.md) and [`test-results.md`](test-results.md).
