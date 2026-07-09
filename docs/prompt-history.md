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
