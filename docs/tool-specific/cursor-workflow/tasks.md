# Implementation Tasks — Support Ticket Management System

**Document version:** 1.0  
**Date:** 2026-07-10  
**Status:** Ready for execution  
**Source:** `[spec.md](./spec.md)` · `[project-context.md](./project-context.md)` · `[requirements-analysis.md](../../requirements-analysis.md)`

---

## How to Use This Document

- Tasks are ordered by **phase** and **dependency** — complete earlier phases before later ones unless noted.
- Mark tasks complete in place: `[ ]` → `[x]`.
- **Complexity** is relative effort for an experienced developer using AI assistance:
  - **Low** — ~30–90 minutes
  - **Medium** — ~1.5–3 hours
  - **High** — ~3–5 hours or higher risk
- Each task includes verifiable **acceptance criteria** aligned to Core requirements.

---



## Phase Overview


| Phase | Name                         | Tasks           | Focus                                |
| ----- | ---------------------------- | --------------- | ------------------------------------ |
| 0     | Project Setup                | P0-T01 – P0-T04 | Monorepo scaffold, env, tooling      |
| 1     | Database Layer               | P1-T01 – P1-T04 | Mongoose models, indexes, seed       |
| 2     | Backend Foundation           | P2-T01 – P2-T05 | Express app, errors, middleware      |
| 3     | Backend Domain & API         | P3-T01 – P3-T08 | State machine, services, routes      |
| 4     | Backend Testing              | P4-T01 – P4-T05 | Integration tests (mandatory)        |
| 5     | Frontend Foundation          | P5-T01 – P5-T06 | React scaffold, API client, layout   |
| 6     | Frontend Features            | P6-T01 – P6-T08 | Pages, forms, status UI, comments    |
| 7     | Documentation & Verification | P7-T01 – P7-T04 | README, manual acceptance, artifacts |


**Estimated Core effort:** ~8–12 focused hours (per exercise scope), excluding lifecycle documentation already complete.

---



## Phase 0 — Project Setup



### P0-T01 — Initialize monorepo structure


| Field            | Value                                                                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create the monorepo folder layout: `client/`, `server/`, `scripts/`, root `package.json` (optional workspace), `.gitignore`, and placeholder README. Ensure `node_modules`, `.env`, and build artifacts are gitignored. |
| **Dependencies** | None                                                                                                                                                                                                                    |
| **Complexity**   | Low                                                                                                                                                                                                                     |


**Acceptance criteria:**

- [ ] Directories exist: `client/`, `server/`, `scripts/`
- [ ] `.gitignore` excludes `node_modules`, `.env`, `dist`, `build`
- [ ] Root README stub links to `docs/` artifacts

---



### P0-T02 — Scaffold Node.js backend project


| Field            | Value                                                                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Initialize `server/` with `package.json`, Express dependency, dev script (`nodemon` or `node --watch`), and entry point `src/index.js`. Add folder structure per spec §4.2 (`routes`, `controllers`, `services`, `models`, `middleware`, `config`, `errors`, `utils`). |
| **Dependencies** | P0-T01                                                                                                                                                                                                                                                                 |
| **Complexity**   | Low                                                                                                                                                                                                                                                                    |


**Acceptance criteria:**

- [ ] `npm install` succeeds in `server/`
- [ ] `npm run dev` starts without crash (health route optional)
- [ ] Folder structure matches spec §4.2

---



### P0-T03 — Scaffold React frontend project


| Field            | Value                                                                                                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Initialize `client/` with Vite + React (recommended) or CRA. Add React Router. Create folder structure per spec §3.1 (`api`, `pages`, `components`, `hooks`, `context`, `utils`). Configure dev server proxy or env var for API base URL. |
| **Dependencies** | P0-T01                                                                                                                                                                                                                                    |
| **Complexity**   | Low                                                                                                                                                                                                                                       |


**Acceptance criteria:**

- [ ] `npm install` succeeds in `client/`
- [ ] `npm run dev` serves the app in browser
- [ ] `VITE_API_URL` (or equivalent) documented in `.env.example`
- [ ] Folder structure matches spec §3.1

---



### P0-T04 — Environment configuration


| Field            | Value                                                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create root and/or per-package `.env.example` files with `MONGODB_URI`, `PORT`, and frontend API URL. Add `server/src/config/env.js` to load and validate required variables at startup. |
| **Dependencies** | P0-T02, P0-T03                                                                                                                                                                           |
| **Complexity**   | Low                                                                                                                                                                                      |


**Acceptance criteria:**

- [ ] `.env.example` present with placeholder values (no real secrets)
- [ ] Server fails fast with clear message if `MONGODB_URI` is missing
- [ ] `.env` is gitignored

---



## Phase 1 — Database Layer



### P1-T01 — MongoDB connection module


| Field            | Value                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `server/src/config/database.js` using Mongoose. Connect on server start; disconnect on SIGTERM. Log connection success/failure. |
| **Dependencies** | P0-T02, P0-T04                                                                                                                            |
| **Complexity**   | Low                                                                                                                                       |


**Acceptance criteria:**

- [ ] Server connects to MongoDB at `MONGODB_URI` on startup
- [ ] Connection errors are logged and prevent silent failure
- [ ] Graceful disconnect on shutdown

---



### P1-T02 — Mongoose models (User, Ticket, Comment)


| Field            | Value                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create Mongoose schemas per spec §8.2: `User`, `Ticket`, `Comment` with enums, maxlength, refs, and timestamps. Export models from `server/src/models/`. |
| **Dependencies** | P1-T01                                                                                                                                                   |
| **Complexity**   | Medium                                                                                                                                                   |


**Acceptance criteria:**

- [ ] `User`: name, email (unique), role enum (`agent`, `admin`, `viewer`)
- [ ] `Ticket`: title, description, priority enum, status enum (default `open`), assignedTo (optional ref), createdBy (required ref), timestamps
- [ ] `Comment`: ticketId ref, message, createdBy ref, createdAt
- [ ] Enum values match spec Appendix B exactly

---



### P1-T03 — Database init script (indexes)


| Field            | Value                                                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create `scripts/db-init.js` that connects to MongoDB and ensures indexes per spec §8.3: `users.email` (unique), `tickets.status`, `tickets.assignedTo`, `tickets.updatedAt`, `comments.ticketId` + `createdAt`. |
| **Dependencies** | P1-T02                                                                                                                                                                                                          |
| **Complexity**   | Low                                                                                                                                                                                                             |


**Acceptance criteria:**

- [ ] `node scripts/db-init.js` runs without error against local MongoDB
- [ ] Indexes are created (verifiable via MongoDB shell or script output)
- [ ] Script is idempotent (safe to run multiple times)

---



### P1-T04 — Seed script


| Field            | Value                                                                                                                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create `scripts/seed.js` to populate dev data: ≥3 users (mixed roles), ≥1 ticket in each status (`open`, `in_progress`, `resolved`, `closed`, `cancelled`), ≥2 comments on different tickets. Support `--force` or dev-only clear before seed. |
| **Dependencies** | P1-T02, P1-T03                                                                                                                                                                                                                                 |
| **Complexity**   | Medium                                                                                                                                                                                                                                         |


**Acceptance criteria:**

- [ ] `node scripts/seed.js` populates all collections
- [ ] At least one ticket exists in every status
- [ ] Seed is documented in README steps
- [ ] Re-running seed does not crash (document whether it clears or skips)

---



## Phase 2 — Backend Foundation



### P2-T01 — Application error types


| Field            | Value                                                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `AppError` base class and subclasses/errors per spec §4.5 and §6.3: `ValidationError`, `InvalidTransitionError`, `NotFoundError`, `BadRequestError`. Add `errorCodes.js` constants. |
| **Dependencies** | P0-T02                                                                                                                                                                                        |
| **Complexity**   | Low                                                                                                                                                                                           |


**Acceptance criteria:**

- [ ] Each error type carries `code`, `message`, optional `details`, and `statusCode`
- [ ] `InvalidTransitionError` supports `currentStatus`, `requestedStatus`, `allowedTransitions` in details
- [ ] No HTTP/Express imports in error classes

---



### P2-T02 — Global error handler middleware


| Field            | Value                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `errorHandler.js` and `asyncHandler.js` per spec §6.5. Map `AppError` → JSON envelope; map Mongoose `ValidationError` and `CastError` to 400; unknown errors → 500 with safe message. |
| **Dependencies** | P2-T01                                                                                                                                                                                          |
| **Complexity**   | Medium                                                                                                                                                                                          |


**Acceptance criteria:**

- [ ] All API errors return `{ error: { code, message, details? } }`
- [ ] 500 responses do not leak stack traces to client
- [ ] Async controller errors propagate to error handler

---



### P2-T03 — Core Express middleware stack


| Field            | Value                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Configure `server/src/app.js` with `cors` (dev origin), `express.json()`, optional request logging, mount routes under `/api`, and register error handler last. |
| **Dependencies** | P0-T02, P2-T02                                                                                                                                                  |
| **Complexity**   | Low                                                                                                                                                             |


**Acceptance criteria:**

- [ ] CORS allows frontend dev server origin
- [ ] JSON body parsing works for POST/PATCH
- [ ] Error handler is the final middleware

---



### P2-T04 — ObjectId validation middleware


| Field            | Value                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `validateObjectId.js` middleware for `:id` route params. Return 400 `INVALID_OBJECT_ID` for malformed IDs before hitting controllers. |
| **Dependencies** | P2-T01, P2-T02                                                                                                                                  |
| **Complexity**   | Low                                                                                                                                             |


**Acceptance criteria:**

- [ ] `GET /api/tickets/not-an-id` returns 400 with `INVALID_OBJECT_ID`
- [ ] Valid 24-char hex ObjectIds pass through

---



### P2-T05 — User service and read-only user API


| Field            | Value                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `userService` (`listUsers`, `getUserById`, `assertUserExists`) and `userController` + `userRoutes` for `GET /api/users` and optional `GET /api/users/:id`. |
| **Dependencies** | P1-T02, P2-T03, P2-T04                                                                                                                                               |
| **Complexity**   | Low                                                                                                                                                                  |


**Acceptance criteria:**

- [ ] `GET /api/users` returns seeded users as JSON (camelCase)
- [ ] `assertUserExists` throws `NotFoundError` for missing user
- [ ] No write endpoints for users (Core)

---



## Phase 3 — Backend Domain & API



### P3-T01 — State machine module (pure)


| Field            | Value                                                                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `server/src/services/stateMachine.js` as a pure module per spec §9.2: `STATUSES`, `TERMINAL_STATUSES`, `TRANSITIONS`, `canTransition`, `getAllowedTransitions`, `assertTransition`. No DB or Express imports. |
| **Dependencies** | P2-T01                                                                                                                                                                                                                  |
| **Complexity**   | Medium                                                                                                                                                                                                                  |


**Acceptance criteria:**

- [ ] Transition table matches spec §9.3 exactly
- [ ] `canTransition('closed', 'open')` returns `false`
- [ ] `getAllowedTransitions('open')` returns `['in_progress', 'cancelled']`
- [ ] Same-status transition returns `false` / throws (DD-06)
- [ ] Module is importable without side effects

---



### P3-T02 — Ticket service — create and list


| Field            | Value                                                                                                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `ticketService.createTicket` and `ticketService.listTickets` with validation per spec §7.2. Create sets `status: open`; list supports `search` (case-insensitive regex on title/description) and `status` filter; populate user refs; sort by `updatedAt` desc. |
| **Dependencies** | P1-T02, P2-T01, P2-T05, P3-T01                                                                                                                                                                                                                                            |
| **Complexity**   | Medium                                                                                                                                                                                                                                                                    |


**Acceptance criteria:**

- [ ] Create validates required fields and user refs
- [ ] New tickets always have `status: 'open'`
- [ ] List returns populated `createdBy` and `assignedTo`
- [ ] `?search=` filters title/description (case-insensitive)
- [ ] `?status=` filters by exact status enum
- [ ] Empty search returns all (subject to status filter)

---



### P3-T03 — Ticket service — get by ID and update fields


| Field            | Value                                                                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `ticketService.getTicketById` (ticket + comments) and `ticketService.updateTicket`. Update accepts title, description, priority, assignedTo only — **reject** `status` **in body** with `STATUS_UPDATE_NOT_ALLOWED` (spec §4.4, DD-01). |
| **Dependencies** | P3-T02                                                                                                                                                                                                                                            |
| **Complexity**   | Medium                                                                                                                                                                                                                                            |


**Acceptance criteria:**

- [ ] Detail response includes ticket and comments (oldest first)
- [ ] Missing ticket returns `NotFoundError`
- [ ] Field update refreshes `updatedAt`
- [ ] `assignedTo: null` unassigns ticket
- [ ] PATCH with `status` field returns 400 `STATUS_UPDATE_NOT_ALLOWED`
- [ ] Field updates allowed on terminal-status tickets (DD-04)

---



### P3-T04 — Ticket service — change status


| Field            | Value                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Description**  | Implement `ticketService.changeStatus` per spec §9.5: load ticket, call `assertTransition`, persist new status, update `updatedAt`, return populated ticket. |
| **Dependencies** | P3-T01, P3-T03                                                                                                                                               |
| **Complexity**   | High                                                                                                                                                         |


**Acceptance criteria:**

- [ ] Valid transitions persist new status
- [ ] Invalid transitions throw `InvalidTransitionError` with `allowedTransitions` in details
- [ ] Terminal statuses reject all outbound transitions
- [ ] Same-status request is rejected (no silent no-op)
- [ ] Invalid enum string rejected before transition check

---



### P3-T05 — Comment service


| Field            | Value                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Description**  | Implement `commentService.addComment` and `getCommentsByTicketId`. Validate non-empty message, ticket exists, `createdBy` exists. Comments allowed on tickets in any status (DD-03). |
| **Dependencies** | P1-T02, P2-T05, P3-T03                                                                                                                                                               |
| **Complexity**   | Medium                                                                                                                                                                               |


**Acceptance criteria:**

- [ ] Comment created with ticketId, message, createdBy, createdAt
- [ ] Empty/whitespace message returns `ValidationError`
- [ ] Non-existent ticket returns `NotFoundError`
- [ ] Comments on `closed`/`cancelled` tickets succeed

---



### P3-T06 — Ticket and comment controllers + routes


| Field            | Value                                                                                                                                                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Wire HTTP layer: `ticketController`, `commentController`, `ticketRoutes`, `commentRoutes` per spec Appendix A. Endpoints: `GET/POST /api/tickets`, `GET/PATCH /api/tickets/:id`, `PATCH /api/tickets/:id/status`, `POST /api/tickets/:id/comments`. |
| **Dependencies** | P2-T03, P2-T04, P3-T02, P3-T03, P3-T04, P3-T05                                                                                                                                                                                                      |
| **Complexity**   | Medium                                                                                                                                                                                                                                              |


**Acceptance criteria:**

- [ ] All endpoints return correct HTTP status codes (200, 201, 400, 404)
- [ ] Controllers are thin — no business logic beyond request mapping
- [ ] `asyncHandler` wraps all async controllers
- [ ] JSON responses use camelCase and ISO 8601 dates

---



### P3-T07 — Response serialization helpers


| Field            | Value                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Add utilities to map Mongoose documents to API JSON shape (`id` instead of `_id`, nested user objects with `id`, `name`, `email`). Use consistently across all controllers. |
| **Dependencies** | P3-T06                                                                                                                                                                      |
| **Complexity**   | Low                                                                                                                                                                         |


**Acceptance criteria:**

- [ ] API responses never expose `_id` without also providing `id` (or only `id`)
- [ ] Populated users appear as `{ id, name, email }` in ticket/comment responses
- [ ] Shape matches spec Appendix A.3 example

---



### P3-T08 — Manual API smoke test


| Field            | Value                                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Description**  | Verify full backend flow manually (curl, Postman, or REST Client): seed DB → create ticket → list → detail → update fields → valid status change → invalid status change → add comment. Document any fixes needed. |
| **Dependencies** | P3-T06, P3-T07, P1-T04                                                                                                                                                                                             |
| **Complexity**   | Low                                                                                                                                                                                                                |


**Acceptance criteria:**

- [ ] Complete happy path works end-to-end via HTTP
- [ ] Invalid transition returns 400 with structured error
- [ ] Data persists after server restart
- [ ] Issues found are fixed or logged in `docs/testing-notes.md`

---



## Phase 4 — Backend Testing



### P4-T01 — Test infrastructure setup


| Field            | Value                                                                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Configure Vitest or Jest + Supertest + `mongodb-memory-server` in `server/`. Create `tests/integration/setup.js` for connect/clear/disconnect and `tests/helpers/fixtures.js` with `createUser`, `createTicket`, `createComment`. |
| **Dependencies** | P3-T06                                                                                                                                                                                                                            |
| **Complexity**   | Medium                                                                                                                                                                                                                            |


**Acceptance criteria:**

- [ ] `npm test` runs in `server/` without manual DB setup
- [ ] Tests use isolated in-memory MongoDB
- [ ] Collections cleared between tests
- [ ] Fixtures create valid seed data programmatically

---



### P4-T02 — State machine integration tests (MANDATORY)


| Field            | Value                                                                                                                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `tests/integration/stateMachine.test.js` covering all 11 cases in spec §10.4 via `PATCH /api/tickets/:id/status`. Include assertions on error code and `allowedTransitions`. Add test that `PATCH /api/tickets/:id` with `status` in body returns 400. |
| **Dependencies** | P4-T01, P3-T04                                                                                                                                                                                                                                                   |
| **Complexity**   | High                                                                                                                                                                                                                                                             |


**Acceptance criteria:**

- [ ] All 5 valid transitions return 200 and correct final status
- [ ] All 6 invalid transitions return 400 and leave status unchanged
- [ ] Error body has `code: INVALID_STATUS_TRANSITION`
- [ ] `details.allowedTransitions` present on failure
- [ ] Field update endpoint rejects `status` in body
- [ ] Tests pass reliably on repeated runs

---



### P4-T03 — Ticket API integration tests


| Field            | Value                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `tests/integration/tickets.test.js` per spec §10.5: create (valid/invalid), list, search, status filter, get by id (valid/invalid/not found), update fields. |
| **Dependencies** | P4-T01, P3-T06                                                                                                                                                         |
| **Complexity**   | Medium                                                                                                                                                                 |


**Acceptance criteria:**

- [ ] POST valid ticket → 201, status `open`
- [ ] POST missing title → 400
- [ ] GET list returns array; `?status=open` filters correctly
- [ ] GET `?search=` matches title/description
- [ ] GET invalid ObjectId → 400; nonexistent → 404
- [ ] PATCH updates title and `updatedAt`

---



### P4-T04 — Comment API integration tests


| Field            | Value                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `tests/integration/comments.test.js` per spec §10.5: valid create, empty message, non-existent ticket. |
| **Dependencies** | P4-T01, P3-T05                                                                                                   |
| **Complexity**   | Low                                                                                                              |


**Acceptance criteria:**

- [ ] POST valid comment → 201
- [ ] POST empty message → 400
- [ ] POST to non-existent ticket → 404
- [ ] All tests pass via `npm test`

---



### P4-T05 — Test scripts and npm commands


| Field            | Value                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Description**  | Add `npm test`, `npm run test:integration`, and optional `test:watch` scripts to `server/package.json`. Ensure CI-local single command runs all integration tests. |
| **Dependencies** | P4-T02, P4-T03, P4-T04                                                                                                                                             |
| **Complexity**   | Low                                                                                                                                                                |


**Acceptance criteria:**

- [ ] `npm test` exits 0 with all integration tests passing
- [ ] Commands documented for README (P7-T01)

---



## Phase 5 — Frontend Foundation



### P5-T01 — React Router and app shell


| Field            | Value                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Configure React Router v6 in `App.jsx` with routes: `/` → redirect `/tickets`, `/tickets`, `/tickets/new`, `/tickets/:id`. Create `AppHeader` layout wrapper. |
| **Dependencies** | P0-T03                                                                                                                                                        |
| **Complexity**   | Low                                                                                                                                                           |


**Acceptance criteria:**

- [ ] All four routes resolve without error
- [ ] Unknown routes show 404 or redirect
- [ ] Shared layout renders on all pages

---



### P5-T02 — API client module


| Field            | Value                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `client/src/api/client.js` base wrapper: attach base URL from env, set JSON headers, parse error envelope on non-2xx, throw `ApiError` with code/message/details. |
| **Dependencies** | P0-T03, P0-T04                                                                                                                                                              |
| **Complexity**   | Medium                                                                                                                                                                      |


**Acceptance criteria:**

- [ ] Successful responses return parsed JSON
- [ ] API errors throw structured `ApiError`
- [ ] Network failures throw distinguishable error
- [ ] Base URL configurable via environment variable

---



### P5-T03 — API modules (tickets, comments, users)


| Field            | Value                                                                                                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `api/tickets.js`, `api/comments.js`, `api/users.js` with functions matching spec §5: `getTickets`, `getTicket`, `createTicket`, `updateTicket`, `changeStatus`, `addComment`, `getUsers`. |
| **Dependencies** | P5-T02, P3-T06                                                                                                                                                                                      |
| **Complexity**   | Medium                                                                                                                                                                                              |


**Acceptance criteria:**

- [ ] Each function calls correct method, path, and query params
- [ ] `getTickets` passes `search` and `status` as query string
- [ ] `changeStatus` calls `PATCH .../status` with `{ status }`
- [ ] Manual call against running backend succeeds

---



### P5-T04 — Acting-as user context


| Field            | Value                                                                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `ActingAsContext`, `useActingAs` hook, and `ActingAsSelector` component. Fetch users on load; persist selection in `localStorage` (`actingAsUserId`); default to first user. |
| **Dependencies** | P5-T03, P2-T05                                                                                                                                                                         |
| **Complexity**   | Medium                                                                                                                                                                                 |


**Acceptance criteria:**

- [ ] Dropdown lists all seeded users
- [ ] Selection persists across page refresh
- [ ] `useActingAs()` returns `{ user, setUser, userId }` for forms
- [ ] Header displays current acting user name

---



### P5-T05 — Shared UI utilities and common components


| Field            | Value                                                                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `utils/status.js`, `utils/priority.js`, `utils/formatDate.js` and common components: `LoadingSpinner`, `ErrorBanner`, `EmptyState`, `StatusBadge`. Status utils mirror backend transition map (spec §3.6). |
| **Dependencies** | P5-T01                                                                                                                                                                                                               |
| **Complexity**   | Medium                                                                                                                                                                                                               |


**Acceptance criteria:**

- [ ] `getAllowedTransitions('open')` matches backend: `['in_progress', 'cancelled']`
- [ ] `getStatusLabel` returns human-readable labels
- [ ] `isTerminal('closed')` returns `true`
- [ ] Common components render correctly in isolation

---



### P5-T06 — Basic styling and layout


| Field            | Value                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Apply minimal, clean styling (CSS modules, Tailwind, or plain CSS) for layout, forms, badges, and error states. Ensure readable typography and spacing for demo. |
| **Dependencies** | P5-T01                                                                                                                                                           |
| **Complexity**   | Low                                                                                                                                                              |


**Acceptance criteria:**

- [ ] UI is navigable and readable without raw unstyled HTML
- [ ] Status and priority visually distinguishable (badges/colors)
- [ ] Forms have visible labels and required indicators
- [ ] Error and empty states are visually clear

---



## Phase 6 — Frontend Features



### P6-T01 — Ticket list page with search and filter


| Field            | Value                                                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `TicketListPage`, `TicketList`, `TicketCard`, `SearchBar`, `StatusFilter`. Fetch tickets on mount; debounce search ~300ms; combine search + status filter. Show loading, empty, and error states. |
| **Dependencies** | P5-T03, P5-T05, P5-T06                                                                                                                                                                                      |
| **Complexity**   | Medium                                                                                                                                                                                                      |


**Acceptance criteria:**

- [ ] Lists all tickets from API on load
- [ ] Search narrows results by title/description
- [ ] Status filter shows only matching tickets
- [ ] Combined search + filter works
- [ ] Empty state when no matches
- [ ] Each ticket links to detail page
- [ ] "Create ticket" button navigates to `/tickets/new`

---



### P6-T02 — Create ticket page


| Field            | Value                                                                                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `CreateTicketPage` and `TicketForm` (create mode). Fields: title, description, priority (default `medium`), assignee (optional dropdown). Submit `createdBy` from acting-as context. Client-side required validation. |
| **Dependencies** | P5-T03, P5-T04, P5-T05                                                                                                                                                                                                          |
| **Complexity**   | Medium                                                                                                                                                                                                                          |


**Acceptance criteria:**

- [ ] Form submits successfully with valid data
- [ ] `createdBy` sent from acting-as user (not manual form field)
- [ ] Client blocks submit when title/description empty
- [ ] Server validation errors displayed via `ErrorBanner`
- [ ] Success navigates to new ticket detail page

---



### P6-T03 — Ticket detail page — read view


| Field            | Value                                                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `TicketDetailPage` read sections: `TicketMeta`, `StatusBadge`, all ticket fields, assignee/creator names, timestamps, `CommentList` (oldest first). Handle loading, 404, and error states. |
| **Dependencies** | P5-T03, P5-T05, P5-T06                                                                                                                                                                               |
| **Complexity**   | Medium                                                                                                                                                                                               |


**Acceptance criteria:**

- [ ] Detail page loads ticket and comments from API
- [ ] Invalid ticket ID shows not-found UI
- [ ] All fields render with readable labels
- [ ] Comments show author name and formatted date

---



### P6-T04 — Ticket detail page — edit fields


| Field            | Value                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Description**  | Add edit capability for title, description, priority, assignee on detail page (inline or edit mode). Call `updateTicket` API; refresh view on success; show validation errors. |
| **Dependencies** | P6-T03, P5-T03                                                                                                                                                                 |
| **Complexity**   | Medium                                                                                                                                                                         |


**Acceptance criteria:**

- [ ] Field changes persist after save and page refresh
- [ ] Assignee dropdown populated from users API
- [ ] Unassign (null assignee) works if supported in UI
- [ ] `updatedAt` reflects change after refetch
- [ ] Works on terminal-status tickets (metadata only)

---



### P6-T05 — Status actions component


| Field            | Value                                                                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `StatusActions` per spec §9.7. Render only buttons for `getAllowedTransitions(currentStatus)` with clear labels (e.g., "Start Progress", "Mark Resolved", "Close", "Cancel"). Call `changeStatus` API; show `ErrorBanner` on rejection. |
| **Dependencies** | P5-T03, P5-T05, P6-T03                                                                                                                                                                                                                            |
| **Complexity**   | High                                                                                                                                                                                                                                              |


**Acceptance criteria:**

- [ ] `open` shows Start Progress + Cancel only
- [ ] `in_progress` shows Mark Resolved + Cancel only
- [ ] `resolved` shows Close only
- [ ] `closed` and `cancelled` show no action buttons
- [ ] Successful transition updates displayed status
- [ ] API rejection shows server error message; UI status unchanged
- [ ] Invalid transition cannot be triggered from UI for terminal states

---



### P6-T06 — Comment form and submission


| Field            | Value                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Implement `CommentForm` on detail page. Submit message + `createdBy` from acting-as context. Append/refetch comments on success. Disable when no acting user. |
| **Dependencies** | P5-T03, P5-T04, P6-T03                                                                                                                                        |
| **Complexity**   | Low                                                                                                                                                           |


**Acceptance criteria:**

- [ ] Valid comment appears in list without full page reload (refetch or append)
- [ ] Empty message blocked client-side
- [ ] Server error displayed in UI
- [ ] Works on tickets in any status including closed/cancelled

---



### P6-T07 — Frontend error handling polish


| Field            | Value                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Audit all pages for consistent loading, error, and empty states per spec §6.6 and §3.7. Map API error codes to user-friendly messages where helpful. |
| **Dependencies** | P6-T01 – P6-T06                                                                                                                                      |
| **Complexity**   | Low                                                                                                                                                  |


**Acceptance criteria:**

- [ ] No page shows blank screen during load or on error
- [ ] Validation and transition errors are user-visible
- [ ] Network failure shows actionable message
- [ ] Meets AC-13 (meaningful error states in UI)

---



### P6-T08 — End-to-end UI verification


| Field            | Value                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Manual walkthrough of all Core user flows with backend + MongoDB running. Fix integration issues between frontend and API. |
| **Dependencies** | P6-T01 – P6-T07, P3-T08                                                                                                    |
| **Complexity**   | Medium                                                                                                                     |


**Acceptance criteria:**

- [ ] AC-01 through AC-08 pass via manual UI testing
- [ ] Data survives frontend refresh and server restart
- [ ] Issues logged in `docs/testing-notes.md` with fixes applied

---



## Phase 7 — Documentation & Verification



### P7-T01 — README and setup instructions


| Field            | Value                                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Write root `README.md` with prerequisites, clone/install, env setup, MongoDB start, `db-init`, `seed`, run server + client, run tests. Verify instructions on a clean checkout. |
| **Dependencies** | P4-T05, P6-T08, P1-T03, P1-T04                                                                                                                                                  |
| **Complexity**   | Medium                                                                                                                                                                          |


**Acceptance criteria:**

- [ ] Fresh developer can run full app from README alone
- [ ] All npm scripts documented
- [ ] `.env.example` referenced
- [ ] Links to `docs/requirements-analysis.md` and `docs/tool-specific/cursor-workflow/`
- [ ] No secrets in repository (AC-10)

---



### P7-T02 — Acceptance criteria document


| Field            | Value                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create `docs/tool-specific/cursor-workflow/acceptance-criteria.md` with testable checklist mapped to AC-01–AC-17 from requirements analysis. Include manual and automated verification columns. |
| **Dependencies** | P6-T08, P4-T02                                                                                                                                                                                  |
| **Complexity**   | Low                                                                                                                                                                                             |


**Acceptance criteria:**

- [ ] Every Core acceptance criterion has verification steps
- [ ] State machine tests referenced for AC-06 and AC-11
- [ ] Document usable by reviewers

---



### P7-T03 — Testing notes and debugging evidence


| Field            | Value                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Create or update `docs/testing-notes.md` with test strategy summary, failures encountered, AI-assisted debugging steps, and commit references for notable fixes. |
| **Dependencies** | P4-T02, P6-T08                                                                                                                                                   |
| **Complexity**   | Low                                                                                                                                                              |


**Acceptance criteria:**

- [ ] Document exists with at least one real debugging example
- [ ] Test commands and coverage summary included
- [ ] References to state machine test matrix

---



### P7-T04 — Final Core review and definition of done


| Field            | Value                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**  | Walk through definition of done in `requirements-analysis.md` §14.4. Run `npm test`; manual acceptance; confirm artifacts complete. Fix any remaining gaps. |
| **Dependencies** | P7-T01, P7-T02, P7-T03, P4-T05, P6-T08                                                                                                                      |
| **Complexity**   | Medium                                                                                                                                                      |


**Acceptance criteria:**

- [ ] AC-01 through AC-17 verified (or N/A documented for Stretch-only items)
- [ ] `npm test` passes all integration tests
- [ ] No secrets in repo
- [ ] `docs/prompt-history.md` is up to date
- [ ] Core definition of done satisfied

---



## Dependency Graph (Critical Path)

```
P0 (Setup)
  └─► P1 (Database)
        └─► P2 (Backend Foundation)
              └─► P3-T01 (State Machine)
                    └─► P3-T02..T04 (Ticket Services)
                          └─► P3-T05..T07 (Comments + Routes)
                                ├─► P3-T08 (Smoke Test)
                                └─► P4 (Integration Tests) ──► P7
              P0-T03 ──► P5 (Frontend Foundation)
                          └─► P6 (Frontend Features)
                                └─► P6-T08 ──► P7 (Docs & Verification)
```

**Parallelization opportunity:** Phase 5 (frontend foundation) can start once P2-T05 (user API) and P3-T06 (ticket API) are available — P5-T03 depends on live API. Frontend feature work (Phase 6) should follow P3-T08 smoke test.

---



## Stretch Tasks (Optional — Not Core)


| ID    | Description                                      | Complexity |
| ----- | ------------------------------------------------ | ---------- |
| X-T01 | JWT/session authentication + protected routes    | High       |
| X-T02 | Role-based API authorization                     | High       |
| X-T03 | Filter by priority/assignee, sorting, pagination | Medium     |
| X-T04 | OpenAPI/Swagger documentation                    | Low        |
| X-T05 | Docker Compose for MongoDB + API + client        | Medium     |
| X-T06 | CI workflow (GitHub Actions) running tests       | Medium     |
| X-T07 | State machine unit tests (pure, no DB)           | Low        |
| X-T08 | User CRUD and role management UI                 | High       |


---



## Task Status Tracker


| Phase                    | Total  | Done  | Progress |
| ------------------------ | ------ | ----- | -------- |
| 0 — Setup                | 4      | 0     | 0%       |
| 1 — Database             | 4      | 0     | 0%       |
| 2 — Backend Foundation   | 5      | 0     | 0%       |
| 3 — Backend Domain & API | 8      | 0     | 0%       |
| 4 — Backend Testing      | 5      | 0     | 0%       |
| 5 — Frontend Foundation  | 6      | 0     | 0%       |
| 6 — Frontend Features    | 8      | 0     | 0%       |
| 7 — Documentation        | 4      | 0     | 0%       |
| **Total Core**           | **44** | **0** | **0%**   |


---

*Update task checkboxes and the status tracker as work progresses. Append significant scope changes to* `docs/prompt-history.md`*.*