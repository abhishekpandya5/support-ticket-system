# Project Context — Support Ticket Management System

**Document version:** 1.0  
**Last updated:** 2026-07-10  
**Status:** Active — reference this document for all AI-assisted work in this repository

> **Purpose:** This file is persistent project context for Cursor and human contributors. It summarizes what we are building, how we build it, and how AI should be used. For detailed requirements, see [`docs/requirements-analysis.md`](../../requirements-analysis.md).

---

## 1. Project Overview

The **Support Ticket Management System** is a production-quality full-stack web application for internal support teams to create, track, update, comment on, search, and progress tickets through a strictly enforced lifecycle.

It is built as part of an **AI Capability Exercise** — reviewers evaluate engineering workflow (planning, AI usage, testing, debugging, documentation, reasoning) as much as the running application. The mandatory **Core** scope is intentionally small (~8–12 focused hours of application work); lifecycle artifacts are equally important.

### What makes this project distinctive

The **status state machine** is the signature judgment piece. Valid transitions must succeed; invalid transitions must be rejected by the **backend** and handled clearly in the **frontend**. This is where engineering rigor matters most.

### Core entities

| Entity | Purpose |
|--------|---------|
| **User** | Seeded reference data (id, name, email, role) — no user-management UI in Core |
| **Ticket** | Support request with title, description, priority, status, assignee, creator, timestamps |
| **Comment** | Message tied to a ticket with author and timestamp |

### Architecture at a glance

```
React SPA  ──REST JSON──>  Node.js API  ──ODM/Driver──>  MongoDB
```

---

## 2. Business Objective

### Problem

Internal support requests are often lost in email or chat. Without a structured system:

- Ownership and priority are unclear
- Progress cannot be audited consistently
- Invalid status changes create inconsistent data

### Goals

1. **Centralize** support requests in a single persistent system
2. **Standardize** ticket lifecycle through an explicit, enforced state machine
3. **Enable collaboration** via comments on tickets
4. **Improve discoverability** through keyword search and status filtering
5. **Ensure data integrity** via server-side validation and transition rules

### Success criteria (Core)

- All Core acceptance criteria in `docs/requirements-analysis.md` §14 are met
- State-machine integration tests pass reliably
- Data survives application restart
- No secrets committed to the repository
- Reviewers can trace requirements → design → implementation → tests

---

## 3. Tech Stack

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | React (SPA) | UI, client-side validation, API consumption via HTTP (`fetch` or Axios) |
| **Backend** | Node.js | REST API, business logic, validation, state machine enforcement |
| **Database** | MongoDB | Persistent storage for users, tickets, comments |
| **ODM** | Mongoose (recommended) | Schema validation, indexes, queries |
| **Testing** | Jest / Vitest + Supertest (recommended) | Integration tests (mandatory for state machine) |

### Environment configuration

| Variable | Example | Notes |
|----------|---------|-------|
| `MONGODB_URI` | `mongodb://localhost:27017/support-tickets` | Never commit real credentials |
| `PORT` | `3001` | Backend API port |
| `VITE_API_URL` / `REACT_APP_API_URL` | `http://localhost:3001/api` | Frontend → backend base URL |

Provide `.env.example`; keep `.env` in `.gitignore`.

### Out of scope for Core (Stretch only)

Authentication, pagination, sorting, advanced filters, Swagger/OpenAPI, Docker, CI, user CRUD UI.

---

## 4. Functional Scope

### In scope (Core — Must deliver)

| Area | Capabilities |
|------|--------------|
| **Tickets** | Create, list, detail view, update fields (title, description, priority, assignee) |
| **Status** | Change status only through valid state machine transitions |
| **Comments** | Add comments to existing tickets; display on detail view |
| **Search & filter** | Keyword search (title/description); filter by status |
| **Users** | Seeded users; read via API for assignee/creator selection |
| **Persistence** | All data in MongoDB; survives restart |
| **Validation** | Backend rejects invalid input; frontend shows meaningful errors |

### State machine (authoritative rules)

| From | Allowed transitions |
|------|---------------------|
| `open` | `in_progress`, `cancelled` |
| `in_progress` | `resolved`, `cancelled` |
| `resolved` | `closed` |
| `closed` | *(terminal — no outbound transitions)* |
| `cancelled` | *(terminal — no outbound transitions)* |

**Backend is the source of truth.** Frontend may guide UX (hide invalid actions) but must handle API rejection gracefully.

### Acting user model (Core, no auth)

Use a UI **"Acting as"** selector (dropdown of seeded users). Pass selected user ID to API as `createdBy` on ticket/comment operations. Document this choice in design docs.

### API surface (capabilities, not final paths)

| Operation | Endpoint pattern |
|-----------|------------------|
| List tickets (search/filter) | `GET /api/tickets?search=&status=` |
| Create ticket | `POST /api/tickets` |
| Get ticket detail | `GET /api/tickets/:id` |
| Update ticket fields | `PATCH /api/tickets/:id` |
| Change status | `PATCH /api/tickets/:id/status` |
| Add comment | `POST /api/tickets/:id/comments` |
| List users | `GET /api/users` |

---

## 5. Non-Functional Requirements

### Reliability & data integrity

- Status transitions must be atomic — no partial inconsistent state
- Reference integrity (`createdBy`, `assignedTo`, `ticketId`) enforced in the Node.js service layer
- State machine logic lives in **one module** — never duplicated across handlers

### Security

- **No secrets** in the repository
- Validate and sanitize all inputs; use Mongoose/ODM typed queries (mitigate NoSQL injection)
- Encode output in React (mitigate XSS)
- Auth is optional Stretch — do not add unless explicitly scoped

### Maintainability

- Clear separation: routes → controllers → services → models/repositories
- Consistent naming across API (camelCase JSON), MongoDB fields, and React props/state
- README must enable a fresh clone to run locally

### Usability

- Clear labels for status, priority, assignee
- Actionable error messages for invalid transitions (e.g., "Cannot move from Closed to In Progress")
- Handle empty states: no tickets, no comments, no search results

### Performance (Core — light)

- Acceptable for demo scale (< 1000 tickets); no formal SLA
- Index `tickets.status`, `comments.ticketId`; consider text index for search

### Testability

- State machine testable via API integration tests without UI
- Isolated test database (`mongodb-memory-server`, separate DB name, or Docker)

---

## 6. Coding Standards

### General

- **Minimal diffs** — solve the problem with the smallest correct change; avoid unrelated refactors
- **Follow existing patterns** — match naming, folder structure, and error handling already in the repo
- **No premature abstraction** — inline simple logic; extract only when reused or complex
- **Self-documenting code** — comments only for non-obvious business rules (especially state machine edge cases)

### JavaScript / TypeScript

- Prefer `async/await` over raw promise chains
- Use explicit error handling — never swallow errors silently
- Validate inputs at API boundary before service layer
- Use consistent enum values: `open`, `in_progress`, `resolved`, `closed`, `cancelled` (lowercase snake_case in storage/API)

### React

- Functional components with hooks
- Separate API client module from UI components
- Loading, error, and empty states for every data-fetching view
- Do not duplicate state machine rules in frontend as the only enforcement layer

### Node.js / API

- Consistent HTTP status codes: `200`/`201` success, `400` validation/transition failure, `404` not found, `500` unexpected
- Structured error responses:

```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot transition from 'closed' to 'in_progress'."
  }
}
```

- Use middleware for common concerns (JSON parsing, error handler, CORS for local dev)

### MongoDB / Mongoose

- Define schemas with required fields, enums, and timestamps
- Index frequently queried fields
- Validate ObjectId format before queries; return `404` for invalid/non-existent IDs
- Seed scripts must create users and tickets in **every status** for demo and testing

### Git & commits

- Commit only when requested by the user
- Never commit `.env`, credentials, or `node_modules`
- Meaningful commit messages focused on *why*, not just *what*

---

## 7. Architecture Principles

### 1. Backend owns business rules

All validation, state machine enforcement, and referential integrity checks happen server-side. The frontend is a thin client.

### 2. Layered backend

```
HTTP Request
    → Route (routing only)
    → Controller (request/response mapping)
    → Service (business logic, state machine)
    → Model/Repository (MongoDB access)
```

### 3. Single source of truth for transitions

Implement `canTransition(from, to)` (or equivalent) in one domain module. Controllers and tests import from there. Consider sharing allowed-transition metadata with frontend for UX.

### 4. API-first development

Define and test API behavior before or alongside UI. Integration tests are the contract.

### 5. Fail explicitly

Reject invalid input and illegal transitions with clear `4xx` responses. Never silently coerce invalid status changes.

### 6. Idempotent reads, careful writes

`GET` endpoints must be safe to repeat. `POST`/`PATCH` must validate thoroughly before persistence.

### 7. Configuration over hardcoding

Ports, database URIs, and API URLs come from environment variables.

### 8. Traceability

Every feature should trace back to a requirement ID in `docs/requirements-analysis.md` and forward to a test.

---

## 8. Folder Structure Philosophy

Use a **monorepo** layout that separates concerns while keeping the project navigable for reviewers.

```
support-ticket-system/
├── client/                    # React SPA
│   ├── public/
│   └── src/
│       ├── api/               # API client functions (fetch wrappers)
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route-level views (list, detail, create)
│       ├── hooks/             # Custom React hooks
│       ├── utils/             # Pure helpers (formatDate, status labels)
│       └── App.jsx
├── server/                    # Node.js API
│   ├── src/
│   │   ├── routes/            # Express/Fastify route definitions
│   │   ├── controllers/       # Request/response handlers
│   │   ├── services/          # Business logic (ticketService, stateMachine)
│   │   ├── models/            # Mongoose schemas
│   │   ├── middleware/        # Error handler, validation, CORS
│   │   ├── config/            # DB connection, env loading
│   │   └── app.js             # App entry point
│   └── tests/
│       ├── integration/       # API + DB tests (state machine here)
│       └── unit/              # Pure logic tests (Stretch)
├── scripts/                   # DB init, seed, tooling
├── docs/                      # Lifecycle artifacts
│   ├── requirements-analysis.md
│   ├── prompt-history.md
│   ├── testing-notes.md
│   └── tool-specific/cursor-workflow/
│       ├── project-context.md   # ← this file
│       ├── spec.md
│       ├── tasks.md
│       └── acceptance-criteria.md
├── .cursor/rules/             # Persistent AI instructions
├── .env.example
└── README.md
```

### Principles

| Principle | Rationale |
|-----------|-----------|
| **Colocate tests near server** | Integration tests need DB + API; keep in `server/tests/` |
| **Thin routes, fat services** | Business logic is testable without HTTP |
| **One component per concern** | Ticket list, ticket detail, comment form are separate components |
| **Docs are first-class** | `docs/` is not an afterthought — reviewers read it |
| **No deep nesting** | Prefer flat `components/` over excessive subfolders until needed |

Adjust structure during setup if using a different convention (e.g., `apps/web` + `apps/api`), but preserve the **layered backend** and **separated frontend** principles.

---

## 9. AI Usage Guidelines

This project is an AI capability exercise. Use AI **thoughtfully** — as a collaborator, not a copy-paste code generator.

### Before asking AI to implement

1. **Provide context** — Reference this file, `docs/requirements-analysis.md`, and relevant spec/tasks docs
2. **State scope** — Core vs Stretch; what is in/out of scope
3. **Name constraints** — Stack (React, Node.js, MongoDB), patterns, acceptance criteria

### What AI should do

| Activity | Approach |
|----------|----------|
| **Requirement analysis** | Analyze before coding; produce structured docs |
| **Planning** | Break work into tasks with traceability to requirements |
| **Implementation** | Generate focused diffs; follow architecture principles above |
| **Testing** | Write integration tests for state machine first; validate edge cases |
| **Debugging** | Share error output; fix root cause, not symptoms |
| **Review** | Critique diffs for rule violations (especially state machine bypass) |
| **Documentation** | Keep README and docs in sync with actual commands/paths |

### What AI must not do

- Skip backend validation because "it's just a demo"
- Implement state machine rules only in the frontend
- Commit secrets or hardcode credentials
- Expand into Stretch features without explicit approval
- Overwrite `docs/prompt-history.md` — **append only**
- Make broad refactors unrelated to the current task

### Validation checklist for AI-generated code

Before accepting AI output, verify:

- [ ] State machine enforced in backend service layer
- [ ] Invalid transitions return `4xx` with clear message
- [ ] Required fields validated server-side
- [ ] ObjectId references checked for existence
- [ ] No secrets in code
- [ ] Integration tests cover valid and invalid transitions
- [ ] Error states handled in React UI
- [ ] Matches existing folder structure and naming

### Prompt history

After every major task, append an entry to [`docs/prompt-history.md`](../../prompt-history.md) (see `.cursor/rules/prompt-history-logging.mdc`). Include objective, prompt summary, and output summary.

### Information to avoid sharing with AI

- Real database credentials, API keys, or production URLs
- Personal data unrelated to the project
- Internal credentials from other systems

---

## 10. Testing Strategy

### Priority order

1. **State machine integration tests** (mandatory — Core gate)
2. **Ticket CRUD validation tests** (recommended)
3. **Comment and search/filter API tests** (recommended)
4. **Unit tests for pure state machine function** (Stretch)
5. **E2E / CI** (Stretch)

### Mandatory: state machine integration tests

Test via HTTP against the API (Supertest or similar) with a test database.

| # | Transition | Expected |
|---|------------|----------|
| 1 | `open` → `in_progress` | 200/201 success |
| 2 | `open` → `cancelled` | Success |
| 3 | `in_progress` → `resolved` | Success |
| 4 | `in_progress` → `cancelled` | Success |
| 5 | `resolved` → `closed` | Success |
| 6 | `open` → `resolved` | 400/409 fail |
| 7 | `open` → `closed` | Fail |
| 8 | `in_progress` → `open` | Fail |
| 9 | `resolved` → `open` | Fail |
| 10 | `closed` → `in_progress` | Fail |
| 11 | `cancelled` → `open` | Fail |

### Test infrastructure

- Use `mongodb-memory-server` or a dedicated `support-tickets-test` database
- Seed minimal users in `beforeAll` or test fixtures
- Reset collections between tests (`beforeEach`) for isolation
- Run via `npm test` from README-documented command

### What not to rely on

- Manual UI-only verification for state machine (insufficient for Core)
- Tests against production/development database with shared state

### Debugging evidence

Document failures and fixes in `docs/testing-notes.md`. Reference commits where AI-generated code was corrected.

---

## 11. Documentation Strategy

### Document hierarchy

| Document | Purpose | When to update |
|----------|---------|----------------|
| **`project-context.md`** (this file) | Persistent AI + team context | Stack, architecture, or workflow changes |
| **`requirements-analysis.md`** | Full requirement breakdown | Scope or rule changes |
| **`spec.md`** | Technical design decisions | Before/during implementation |
| **`tasks.md`** | Work breakdown and progress | Sprint/task changes |
| **`acceptance-criteria.md`** | Testable done-definitions | Per feature or milestone |
| **`prompt-history.md`** | Append-only AI interaction log | After every major AI task |
| **`testing-notes.md`** | Debug and test evidence | When bugs found/fixed |
| **`README.md`** | Setup, run, test instructions | Any command or env var change |

### README minimum contents

1. Prerequisites (Node.js version, MongoDB)
2. Clone and install steps
3. Environment variable setup (`.env.example`)
4. Database init and seed commands
5. Start backend and frontend (separate terminals)
6. Run tests
7. Brief architecture overview and link to `docs/`

### Documentation principles

- **Reproducible** — A reviewer on a clean machine can follow README without guessing
- **Traceable** — Requirements → spec → code → tests → acceptance criteria
- **Honest** — Document known limitations, trade-offs, and deferred Stretch items
- **Current** — Update docs in the same PR/commit as behavioral changes
- **Concise** — Prefer tables and bullet points over prose walls

### Cursor workflow artifacts

Keep these in `docs/tool-specific/cursor-workflow/`:

- `project-context.md` — this file
- `spec.md` — detailed technical design
- `tasks.md` — implementation checklist
- `acceptance-criteria.md` — verifiable done conditions
- `cursor-rules-or-instructions.md` — rule index and rationale

---

## 12. Quick Reference

### Priority enum

`low` | `medium` | `high` | `critical`

### Status enum

`open` | `in_progress` | `resolved` | `closed` | `cancelled`

### Key files to @-mention in Cursor prompts

```
@docs/tool-specific/cursor-workflow/project-context.md
@docs/requirements-analysis.md
@docs/tool-specific/cursor-workflow/spec.md
@docs/tool-specific/cursor-workflow/tasks.md
```

### Golden rule

> If a status transition works in the UI but is not validated in the Node.js service layer with integration tests, it is **not done**.

---

*This document is the single entry point for project context. Link to it at the start of major Cursor sessions.*
