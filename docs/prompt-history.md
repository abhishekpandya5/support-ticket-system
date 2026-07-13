# Prompt History

Append-only log of major AI-assisted tasks in this project. New entries are added to the end of this file — never overwrite previous entries.

## Entry format

Each entry uses this structure:

```markdown
---

## YYYY-MM-DD — <Phase>

**Objective:** <one-line goal>

**Prompt Summary:** <concise summary of the user request>

**AI Output Summary:** <concise summary of what was done or delivered>

<!-- gen:<generation_id> -->
```

### Phases

Use the phase that best matches the work:


| Phase         | When to use                                  |
| ------------- | -------------------------------------------- |
| Planning      | Architecture, requirements, design decisions |
| Setup         | Project scaffolding, tooling, configuration  |
| Backend       | API, services, database, server logic        |
| Frontend      | UI, components, client-side logic            |
| Auth          | Authentication and authorization             |
| Testing       | Tests, CI, quality assurance                 |
| DevOps        | Deployment, infrastructure, monitoring       |
| Documentation | Docs, READMEs, guides                        |
| Refactor      | Code cleanup without behavior change         |
| Bugfix        | Defect fixes                                 |


---

## 2026-07-10 — Setup

**Objective:** Automatically log major AI tasks to an append-only prompt history file.

**Prompt Summary:** For every major task, append a new entry to `docs/prompt-history.md` with Date, Phase, Objective, Prompt Summary, and AI Output Summary. Never overwrite — always append.

**AI Output Summary:** Created `docs/prompt-history.md` with entry format and phase guide. Added always-on Cursor rule at `.cursor/rules/prompt-history-logging.mdc` instructing the agent to append entries after major tasks. Added a `stop` hook (`.cursor/hooks.json` + `.cursor/hooks/append-prompt-history.sh`) backed by `scripts/append-prompt-history.py` to auto-append from conversation transcripts when file-changing tools were used. Duplicate entries are prevented via `<!-- gen:... -->` markers.

---

## 2026-07-10 — Planning

**Objective:** Produce a detailed requirement analysis document for the Support Ticket Management System without generating implementation code.

**Prompt Summary:** As Senior Software Architect, analyze project requirements from the AI Capability Assessment PDF and write `docs/requirements-analysis.md` covering 14 sections: overview, business problem, functional/non-functional requirements, roles, entities, business rules, state machine, validation, API, database, testing, risks/assumptions, and acceptance criteria.

**AI Output Summary:** Read the JS AI Capability Exercise PDF and authored `docs/requirements-analysis.md` — a comprehensive planning document with traceability IDs, state machine diagram, forbidden transitions, API endpoint capabilities, database schema constraints, mandatory integration test matrix, risks/assumptions, and expanded acceptance criteria aligned to the exercise Core and Stretch tiers. No implementation code was generated.

---

## 2026-07-10 — Planning

**Objective:** Lock in the selected technical stack in the requirements analysis document.

**Prompt Summary:** In the Technical Stack section, specify that the frontend is a React single-page application consuming a REST API, the backend is Node.js, and the database is MongoDB.

**AI Output Summary:** Updated `docs/requirements-analysis.md` (v1.1) to replace generic stack options with the selected stack: React SPA, Node.js REST API, and MongoDB. Aligned related sections — entities (ObjectId references), validation, API, database (collections, indexes, `MONGODB_URI`), NFRs, assumptions (A-09), open question Q-06 (resolved), and acceptance criteria — for consistency with the MongoDB + Node.js + React architecture.

---

## 2026-07-10 — Documentation

**Objective:** Create a reusable project-context document for persistent AI and team reference throughout the project.

**Prompt Summary:** As Senior Software Architect, create `project-context.md` covering project overview, business objective, tech stack, functional scope, non-functional requirements, coding standards, architecture principles, folder structure philosophy, AI usage guidelines, testing strategy, and documentation strategy.

**AI Output Summary:** Authored `docs/tool-specific/cursor-workflow/project-context.md` — a comprehensive, reusable context document derived from `docs/requirements-analysis.md`. Includes state machine rules, API surface, monorepo folder structure, layered backend principles, AI do/don't guidelines, mandatory test matrix, documentation hierarchy, and quick-reference enums. Designed to be @-mentioned in Cursor sessions for spec-driven development.

---

## 2026-07-10 — Planning

**Objective:** Create a technical specification for implementation based on requirements analysis and project context.

**Prompt Summary:** Using `docs/requirements-analysis.md` and `project-context.md`, produce a technical spec (no code) covering high-level architecture, component responsibilities, frontend/backend architecture, API communication flow, error handling, validation, database interaction, state machine responsibilities, and testing approach. Save as `tool-specific/cursor-workflow/spec.md`.

**AI Output Summary:** Authored `docs/tool-specific/cursor-workflow/spec.md` — full technical design document with system context diagrams, component responsibility matrix, React SPA structure (routing, state, acting-as pattern), layered Node.js backend design, detailed API flows, error envelope catalog, multi-layer validation strategy, MongoDB schemas/indexes/query patterns, state machine module API and bypass prevention, and mandatory integration test matrix. Resolved open design decisions (dedicated status endpoint, acting-as selector, terminal ticket behavior, case-insensitive search).

---

## 2026-07-10 — Planning

**Objective:** Break the project into phased implementation tasks with dependencies, complexity, and acceptance criteria.

**Prompt Summary:** Using the technical specification, create `tool-specific/cursor-workflow/tasks.md` organizing implementation into phases. Each task must include ID, description, dependencies, estimated complexity, and acceptance criteria.

**AI Output Summary:** Authored `docs/tool-specific/cursor-workflow/tasks.md` with 44 Core tasks across 8 phases (Setup → Database → Backend Foundation → Backend Domain & API → Backend Testing → Frontend Foundation → Frontend Features → Documentation & Verification). Includes critical-path dependency graph, optional Stretch task list, and progress tracker. Tasks trace to spec sections and requirements acceptance criteria (AC-01–AC-17).

---

## 2026-07-11 — Documentation

**Objective:** Create a detailed, measurable acceptance criteria document for Core verification across all system layers.

**Prompt Summary:** Create `tool-specific/cursor-workflow/acceptance-criteria.md` with measurable acceptance criteria for backend, frontend, database, validation, state machine, testing, documentation, and performance.

**AI Output Summary:** Authored `docs/tool-specific/cursor-workflow/acceptance-criteria.md` with 100+ measurable criteria organized into 8 sections (BE, FE, DB, VAL, SM, TEST, DOC, PERF). Each criterion includes ID, priority (Must/Should), pass condition, verification method (Manual/Automated/Both), and requirement traceability. Includes exercise AC-01–AC-17 cross-reference, pre-submission gate checklist, strong-submission checklist, and sign-off template.

---

## 2026-07-11 — Documentation

**Objective:** Create visual architecture documentation using Mermaid diagrams for system design reference.

**Prompt Summary:** Create Mermaid diagrams for system architecture, backend layers, database ERD, ticket status state machine, and request flow. Save in `docs/architecture.md` without generating images.

**AI Output Summary:** Authored `docs/architecture.md` with 9 Mermaid diagrams: (1) three-tier system architecture flowchart, (2) backend layered architecture flowchart, (3) MongoDB ERD with users/tickets/comments, (4) stateDiagram-v2 for ticket lifecycle, (5) five sequence diagrams for create ticket, change status, list/search, add comment, and error response flows. Includes supporting tables, diagram index, and links to spec/requirements docs.

---

## 2026-07-11 — Planning

**Objective:** Design the complete REST API contract for the Support Ticket Management System.

**Prompt Summary:** Design REST APIs for each endpoint with method, URL, description, request/response bodies, status codes, validation rules, and error responses. Save as `docs/api-design.md` without implementing code.

**AI Output Summary:** Authored `docs/api-design.md` — full REST API design covering 8 endpoints (tickets CRUD, status change, comments, users). Each endpoint documents method, URL, description, request/response JSON schemas, status codes, validation rules, and example error responses. Includes shared schemas (UserSummary, Ticket, Comment), error model catalog, state machine transition matrix, quick reference table, and requirement traceability to FR/AC IDs.

---

## 2026-07-11 — Planning

**Objective:** Design the MongoDB database schema and Mongoose data layer without implementation code.

**Prompt Summary:** Design MongoDB schema using Mongoose covering collections, document structure, ObjectId relationships, required fields, indexes, validation rules, seed data strategy, and connection strategy. Save as `docs/database-design.md`.

**AI Output Summary:** Authored `docs/database-design.md` — complete database design for three collections (`users`, `tickets`, `comments`) with field-level tables (BSON/Mongoose types), ERD diagram, ObjectId reference map, index definitions, two-layer validation model (Mongoose + service), query patterns, seed data tables (users/tickets/comments), idempotent seed strategy, connection lifecycle diagram, test DB strategy with mongodb-memory-server, and stretch considerations.

---

## 2026-07-12 — Planning

**Objective:** Design frontend screens with components, flows, and UX patterns for all Core user journeys.

**Prompt Summary:** Design frontend screens for Dashboard, Ticket List, Ticket Detail, Create Ticket, and Edit Ticket. Describe components, user flow, validation, error handling, loading states, and empty states. Save as `docs/ui-design.md` without code.

**AI Output Summary:** Authored `docs/ui-design.md` — UI design for 5 screens with ASCII wireframes, component inventories, Mermaid user-flow diagrams, validation rules, error/loading/empty state tables per screen, shared component library (badges, forms, banners), global layout with Acting-as selector, routing map, cross-screen patterns, and acceptance criteria traceability. Edit Ticket designed as inline mode on Detail page per spec.

---

## 2026-07-12 — Setup

**Objective:** Scaffold scalable layered backend folder structure for Express + TypeScript + MongoDB.

**Prompt Summary:** Create enterprise-grade backend folder structure with layered architecture (config, routes, controllers, services, repositories, models, middleware, validators, utils, constants, stateMachine, tests). Placeholder index files only — no business logic.

**AI Output Summary:** Created `backend/src/` layered tree under Express + TypeScript project: entry points (`index.ts`, `app.ts`), config/constants barrels, versioned routes (`routes/v1/{tickets,comments,users}`), domain-scoped controllers/services/repositories/validators, plus models, middleware, utils, stateMachine, and `tests/{integration,unit,helpers}`. All files are placeholder modules with JSDoc purpose comments only.

---

## 2026-07-12 — Setup

**Objective:** Scaffold scalable React + TypeScript frontend folder structure for enterprise layered architecture.

**Prompt Summary:** Create folder structure only (no components) for React + TypeScript app including components, pages, hooks, services, api, routes, layouts, context, utils, types, constants, assets.

**AI Output Summary:** Created `frontend/src/` directory tree with domain-scoped subfolders: `api/{client,tickets,comments,users}`, `components/{common,layout,tickets,comments}`, `pages/{dashboard,tickets/{list,detail,create}}`, plus hooks, services, routes, layouts, context, utils, types, constants, and `assets/{icons,images}`. Empty directories tracked via `.gitkeep`; existing `main.tsx`/`App.tsx` untouched.

---

## 2026-07-12 — Backend

**Objective:** Implement a reusable, production-ready Mongoose MongoDB connection module with environment-driven configuration.

**Prompt Summary:** Create a reusable MongoDB connection module using Mongoose (TypeScript, environment variables, error handling, graceful shutdown, logging, production-ready). Do not generate application logic.

**AI Output Summary:** Implemented `backend/src/config/env.ts` (Zod-validated `MONGODB_URI`, `NODE_ENV`, `PORT`, `LOG_LEVEL`), `backend/src/config/database.ts` (idempotent `connectDatabase()`, `disconnectDatabase()`, signal-based shutdown helpers, pool tuning, Mongoose event listeners, connection state helpers), `backend/src/utils/logger.ts` (structured JSON logging), and `backend/src/config/index.ts` barrel. Added `backend/.env.example`. Updated `backend/tsconfig.json` (`rootDir`, `include`/`exclude`, ESM settings) and `backend/package.json` (`"type": "module"`). No routes, models, or business logic.

---

## 2026-07-12 — Backend

**Objective:** Bootstrap a production-ready Express HTTP server with core middleware and health checks only.

**Prompt Summary:** Generate a production-ready Express server (TypeScript, CORS, JSON middleware, environment variables, `/health` endpoint, global error middleware, not-found middleware). Do not implement APIs — bootstrap only.

**AI Output Summary:** Implemented `backend/src/app.ts` (`createApp()` with CORS, `express.json()`, health route, 404 and error handlers), `backend/src/index.ts` (env load, DB connect, HTTP listen, graceful shutdown closing server then disconnecting MongoDB), `backend/src/routes/health.ts` (`GET /health` with database readiness; 503 when disconnected), `backend/src/middleware/{cors,notFoundHandler,errorHandler}.ts`, `backend/src/utils/AppError.ts`, and `backend/src/constants/errorCodes.ts`. Extended env with `PORT` default `3001` and optional `CORS_ORIGINS`. Added `build`, `start`, and `dev` npm scripts. API routes not mounted.

---

## 2026-07-12 — Bugfix

**Objective:** Fix the backend `npm run dev` script so the development server starts reliably.

**Prompt Summary:** `npm run dev` in the backend folder is not running.

**AI Output Summary:** Diagnosed `ts-node-dev --esm` swallowing the entry file (`no script to run provided`) and incompatibility with TypeScript 7. Replaced dev runner with `tsx watch src/index.ts`, added `tsx` as a devDependency, and set `"engines": { "node": ">=18" }` in `backend/package.json`. Verified server starts and connects to MongoDB on Node 24.

---

## 2026-07-12 — Backend

**Objective:** Define canonical domain enumerations for tickets and users as reusable TypeScript constants.

**Prompt Summary:** Create enums/constants for `TicketStatus`, `TicketPriority`, and `UserRole` (TypeScript, reusable types, enterprise standards). No business logic.

**AI Output Summary:** Implemented `backend/src/constants/enums.ts` with `as const` objects (`TICKET_STATUS`, `TICKET_PRIORITY`, `USER_ROLE`), union types (`TicketStatus`, `TicketPriority`, `UserRole`), and readonly value arrays for validators. Updated `backend/src/constants/index.ts` barrel to re-export enums alongside `errorCodes`. Values aligned with `docs/api-design.md` and `docs/database-design.md`.

---

## 2026-07-12 — Backend

**Objective:** Implement Mongoose schemas and models for the three Core collections.

**Prompt Summary:** Generate Mongoose models for User, Ticket, and Comment (TypeScript interfaces, schema validation, timestamps, required fields, ObjectId refs, indexes). No controllers or services.

**AI Output Summary:** Created `backend/src/models/{User,Ticket,Comment}.ts` with `InferSchemaType`/`HydratedDocument` typing, enum validation via shared constants, trim/minlength/maxlength rules, ObjectId references (`createdBy`, `assignedTo`, `ticketId`), `timestamps: true`, explicit collection names, and named indexes per database design (`email_1` unique; `status_1`, `assignedTo_1` sparse, `updatedAt_-1`; `ticketId_1_createdAt_1`). Hot-reload-safe model registration and barrel exports in `backend/src/models/index.ts`.

---

## 2026-07-12 — Backend

**Objective:** Provide an idempotent MongoDB seed script for development users only.

**Prompt Summary:** Create a seed script using Mongoose for Admin, John Doe, and Alice Smith. Insert users only if they do not already exist. Idempotent. Do not seed tickets or comments yet.

**AI Output Summary:** Implemented `backend/src/scripts/seedUsers.ts` (`USER_SEEDS`, `seedUsers()` with email-based existence check) and `backend/src/scripts/seed.ts` (connect, seed, disconnect CLI). Added `npm run seed` to `backend/package.json`. Users: Admin (`admin@example.com`, admin), John Doe (`john.doe@example.com`, agent), Alice Smith (`alice.smith@example.com`, viewer). Fixed Mongoose ESM imports in model files (`mongoose.models` via default import). Verified two consecutive runs (insert then skip).

---

## 2026-07-12 — Backend

**Objective:** Implement a pure, reusable ticket status state machine for lifecycle transition enforcement.

**Prompt Summary:** Design a reusable `TicketStateMachine` class with allowed transitions (open→in_progress, in_progress→resolved, resolved→closed, open→cancelled, in_progress→cancelled). SRP, meaningful errors, unit-testable. No Express APIs.

**AI Output Summary:** Created `backend/src/stateMachine/{transitions,InvalidTransitionError,TicketStateMachine}.ts` with authoritative `TICKET_TRANSITIONS` map, `InvalidTransitionError` (includes `toDetails()` for API envelope), and injectable `TicketStateMachine` class. Public API: `isTransitionAllowed()`, `changeStatus()`, `getAllowedTransitions()`, plus `isTerminal()` helpers. Same-status transitions rejected. Pure module — no Mongoose, Express, or persistence. Exported `ticketStateMachine` singleton and barrel from `stateMachine/index.ts`.

---

## 2026-07-12 — Backend

**Objective:** Add Mongoose repository classes as a data-access layer over domain models.

**Prompt Summary:** Generate repository classes for MongoDB using Mongoose (`TicketRepository`, `UserRepository`, `CommentRepository`). Data access only — no business rules, validation, or Express.

**AI Output Summary:** Created `backend/src/repositories/{UserRepository,TicketRepository,CommentRepository}.ts` with injectable model constructors and default singleton instances. `UserRepository`: findAll, findById, findByEmail, existsById, create. `TicketRepository`: findById, findByIdPopulated, findMany (QueryFilter pass-through, optional populate), create, updateFieldsById, updateFieldsByIdPopulated, save. `CommentRepository`: findById, findByTicketId (sorted, populated), create, createPopulated. Typed input DTOs and barrel exports in `repositories/index.ts`.

---

## 2026-07-12 — Backend

**Objective:** Implement the business logic service layer on top of repositories and the state machine.

**Prompt Summary:** Implement service layer using repositories — business validation, ticket workflow, status transition validation, comment creation, assignment. No controllers.

**AI Output Summary:** Created `backend/src/services/{UserService,TicketService,CommentService}.ts` with injectable dependencies and singleton instances. `UserService`: listUsers, getUserById, assertUserExists. `TicketService`: listTickets (status filter, escaped regex search), getTicketById (ticket + comments), createTicket (always `open`, user ref checks), updateTicket (rejects status field, assignment), changeStatus (state machine + persist). `CommentService`: getCommentsByTicketId, addComment. Added `utils/{objectId,regex,errors}.ts` for ObjectId validation, search escaping, and `AppError` factories. Services throw `AppError`; map `InvalidTransitionError` to API envelope. Barrel exports in `services/index.ts`. No controllers.

---

## 2026-07-12 — Refactor

**Objective:** Align `TicketStateMachine` public method names with the intended service-layer API.

**Prompt Summary:** State machine should expose `isTransitionAllowed()`, `changeStatus()`, and `getAllowedTransitions()`.

**AI Output Summary:** Refactored `backend/src/stateMachine/TicketStateMachine.ts` to replace `canTransition()`, `assertTransition()`, and `validateTransition()` with `isTransitionAllowed()`, `changeStatus()`, and `getAllowedTransitions()`. Simplified `stateMachine/index.ts` barrel (removed transition result types). Transition rules and `InvalidTransitionError` behavior unchanged.

---

## 2026-07-13 — Backend

**Objective:** Implement thin HTTP controllers that delegate to the service layer and return API-shaped responses.

**Prompt Summary:** Generate controllers for User, Ticket, and Comment (Express + TypeScript). Parse request, call services, return HTTP response only — no database logic or business rules. Proper status codes and async error handling. Clean Architecture.

**AI Output Summary:** Created `backend/src/controllers/{UserController,TicketController,CommentController}.ts` with injectable service dependencies and singleton instances. `UserController`: list (200), getById (200/404). `TicketController`: list, getById, create (201), update (200), changeStatus (200). `CommentController`: create (201). Added `middleware/asyncHandler.ts` for async error forwarding to global handler and `utils/serializers.ts` for API JSON mapping (`id`, `UserSummary`, ISO timestamps). Updated `controllers/index.ts` and middleware/utils barrels. Routes not wired.

---

## 2026-07-13 — Backend

**Objective:** Wire RESTful Express routes to controllers with a modular router hierarchy.

**Prompt Summary:** Generate Express routes (RESTful, controllers only, no direct service calls, modular routes, index router for mounting, no business logic).

**AI Output Summary:** Implemented modular routers: `routes/v1/users/index.ts` (`GET /`, `GET /:id`), `routes/v1/tickets/index.ts` (list, create, get, update, status change, nested comments), `routes/v1/comments/index.ts` (`POST /` with `mergeParams`), `routes/v1/index.ts` (aggregates tickets + users), and `routes/index.ts` (`apiRouter`). Mounted `apiRouter` at `/api` in `app.ts` — endpoints at `/api/tickets`, `/api/users`, `/api/tickets/:id/status`, `/api/tickets/:id/comments`. Controllers only; no service imports in route files.

