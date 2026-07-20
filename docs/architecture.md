# Architecture

System architecture for the Support Ticket Management System (Core tier). For full design rationale, see [`design-notes.md`](../design-notes.md). For API shapes and data fields, see [`api-contract.md`](../api-contract.md) and [`data-model.md`](../data-model.md).

## 1. System Architecture

Three-tier, client–server architecture. The React SPA communicates exclusively with the Node.js REST API over HTTP/JSON. MongoDB is the system of record. No authentication in Core — users are seeded and selected via an **Acting as** control in the app header.

```mermaid
flowchart TB
    subgraph Client["Browser — React SPA (:5173)"]
        direction TB
        UI["Pages & Components<br/>List · Detail · Create · Comments"]
        CTX["Acting-as selector<br/>localStorage"]
        API_CLIENT["API Client<br/>fetch"]
        UI --> CTX
        UI --> API_CLIENT
    end

    subgraph Server["Node.js API Server (:3001)"]
        direction TB
        MW["Middleware<br/>CORS · JSON · Error Handler"]
        ROUTES["Routes /api/*"]
        CTRL["Controllers"]
        SVC["Services + State Machine"]
        MODELS["Mongoose Models"]
        MW --> ROUTES --> CTRL --> SVC --> MODELS
    end

    subgraph Data["MongoDB (:27017)"]
        direction LR
        USERS[("users")]
        TICKETS[("tickets")]
        COMMENTS[("comments")]
    end

    subgraph Scripts["backend/src/scripts/"]
        SEED["seed.ts"]
    end

    API_CLIENT -->|"REST JSON<br/>HTTP"| MW
    MODELS -->|"Mongoose ODM"| Data
    SEED -.->|"seed data"| Data
```

### Runtime processes (local development)

| Process | Port | Technology |
|---------|------|------------|
| Frontend dev server | 5173 (Vite) | React SPA |
| Backend API | 3001 (configurable via `PORT`) | Node.js + Express |
| Database | 27017 | MongoDB |

### Key architectural decisions

- **Backend owns business rules** — validation and state machine enforcement occur server-side.
- **Thin client** — React handles presentation and UX gating only.
- **Dedicated status endpoint** — `PATCH /api/tickets/:id/status` prevents state machine bypass.
- **No auth (Core)** — acting user selected in the UI and sent as `createdBy` on writes.

---

## 2. Backend Layer Architecture

Layered monolith with strict dependency direction: routes → controllers → services → models → MongoDB. The state machine is a pure module invoked by `TicketService` — it has no database or HTTP dependencies.

```mermaid
flowchart TB
    subgraph HTTP["HTTP Layer"]
        REQ["Incoming Request"]
        RES["HTTP Response"]
    end

    subgraph Middleware["Middleware Stack"]
        CORS["cors()"]
        JSON["express.json()"]
        OID["validateObjectId()"]
        ERR["errorHandler()"]
    end

    subgraph Routes["Routes — /api"]
        TR["ticketRoutes"]
        CR["commentRoutes"]
        UR["userRoutes"]
    end

    subgraph Controllers["Controllers"]
        TC["TicketController"]
        CC["CommentController"]
        UC["UserController"]
    end

    subgraph Services["Service Layer — Business Logic"]
        TS["TicketService"]
        CS["CommentService"]
        US["UserService"]
        SM["TicketStateMachine<br/><i>pure module</i>"]
    end

    subgraph Models["Data Access — Mongoose"]
        MU["User"]
        MT["Ticket"]
        MC["Comment"]
    end

    DB[("MongoDB")]

    REQ --> CORS --> JSON --> OID
    OID --> TR & CR & UR
    TR --> TC
    CR --> CC
    UR --> UC

    TC --> TS
    CC --> CS
    UC --> US

    TS --> SM
    TS --> US
    CS --> US
    TS --> MT
    CS --> MC
    US --> MU

    MT & MC & MU --> DB

    TC & CC & UC --> RES
    ERR -.->|"catches errors"| RES
```

### Layer responsibilities

| Layer | Responsibility | Must not |
|-------|----------------|----------|
| **Middleware** | Cross-cutting HTTP concerns | Contain business logic |
| **Routes** | URL → controller binding | Access database directly |
| **Controllers** | Request/response mapping | Implement state machine rules |
| **Services** | Validation, business rules, orchestration | Use `req` / `res` objects |
| **State machine** | Transition rules (`isTransitionAllowed`) | Import Mongoose or Express |
| **Models** | Schema, indexes, queries | Application workflow logic |

### API endpoints by route group

| Route group | Endpoints |
|-------------|-----------|
| `ticketRoutes` | `GET/POST /tickets`, `GET/PATCH /tickets/:id`, `PATCH /tickets/:id/status` |
| `commentRoutes` | `POST /tickets/:id/comments` |
| `userRoutes` | `GET /users`, `GET /users/:id` |

---

## 3. Database Entity Relationship Diagram

MongoDB document collections with ObjectId references. Referential integrity is enforced in the **service layer**, not via SQL-style foreign keys.

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string name
        string email UK
        string role
    }

    TICKETS {
        ObjectId _id PK
        string title
        string description
        string priority
        string status
        ObjectId assignedTo FK
        ObjectId createdBy FK
        date createdAt
        date updatedAt
    }

    COMMENTS {
        ObjectId _id PK
        ObjectId ticketId FK
        string message
        ObjectId createdBy FK
        date createdAt
    }

    USERS ||--o{ TICKETS : "creates (createdBy)"
    USERS ||--o{ TICKETS : "assigned to (assignedTo)"
    USERS ||--o{ COMMENTS : "authors (createdBy)"
    TICKETS ||--o{ COMMENTS : "has (ticketId)"
```

---

## 4. Ticket Status State Machine

Only the transitions shown below are permitted. `closed` and `cancelled` are **terminal states** — no outbound transitions.

```mermaid
stateDiagram-v2
    [*] --> open : Create ticket

    open --> in_progress : Start progress
    open --> cancelled : Cancel

    in_progress --> resolved : Mark resolved
    in_progress --> cancelled : Cancel

    resolved --> closed : Close

    closed --> [*]
    cancelled --> [*]
```

### Transition table

| From | Allowed to | Blocked examples |
|------|------------|------------------|
| `open` | `in_progress`, `cancelled` | → `resolved`, → `closed` |
| `in_progress` | `resolved`, `cancelled` | → `open`, → `closed` |
| `resolved` | `closed` | → `open`, → `in_progress`, → `cancelled` |
| `closed` | *(none)* | → any |
| `cancelled` | *(none)* | → any |

### Enforcement points

| Layer | Mechanism |
|-------|-----------|
| **Backend** | `TicketStateMachine.changeStatus` in `TicketService.changeStatus` |
| **API** | `PATCH /api/tickets/:id/status` only — field update endpoint rejects `status` |
| **Frontend** | `StatusActions` renders buttons from `allowedTransitions` (UX only) |
| **Tests** | Unit tests on `TicketStateMachine` + integration tests via Supertest |

---

## 5. Request Flow Highlights

### Create ticket

1. User selects acting-as identity in the header (persisted in `localStorage`).
2. `POST /api/tickets` includes `createdBy` from the acting-as user.
3. On success, the UI navigates to `/tickets/:id`.

### Change status

1. `PATCH /api/tickets/:id/status` with the requested status.
2. `TicketService` loads the ticket and calls the state machine.
3. Invalid transitions return `400 INVALID_STATUS_TRANSITION` with `allowedTransitions`.

### Add comment

1. Acting-as user ID is sent as `createdBy` on `POST /api/tickets/:id/comments`.
2. Comments are allowed on tickets in any status, including closed.

---

## Diagram index

| # | Diagram | Type | Section |
|---|---------|------|---------|
| 1 | System Architecture | `flowchart TB` | §1 |
| 2 | Backend Layer Architecture | `flowchart TB` | §2 |
| 3 | Database ERD | `erDiagram` | §3 |
| 4 | Ticket Status State Machine | `stateDiagram-v2` | §4 |

For sequence diagrams (create, status change, list/filter, comments, errors), see **Architecture Diagrams** in [`design-notes.md`](../design-notes.md).

---

*Reflects Core scope per `spec.md`. Update when architecture changes.*
