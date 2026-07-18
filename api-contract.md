# API Contract — Support Ticket Management System

**Document version:** 1.0  
**Date:** 2026-07-11  
**Base URL:** `http://localhost:3001/api`  
**Scope:** Core tier

**Source documents:**

- [`design-notes.md`](design-notes.md)
- [`requirements-analysis.md`](requirements-analysis.md)
- [`data-model.md`](data-model.md)
- [`tool-specific/cursor-workflow/spec.md`](tool-specific/cursor-workflow/spec.md)

---

## Table of Contents

1. [Conventions](#1-conventions)
2. [Shared Schemas](#2-shared-schemas)
3. [Error Model](#3-error-model)
4. [Endpoints Overview](#4-endpoints-overview)
5. [Ticket Endpoints](#5-ticket-endpoints)
6. [Comment Endpoints](#6-comment-endpoints)
7. [User Endpoints](#7-user-endpoints)
8. [State Machine Reference](#8-state-machine-reference)

---

## 1. Conventions

### 1.1 General

| Convention | Value |
|------------|-------|
| Protocol | HTTP/1.1 |
| Format | JSON (`Content-Type: application/json`) |
| Charset | UTF-8 |
| ID format | MongoDB ObjectId — 24-character hex string |
| Property naming | camelCase |
| Date format | ISO 8601 UTC strings (e.g., `2026-07-10T12:00:00.000Z`) |
| Authentication | None (Core) — `createdBy` supplied in request body |

### 1.2 HTTP Methods Used

| Method | Usage |
|--------|-------|
| `GET` | Read resources (safe, idempotent) |
| `POST` | Create resources |
| `PATCH` | Partial update of resources |

`PUT` and `DELETE` are not used in Core.

### 1.3 Path Parameters

| Parameter | Format | Validation |
|-----------|--------|------------|
| `:id` | ObjectId hex string | Malformed → `400 INVALID_OBJECT_ID` |
| `:id` (valid format, missing resource) | — | → `404 NOT_FOUND` |

### 1.4 Query Parameters

- Omitted parameters are ignored (no filter applied).
- Empty string for `search` is treated as no search filter.
- Unknown query parameters are ignored (not an error).

### 1.5 CORS (Development)

| Setting | Value |
|---------|-------|
| Allowed origins | `http://localhost:5173`, `http://localhost:3000` |
| Allowed methods | `GET`, `POST`, `PATCH`, `OPTIONS` |
| Allowed headers | `Content-Type` |

---

## 2. Shared Schemas

### 2.1 UserSummary

Populated user reference embedded in ticket and comment responses.

```json
{
  "id": "507f191e810c19729de860ea",
  "name": "Jane Agent",
  "email": "jane@example.com"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | User ObjectId |
| `name` | string | Display name |
| `email` | string | Email address |

### 2.2 User (full)

Returned by user endpoints.

```json
{
  "id": "507f191e810c19729de860ea",
  "name": "Jane Agent",
  "email": "jane@example.com",
  "role": "agent"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | User ObjectId |
| `name` | string | Display name |
| `email` | string | Email address |
| `role` | string | `agent` \| `admin` \| `viewer` |

### 2.3 Ticket

```json
{
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
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Ticket ObjectId |
| `title` | string | Short summary |
| `description` | string | Full details |
| `priority` | string | `low` \| `medium` \| `high` \| `critical` |
| `status` | string | `open` \| `in_progress` \| `resolved` \| `closed` \| `cancelled` |
| `assignedTo` | UserSummary \| null | Assignee; `null` if unassigned |
| `createdBy` | UserSummary | Creator (required) |
| `createdAt` | string | ISO 8601 creation timestamp |
| `updatedAt` | string | ISO 8601 last update timestamp |

### 2.4 Comment

```json
{
  "id": "507f1f77bcf86cd799439013",
  "ticketId": "507f1f77bcf86cd799439012",
  "message": "Reproduced in Chrome.",
  "createdBy": {
    "id": "507f191e810c19729de860ea",
    "name": "Jane Agent",
    "email": "jane@example.com"
  },
  "createdAt": "2026-07-10T11:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Comment ObjectId |
| `ticketId` | string | Parent ticket ObjectId |
| `message` | string | Comment body |
| `createdBy` | UserSummary | Author |
| `createdAt` | string | ISO 8601 creation timestamp |

### 2.5 Enumerations

| Enum | Values |
|------|--------|
| **priority** | `low`, `medium`, `high`, `critical` |
| **status** | `open`, `in_progress`, `resolved`, `closed`, `cancelled` |
| **role** | `agent`, `admin`, `viewer` |

---

## 3. Error Model

### 3.1 Error Response Envelope

All error responses use this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `error.code` | string | Yes | Machine-readable error constant |
| `error.message` | string | Yes | User-facing description |
| `error.details` | object | No | Additional context (field errors, transition info) |

### 3.2 Error Code Catalog

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Missing or invalid request field |
| `INVALID_STATUS_TRANSITION` | 400 | State machine rejects status change |
| `STATUS_UPDATE_NOT_ALLOWED` | 400 | `status` sent to field-update endpoint |
| `INVALID_OBJECT_ID` | 400 | Malformed ObjectId in path or body |
| `NOT_FOUND` | 404 | Resource does not exist |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

### 3.3 Validation Error Details (optional)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "title": "Title is required",
        "priority": "Priority must be one of: low, medium, high, critical"
      }
    }
  }
}
```

---

## 4. Endpoints Overview

| # | Method | URL | Description |
|---|--------|-----|-------------|
| 1 | `GET` | `/tickets` | List tickets with search and status filter |
| 2 | `POST` | `/tickets` | Create a new ticket |
| 3 | `GET` | `/tickets/:id` | Get ticket detail with comments |
| 4 | `PATCH` | `/tickets/:id` | Update ticket fields (not status) |
| 5 | `PATCH` | `/tickets/:id/status` | Change ticket status (state machine) |
| 6 | `POST` | `/tickets/:id/comments` | Add a comment to a ticket |
| 7 | `GET` | `/users` | List all seeded users |
| 8 | `GET` | `/users/:id` | Get a single user by ID |

---

## 5. Ticket Endpoints

---

### 5.1 List Tickets

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/tickets` |
| **Description** | Returns all tickets matching optional search and status filters. Results are sorted by `updatedAt` descending (most recently updated first). User references (`createdBy`, `assignedTo`) are populated. |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Case-insensitive keyword search on `title` and `description` |
| `status` | string | No | Filter by exact status enum value |

#### Request Body

None.

#### Example Request

```http
GET /api/tickets?search=login&status=open HTTP/1.1
Host: localhost:3001
Accept: application/json
```

#### Response Body — `200 OK`

```json
{
  "tickets": [
    {
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
    }
  ]
}
```

Returns `{ "tickets": [] }` when no tickets match (not an error).

#### Status Codes

| Code | Condition |
|------|-----------|
| `200` | Success |
| `400` | Invalid `status` query value |
| `500` | Internal server error |

#### Validation Rules

| Rule | Detail |
|------|--------|
| `search` | If provided and non-empty after trim, apply case-insensitive regex to `title` and `description` |
| `search` empty/whitespace | Ignored; returns all tickets (subject to `status` filter) |
| `status` | If provided, must be a valid status enum |
| Sort | Always `updatedAt` descending |

#### Error Responses

**400 — Invalid status filter**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status value",
    "details": {
      "fields": {
        "status": "Status must be one of: open, in_progress, resolved, closed, cancelled"
      }
    }
  }
}
```

**500 — Internal error**

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

### 5.2 Create Ticket

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/tickets` |
| **Description** | Creates a new support ticket. Server always sets initial `status` to `open`, regardless of any `status` value in the request body. Returns the created ticket with populated user references. |

#### Request Body

```json
{
  "title": "Cannot login to dashboard",
  "description": "User reports 500 error after entering credentials.",
  "priority": "high",
  "assignedTo": "507f1f77bcf86cd799439011",
  "createdBy": "507f191e810c19729de860ea"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **Yes** | Ticket title (1–200 chars after trim) |
| `description` | string | **Yes** | Ticket description (1–5000 chars after trim) |
| `priority` | string | **Yes** | `low` \| `medium` \| `high` \| `critical` |
| `createdBy` | string | **Yes** | ObjectId of existing seeded user |
| `assignedTo` | string \| null | No | ObjectId of existing user, or omit/null for unassigned |
| `status` | string | No | **Ignored** — server always sets `open` |

#### Response Body — `201 Created`

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
  }
}
```

#### Status Codes

| Code | Condition |
|------|-----------|
| `201` | Ticket created successfully |
| `400` | Validation failure or invalid ObjectId in body |
| `404` | `createdBy` or `assignedTo` references non-existent user |
| `500` | Internal server error |

#### Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Required; non-empty after trim; max 200 characters |
| `description` | Required; non-empty after trim; max 5000 characters |
| `priority` | Required; must be valid priority enum |
| `createdBy` | Required; valid ObjectId format; user must exist |
| `assignedTo` | Optional; if provided (non-null), valid ObjectId; user must exist |
| `status` | Ignored if sent; server sets `open` |

#### Error Responses

**400 — Missing title**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "title": "Title is required"
      }
    }
  }
}
```

**400 — Invalid priority**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "priority": "Priority must be one of: low, medium, high, critical"
      }
    }
  }
}
```

**400 — Invalid ObjectId in body**

```json
{
  "error": {
    "code": "INVALID_OBJECT_ID",
    "message": "Invalid createdBy ID"
  }
}
```

**404 — User not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": {
      "field": "createdBy",
      "id": "507f191e810c19729de860eb"
    }
  }
}
```

---

### 5.3 Get Ticket Detail

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/tickets/:id` |
| **Description** | Returns a single ticket with populated user references and all associated comments sorted by `createdAt` ascending (oldest first). |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Ticket ObjectId |

#### Request Body

None.

#### Example Request

```http
GET /api/tickets/507f1f77bcf86cd799439012 HTTP/1.1
Host: localhost:3001
Accept: application/json
```

#### Response Body — `200 OK`

```json
{
  "ticket": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Cannot login to dashboard",
    "description": "User reports 500 error after entering credentials.",
    "priority": "high",
    "status": "in_progress",
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
    "updatedAt": "2026-07-10T11:30:00.000Z"
  },
  "comments": [
    {
      "id": "507f1f77bcf86cd799439013",
      "ticketId": "507f1f77bcf86cd799439012",
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

Returns `{ "ticket": {...}, "comments": [] }` when ticket has no comments.

#### Status Codes

| Code | Condition |
|------|-----------|
| `200` | Ticket found |
| `400` | Malformed `:id` parameter |
| `404` | Ticket not found |
| `500` | Internal server error |

#### Validation Rules

| Rule | Detail |
|------|--------|
| `:id` | Must be valid 24-char hex ObjectId |
| Ticket | Must exist in database |
| Comments | Sorted `createdAt` ascending |

#### Error Responses

**400 — Invalid ObjectId**

```json
{
  "error": {
    "code": "INVALID_OBJECT_ID",
    "message": "Invalid ticket ID"
  }
}
```

**404 — Ticket not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

---

### 5.4 Update Ticket Fields

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/tickets/:id` |
| **Description** | Partially updates ticket metadata: `title`, `description`, `priority`, and `assignedTo`. **Does not accept `status`** — use `PATCH /api/tickets/:id/status` for status changes. Allowed on tickets in any status including terminal states (`closed`, `cancelled`). Updates `updatedAt` on success. |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Ticket ObjectId |

#### Request Body

At least one field required. All fields optional (partial update).

```json
{
  "title": "Updated title",
  "description": "Updated description with more detail.",
  "priority": "critical",
  "assignedTo": "507f1f77bcf86cd799439011"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | New title (1–200 chars after trim) |
| `description` | string | No | New description (1–5000 chars after trim) |
| `priority` | string | No | New priority enum value |
| `assignedTo` | string \| null | No | New assignee ObjectId, or `null` to unassign |
| `status` | string | **Rejected** | Must not be sent — returns `400` |

#### Response Body — `200 OK`

```json
{
  "ticket": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Updated title",
    "description": "Updated description with more detail.",
    "priority": "critical",
    "status": "in_progress",
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
    "updatedAt": "2026-07-10T14:00:00.000Z"
  }
}
```

#### Status Codes

| Code | Condition |
|------|-----------|
| `200` | Ticket updated successfully |
| `400` | Validation failure, `status` in body, or invalid ObjectId |
| `404` | Ticket or assignee user not found |
| `500` | Internal server error |

#### Validation Rules

| Field | Rules |
|-------|-------|
| Body | At least one of `title`, `description`, `priority`, `assignedTo` must be present |
| `title` | If provided: non-empty after trim; max 200 characters |
| `description` | If provided: non-empty after trim; max 5000 characters |
| `priority` | If provided: must be valid priority enum |
| `assignedTo` | If provided as string: valid ObjectId; user must exist. `null` clears assignee |
| `status` | **Must not be present** — return `400 STATUS_UPDATE_NOT_ALLOWED` |
| `:id` | Valid ObjectId; ticket must exist |
| `updatedAt` | Set to current UTC time on success |

#### Error Responses

**400 — Status field rejected**

```json
{
  "error": {
    "code": "STATUS_UPDATE_NOT_ALLOWED",
    "message": "Use PATCH /api/tickets/:id/status to change ticket status"
  }
}
```

**400 — Empty title**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "title": "Title cannot be empty"
      }
    }
  }
}
```

**400 — Empty body**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "At least one field must be provided for update"
  }
}
```

**404 — Ticket not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

**404 — Assignee not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": {
      "field": "assignedTo",
      "id": "507f1f77bcf86cd799439099"
    }
  }
}
```

---

### 5.5 Change Ticket Status

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/tickets/:id/status` |
| **Description** | Changes ticket status according to the enforced state machine. This is the **only** endpoint permitted to modify `status`. Invalid transitions are rejected; ticket status remains unchanged on failure. Updates `updatedAt` on success. |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Ticket ObjectId |

#### Request Body

```json
{
  "status": "in_progress"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | **Yes** | Target status enum value |

#### Response Body — `200 OK`

```json
{
  "ticket": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Cannot login to dashboard",
    "description": "User reports 500 error after entering credentials.",
    "priority": "high",
    "status": "in_progress",
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
    "updatedAt": "2026-07-10T15:00:00.000Z"
  }
}
```

#### Status Codes

| Code | Condition |
|------|-----------|
| `200` | Status changed successfully |
| `400` | Invalid transition, invalid enum, same-status request, or missing `status` |
| `404` | Ticket not found |
| `500` | Internal server error |

#### Validation Rules

| Rule | Detail |
|------|--------|
| `status` | Required in request body |
| `status` | Must be a valid status enum value |
| `status` | Must differ from current status (same-status → `400`) |
| Transition | `canTransition(currentStatus, requestedStatus)` must return `true` |
| `:id` | Valid ObjectId; ticket must exist |
| On failure | Ticket status in database must remain unchanged |
| On success | `updatedAt` set to current UTC time |

#### Allowed Transitions

| From | Allowed to |
|------|------------|
| `open` | `in_progress`, `cancelled` |
| `in_progress` | `resolved`, `cancelled` |
| `resolved` | `closed` |
| `closed` | *(none — terminal)* |
| `cancelled` | *(none — terminal)* |

#### Error Responses

**400 — Invalid transition**

```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot transition from 'open' to 'closed'.",
    "details": {
      "currentStatus": "open",
      "requestedStatus": "closed",
      "allowedTransitions": ["in_progress", "cancelled"]
    }
  }
}
```

**400 — Same status (no-op rejected)**

```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Ticket is already in status 'open'.",
    "details": {
      "currentStatus": "open",
      "requestedStatus": "open",
      "allowedTransitions": ["in_progress", "cancelled"]
    }
  }
}
```

**400 — Missing status field**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "status": "Status is required"
      }
    }
  }
}
```

**400 — Invalid status enum**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "status": "Status must be one of: open, in_progress, resolved, closed, cancelled"
      }
    }
  }
}
```

**404 — Ticket not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

---

## 6. Comment Endpoints

---

### 6.1 Add Comment to Ticket

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/tickets/:id/comments` |
| **Description** | Adds an append-only comment to an existing ticket. Comments are allowed on tickets in **any** status, including terminal states (`closed`, `cancelled`). Returns the created comment with populated author. |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Ticket ObjectId |

#### Request Body

```json
{
  "message": "Reproduced the issue in Chrome on macOS.",
  "createdBy": "507f191e810c19729de860ea"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | **Yes** | Comment text (1–2000 chars after trim) |
| `createdBy` | string | **Yes** | ObjectId of existing seeded user (acting user) |

#### Response Body — `201 Created`

```json
{
  "comment": {
    "id": "507f1f77bcf86cd799439013",
    "ticketId": "507f1f77bcf86cd799439012",
    "message": "Reproduced the issue in Chrome on macOS.",
    "createdBy": {
      "id": "507f191e810c19729de860ea",
      "name": "Jane Agent",
      "email": "jane@example.com"
    },
    "createdAt": "2026-07-10T16:00:00.000Z"
  }
}
```

#### Status Codes

| Code | Condition |
|------|-----------|
| `201` | Comment created successfully |
| `400` | Validation failure or invalid ObjectId in body |
| `404` | Ticket or user not found |
| `500` | Internal server error |

#### Validation Rules

| Field | Rules |
|-------|-------|
| `message` | Required; non-empty after trim; max 2000 characters |
| `createdBy` | Required; valid ObjectId; user must exist |
| `:id` (ticket) | Valid ObjectId; ticket must exist (any status) |
| Immutability | Comments cannot be edited or deleted in Core |

#### Error Responses

**400 — Empty message**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "message": "Message is required"
      }
    }
  }
}
```

**400 — Invalid ticket ObjectId in path**

```json
{
  "error": {
    "code": "INVALID_OBJECT_ID",
    "message": "Invalid ticket ID"
  }
}
```

**404 — Ticket not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

**404 — User not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": {
      "field": "createdBy",
      "id": "507f191e810c19729de860eb"
    }
  }
}
```

---

## 7. User Endpoints

Users are **seeded only** in Core. These endpoints are read-only.

---

### 7.1 List Users

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/users` |
| **Description** | Returns all seeded users. Used by the frontend for acting-as selector, assignee dropdown, and display name resolution. |

#### Request Body

None.

#### Example Request

```http
GET /api/users HTTP/1.1
Host: localhost:3001
Accept: application/json
```

#### Response Body — `200 OK`

```json
{
  "users": [
    {
      "id": "507f191e810c19729de860ea",
      "name": "Jane Agent",
      "email": "jane@example.com",
      "role": "agent"
    },
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Bob Admin",
      "email": "bob@example.com",
      "role": "admin"
    },
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "Carol Viewer",
      "email": "carol@example.com",
      "role": "viewer"
    }
  ]
}
```

#### Status Codes

| Code | Condition |
|------|-----------|
| `200` | Success (including empty array if no users) |
| `500` | Internal server error |

#### Validation Rules

None.

#### Error Responses

**500 — Internal error**

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

### 7.2 Get User by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/users/:id` |
| **Description** | Returns a single seeded user by ObjectId. Optional in Core but recommended for consistency. |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | User ObjectId |

#### Request Body

None.

#### Response Body — `200 OK`

```json
{
  "user": {
    "id": "507f191e810c19729de860ea",
    "name": "Jane Agent",
    "email": "jane@example.com",
    "role": "agent"
  }
}
```

#### Status Codes

| Code | Condition |
|------|-----------|
| `200` | User found |
| `400` | Malformed `:id` parameter |
| `404` | User not found |
| `500` | Internal server error |

#### Validation Rules

| Rule | Detail |
|------|--------|
| `:id` | Must be valid 24-char hex ObjectId |
| User | Must exist in database |

#### Error Responses

**400 — Invalid ObjectId**

```json
{
  "error": {
    "code": "INVALID_OBJECT_ID",
    "message": "Invalid user ID"
  }
}
```

**404 — User not found**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

---

## 8. State Machine Reference

Status changes are only permitted via `PATCH /api/tickets/:id/status`.

### 8.1 Transition Matrix

| Current → Requested | `open` | `in_progress` | `resolved` | `closed` | `cancelled` |
|---------------------|--------|---------------|------------|----------|-------------|
| **open** | ❌ 400 | ✅ 200 | ❌ 400 | ❌ 400 | ✅ 200 |
| **in_progress** | ❌ 400 | ❌ 400 | ✅ 200 | ❌ 400 | ✅ 200 |
| **resolved** | ❌ 400 | ❌ 400 | ❌ 400 | ✅ 200 | ❌ 400 |
| **closed** | ❌ 400 | ❌ 400 | ❌ 400 | ❌ 400 | ❌ 400 |
| **cancelled** | ❌ 400 | ❌ 400 | ❌ 400 | ❌ 400 | ❌ 400 |

✅ = `200 OK` — ❌ = `400 INVALID_STATUS_TRANSITION` (status unchanged)

### 8.2 Lifecycle

```
open → in_progress → resolved → closed
  │         │
  └─ cancelled ─┘
```

Terminal states: `closed`, `cancelled`

---

## Appendix A — Endpoint Quick Reference

| Method | URL | Success | Body required |
|--------|-----|---------|---------------|
| `GET` | `/api/tickets` | 200 | No |
| `POST` | `/api/tickets` | 201 | Yes |
| `GET` | `/api/tickets/:id` | 200 | No |
| `PATCH` | `/api/tickets/:id` | 200 | Yes |
| `PATCH` | `/api/tickets/:id/status` | 200 | Yes |
| `POST` | `/api/tickets/:id/comments` | 201 | Yes |
| `GET` | `/api/users` | 200 | No |
| `GET` | `/api/users/:id` | 200 | No |

---

## Appendix B — Requirement Traceability

| Endpoint | Requirements | Acceptance criteria |
|----------|--------------|-------------------|
| `GET /tickets` | FR-T02, FR-Q01, FR-Q02 | BE-01, BE-25, BE-26, AC-02, AC-07 |
| `POST /tickets` | FR-T01, FR-T05, FR-U03 | BE-02, BE-21, AC-01 |
| `GET /tickets/:id` | FR-T03, FR-C03 | BE-03, BE-31, AC-03 |
| `PATCH /tickets/:id` | FR-T04 | BE-04, BE-23, AC-04 |
| `PATCH /tickets/:id/status` | FR-S01, FR-S02 | BE-05, SM-04–SM-23, AC-06 |
| `POST /tickets/:id/comments` | FR-C01, FR-C02 | BE-06, BE-30, AC-05 |
| `GET /users` | FR-U04 | BE-07, FE-35 |
| `GET /users/:id` | FR-U04 | BE-08 |

---

*This document is the API contract for Core implementation. All backend routes and integration tests must conform to these definitions.*
