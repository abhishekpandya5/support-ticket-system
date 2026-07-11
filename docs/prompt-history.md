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

| Phase | When to use |
|-------|-------------|
| Planning | Architecture, requirements, design decisions |
| Setup | Project scaffolding, tooling, configuration |
| Backend | API, services, database, server logic |
| Frontend | UI, components, client-side logic |
| Auth | Authentication and authorization |
| Testing | Tests, CI, quality assurance |
| DevOps | Deployment, infrastructure, monitoring |
| Documentation | Docs, READMEs, guides |
| Refactor | Code cleanup without behavior change |
| Bugfix | Defect fixes |

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
