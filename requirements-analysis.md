# Requirements Analysis — Support Ticket Management System

**Document version:** 1.1  
**Date:** 2026-07-10  
**Phase:** Planning / Requirement Analysis  
**Source:** JS AI Capability Exercise — Participant Guide (Support Ticket Management System, Core tier)

---

## 1. Project Overview

### 1.1 Purpose

The Support Ticket Management System is a small, production-quality full-stack web application for internal users to create, track, update, comment on, search, and progress support tickets through a strictly enforced lifecycle. It is the mandatory **Core** deliverable for the AI Capability Exercise (Part B), scoped for roughly 8–12 focused hours of application work, with additional effort allocated to lifecycle artifacts (requirement analysis, prompt history, testing notes, reflection).

### 1.2 Scope

| In scope (Core) | Out of scope (Core) |
|-----------------|---------------------|
| Ticket CRUD (create, list, detail, update fields) | User management UI (CRUD for users) |
| Comment creation on tickets | Authentication / authorization |
| Status transitions via enforced state machine | Pagination, sorting, advanced filters |
| Keyword search and status filter | API documentation (Swagger/OpenAPI) |
| Backend validation and meaningful UI error states | Docker, CI pipelines |
| Database persistence with MongoDB init scripts and seed data | Full role-based access control |
| Integration tests for state-machine rules | Third entity beyond User/Ticket/Comment |

Users are **seeded only** — no user-management UI is required for Core. Authentication is optional and counts toward Stretch if implemented well.

### 1.3 Technical Stack (Selected)

The following stack is selected for this project:

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | React (SPA) | Single-page application that consumes the backend REST API via HTTP (e.g., `fetch` or Axios) |
| **Backend** | Node.js | REST API server exposing ticket, comment, and user-read endpoints |
| **Database** | MongoDB | Document persistence with initialization/migration scripts and seed data |
| **Testing** | Node test runner (e.g., Jest, Vitest, or Supertest-based suite) | At minimum, integration tests proving state-machine behavior |

**Architecture pattern:** React SPA ↔ REST JSON API (Node.js) ↔ MongoDB

- The frontend is decoupled from the backend and communicates exclusively through REST endpoints.
- The backend owns all business logic, validation, and state-machine enforcement.
- MongoDB stores users, tickets, and comments as collections with reference fields between documents.

### 1.4 Deliverables Beyond the Application

Per the exercise guide, the repository must also contain lifecycle artifacts regardless of application size:

- Requirement analysis (this document)
- Design notes and task breakdown
- Full prompt history
- Testing and debugging notes
- Reflection and PR description
- README with local setup instructions
- Tool-specific workflow artifacts (e.g., `tool-specific/cursor-workflow/` for Cursor users)

### 1.5 Success Definition

A strong Core submission is a **clean, well-documented, working application** where reviewers can trace requirements → design → implementation → tests, and where the state machine is correctly enforced at the backend with clear frontend handling of invalid transitions.

---

## 2. Business Problem

### 2.1 Problem Statement

Internal teams handling support requests lack a lightweight, persistent system to track issues from creation through resolution. Without structured ticket management:

- Support items are lost in email or chat threads
- Ownership and priority are unclear
- Progress cannot be audited or reported consistently
- Invalid status changes (e.g., reopening a closed ticket without rules) create data inconsistency

### 2.2 Business Goals

1. **Centralize** support requests in a single system with durable storage
2. **Standardize** ticket lifecycle through an explicit state machine
3. **Enable collaboration** via comments tied to tickets
4. **Improve discoverability** through keyword search and status filtering
5. **Ensure data integrity** via server-side validation and transition rules

### 2.3 Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| Internal support agents | Create, assign, update, and resolve tickets |
| Team leads / managers | View ticket status distribution and assignments |
| Developers (exercise participant) | Deliver a working system demonstrating engineering judgment |
| Reviewers (competency team) | Evaluate AI-assisted workflow, not only the running app |

### 2.4 Constraints

- **Time-boxed:** Core scoped for ~8–12 hours; artifacts are equally important
- **No auth in Core:** Application operates in a trusted internal context with seeded users
- **Small surface area:** Three entities only; complexity is intentional in the state machine
- **No secrets in repo:** Credentials via environment variables only

---

## 3. Functional Requirements

### 3.1 Ticket Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-T01 | The system shall allow a user to **create a ticket** with at minimum: title, description, priority, and creator (from seeded users). | Must |
| FR-T02 | The system shall **list all tickets** retrieved from persistent storage. | Must |
| FR-T03 | The system shall provide a **ticket detail view** showing all ticket fields, assignee, timestamps, status, and associated comments. | Must |
| FR-T04 | The system shall allow **updating ticket fields**: title, description, priority, and assignee (`assignedTo`). | Must |
| FR-T05 | New tickets shall be created with an initial status of **Open** (unless explicitly specified otherwise in design). | Must |
| FR-T06 | The system shall record `createdAt` and `updatedAt` timestamps on tickets; `updatedAt` shall change on any ticket modification. | Must |

### 3.2 Status Lifecycle

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-S01 | The system shall enforce ticket status changes **only** through the defined state machine (see Section 8). | Must |
| FR-S02 | Invalid status transitions shall be **rejected by the backend** with a clear error response. | Must |
| FR-S03 | The frontend shall **display meaningful feedback** when a transition is rejected. | Must |
| FR-S04 | Status changes shall be distinguishable from general field updates (may be same or separate API operation; design decision). | Should |

### 3.3 Comments

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C01 | The system shall allow **adding comments** to an existing ticket. | Must |
| FR-C02 | Each comment shall store: message body, creating user, creation timestamp, and parent ticket reference. | Must |
| FR-C03 | Comments shall appear on the ticket detail view in chronological order. | Must |
| FR-C04 | Comments are **append-only** in Core (no edit/delete required). | Must |

### 3.4 Search and Filter

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-Q01 | The system shall support **keyword search** across ticket fields (at minimum title and description; design may extend to comments). | Must |
| FR-Q02 | The system shall support **filtering tickets by status**. | Must |
| FR-Q03 | Search and filter may be combinable (e.g., keyword + status filter). | Should |

### 3.5 Users (Seeded)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-U01 | Users shall exist in the database with: id, name, email, role. | Must |
| FR-U02 | Users shall be populated via **seed data**; no user-management UI in Core. | Must |
| FR-U03 | The UI shall allow selecting a seeded user as **creator** or **assignee** when creating/updating tickets (mechanism TBD: dropdown, session-less "acting as" selector). | Must |
| FR-U04 | The API shall expose enough user information for assignee selection and display (e.g., list users or embed user details in ticket responses). | Must |

### 3.6 Data Persistence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-D01 | All tickets, comments, and users shall persist in a database. | Must |
| FR-D02 | Data shall **survive application restart**. | Must |
| FR-D03 | MongoDB collections, indexes, and schema validation shall be established via initialization or migration scripts. | Must |
| FR-D04 | Sample/seed data shall be provided for local development and demonstration. | Must |

### 3.7 Error Handling and Validation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-E01 | The backend shall **validate all required fields** and reject invalid input before persistence. | Must |
| FR-E02 | The frontend shall surface validation and business-rule errors in a user-visible manner. | Must |
| FR-E03 | The system shall handle not-found resources (e.g., invalid ticket ID) with appropriate HTTP status codes. | Must |

### 3.8 Stretch Functional Requirements (Optional — Not Core)

| ID | Requirement |
|----|-------------|
| FR-X01 | Full user CRUD and role management |
| FR-X02 | Authentication (login/logout), JWT or session, protected routes, API authorization |
| FR-X03 | Filter by priority and assignee; sorting; pagination |
| FR-X04 | Third entity or richer data model (e.g., categories, attachments, audit log) |
| FR-X05 | API documentation (OpenAPI/Swagger) |

---

## 4. Non-Functional Requirements

### 4.1 Reliability and Data Integrity

| ID | Requirement |
|----|-------------|
| NFR-01 | Status transitions must be atomic; partial updates that leave ticket in an inconsistent state are unacceptable. |
| NFR-02 | MongoDB schema validation (e.g., Mongoose schemas) and application-layer checks should reinforce business rules; reference integrity for `createdBy`, `assignedTo`, and `ticketId` is enforced in the Node.js service layer. |
| NFR-03 | Concurrent updates to the same ticket should not corrupt data (optimistic locking or last-write-wins with documented behavior). |

### 4.2 Security

| ID | Requirement |
|----|-------------|
| NFR-04 | **No secrets** (passwords, API keys, connection strings with credentials) committed to the repository. |
| NFR-05 | Environment variables used for database connection and configuration; `.env.example` provided if applicable. |
| NFR-06 | Input sanitization to mitigate injection (NoSQL injection via typed queries/ODM and validated inputs; XSS via output encoding in the React UI). |
| NFR-07 | Authentication optional for Core; if added in Stretch, must include proper session/token handling. |

### 4.3 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-08 | Code organized into clear layers: routes/controllers, services/domain, data access, models. |
| NFR-09 | State machine logic centralized in one module/service — not duplicated across handlers. |
| NFR-10 | README documents prerequisites, setup, migration, seed, run, and test commands. |

### 4.4 Testability

| ID | Requirement |
|----|-------------|
| NFR-11 | State machine rules testable in isolation or via integration tests without UI. |
| NFR-12 | MongoDB test database strategy documented (e.g., separate database name, `mongodb-memory-server`, or Docker); tests repeatable locally. |

### 4.5 Usability

| ID | Requirement |
|----|-------------|
| NFR-13 | UI provides clear labels for status, priority, and assignee. |
| NFR-14 | Invalid transition attempts show actionable error messages (e.g., "Cannot move from Closed to In Progress"). |
| NFR-15 | Empty states handled (no tickets, no comments, no search results). |

### 4.6 Performance (Core — Light)

| ID | Requirement |
|----|-------------|
| NFR-16 | Acceptable response times for list/detail on seed-scale data (< 1000 tickets); no formal SLA required. |
| NFR-17 | Search implemented efficiently enough for demo data; full-text indexing optional for Core. |

### 4.7 Portability

| ID | Requirement |
|----|-------------|
| NFR-18 | Application runnable locally from README instructions on a standard developer machine. |
| NFR-19 | Database choice documented with rationale. |

### 4.8 Observability (Minimal for Core)

| ID | Requirement |
|----|-------------|
| NFR-20 | Structured or readable server logs for errors and rejected transitions (recommended). |

---

## 5. User Roles

Core requires seeded users with a `role` field but **does not require role-based authorization**. Roles are data attributes that support future Stretch work and realistic seed data.

### 5.1 Role Definitions (Logical)

| Role | Description | Core Permissions (Logical — No Auth Enforcement) |
|------|-------------|---------------------------------------------------|
| **Agent** | Front-line support staff who handle tickets | Create tickets, comment, update fields, change status per state machine, search/filter |
| **Admin** | Team lead or system administrator | Same as Agent in Core; Stretch may add user management |
| **Viewer** (optional seed role) | Read-only stakeholder | View tickets and comments only — enforce only if Stretch auth added |

### 5.2 Acting User Model (Core)

Because authentication is not required, the application must define how `createdBy` and comment authorship are determined:

- **Recommended approach:** UI "Acting as" user selector (from seeded users), passed to API on create/update/comment operations
- **Alternative:** Hard-coded default user for all operations (weaker UX, still valid for minimal Core)

### 5.3 Stretch Considerations

If authentication is implemented:

- Agents can manage tickets but not users
- Admins can manage users and roles
- Viewers have read-only API and UI access
- Protected routes and API middleware enforce role checks

---

## 6. Entities

### 6.1 Entity Relationship Overview

```
User 1──* Ticket (createdBy)
User 1──* Ticket (assignedTo)
User 1──* Comment (createdBy)
Ticket 1──* Comment
```

### 6.2 User

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| id | ObjectId (MongoDB) | Yes | Primary key (`_id`) |
| name | string | Yes | Display name |
| email | string | Yes | Unique index recommended |
| role | enum/string | Yes | e.g., `agent`, `admin`, `viewer` |

**Core behavior:** Seeded only; read via API as needed for dropdowns and display.

### 6.3 Ticket

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| id | ObjectId (MongoDB) | Yes | Primary key (`_id`) |
| title | string | Yes | Short summary |
| description | string | Yes | Full issue details |
| priority | enum | Yes | e.g., `low`, `medium`, `high`, `critical` |
| status | enum | Yes | `open`, `in_progress`, `resolved`, `closed`, `cancelled` |
| assignedTo | ObjectId ref → User | No | Optional; null if unassigned |
| createdBy | ObjectId ref → User | Yes | Ticket creator |
| createdAt | Date | Yes | Set on create |
| updatedAt | Date | Yes | Set on create and every update |

### 6.4 Comment

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| id | ObjectId (MongoDB) | Yes | Primary key (`_id`) |
| ticketId | ObjectId ref → Ticket | Yes | Parent ticket |
| message | string | Yes | Comment body |
| createdBy | ObjectId ref → User | Yes | Author |
| createdAt | Date | Yes | Set on create |

### 6.5 Enumerations

**Priority (proposed):** `low`, `medium`, `high`, `critical`

**Status (required by spec):** `open`, `in_progress`, `resolved`, `closed`, `cancelled`

Exact casing and storage format (SCREAMING_SNAKE vs lowercase) is an implementation choice but must be consistent across API, database, and UI.

---

## 7. Business Rules

### 7.1 Ticket Creation

| Rule ID | Rule |
|---------|------|
| BR-01 | Title and description are mandatory. |
| BR-02 | Priority must be a valid enum value. |
| BR-03 | `createdBy` must reference an existing seeded user. |
| BR-04 | New tickets start with status `open`. |
| BR-05 | `assignedTo` is optional at creation; if provided, must reference an existing user. |

### 7.2 Ticket Update

| Rule ID | Rule |
|---------|------|
| BR-06 | Title, description, priority, and assignee may be updated independently of status. |
| BR-07 | Assignee may be set to null (unassigned) if the data model supports it. |
| BR-08 | Updating fields on a `closed` or `cancelled` ticket: Core does not explicitly forbid field edits on terminal statuses; recommend allowing comment and metadata updates but **not** status reopening without Stretch rules. Document chosen behavior. |
| BR-09 | `updatedAt` must reflect the latest modification time. |

### 7.3 Status Transitions

| Rule ID | Rule |
|---------|------|
| BR-10 | Only transitions defined in the state machine (Section 8) are permitted. |
| BR-11 | `closed` and `cancelled` are terminal states in Core — no outbound transitions. |
| BR-12 | Backend is the **source of truth** for transition validity; frontend mirrors rules for UX but cannot be sole enforcer. |

### 7.4 Comments

| Rule ID | Rule |
|---------|------|
| BR-13 | Comments may only be added to existing tickets. |
| BR-14 | Comment message must be non-empty (after trim). |
| BR-15 | `createdBy` must reference an existing user. |
| BR-16 | Comments may be allowed on tickets in any status (recommended for audit trail). |

### 7.5 Search and Filter

| Rule ID | Rule |
|---------|------|
| BR-17 | Keyword search matches against ticket title and description (minimum). |
| BR-18 | Status filter limits results to a single status or "all" when unset. |
| BR-19 | Empty search keyword returns all tickets (subject to status filter). |

### 7.6 Referential Integrity

| Rule ID | Rule |
|---------|------|
| BR-20 | Deleting a user who is referenced by tickets or comments is not required in Core; seed data should remain stable. |
| BR-21 | Deleting a ticket with comments: Core does not require delete; if implemented, cascade rules must be defined. |

---

## 8. State Machine Requirements

The state machine is the **signature judgment piece** of the Core project. It must be implemented with explicit, testable rules.

### 8.1 States

| State | Description |
|-------|-------------|
| **Open** | Ticket created, not yet being worked |
| **In Progress** | Actively being handled |
| **Resolved** | Work complete, awaiting closure |
| **Closed** | Terminal — ticket fully completed |
| **Cancelled** | Terminal — ticket withdrawn or invalid |

### 8.2 Allowed Transitions

| From | To | Meaning |
|------|-----|---------|
| Open | In Progress | Work started |
| Open | Cancelled | Ticket withdrawn before work |
| In Progress | Resolved | Fix/work completed |
| In Progress | Cancelled | Work abandoned |
| Resolved | Closed | Resolution accepted, ticket archived |

### 8.3 Transition Diagram

```
                    ┌─────────────┐
                    │    Open     │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               │               ▼
   ┌───────────────┐       │       ┌───────────────┐
   │  In Progress  │       │       │  Cancelled    │ (terminal)
   └───────┬───────┘       │       └───────────────┘
           │               │
     ┌─────┴─────┐         │
     ▼           ▼         ▼
┌─────────┐ ┌───────────┐
│Resolved │ │ Cancelled │
└────┬────┘ └───────────┘
     │
     ▼
┌─────────┐
│ Closed  │ (terminal)
└─────────┘
```

### 8.4 Explicitly Forbidden Transitions (Sample — Non-Exhaustive)

| From | To | Reason |
|------|-----|--------|
| Open | Resolved | Must go through In Progress |
| Open | Closed | Must go through In Progress → Resolved |
| In Progress | Open | No backward transition defined |
| In Progress | Closed | Must resolve first |
| Resolved | Open | No reopen in Core |
| Resolved | In Progress | No reopen in Core |
| Resolved | Cancelled | Not defined |
| Closed | *any* | Terminal state |
| Cancelled | *any* | Terminal state |

### 8.5 Implementation Requirements

| ID | Requirement |
|----|-------------|
| SM-01 | Transition validation logic lives in a dedicated domain module (e.g., `canTransition(from, to)`). |
| SM-02 | API returns `4xx` (recommend `400` or `409`) with structured error body on invalid transition. |
| SM-03 | UI disables or hides invalid transition actions based on current status. |
| SM-04 | UI still handles unexpected API rejection gracefully (defense in depth). |
| SM-05 | Integration tests cover **every allowed** transition (success) and **representative forbidden** transitions (failure). |

---

## 9. Validation Requirements

### 9.1 Backend Validation (Mandatory)

| Field / Operation | Rules |
|-------------------|-------|
| Ticket.title | Required; min length 1; max length TBD (recommend 200) |
| Ticket.description | Required; min length 1; max length TBD (recommend 5000) |
| Ticket.priority | Required; must be valid enum |
| Ticket.status | Required; must be valid enum; changes must pass state machine |
| Ticket.createdBy | Required; must reference an existing document in the `users` collection (valid ObjectId) |
| Ticket.assignedTo | Optional; if present, must reference an existing document in the `users` collection (valid ObjectId) |
| Comment.message | Required; non-whitespace; max length TBD (recommend 2000) |
| Comment.ticketId | Required; ticket must exist in the `tickets` collection |
| Comment.createdBy | Required; user must exist in the `users` collection |
| IDs in URL/path | Must be valid MongoDB ObjectId format; resource must exist or return 404 |

### 9.2 Frontend Validation (React SPA)

| Area | Rules |
|------|-------|
| Create ticket form | Inline validation before submit; required field indicators |
| Update ticket form | Same as create where applicable |
| Status change | Only offer valid target statuses |
| Comment form | Non-empty message |
| API errors | Map server validation errors to field-level or toast/banner messages |

### 9.3 Error Response Shape (Recommended)

```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot transition from 'closed' to 'in_progress'.",
    "details": {
      "from": "closed",
      "to": "in_progress"
    }
  }
}
```

Consistency across endpoints is recommended but exact schema is a design decision.

---

## 10. API Requirements

The **Node.js** backend exposes a **REST-style JSON API** consumed by the **React SPA**. Exact route paths and framework choice (e.g., Express, Fastify) are design decisions; the capabilities below are mandatory.

- Base URL configured in the React app (e.g., `http://localhost:3001/api`)
- CORS enabled for local development between frontend dev server and API
- Request/response bodies use `application/json`

### 10.1 Ticket Endpoints

| Method | Endpoint (illustrative) | Purpose |
|--------|-------------------------|---------|
| GET | `/api/tickets` | List tickets; supports `?search=` and `?status=` query params |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Get ticket detail with comments |
| PATCH or PUT | `/api/tickets/:id` | Update title, description, priority, assignee |
| PATCH | `/api/tickets/:id/status` | Change status (may be merged with update if transition validated) |

### 10.2 Comment Endpoints

| Method | Endpoint (illustrative) | Purpose |
|--------|-------------------------|---------|
| POST | `/api/tickets/:id/comments` | Add comment to ticket |
| GET | `/api/tickets/:id/comments` | List comments (optional if included in ticket detail) |

### 10.3 User Endpoints

| Method | Endpoint (illustrative) | Purpose |
|--------|-------------------------|---------|
| GET | `/api/users` | List seeded users for assignee/creator selection |
| GET | `/api/users/:id` | Optional; user detail |

### 10.4 Query Parameters (List Tickets)

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Keyword search on title/description |
| `status` | string | Filter by ticket status |

### 10.5 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PATCH, PUT |
| 201 | Successful POST (create) |
| 400 | Validation failure, invalid transition |
| 404 | Ticket, user, or comment parent not found |
| 500 | Unexpected server error (with safe message to client) |

### 10.6 API Design Principles

- JSON request/response bodies
- ISO 8601 timestamps in API responses
- Consistent naming (camelCase in JSON is conventional for JS stacks)
- Idempotent GET; safe retries on read
- Status change should not succeed via generic update endpoint without transition checks (avoid bypass)

---

## 11. Database Requirements

### 11.1 Database Selection

**MongoDB** is the selected database for this project.

| Rationale | Detail |
|-----------|--------|
| Stack alignment | Pairs naturally with Node.js via Mongoose or the native MongoDB driver |
| Document model | Tickets with embedded metadata and referenced comments map cleanly to collections |
| Local development | MongoDB Community Server or Docker-based MongoDB instance for local runs |
| Assessment compliance | Meets the exercise requirement for database persistence with setup and seed scripts |

### 11.2 Collections

| Collection | Purpose |
|------------|---------|
| `users` | Seeded user accounts |
| `tickets` | Support tickets |
| `comments` | Ticket comments (stored separately with `ticketId` reference) |

### 11.3 Schema and Constraints

Schema definition via **Mongoose schemas** (recommended) or equivalent ODM validation:

| Constraint | Detail |
|------------|--------|
| Primary keys | MongoDB `_id` (ObjectId) on all collections |
| References | `tickets.createdBy` → `users._id`, `tickets.assignedTo` → `users._id`, `comments.ticketId` → `tickets._id`, `comments.createdBy` → `users._id` |
| Indexes | Index on `tickets.status`, `tickets.assignedTo`, `comments.ticketId`; text index on `tickets.title` and `tickets.description` for keyword search (or regex query for Core) |
| Timestamps | `createdAt`, `updatedAt` on tickets; `createdAt` on comments |
| Enums | `status` and `priority` restricted via schema enum validation |
| Uniqueness | Unique index on `users.email` |

Referential integrity (valid user/ticket IDs) is enforced in the **Node.js service layer** at create/update time, not via SQL-style foreign keys.

### 11.4 Initialization, Migrations, and Seed

| Deliverable | Requirement |
|-------------|-------------|
| Init/migration script | Creates indexes and schema validation (e.g., Mongoose model registration or `db-init` script) |
| Seed script | Populates users (≥3 recommended), sample tickets across all statuses, sample comments |
| Documentation | README steps: start MongoDB, run init/migration, run seed |
| Environment | `.env.example` with `MONGODB_URI` (e.g., `mongodb://localhost:27017/support-tickets`) |

### 11.5 Data Persistence Verification

- Stop and restart the Node.js backend and MongoDB process; all tickets, comments, and users remain intact
- Acceptance test: create ticket → restart services → ticket still listed in React UI and via API

---

## 12. Testing Requirements

### 12.1 Mandatory (Core)

| ID | Requirement |
|----|-------------|
| TEST-01 | **Integration tests** for state machine: all valid transitions succeed |
| TEST-02 | **Integration tests** for state machine: invalid transitions are rejected with appropriate status code |
| TEST-03 | Tests runnable via documented command (e.g., `npm test`, `pytest`, `mvn test`) |
| TEST-04 | Tests should not depend on manual UI interaction |

### 12.2 Recommended (Core — Strong Submission)

| ID | Requirement |
|----|-------------|
| TEST-05 | Integration tests for ticket creation validation (missing title rejected) |
| TEST-06 | Integration tests for comment creation on valid/invalid ticket |
| TEST-07 | Integration tests for search and status filter API |
| TEST-08 | Test database isolation (in-memory, separate schema, or transaction rollback) |

### 12.3 Stretch Testing

| ID | Requirement |
|----|-------------|
| TEST-09 | Unit tests for state machine pure function |
| TEST-10 | Edge-case tests: empty search, invalid ObjectId, concurrent updates |
| TEST-11 | Auth tests: protected endpoints reject unauthenticated requests |
| TEST-12 | CI workflow running tests on push |

### 12.4 State Machine Test Matrix (Minimum)

| # | From | To | Expected |
|---|------|-----|----------|
| 1 | open | in_progress | Success |
| 2 | open | cancelled | Success |
| 3 | in_progress | resolved | Success |
| 4 | in_progress | cancelled | Success |
| 5 | resolved | closed | Success |
| 6 | open | resolved | Fail |
| 7 | open | closed | Fail |
| 8 | in_progress | open | Fail |
| 9 | resolved | open | Fail |
| 10 | closed | in_progress | Fail |
| 11 | cancelled | open | Fail |

### 12.5 Debugging Evidence

Per exercise expectations, maintain notes (e.g., `debugging-notes.md`) documenting failures found, AI-assisted debugging steps, and fixes — including reference to commits where AI mistakes were corrected.

---

## 13. Risks and Assumptions

### 13.1 Assumptions

| ID | Assumption |
|----|------------|
| A-01 | Single-tenant internal app; no multi-organization support needed |
| A-02 | User identity in Core is selected or implied, not authenticated |
| A-03 | Concurrent ticket volume is low (demo/team scale) |
| A-04 | English-only UI and content |
| A-05 | No file attachments on tickets in Core |
| A-06 | No email notifications or external integrations |
| A-07 | All users share the same visibility to all tickets (no per-user ticket isolation in Core) |
| A-08 | Timezone for timestamps: UTC storage with local display, or local server time — document choice |
| A-09 | **Tech stack is fixed:** React SPA (frontend), Node.js (backend REST API), MongoDB (persistence) |

### 13.2 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| State machine bypass via generic update endpoint | High | Separate status endpoint or enforce transitions in service layer for all code paths |
| Frontend/backend status rules drift | Medium | Share transition map or generate from single source; integration tests on API |
| Scope creep into Stretch | Medium | Time-box Core; defer auth, pagination, Docker to Stretch |
| Weak seed data | Low | Seed tickets in every status to demo transitions and filters |
| AI-generated code with hidden bugs | Medium | Mandatory integration tests; manual review of transition logic |
| Setup friction for reviewers | Medium | README with copy-paste commands; verify fresh clone works |
| Over-engineering database | Low | Three MongoDB collections sufficient for Core; avoid premature audit collections |

### 13.3 Open Questions (To Resolve in Design Phase)

| # | Question |
|---|----------|
| Q-01 | Separate `PATCH /status` vs unified ticket update? |
| Q-02 | How is "acting user" chosen in UI without auth? |
| Q-03 | Allow comments on cancelled/closed tickets? |
| Q-04 | Allow field edits on terminal-status tickets? |
| Q-05 | Case sensitivity for keyword search? |
| ~~Q-06~~ | ~~Which database and stack final selection?~~ **Resolved:** React SPA + Node.js + MongoDB |

---

## 14. Acceptance Criteria

Aligned with the exercise guide **Core Acceptance Criteria** and expanded for verification.

### 14.1 User-Facing Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-01 | A user can create a ticket via the UI | Manual: submit form; ticket appears in list |
| AC-02 | A user can view all tickets from the database | Manual: list matches DB contents after restart |
| AC-03 | A user can open a ticket detail view | Manual: all fields and comments visible |
| AC-04 | A user can update ticket fields and reassign | Manual: changes persist after refresh |
| AC-05 | A user can add comments | Manual: comment appears on detail view with author and time |
| AC-06 | Status changes only through valid transitions; invalid ones rejected | Manual + automated: UI blocks/handles; API returns error; integration tests pass |
| AC-07 | Keyword search and status filter work | Manual: search term and filter reduce results correctly |
| AC-08 | Data remains available after restart | Manual: create data → restart services → data present |

### 14.2 Technical Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-09 | Backend validation prevents invalid records | API test: missing title → 400 |
| AC-10 | No secrets committed to the repo | Repo scan; only `.env.example` present |
| AC-11 | State-machine integration tests pass | CI/local: test command exits 0 |
| AC-12 | MongoDB initialization and seed scripts run from README | Fresh clone setup by reviewer |
| AC-13 | Meaningful error states in UI | Manual: trigger validation and transition errors |

### 14.3 Artifact Criteria (Exercise)

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-14 | Requirement analysis document exists | `requirements-analysis.md` |
| AC-15 | Prompt history maintained | `ai-prompts/` |
| AC-16 | README setup instructions complete | Reviewer can run app locally |
| AC-17 | Tool-specific workflow artifacts present | e.g., `tool-specific/cursor-workflow/` |

### 14.4 Definition of Done (Core)

The Core feature set is **done** when:

1. All criteria AC-01 through AC-13 pass
2. Integration tests for the state machine pass reliably
3. README documents end-to-end local setup
4. At least one search/filter capability works against persisted data
5. Repository contains no committed secrets
6. Lifecycle artifacts demonstrate thoughtful AI-assisted engineering, not just generated code

---

## Appendix A — Traceability Matrix (Features → Requirements)

| Feature (Exercise) | Functional Requirements | Business Rules | Tests |
|--------------------|-------------------------|----------------|-------|
| Create ticket | FR-T01, FR-T05, FR-D01 | BR-01 – BR-05 | TEST-05 |
| List tickets | FR-T02 | — | TEST-07 |
| View detail | FR-T03 | — | Manual |
| Update fields | FR-T04 | BR-06 – BR-09 | Manual |
| Status state machine | FR-S01 – FR-S04 | BR-10 – BR-12, Section 8 | TEST-01, TEST-02 |
| Add comments | FR-C01 – FR-C04 | BR-13 – BR-16 | TEST-06 |
| Search/filter | FR-Q01, FR-Q02 | BR-17 – BR-19 | TEST-07 |
| Persistence | FR-D01 – FR-D04 | — | AC-08 |
| Validation | FR-E01 – FR-E03 | Section 9 | TEST-05 |
| UI error states | FR-E02, NFR-14 | — | AC-13 |

---

## Appendix B — Glossary

| Term | Definition |
|------|------------|
| **Ticket** | A support request record tracked through its lifecycle |
| **Transition** | A change from one status to another |
| **Terminal status** | A status with no allowed outbound transitions (`closed`, `cancelled`) |
| **Seeded user** | Pre-populated user record; not created via UI in Core |
| **Core** | Mandatory exercise scope |
| **Stretch** | Optional advanced features for additional evidence |

---

*This document is the authoritative requirement baseline for the Support Ticket Management System Core. Design, implementation, and tests should trace back to the IDs and acceptance criteria defined here.*
