# Test Strategy

**Document version:** 1.0 (migrated)  
**Date:** 2026-07-18  
**Scope:** Core tier

**Related:** [`acceptance-criteria.md`](acceptance-criteria.md) · [`implementation-plan.md`](implementation-plan.md) (Phase 4)

---

## Test Scope

Core verification requires automated state-machine integration tests, recommended API validation tests, and manual UI acceptance checks (AC-01–AC-08).

---

## 10. Testing Approach

### 10.1 Testing Pyramid (Core)

```
                    ┌─────────────┐
                    │  Manual UI  │  Exploratory, acceptance
                    └──────┬──────┘
               ┌─────────────┴─────────────┐
               │   API Integration Tests   │  ← Mandatory focus
               │  (Supertest + MongoDB)    │
               └─────────────┬─────────────┘
          ┌──────────────────┴──────────────────┐
          │     State Machine Unit Tests          │  ← Stretch
          │     (pure function, no DB)            │
          └───────────────────────────────────────┘
```

### 10.2 Test Infrastructure

| Component | Choice |
|-----------|--------|
| Runner | Vitest or Jest |
| HTTP testing | Supertest against Express app |
| Database | `mongodb-memory-server` (recommended) |
| Isolation | Fresh DB per test file or `beforeEach` collection drop |
| Seed | `fixtures.js` creates minimal users + ticket in `open` status |

### 10.3 Test File Organization

```
server/tests/
├── integration/
│   ├── setup.js              # connect, clear, seed base data
│   ├── stateMachine.test.js  # MANDATORY — 11 transition cases
│   ├── tickets.test.js       # CRUD, validation, search/filter
│   └── comments.test.js      # create, not-found cases
└── helpers/
    └── fixtures.js           # createUser, createTicket, createComment
```

### 10.4 Mandatory: State Machine Integration Tests

Each test exercises `PATCH /api/tickets/:id/status` via Supertest.

| # | Setup status | Requested status | Expected HTTP | Expected final status |
|---|--------------|------------------|---------------|---------------------|
| 1 | `open` | `in_progress` | 200 | `in_progress` |
| 2 | `open` | `cancelled` | 200 | `cancelled` |
| 3 | `in_progress` | `resolved` | 200 | `resolved` |
| 4 | `in_progress` | `cancelled` | 200 | `cancelled` |
| 5 | `resolved` | `closed` | 200 | `closed` |
| 6 | `open` | `resolved` | 400 | `open` (unchanged) |
| 7 | `open` | `closed` | 400 | `open` |
| 8 | `in_progress` | `open` | 400 | `in_progress` |
| 9 | `resolved` | `open` | 400 | `resolved` |
| 10 | `closed` | `in_progress` | 400 | `closed` |
| 11 | `cancelled` | `open` | 400 | `cancelled` |

**Additional mandatory assertions:**

- Error body contains `code: INVALID_STATUS_TRANSITION`
- `details.allowedTransitions` present on failure
- `PATCH /tickets/:id` with `status` in body returns 400

### 10.5 Recommended Integration Tests

#### tickets.test.js

| Test case | Assertion |
|-----------|-----------|
| POST /tickets — valid | 201, status defaults to `open` |
| POST /tickets — missing title | 400 `VALIDATION_ERROR` |
| POST /tickets — invalid createdBy | 404 or 400 |
| GET /tickets | 200, array |
| GET /tickets?status=open | Only open tickets |
| GET /tickets?search=keyword | Matches title or description |
| PATCH /tickets/:id — update title | 200, `updatedAt` changes |
| GET /tickets/:invalidId | 400 `INVALID_OBJECT_ID` |
| GET /tickets/:nonexistent | 404 |

#### comments.test.js

| Test case | Assertion |
|-----------|-----------|
| POST /tickets/:id/comments — valid | 201 |
| POST /tickets/:id/comments — empty message | 400 |
| POST /tickets/badId/comments | 404 or 400 |

### 10.6 Test Execution

| Command | Scope |
|---------|-------|
| `npm test` (in `server/`) | All integration tests |
| `npm run test:integration` | Integration only |
| `npm run test:watch` | Dev watch mode |

Document exact commands in root `README.md`.

### 10.7 Test Data Fixtures

| Fixture | Purpose |
|---------|---------|
| `seedUsers()` | Returns 3 user IDs |
| `createTicket(overrides)` | Ticket in specified status |
| `createComment(ticketId, overrides)` | Comment linked to ticket |

Use overrides to place tickets in specific statuses for transition tests without walking the full chain.

### 10.8 Manual Test Checklist (Acceptance)

Complement automated tests with manual verification for AC-01–AC-08:

- [ ] Create ticket via UI
- [ ] List persists after server restart
- [ ] Detail view shows comments
- [ ] Update fields and reassign
- [ ] Invalid transition shows error in UI
- [ ] Search and filter work in UI
- [ ] Acting-as selector changes `createdBy`

### 10.9 Debugging Evidence

Record in `debugging-notes.md`:

- Test failures encountered during development
- AI-suggested fixes that were wrong and how they were corrected
- Commit hashes for notable fixes

---

## Appendix A — API Contract

### A.1 Endpoints Summary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tickets` | List tickets |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Get ticket + comments |
| PATCH | `/api/tickets/:id` | Update fields (no status) |
| PATCH | `/api/tickets/:id/status` | Change status |
| POST | `/api/tickets/:id/comments` | Add comment |
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get user (optional) |

### A.2 Example: Create Ticket Request

```json
{
  "title": "Cannot login to dashboard",
  "description": "User reports 500 error after entering credentials.",
  "priority": "high",
  "assignedTo": "507f1f77bcf86cd799439011",
  "createdBy": "507f191e810c19729de860ea"
}
```

### A.3 Example: Ticket Response (Detail)

```json
{
  "ticket": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Cannot login to dashboard",
    "description": "User reports 500 error after entering credentials.",
    "priority": "high",
    "status": "open",
    "assignedTo": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Bob Admin",
      "email": "bob@example.com"
    },
    "createdBy": {
      "id": "507f191e810c19729de860ea",
      "name": "Jane Agent",
      "email": "jane@example.com"
    },
    "createdAt": "2026-07-10T10:00:00.000Z",
    "updatedAt": "2026-07-10T10:00:00.000Z"
  },
  "comments": [
    {
      "id": "507f1f77bcf86cd799439013",
      "message": "Reproduced in Chrome.",
      "createdBy": {
        "id": "507f191e810c19729de860ea",
        "name": "Jane Agent",
        "email": "jane@example.com"
      },
      "createdAt": "2026-07-10T11:00:00.000Z"
    }
  ]
}
```

### A.4 Example: Change Status Request

```json
{
  "status": "in_progress"
}
```

---

## Appendix B — Data Models

### B.1 Entity Relationship

```
User 1──* Ticket (createdBy)
User 1──* Ticket (assignedTo)
User 1──* Comment (createdBy)
Ticket 1──* Comment (ticketId)
```

### B.2 Enum Reference

**Status:** `open` | `in_progress` | `resolved` | `closed` | `cancelled`

**Priority:** `low` | `medium` | `high` | `critical`

**Role:** `agent` | `admin` | `viewer`

---

## Appendix C — Resolved Design Decisions

| ID | Question | Decision | Rationale |
|----|----------|----------|-----------|
| DD-01 | Separate status endpoint? | **Yes** — `PATCH /tickets/:id/status` | Prevents state machine bypass |
| DD-02 | Acting user without auth? | **Acting-as selector** in header | Meets FR-U03; persisted in localStorage |
| DD-03 | Comments on terminal tickets? | **Allowed** | Audit trail (BR-16) |
| DD-04 | Edit fields on terminal tickets? | **Allowed** | Metadata corrections; status still locked |
| DD-05 | Search case sensitivity? | **Case-insensitive** | Better UX |
| DD-06 | Same-status transition? | **Rejected** | Returns 400; no silent no-op |
| DD-07 | Concurrency | **Last-write-wins** | Sufficient for Core scale |
| DD-08 | Timestamps | **UTC** in DB; ISO in API | Standard practice |
| DD-09 | List sort default | **`updatedAt` descending** | Most recently updated first |
| DD-10 | HTTP framework | **Express** (recommended) | Ecosystem familiarity |

---

## Appendix D — Traceability Matrix

| Spec section | Requirements | Acceptance criteria |
|--------------|--------------|---------------------|
| §1 Architecture | FR-D01–D04, NFR-08 | AC-08, AC-12 |
| §3 Frontend | FR-T01–T04, FR-E02, NFR-13–15 | AC-01, AC-03–AC-05, AC-13 |
| §4 Backend | FR-E01, NFR-01–02, NFR-09 | AC-09 |
| §5 API flows | FR-T02, FR-Q01–Q02, FR-C01 | AC-02, AC-07 |
| §6 Error handling | FR-E02, FR-S03, NFR-06 | AC-06, AC-13 |
| §7 Validation | FR-E01, Section 9 reqs | AC-09, AC-10 |
| §8 Database | FR-D01–D04, NFR-02 | AC-08, AC-12 |
| §9 State machine | FR-S01–S04, BR-10–12, SM-01–05 | AC-06, AC-11 |
| §10 Testing | TEST-01–04, TEST-08 | AC-11 |

---

*This specification is the technical design baseline for implementation. All code changes should align with this document and trace back to `requirements-analysis.md`.*


---

## Acceptance Criteria (Testing Excerpt)

<!-- TODO: Extract TEST acceptance section -->

---

## Tests Not Covered (and why)

| Area | Status | Reason |
|------|--------|--------|
| Full E2E browser automation | Not implemented | Stretch / time-boxed Core |
| Frontend component unit tests | Partial | Utility/schema/filter unit tests in `frontend/src/**/*.test.ts` |
| State machine unit tests | Implemented | `backend/tests/unit/ticketStateMachine.test.ts` |
| Load/performance testing | Not implemented | Out of Core NFR scope |
| CI pipeline | Not implemented | Stretch tier |
