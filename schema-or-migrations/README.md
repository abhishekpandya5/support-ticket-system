# Schema & Indexes

Mongoose schemas and indexes live in [`server/src/models/`](../server/src/models/).

Sync indexes after schema changes:

```bash
node scripts/db-init.js
# or: cd server && npm run db:init
```

See [`data-model.md`](../data-model.md) for collection definitions.
