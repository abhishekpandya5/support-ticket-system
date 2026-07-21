# Support Ticket Management System

AI Capability Assessment — Core tier full-stack project (React SPA + Node.js REST API + MongoDB).

> **Layout note:** Application code lives in `server/` and `client/` per the assessment template.

## Prerequisites

- Node.js **18+**
- MongoDB **6+**
- npm

## Quick Start

### Server

```bash
cd server
cp .env.example .env   # set MONGODB_URI
npm install
node ../scripts/db-init.js   # sync MongoDB indexes
npm run seed
npm run dev            # http://localhost:3001
```

### Client

```bash
cd client
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
| [`test-results.md`](test-results.md) | Manual + automated test evidence |
| [`debugging-notes.md`](debugging-notes.md) | Debugging case studies |
| [`code-review-notes.md`](code-review-notes.md) | Staff-level PR reviews |
| [`review-fixes.md`](review-fixes.md) | Review finding remediation tracker |
| [`reflection.md`](reflection.md) | Submission reflection |
| [`pr-description.md`](pr-description.md) | PR-style submission summary |
| [`final-ai-usage-summary.md`](final-ai-usage-summary.md) | AI usage summary |
| [`ai-prompts/`](ai-prompts/) | Prompt history by activity |
| [`database/setup-notes.md`](database/setup-notes.md) | MongoDB setup and indexes |

## API

Base path: `/api` — see [`api-contract.md`](api-contract.md)

## Testing

Requires **Node.js 18+** (Node 20+ recommended for client Vitest).

```bash
# Server — integration + unit tests
cd server && npm test

# Client — unit tests
cd client && npm test
```

The client dev server proxies API requests to the server (default `http://localhost:3001`). Override with `VITE_API_PROXY_TARGET` in `client/.env` if your API runs on another port (e.g. `5000`).

See [`test-strategy.md`](test-strategy.md) and [`test-results.md`](test-results.md).
