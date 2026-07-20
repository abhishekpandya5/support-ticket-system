# Reflection

## What I Built

A full-stack Support Ticket Management System for the Core assessment tier:

- **Backend** — Express REST API with layered architecture, Zod validation, MongoDB persistence, and a pure `TicketStateMachine` enforcing lifecycle rules.
- **Frontend** — React SPA with ticket list/detail/create/edit flows, status workflow UI, comments, search/filter, acting-as user selection, React Query data layer, and React Hook Form + Zod forms.
- **Tests** — Backend integration tests (API + state machine paths) and frontend unit tests (acting-as, filters, schemas).
- **Documentation** — Architecture diagrams, API contract, test evidence, debugging notes, and prompt history.

## How I Used AI

Cursor assisted across the lifecycle: requirements analysis → design docs → backend implementation → frontend UI → debugging → code review → maintainability refactor → submission polish.

See [`ai-prompts/`](ai-prompts/) for append-only prompt history by activity.

## What AI Helped With Most

- Scaffolding layered backend structure and error/validation patterns
- Generating design documents and Mermaid diagrams from requirements
- Accelerating repetitive UI (forms, filters, loading/error states)
- Surfacing review findings (architecture, a11y, maintainability) for targeted fixes

## What AI Got Wrong

- Initial `ts-node-dev` dev script was broken; replaced with `tsx watch`
- Early state machine API naming drifted from the spec; aligned to `TicketStateMachine`
- Occasional invalid JSX tag typos during rapid edits — caught via grep before commit
- Vitest on Node 16 fails; project targets Node 18+ (20+ recommended for frontend Vitest)

## How I Validated AI Output

- TypeScript strict builds for backend and frontend
- `npm test` in backend (integration + unit) and frontend (Vitest)
- Manual UI verification with screenshots in [`test-results.md`](test-results.md)
- Cross-check against [`acceptance-criteria.md`](acceptance-criteria.md) and [`api-contract.md`](api-contract.md)

## Reusable Workflow

- [`tool-workflow.md`](tool-workflow.md) — Cursor workflow and guardrails
- [`.cursor/rules/`](.cursor/rules/) — Team rules (security, tests, minimal diffs)
- [`tool-specific/cursor-workflow/project-context.md`](tool-specific/cursor-workflow/project-context.md) — Project context for agents

## If I Had More Time

- E2E tests with Playwright against a running stack
- Optional auth layer (out of Core scope) with server-side session validation
