# Design

Prompt history for **Design** activity.

Each entry uses: Objective, Prompt, AI Response Summary, Accepted, Modified, Rejected, Reason.

---

## 2026-07-11 — Planning

**Objective:** Design the complete REST API contract for the Support Ticket Management System.

**Prompt:** Design REST APIs for each endpoint with method, URL, description, request/response bodies, status codes, validation rules, and error responses. Save as `docs/api-design.md` without implementing code.

**AI Response Summary:** Authored `docs/api-design.md` — full REST API design covering 8 endpoints (tickets CRUD, status change, comments, users). Each endpoint documents method, URL, description, request/response JSON schemas, status codes, validation rules, and example error responses. Includes shared schemas (UserSummary, Ticket, Comment), error model catalog, state machine transition matrix, quick reference table, and requirement traceability to FR/AC IDs.

**Accepted:** All 8 Core endpoints, shared schemas, and error model.

**Modified:** Renamed to `api-contract.md` at repo root.

**Rejected:** Stretch-tier endpoints (auth, pagination).

**Reason:** API contract is the source of truth for backend and frontend types.

---

## 2026-07-11 — Planning

**Objective:** Design the MongoDB database schema and Mongoose data layer without implementation code.

**Prompt:** Design MongoDB schema using Mongoose covering collections, document structure, ObjectId relationships, required fields, indexes, validation rules, seed data strategy, and connection strategy. Save as `docs/database-design.md`.

**AI Response Summary:** Authored `docs/database-design.md` — complete database design for three collections (`users`, `tickets`, `comments`) with field-level tables (BSON/Mongoose types), ERD diagram, ObjectId reference map, index definitions, two-layer validation model (Mongoose + service), query patterns, seed data tables (users/tickets/comments), idempotent seed strategy, connection lifecycle diagram, test DB strategy with mongodb-memory-server, and stretch considerations.

**Accepted:** Three-collection schema, indexes, and seed strategy.

**Modified:** Renamed to `data-model.md` at repo root.

**Rejected:** None.

**Reason:** Database design directly shaped the Mongoose models.

---

## 2026-07-12 — Planning

**Objective:** Design frontend screens with components, flows, and UX patterns for all Core user journeys.

**Prompt:** Design frontend screens for Dashboard, Ticket List, Ticket Detail, Create Ticket, and Edit Ticket. Describe components, user flow, validation, error handling, loading states, and empty states. Save as `docs/ui-design.md` without code.

**AI Response Summary:** Authored `docs/ui-design.md` — UI design for 5 screens with ASCII wireframes, component inventories, Mermaid user-flow diagrams, validation rules, error/loading/empty state tables per screen, shared component library (badges, forms, banners), global layout with Acting-as selector, routing map, cross-screen patterns, and acceptance criteria traceability. Edit Ticket designed as inline mode on Detail page per spec.

**Accepted:** Screen flows, loading/error/empty states, and component naming.

**Modified:** Renamed to `ui-flow.md`; ticket list built as a table instead of cards.

**Rejected:** None.

**Reason:** UI design guided component structure; table layout was a valid implementation choice.
