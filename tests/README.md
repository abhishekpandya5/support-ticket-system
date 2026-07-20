# Tests Layout

Assessment `tests/` maps to [`backend/tests/`](../backend/tests/).

```
backend/tests/
├── integration/
│   ├── tickets.integration.test.ts
│   └── health.users.integration.test.ts
├── unit/
│   └── ticketStateMachine.test.ts
└── helpers/
```

Frontend unit tests live in `frontend/src/**/*.test.ts`.

See [`test-strategy.md`](../test-strategy.md) and [`test-results.md`](../test-results.md).
