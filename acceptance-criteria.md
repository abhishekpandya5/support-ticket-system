# Acceptance Criteria — Support Ticket Management System

**Document version:** 1.0  
**Date:** 2026-07-11  
**Scope:** Core (mandatory)  
**Status:** Active — use for implementation verification and final review

**Source documents:**

- [`requirements-analysis.md`](requirements-analysis.md)
- [`tool-specific/cursor-workflow/spec.md`](tool-specific/cursor-workflow/spec.md)
- [`implementation-plan.md`](implementation-plan.md)
- [`tool-specific/cursor-workflow/project-context.md`](tool-specific/cursor-workflow/project-context.md)

---

## How to Use This Document

Each criterion is **measurable** — it has a clear pass condition and a specified verification method.

| Column | Meaning |
|--------|---------|
| **ID** | Unique identifier (`BE-`, `FE-`, `DB-`, `VAL-`, `SM-`, `TEST-`, `DOC-`, `PERF-`) |
| **Priority** | **Must** (Core gate) or **Should** (strong submission) |
| **Requirement ref** | Traceability to `requirements-analysis.md` |
| **Verification** | Manual (M), Automated (A), or Both (B) |

Mark criteria during review: `[ ]` not verified · `[x]` passed · `[~]` partial · `[!]` failed

---

## Definition of Done (Core)

The Core project is **accepted** when **all Must criteria** in every section pass, and:

1. Exercise criteria AC-01 through AC-13 are satisfied
2. `npm test` in `server/` exits with code `0`
3. A reviewer can run the app from README on a clean clone
4. No secrets are committed to the repository

---

## 1. Backend Acceptance Criteria

### 1.1 API Endpoints

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-01 | Must | Ticket list endpoint exists | `GET /api/tickets` returns HTTP `200` and JSON body with a `tickets` array (or bare array) | A | FR-T02 |
| BE-02 | Must | Ticket create endpoint exists | `POST /api/tickets` with valid body returns HTTP `201` and created ticket object | A | FR-T01 |
| BE-03 | Must | Ticket detail endpoint exists | `GET /api/tickets/:id` returns HTTP `200` with ticket and comments | A | FR-T03 |
| BE-04 | Must | Ticket field update endpoint exists | `PATCH /api/tickets/:id` updates title, description, priority, assignee | A | FR-T04 |
| BE-05 | Must | Dedicated status endpoint exists | `PATCH /api/tickets/:id/status` accepts `{ "status": "..." }` and returns HTTP `200` on valid transition | A | FR-S01, DD-01 |
| BE-06 | Must | Comment create endpoint exists | `POST /api/tickets/:id/comments` returns HTTP `201` with comment object | A | FR-C01 |
| BE-07 | Must | User list endpoint exists | `GET /api/users` returns HTTP `200` with ≥1 seeded user | A | FR-U04 |
| BE-08 | Should | User detail endpoint | `GET /api/users/:id` returns HTTP `200` for valid user, `404` for missing | A | FR-U04 |

### 1.2 HTTP Status Codes

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-09 | Must | Success codes correct | `GET`/`PATCH` success → `200`; `POST` create → `201` | A | Spec §10.5 |
| BE-10 | Must | Validation failures → 400 | Invalid body or business rule violation returns HTTP `400` | A | FR-E01 |
| BE-11 | Must | Not found → 404 | Non-existent ticket or user returns HTTP `404` with error envelope | A | FR-E03 |
| BE-12 | Must | Malformed ObjectId → 400 | `GET /api/tickets/not-valid-id` returns HTTP `400`, code `INVALID_OBJECT_ID` | A | Spec §6.3 |
| BE-13 | Must | Server errors are safe | Unhandled errors return HTTP `500` with generic message; no stack trace in response body | M + A | NFR-06 |

### 1.3 Error Response Format

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-14 | Must | Uniform error envelope | All `4xx`/`5xx` responses match `{ error: { code, message, details? } }` | A | Spec §6.2 |
| BE-15 | Must | Error codes are machine-readable | `error.code` is a string constant (e.g., `VALIDATION_ERROR`, `NOT_FOUND`) | A | Spec §6.3 |
| BE-16 | Should | Invalid transition detail | `INVALID_STATUS_TRANSITION` errors include `details.allowedTransitions` array | A | SM-02 |

### 1.4 Layered Architecture

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-17 | Must | Business logic in services | Controllers do not contain state machine or validation logic beyond request mapping | Code review | NFR-08, NFR-09 |
| BE-18 | Must | Routes are thin | Route files only bind paths to controllers | Code review | Spec §2.2 |
| BE-19 | Must | Services do not use HTTP objects | Service functions do not accept `req` or `res` | Code review | Spec §2.2 |
| BE-20 | Must | CORS enabled for dev | Frontend dev origin can call API without browser CORS errors | M | Spec §5.8 |

### 1.5 Ticket Business Rules

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-21 | Must | New ticket status is `open` | `POST /api/tickets` always creates ticket with `status: "open"` regardless of client input | A | FR-T05, BR-04 |
| BE-22 | Must | `updatedAt` changes on update | `PATCH /api/tickets/:id` or status change updates `updatedAt` to a newer timestamp | A | FR-T06, BR-09 |
| BE-23 | Must | Status blocked on field update | `PATCH /api/tickets/:id` with `status` in body returns HTTP `400`, code `STATUS_UPDATE_NOT_ALLOWED` | A | DD-01 |
| BE-24 | Must | Populated user refs | Ticket responses include `createdBy` and `assignedTo` as objects with `id`, `name`, `email` (or equivalent) | A | FR-U04 |
| BE-25 | Must | List supports search | `GET /api/tickets?search=term` returns only tickets where title or description matches (case-insensitive) | A | FR-Q01, BR-17 |
| BE-26 | Must | List supports status filter | `GET /api/tickets?status=open` returns only tickets with `status: "open"` | A | FR-Q02, BR-18 |
| BE-27 | Should | Combined search + filter | `GET /api/tickets?search=x&status=open` applies both filters | A | FR-Q03 |
| BE-28 | Must | List sort order | Tickets returned sorted by `updatedAt` descending (most recent first) | A | DD-09 |
| BE-29 | Should | Unassign ticket | `PATCH /api/tickets/:id` with `assignedTo: null` clears assignee | A | BR-07 |

### 1.6 Comment Business Rules

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-30 | Must | Comments on terminal tickets | `POST /api/tickets/:id/comments` succeeds when ticket status is `closed` or `cancelled` | A | BR-16, DD-03 |
| BE-31 | Must | Comments ordered in detail | `GET /api/tickets/:id` returns comments sorted `createdAt` ascending (oldest first) | A | FR-C03 |

### 1.7 Configuration & Security

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| BE-32 | Must | Environment-based config | `MONGODB_URI` and `PORT` read from environment; server fails clearly if `MONGODB_URI` missing | M | NFR-05 |
| BE-33 | Must | No hardcoded credentials | No database connection strings with real credentials in source code | Code review | NFR-04, AC-10 |
| BE-34 | Should | Rejected transitions logged | Invalid transition attempts logged at `warn` level on server | M | NFR-20 |

---

## 2. Frontend Acceptance Criteria

### 2.1 Routing & Navigation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-01 | Must | Ticket list route | Navigating to `/tickets` renders ticket list page | M | Spec §3.2 |
| FE-02 | Must | Create ticket route | Navigating to `/tickets/new` renders create form | M | AC-01 |
| FE-03 | Must | Ticket detail route | Navigating to `/tickets/:id` renders detail for valid ID | M | AC-03 |
| FE-04 | Must | Default route | Navigating to `/` renders the Dashboard page | M | `ui-flow.md` §3 |
| FE-05 | Must | Invalid ticket ID handling | Navigating to `/tickets/:invalidId` shows user-visible not-found state (not blank page) | M | FR-E03 |

### 2.2 Ticket List

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-06 | Must | Display all tickets | List shows tickets from database with title, status, priority, assignee, date | M | AC-02 |
| FE-07 | Must | Keyword search | Entering search text filters displayed tickets (after debounce ≤500ms) | M | AC-07 |
| FE-08 | Must | Status filter | Selecting a status shows only tickets in that status | M | AC-07 |
| FE-09 | Must | Empty search results | When no tickets match, empty state message is shown | M | NFR-15 |
| FE-10 | Must | Navigate to detail | Clicking a ticket navigates to its detail page | M | AC-03 |
| FE-11 | Must | Create ticket navigation | "Create ticket" control navigates to `/tickets/new` | M | AC-01 |

### 2.3 Create Ticket

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-12 | Must | Create via UI | Submitting valid form creates ticket visible in list and detail | M | AC-01 |
| FE-13 | Must | Required field indicators | Title, description, priority marked required in UI | M | NFR-13 |
| FE-14 | Must | Client-side required validation | Submit blocked when title or description empty; inline or banner message shown | M | Spec §9.2 |
| FE-15 | Must | Acting-as sets creator | `createdBy` sent from acting-as selector, not a manual free-text field | M | FR-U03, DD-02 |
| FE-16 | Must | Post-create navigation | Successful create redirects to new ticket detail page | M | Spec §3.5 |
| FE-17 | Must | Server error display | API validation failure shows user-visible error (banner or inline) | M | AC-13 |

### 2.4 Ticket Detail & Edit

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-18 | Must | All fields visible | Detail shows title, description, priority, status, assignee, creator, createdAt, updatedAt | M | AC-03 |
| FE-19 | Must | Update fields via UI | Editing title/description/priority/assignee and saving persists after page refresh | M | AC-04 |
| FE-20 | Must | Assignee dropdown | Assignee selectable from seeded users list | M | FR-U03 |
| FE-21 | Should | Edit on terminal tickets | Metadata editable on `closed`/`cancelled` tickets | M | DD-04 |
| FE-22 | Must | Loading state | Detail page shows loading indicator while fetching | M | Spec §3.7 |
| FE-23 | Must | Error state on fetch failure | API failure shows error message, not blank content | M | AC-13 |

### 2.5 Status Actions (UI)

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-24 | Must | `open` actions | Only "Start Progress" (→ `in_progress`) and "Cancel" (→ `cancelled`) shown | M | Spec §9.7 |
| FE-25 | Must | `in_progress` actions | Only "Mark Resolved" and "Cancel" shown | M | Spec §9.7 |
| FE-26 | Must | `resolved` actions | Only "Close" shown | M | Spec §9.7 |
| FE-27 | Must | Terminal — no actions | `closed` and `cancelled` show zero transition buttons | M | Spec §9.7 |
| FE-28 | Must | Successful transition updates UI | After valid transition, displayed status updates without full page reload (refetch acceptable) | M | AC-06 |
| FE-29 | Must | Rejected transition shows error | API `400` on transition displays server message; status in UI unchanged | M | AC-06, FR-S03 |
| FE-30 | Must | Actionable error text | Transition error message names current and requested status or uses server message verbatim | M | NFR-14 |

### 2.6 Comments

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-31 | Must | Add comment via UI | Submitting comment adds it to list with author name and timestamp | M | AC-05 |
| FE-32 | Must | Chronological order | Comments displayed oldest first | M | FR-C03 |
| FE-33 | Must | Empty message blocked | Submit blocked when message empty/whitespace | M | Spec §9.2 |
| FE-34 | Must | Comment on closed ticket | Comment form works on `closed` ticket | M | DD-03 |

### 2.7 Acting-as Selector

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-35 | Must | User dropdown populated | Selector lists all seeded users from API | M | DD-02 |
| FE-36 | Must | Selection persists | Acting-as choice survives page refresh (localStorage) | M | Spec §3.4 |
| FE-37 | Must | Visible in header | Current acting user name visible in app header | M | Spec §3.4 |

### 2.8 General UX

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| FE-38 | Must | Status labels readable | Status shown as human-readable label (e.g., "In Progress"), not raw enum only | M | NFR-13 |
| FE-39 | Must | Priority labels readable | Priority shown with clear label/badge | M | NFR-13 |
| FE-40 | Must | No blank loading screens | Every data-fetching view has loading, error, or empty handling | M | NFR-15 |
| FE-41 | Should | Form labels accessible | Form inputs have associated `<label>` or `aria-label` | M | Spec §3.7 |
| FE-42 | Must | XSS safe rendering | User-generated content (title, description, comments) rendered as text, not raw HTML | Code review | NFR-06 |

---

## 3. Database Acceptance Criteria

### 3.1 Collections & Schema

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DB-01 | Must | Three collections exist | MongoDB contains `users`, `tickets`, `comments` collections | M | Spec §8.1 |
| DB-02 | Must | User schema fields | User documents have `_id`, `name`, `email`, `role` | M | Spec §8.2 |
| DB-03 | Must | Ticket schema fields | Ticket documents have all required fields per spec §8.2 | M | Spec §8.2 |
| DB-04 | Must | Comment schema fields | Comment documents have `ticketId`, `message`, `createdBy`, `createdAt` | M | Spec §8.2 |
| DB-05 | Must | Enum values stored correctly | `status` and `priority` values match spec enums (lowercase snake_case) | M | Spec Appendix B |
| DB-06 | Must | ObjectId references | `createdBy`, `assignedTo`, `ticketId` store valid ObjectId refs | M | Spec §8.2 |

### 3.2 Indexes

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DB-07 | Must | Unique email index | `users.email` has unique index | M (shell) or script output | Spec §8.3 |
| DB-08 | Must | Status index | `tickets.status` indexed | M | Spec §8.3 |
| DB-09 | Must | Comments by ticket | `comments.ticketId` indexed | M | Spec §8.3 |
| DB-10 | Should | UpdatedAt index | `tickets.updatedAt` indexed descending | M | Spec §8.3 |

### 3.3 Scripts & Seed Data

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DB-11 | Must | Init script runs | `node scripts/db-init.js` completes without error | M | AC-12 |
| DB-12 | Must | Seed script runs | `node scripts/seed.js` completes without error | M | AC-12, FR-D04 |
| DB-13 | Must | Minimum user count | Seed creates ≥3 users with mixed roles | M | Spec §8.5 |
| DB-14 | Must | Tickets in all statuses | Seed includes ≥1 ticket in each of: `open`, `in_progress`, `resolved`, `closed`, `cancelled` | M | Spec §8.5 |
| DB-15 | Must | Seed includes comments | Seed creates ≥2 comments on different tickets | M | Spec §8.5 |
| DB-16 | Must | Init is idempotent | Running `db-init.js` twice does not error | M | P1-T03 |

### 3.4 Persistence

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DB-17 | Must | Data survives API restart | Create ticket → stop Node server → restart → ticket still returned by `GET /api/tickets` | M | AC-08, FR-D02 |
| DB-18 | Must | Data survives MongoDB restart | Create ticket → restart MongoDB → data still present | M | AC-08 |
| DB-19 | Must | No in-memory-only storage | Tickets not stored in process memory alone; confirmed by DB-17 | M | FR-D01 |
| DB-20 | Should | UTC timestamps | `createdAt`/`updatedAt` stored as Date type; API returns ISO 8601 UTC strings | A | DD-08 |

### 3.5 Environment

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DB-21 | Must | `MONGODB_URI` configurable | Connection string set via environment variable only | Code review | NFR-05 |
| DB-22 | Must | `.env.example` provided | Example URI documented without real credentials | M | AC-10 |

---

## 4. Validation Acceptance Criteria

### 4.1 Ticket Create Validation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| VAL-01 | Must | Title required | `POST /api/tickets` without title → HTTP `400`, `VALIDATION_ERROR` | A | BR-01 |
| VAL-02 | Must | Description required | Missing description → HTTP `400` | A | BR-01 |
| VAL-03 | Must | Priority required | Missing or invalid priority → HTTP `400` | A | BR-02 |
| VAL-04 | Must | Priority enum enforced | `priority: "urgent"` → HTTP `400` | A | BR-02 |
| VAL-05 | Must | `createdBy` required | Missing `createdBy` → HTTP `400` | A | BR-03 |
| VAL-06 | Must | `createdBy` must exist | Non-existent user ID → HTTP `404` or `400` | A | BR-03 |
| VAL-07 | Must | `assignedTo` must exist if set | Invalid assignee ID → HTTP `404` or `400` | A | BR-05 |
| VAL-08 | Should | Title max length | Title >200 chars → HTTP `400` | A | Spec §7.2 |
| VAL-09 | Should | Description max length | Description >5000 chars → HTTP `400` | A | Spec §7.2 |
| VAL-10 | Must | Client ignores status on create | Even if client sends `status: "closed"`, created ticket has `status: "open"` | A | BR-04 |

### 4.2 Ticket Update Validation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| VAL-11 | Must | Empty title rejected | `PATCH` with `title: ""` → HTTP `400` | A | Spec §7.2 |
| VAL-12 | Must | Invalid priority rejected | `PATCH` with invalid priority → HTTP `400` | A | Spec §7.2 |
| VAL-13 | Must | Status via wrong endpoint rejected | `PATCH /api/tickets/:id` with `status` field → HTTP `400` | A | DD-01 |
| VAL-14 | Should | Whitespace trimmed | `"  valid title  "` accepted; stored trimmed | A | Spec §7.2 |

### 4.3 Comment Validation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| VAL-15 | Must | Message required | Empty or whitespace-only message → HTTP `400` | A | BR-14 |
| VAL-16 | Must | Ticket must exist | Comment on non-existent ticket → HTTP `404` | A | BR-13 |
| VAL-17 | Must | `createdBy` must exist | Invalid user → HTTP `404` or `400` | A | BR-15 |
| VAL-18 | Should | Message max length | Message >2000 chars → HTTP `400` | A | Spec §7.2 |

### 4.4 Query Parameter Validation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| VAL-19 | Must | Invalid status filter | `?status=invalid` → HTTP `400` or empty result with ignored param (document behavior; prefer 400) | A | BR-15 |
| VAL-20 | Should | Empty search ignored | `?search=` returns all tickets (subject to status filter) | A | BR-19 |

### 4.5 Path Parameter Validation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| VAL-21 | Must | Invalid ObjectId in path | Malformed `:id` → HTTP `400`, `INVALID_OBJECT_ID` | A | Spec §9.1 |
| VAL-22 | Must | Valid but missing ID | Well-formed but non-existent ObjectId → HTTP `404` | A | FR-E03 |

### 4.6 Frontend Validation Mirror

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| VAL-23 | Must | Create form blocks empty submit | UI prevents submit without title and description | M | Spec §9.2 |
| VAL-24 | Must | Comment form blocks empty submit | UI prevents empty comment submit | M | Spec §9.2 |
| VAL-25 | Must | Server errors surfaced | Backend `400` responses displayed to user on all forms | M | FR-E02, AC-13 |

---

## 5. State Machine Acceptance Criteria

### 5.1 Module Design

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| SM-01 | Must | Single module owns rules | `stateMachine.js` (or equivalent) is the only backend module defining allowed transitions | Code review | NFR-09, SM-01 |
| SM-02 | Must | Pure module | State machine module has no Mongoose, Express, or DB imports | Code review | Spec §9.1 |
| SM-03 | Must | Exported API | Module exports `canTransition` and `getAllowedTransitions` (or equivalent) | Code review | Spec §9.2 |

### 5.2 Valid Transitions (Must Succeed — HTTP 200)

| ID | Priority | From | To | Verification | Req ref |
|----|----------|------|-----|--------------|---------|
| SM-04 | Must | `open` | `in_progress` | A | Spec §8.2 |
| SM-05 | Must | `open` | `cancelled` | A | Spec §8.2 |
| SM-06 | Must | `in_progress` | `resolved` | A | Spec §8.2 |
| SM-07 | Must | `in_progress` | `cancelled` | A | Spec §8.2 |
| SM-08 | Must | `resolved` | `closed` | A | Spec §8.2 |

### 5.3 Invalid Transitions (Must Fail — HTTP 400, Status Unchanged)

| ID | Priority | From | To | Verification | Req ref |
|----|----------|------|-----|--------------|---------|
| SM-09 | Must | `open` | `resolved` | A | Spec §8.4 |
| SM-10 | Must | `open` | `closed` | A | Spec §8.4 |
| SM-11 | Must | `in_progress` | `open` | A | Spec §8.4 |
| SM-12 | Must | `resolved` | `open` | A | Spec §8.4 |
| SM-13 | Must | `closed` | `in_progress` | A | Spec §8.4 |
| SM-14 | Must | `cancelled` | `open` | A | Spec §8.4 |

### 5.4 State Machine Error Contract

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| SM-15 | Must | Error code on failure | Invalid transition returns `error.code: "INVALID_STATUS_TRANSITION"` | A | SM-02 |
| SM-16 | Must | Status unchanged on failure | After failed transition, `GET /api/tickets/:id` shows original status | A | NFR-01 |
| SM-17 | Must | Same-status rejected | Requesting current status as target → HTTP `400` (no silent no-op) | A | DD-06 |
| SM-18 | Must | Atomic transition | No intermediate state persisted on failure | A | NFR-01 |

### 5.5 Bypass Prevention

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| SM-19 | Must | No status via field update | `PATCH /api/tickets/:id` cannot change status | A | Spec §9.6 |
| SM-20 | Must | Backend is authoritative | Removing frontend transition buttons does not weaken enforcement; API still rejects invalid transitions | A | BR-12 |
| SM-21 | Should | Frontend mirrors rules | `getAllowedTransitions` in client matches backend for all 5 statuses | Code review + M | SM-03 |

### 5.6 Terminal States

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| SM-22 | Must | `closed` is terminal | No transition from `closed` succeeds | A | BR-11 |
| SM-23 | Must | `cancelled` is terminal | No transition from `cancelled` succeeds | A | BR-11 |
| SM-24 | Must | `getAllowedTransitions('closed')` returns `[]` | Unit check or API + UI inspection | B | Spec §9.7 |

---

## 6. Testing Acceptance Criteria

### 6.1 Test Infrastructure

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| TEST-01 | Must | Tests runnable via npm | `npm test` in `server/` exits code `0` | A | TEST-03, AC-11 |
| TEST-02 | Must | Isolated test database | Tests use `mongodb-memory-server` or separate DB; no manual MongoDB required | A | NFR-12, TEST-08 |
| TEST-03 | Must | Tests are repeatable | Running `npm test` three times consecutively → `0` failures each run | A | NFR-12 |
| TEST-04 | Must | No UI dependency | Integration tests exercise API only (Supertest or equivalent) | Code review | TEST-04 |
| TEST-05 | Should | Test fixtures exist | `fixtures.js` provides `createUser`, `createTicket`, `createComment` | Code review | Spec §10.7 |

### 6.2 Mandatory State Machine Tests

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| TEST-06 | Must | All 5 valid transitions tested | SM-04 through SM-08 covered in `stateMachine.test.js` | A | TEST-01 |
| TEST-07 | Must | All 6 invalid transitions tested | SM-09 through SM-14 covered | A | TEST-02 |
| TEST-08 | Must | Error body assertions | Invalid tests assert `INVALID_STATUS_TRANSITION` and `allowedTransitions` | A | Spec §10.4 |
| TEST-09 | Must | Status bypass test | Test confirms `PATCH /tickets/:id` with `status` returns `400` | A | Spec §10.4 |

### 6.3 Recommended API Tests

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| TEST-10 | Should | Ticket create validation | Missing title test in `tickets.test.js` | A | TEST-05 |
| TEST-11 | Should | Ticket list and filter | GET list, `?status=`, `?search=` tests pass | A | TEST-07 |
| TEST-12 | Should | Ticket update | PATCH title updates `updatedAt` | A | Spec §10.5 |
| TEST-13 | Should | ObjectId validation | Invalid ID → `400` | A | Spec §10.5 |
| TEST-14 | Should | Comment validation | Empty message and missing ticket tests pass | A | TEST-06 |

### 6.4 Manual Testing

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| TEST-15 | Must | Manual UI checklist complete | All items in spec §10.8 verified and recorded | M | AC-01–AC-08 |
| TEST-16 | Should | Testing notes documented | `debugging-notes.md` exists with ≥1 debugging example | M | Spec §10.9 |
| TEST-17 | Should | Acting-as verified manually | Changing acting user changes `createdBy` on new ticket/comment | M | DD-02 |

### 6.5 Exercise Assessment Gate

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| TEST-18 | Must | State machine tests pass | `npm test` includes state machine suite; 0 failures | A | AC-11 |
| TEST-19 | Must | Tests documented in README | README lists exact command to run tests | M | AC-16 |

---

## 7. Documentation Acceptance Criteria

### 7.1 README

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DOC-01 | Must | Prerequisites listed | Node.js version and MongoDB requirement documented | M | NFR-10 |
| DOC-02 | Must | Install steps | Clone, `npm install` for client and server documented | M | AC-16 |
| DOC-03 | Must | Environment setup | How to copy `.env.example` → `.env` documented | M | NFR-05 |
| DOC-04 | Must | Database setup steps | Commands to run `db-init` and `seed` documented | M | AC-12 |
| DOC-05 | Must | Start application | Commands to start backend and frontend (separate terminals) documented | M | AC-16 |
| DOC-06 | Must | Test command | `npm test` command and expected outcome documented | M | TEST-19 |
| DOC-07 | Must | Fresh clone works | Reviewer following README only can run app without undeclared steps | M | NFR-18, AC-16 |
| DOC-08 | Should | Architecture overview | Brief description of React + Node + MongoDB stack with link to `design-notes.md` | M | NFR-10 |

### 7.2 Lifecycle Artifacts

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DOC-09 | Must | Requirements analysis | `requirements-analysis.md` exists and is current (v1.1+) | M | AC-14 |
| DOC-10 | Must | Prompt history | `ai-prompts/` exists with append-only entries | M | AC-15 |
| DOC-11 | Must | Project context | `tool-specific/cursor-workflow/project-context.md` exists | M | AC-17 |
| DOC-12 | Must | Technical spec | `tool-specific/cursor-workflow/spec.md` exists | M | AC-17 |
| DOC-13 | Must | Tasks breakdown | `implementation-plan.md` exists | M | AC-17 |
| DOC-14 | Must | Acceptance criteria | This document exists | M | AC-17 |
| DOC-15 | Should | Testing notes | `debugging-notes.md` exists | M | Spec §10.9 |
| DOC-16 | Should | Cursor rules | `.cursor/rules/` contains project instructions | M | AC-17 |

### 7.3 Security Documentation

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DOC-17 | Must | No secrets in repo | `git grep` for known credential patterns finds none; `.env` gitignored | M | AC-10 |
| DOC-18 | Must | `.env.example` only | Example env file has placeholders, not real secrets | M | AC-10 |

### 7.4 Traceability

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| DOC-19 | Should | Requirements traceable | Features in README or spec reference requirement IDs | Code review | NFR-08 |
| DOC-20 | Should | Known limitations documented | Stretch items and deferred features listed (auth, pagination) | M | Spec scope |

---

## 8. Performance Acceptance Criteria

> Core has no formal SLA. Criteria below define **acceptable minimums** for demo/assessment scale (<1000 tickets).

| ID | Priority | Criterion | Pass condition | Verification | Req ref |
|----|----------|-----------|----------------|--------------|---------|
| PERF-01 | Should | List response time | `GET /api/tickets` with seed data (~20 tickets) completes in **<500ms** (local) | M (browser devtools or curl `-w`) | NFR-16 |
| PERF-02 | Should | Detail response time | `GET /api/tickets/:id` completes in **<500ms** (local) | M | NFR-16 |
| PERF-03 | Should | Create ticket response | `POST /api/tickets` completes in **<500ms** (local) | M | NFR-16 |
| PERF-04 | Should | Search acceptable at scale | `GET /api/tickets?search=term` with 100 seeded tickets completes in **<1s** (local) | M | NFR-17 |
| PERF-05 | Should | No N+1 query explosion | List endpoint uses ≤2 DB queries (or populated single query), not per-ticket queries | Code review | NFR-16 |
| PERF-06 | Should | Frontend perceived load | List page shows loading indicator within **100ms** of navigation; content within **2s** on local setup | M | Spec §3.7 |
| PERF-07 | Should | Search debounce | Search input debounced ≥200ms to avoid excessive API calls while typing | Code review | Spec §3.5 |
| PERF-08 | May | Indexes used | MongoDB explain shows index use on `status` filter query | M (optional) | Spec §8.3 |

**Note:** Performance criteria are **Should** for Core — failures do not block acceptance unless they indicate a fundamental design problem (e.g., loading all comments on every list request).

---

## 9. Exercise Core Criteria Cross-Reference

Maps assessment **Core Acceptance Criteria** (AC-01–AC-17) to sections in this document.

| Exercise AC | Description | Covered by |
|-------------|-------------|------------|
| AC-01 | Create ticket via UI | FE-12, TEST-15 |
| AC-02 | View all tickets from DB | FE-06, DB-17, TEST-15 |
| AC-03 | Ticket detail view | FE-03, FE-18, TEST-15 |
| AC-04 | Update fields and reassign | FE-19, BE-04, TEST-15 |
| AC-05 | Add comments | FE-31, BE-06, TEST-15 |
| AC-06 | Valid transitions only | SM-04–SM-24, FE-24–FE-30, TEST-06–TEST-09 |
| AC-07 | Search and status filter | FE-07, FE-08, BE-25, BE-26, TEST-11 |
| AC-08 | Data survives restart | DB-17, DB-18, TEST-15 |
| AC-09 | Backend validation | VAL-01–VAL-22, TEST-10 |
| AC-10 | No secrets in repo | BE-33, DB-22, DOC-17, DOC-18 |
| AC-11 | State machine tests pass | TEST-01, TEST-06–TEST-09, TEST-18 |
| AC-12 | DB init/seed from README | DB-11, DB-12, DOC-04, DOC-07 |
| AC-13 | Meaningful UI errors | FE-17, FE-23, FE-29, VAL-25, TEST-15 |
| AC-14 | Requirements analysis | DOC-09 |
| AC-15 | Prompt history | DOC-10 |
| AC-16 | README complete | DOC-01–DOC-07 |
| AC-17 | Tool-specific artifacts | DOC-11–DOC-14, DOC-16 |

---

## 10. Review Checklists

### 10.1 Pre-Submission Gate (Must all pass)

```
Backend
  [x] BE-01 – BE-07    All core endpoints respond correctly
  [x] BE-21 – BE-23    Ticket business rules enforced
  [x] BE-14, BE-15     Error envelope consistent

State Machine
  [x] SM-04 – SM-08    All valid transitions succeed (automated)
  [x] SM-09 – SM-14    All invalid transitions fail (automated)
  [x] SM-19            No status bypass via field update

Testing
  [x] TEST-01, TEST-18 npm test exits 0
  [x] TEST-15            Manual UI checklist complete

Database
  [x] DB-17, DB-18       Persistence verified
  [x] DB-11 – DB-15      Scripts and seed data complete

Documentation
  [x] DOC-07             Fresh clone setup works
  [x] DOC-17             No secrets in repo

Frontend
  [x] FE-12 – FE-19      Core user flows work
  [x] FE-24 – FE-29      Status UI correct
  [x] FE-29, VAL-25      Errors visible to user
```

### 10.2 Strong Submission Additions (Should pass)

```
  [x] TEST-10 – TEST-14  Full API integration coverage
  [x] FE-41              Accessible form labels
  [x] PERF-01 – PERF-04  Response times acceptable (local demo scale)
  [x] DOC-15             Testing notes with debugging evidence
  [x] DOC-20             Known limitations documented
```

---

## 11. Sign-Off Template

| Field | Value |
|-------|-------|
| **Reviewer** | Abhishek Pandya (self-verification) |
| **Date** | 2026-07-20 |
| **Commit / tag** | Pre-submission HEAD |
| **Must criteria passed** | 88 / 88 (PERF May-tier excluded) |
| **Should criteria passed** | Strong-submission checklist §10.2 complete |
| **npm test result** | Pass (backend 52, frontend 13) |
| **Fresh README setup** | Pass |
| **Overall Core acceptance** | **Accepted** |
| **Notes** | Verified against `test-results.md`, automated suites, and manual UI screenshots. See `pr-description.md` for known limitations. |

---

*Update this document if scope or spec changes. Version increments should be noted at the top.*
