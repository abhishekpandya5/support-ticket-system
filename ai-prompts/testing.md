# Testing

Prompt history for **Testing** activity.

Each entry uses: Objective, Prompt, AI Response Summary, Accepted, Modified, Rejected, Reason.

---

## 2026-07-18 — Testing

**Objective:** Add Vitest + Supertest integration tests with isolated in-memory MongoDB.

**Prompt:** Generate integration tests using Vitest and Supertest covering ticket creation, update, valid/invalid state transitions, comments, search, status filter, validation failures, and invalid IDs. Use a test MongoDB database; ensure tests are isolated and repeatable.

**AI Response Summary:** Added `mongodb-memory-server`, `vitest.config.ts`, `tests/setup.ts` (memory server + per-test collection clear), `tests/helpers/{db,fixtures}.ts`, and `tests/integration/tickets.integration.test.ts` (21 cases). Updated `package.json` test scripts. Fixed Express 5 query validation in `backend/src/middleware/validate.ts` (in-place query merge). All 21 tests pass with Node 24 (`npm test` in `backend/`).

**Accepted:** Vitest + Supertest setup and 21 integration tests.

**Modified:** Added more tests after code review fixes.

**Rejected:** Testing against live Atlas database.

**Reason:** In-memory MongoDB keeps tests fast, isolated, and repeatable.
