# Architecture Diagrams — Support Ticket Management System

**Document version:** 1.0  
**Date:** 2026-07-11  
**Scope:** Core tier

Visual architecture reference for the Support Ticket Management System. All diagrams use [Mermaid](https://mermaid.js.org/) syntax and render in GitHub, Cursor, and most Markdown viewers.

**Related documents:**

- [`tool-specific/cursor-workflow/spec.md`](tool-specific/cursor-workflow/spec.md) — technical specification
- [`tool-specific/cursor-workflow/project-context.md`](tool-specific/cursor-workflow/project-context.md) — stack and principles
- [`requirements-analysis.md`](requirements-analysis.md) — requirements baseline

---

## 1. System Architecture

Three-tier, client–server architecture. The React SPA communicates exclusively with the Node.js REST API over HTTP/JSON. MongoDB is the system of record. No authentication in Core — users are seeded and selected via an "Acting as" control in the UI.

```mermaid
flowchart TB
    subgraph Client["Browser — React SPA (:5173)"]
        direction TB
        UI["Pages & Components<br/>List · Detail · Create · Comments"]
        CTX["ActingAsContext<br/>localStorage"]
        API_CLIENT["API Client<br/>fetch / Axios"]
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

    subgraph Scripts["scripts/"]
        INIT["db-init.js"]
        SEED["seed.js"]
    end

    API_CLIENT -->|"REST JSON<br/>HTTP"| MW
    MODELS -->|"Mongoose ODM"| Data
    INIT -.->|"indexes"| Data
    SEED -.->|"seed data"| Data

    classDef frontend fill:#e3f2fd,stroke:#1565c0
    classDef backend fill:#e8f5e9,stroke:#2e7d32
    classDef database fill:#fff3e0,stroke:#ef6c00
    classDef scripts fill:#f3e5f5,stroke:#7b1fa2

    class Client frontend
    class Server backend
    class Data database
    class Scripts scripts
```

### Runtime processes (local development)

| Process | Port | Technology |
|---------|------|------------|
| Frontend dev server | 5173 (Vite) or 3000 (CRA) | React SPA |
| Backend API | 3001 | Node.js + Express |
| Database | 27017 | MongoDB |

### Key architectural decisions

- **Backend owns business rules** — validation and state machine enforcement occur server-side.
- **Thin client** — React handles presentation and UX gating only.
- **Dedicated status endpoint** — `PATCH /api/tickets/:id/status` prevents state machine bypass.
- **No auth (Core)** — acting user selected in UI and sent as `createdBy` on writes.

---

## 2. Backend Layer Architecture

Layered monolith with strict dependency direction: routes → controllers → services → models → MongoDB. The state machine is a pure module invoked by `ticketService` — it has no database or HTTP dependencies.

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
        TC["ticketController"]
        CC["commentController"]
        UC["userController"]
    end

    subgraph Services["Service Layer — Business Logic"]
        TS["ticketService"]
        CS["commentService"]
        US["userService"]
        SM["stateMachine.js<br/><i>pure module</i>"]
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

    classDef http fill:#eceff1,stroke:#546e7a
    classDef mw fill:#fff9c4,stroke:#f9a825
    classDef route fill:#e8eaf6,stroke:#3949ab
    classDef ctrl fill:#e3f2fd,stroke:#1565c0
    classDef svc fill:#e8f5e9,stroke:#2e7d32
    classDef sm fill:#c8e6c9,stroke:#1b5e20,stroke-width:2px
    classDef model fill:#fff3e0,stroke:#ef6c00
    classDef db fill:#ffccbc,stroke:#bf360c

    class HTTP http
    class Middleware mw
    class Routes route
    class Controllers ctrl
    class Services svc
    class SM sm
    class Models model
    class DB db
```

### Layer responsibilities

| Layer | Responsibility | Must not |
|-------|----------------|----------|
| **Middleware** | Cross-cutting HTTP concerns | Contain business logic |
| **Routes** | URL → controller binding | Access database directly |
| **Controllers** | Request/response mapping | Implement state machine rules |
| **Services** | Validation, business rules, orchestration | Use `req` / `res` objects |
| **State machine** | Transition rules (`canTransition`) | Import Mongoose or Express |
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

### Collection details

#### users (seeded — read-only in Core)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `name` | string | Display name |
| `email` | string | Unique index |
| `role` | enum | `agent`, `admin`, `viewer` |

#### tickets

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `title` | string | Required, max 200 |
| `description` | string | Required, max 5000 |
| `priority` | enum | `low`, `medium`, `high`, `critical` |
| `status` | enum | Default `open` |
| `assignedTo` | ObjectId → users | Optional (nullable) |
| `createdBy` | ObjectId → users | Required |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto, refreshed on change |

#### comments

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `ticketId` | ObjectId → tickets | Required, indexed |
| `message` | string | Required, max 2000 |
| `createdBy` | ObjectId → users | Required |
| `createdAt` | Date | Auto |

### Indexes

| Collection | Index | Purpose |
|------------|-------|---------|
| `users` | `{ email: 1 }` unique | Email uniqueness |
| `tickets` | `{ status: 1 }` | Status filter |
| `tickets` | `{ assignedTo: 1 }` | Assignee queries |
| `tickets` | `{ updatedAt: -1 }` | List sort |
| `comments` | `{ ticketId: 1, createdAt: 1 }` | Comments per ticket |

---

## 4. Ticket Status State Machine

The state machine is the signature judgment piece of Core. Only the transitions shown below are permitted. `closed` and `cancelled` are **terminal states** — no outbound transitions.

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

    note right of open
        Initial status on create.
        Cannot skip to resolved or closed.
    end note

    note right of in_progress
        Cannot revert to open.
        Must resolve before close.
    end note

    note right of closed
        Terminal — no further transitions.
    end note

    note right of cancelled
        Terminal — no further transitions.
    end note
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
| **Backend** | `stateMachine.canTransition(from, to)` in `ticketService.changeStatus` |
| **API** | `PATCH /api/tickets/:id/status` only — field update endpoint rejects `status` |
| **Frontend** | `StatusActions` renders buttons from `getAllowedTransitions` (UX only) |
| **Tests** | 11 integration test cases via Supertest (5 valid + 6 invalid) |

### Same-status behavior

Requesting the current status as the target (e.g., `open` → `open`) returns **HTTP 400** — no silent no-op.

---

## 5. Request Flow

### 5.1 Create Ticket

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as TicketForm<br/>(React)
    participant CTX as ActingAsContext
    participant API as API Client
    participant RT as ticketRoutes
    participant TC as ticketController
    participant TS as ticketService
    participant US as userService
    participant DB as MongoDB

    User->>UI: Fill form & submit
    UI->>UI: Client validation<br/>(title, description, priority)
    UI->>CTX: Get actingAsUserId
    CTX-->>UI: createdBy userId
    UI->>API: POST /api/tickets<br/>{ title, description, priority, assignedTo?, createdBy }
    API->>RT: HTTP POST
    RT->>TC: create(req, res)
    TC->>TS: createTicket(data)
    TS->>TS: Validate required fields
    TS->>US: assertUserExists(createdBy)
    US->>DB: findById(createdBy)
    DB-->>US: user document
    opt assignedTo provided
        TS->>US: assertUserExists(assignedTo)
        US->>DB: findById(assignedTo)
    end
    TS->>TS: Set status = open
    TS->>DB: Ticket.create()
    DB-->>TS: new ticket
    TS-->>TC: ticket (populated)
    TC-->>API: 201 Created
    API-->>UI: ticket JSON
    UI->>User: Navigate to /tickets/:id
```

### 5.2 Change Ticket Status (Critical Path)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant SA as StatusActions<br/>(React)
    participant UTIL as utils/status.js
    participant API as API Client
    participant RT as ticketRoutes
    participant TC as ticketController
    participant TS as ticketService
    participant SM as stateMachine
    participant DB as MongoDB

    User->>SA: Click "Start Progress"
    SA->>UTIL: getAllowedTransitions(currentStatus)
    UTIL-->>SA: [in_progress, cancelled]
    SA->>API: PATCH /api/tickets/:id/status<br/>{ status: in_progress }
    API->>RT: HTTP PATCH
    RT->>TC: changeStatus(req, res)
    TC->>TS: changeStatus(id, newStatus)
    TS->>DB: findById(id)
    alt Ticket not found
        DB-->>TS: null
        TS-->>TC: throw NotFoundError
        TC-->>API: 404 NOT_FOUND
        API-->>SA: error envelope
        SA->>User: Show error banner
    else Ticket found
        DB-->>TS: ticket document
        TS->>SM: canTransition(current, requested)
        alt Invalid transition
            SM-->>TS: false
            TS-->>TC: throw InvalidTransitionError<br/>(allowedTransitions)
            TC-->>API: 400 INVALID_STATUS_TRANSITION
            API-->>SA: error + details
            SA->>User: Show error banner<br/>(status unchanged)
        else Valid transition
            SM-->>TS: true
            TS->>TS: status = newStatus<br/>updatedAt = now
            TS->>DB: ticket.save()
            DB-->>TS: updated ticket
            TS-->>TC: ticket (populated)
            TC-->>API: 200 OK
            API-->>SA: ticket JSON
            SA->>User: Update UI status badge
        end
    end
```

### 5.3 List Tickets with Search and Filter

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant LP as TicketListPage<br/>(React)
    participant API as API Client
    participant RT as ticketRoutes
    participant TC as ticketController
    participant TS as ticketService
    participant DB as MongoDB

    User->>LP: Type search / select status filter
    LP->>LP: Debounce search (~300ms)
    LP->>API: GET /api/tickets?search=login&status=open
    API->>RT: HTTP GET
    RT->>TC: list(req, res)
    TC->>TS: listTickets({ search, status })
    TS->>DB: find({ status, $or: [title, description regex] })<br/>.sort({ updatedAt: -1 })<br/>.populate(createdBy, assignedTo)
    DB-->>TS: ticket documents
    TS-->>TC: tickets array
    TC-->>API: 200 OK
    API-->>LP: { tickets: [...] }
    alt Results found
        LP->>User: Render TicketList
    else No matches
        LP->>User: Show EmptyState
    end
```

### 5.4 Add Comment

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant CF as CommentForm<br/>(React)
    participant CTX as ActingAsContext
    participant API as API Client
    participant RT as commentRoutes
    participant CC as commentController
    participant CS as commentService
    participant US as userService
    participant DB as MongoDB

    User->>CF: Enter message & submit
    CF->>CF: Client validation<br/>(non-empty message)
    CF->>CTX: Get actingAsUserId
    CTX-->>CF: createdBy userId
    CF->>API: POST /api/tickets/:id/comments<br/>{ message, createdBy }
    API->>RT: HTTP POST
    RT->>CC: create(req, res)
    CC->>CS: addComment(ticketId, data)
    CS->>DB: findById(ticketId)
    alt Ticket not found
        DB-->>CS: null
        CS-->>CC: throw NotFoundError
        CC-->>API: 404
        API-->>CF: error envelope
        CF->>User: Show error banner
    else Ticket exists
        DB-->>CS: ticket (any status incl. closed)
        CS->>US: assertUserExists(createdBy)
        CS->>DB: Comment.create()
        DB-->>CS: new comment
        CS-->>CC: comment (populated)
        CC-->>API: 201 Created
        API-->>CF: comment JSON
        CF->>User: Append to CommentList
    end
```

### 5.5 Error response flow

All failed API requests follow a consistent path back to the UI:

```mermaid
sequenceDiagram
    participant SVC as Service Layer
    participant ERR as AppError subclass
    participant EH as errorHandler<br/>middleware
    participant API as API Client
    participant UI as React Component

    SVC->>ERR: throw ValidationError /<br/>InvalidTransitionError /<br/>NotFoundError
    ERR->>EH: next(err)
    EH->>EH: Map to HTTP status +<br/>{ error: { code, message, details } }
    EH-->>API: 4xx JSON body
    API->>API: Parse error envelope<br/>throw ApiError
    API-->>UI: ApiError caught
    UI->>UI: ErrorBanner or<br/>inline field errors
```

---

## Diagram Index

| # | Diagram | Type | Section |
|---|---------|------|---------|
| 1 | System Architecture | `flowchart TB` | §1 |
| 2 | Backend Layer Architecture | `flowchart TB` | §2 |
| 3 | Database ERD | `erDiagram` | §3 |
| 4 | Ticket Status State Machine | `stateDiagram-v2` | §4 |
| 5a | Create Ticket | `sequenceDiagram` | §5.1 |
| 5b | Change Status | `sequenceDiagram` | §5.2 |
| 5c | List with Search/Filter | `sequenceDiagram` | §5.3 |
| 5d | Add Comment | `sequenceDiagram` | §5.4 |
| 5e | Error Response | `sequenceDiagram` | §5.5 |

---

*Diagrams reflect Core scope per `spec.md` v1.0. Update this document when architecture changes.*
