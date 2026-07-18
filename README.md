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
| [`api-contract.md`](api-contract.md) | REST API contract |
| [`data-model.md`](data-model.md) | MongoDB design |
| [`ui-flow.md`](ui-flow.md) | UI screens & flows |
| [`test-strategy.md`](test-strategy.md) | Test scope |
| [`ai-prompts/`](ai-prompts/) | Prompt history by activity |

## API

Base path: `/api` — see [`api-contract.md`](api-contract.md)

## Testing

<!-- TODO: Document npm test once integration suite is configured. -->

See [`test-strategy.md`](test-strategy.md) and [`test-results.md`](test-results.md).
