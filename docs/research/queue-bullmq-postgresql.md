# Queue research: BullMQ with PostgreSQL backend

**Status:** Validates **proposed** stack direction - not implementation.  
**Parent:** [stack-direction-v0.2.md](stack-direction-v0.2.md#6-queue-proposed-bullmq-postgresql-backend-first)

## Goal

Run background jobs without requiring Redis on minimal JodKit installs (Fastify + PostgreSQL only).

## Finding

BullMQ documents an optional **PostgreSQL backend** that keeps the same high-level API:

- `Queue`, `Worker`, `QueueEvents`, `FlowProducer`
- Select via `createPostgresBackend` factory
- Connection: PostgreSQL URL or `pg.Pool`
- Redis backend remains default and most battle-tested

Official docs: https://docs.bullmq.io/guide/postgresql

## Requirements (from docs)

- PostgreSQL 13+ (14+ recommended)
- `pg` driver
- Schema/migrations managed by backend (`migrate`, `schema`, `skipMigrations` options)

## JodKit abstraction

```text
JodKit Queue (capability)
     |
     v
BullMQ adapter (proposed)
     |
     +-- PostgreSQL backend (default for minimal install)
     +-- Redis backend (optional performance path)
```

Kernel registers queue interface; modules enqueue jobs; workers run in separate process on VPS (PM2).

## Risks / follow-up

- PostgreSQL backend is newer than Redis path - validate load tests before production hard defaults ([implementation-spikes.md](implementation-spikes.md))
- Worker blocking uses LISTEN/NOTIFY - size connection pools accordingly (docs note pool sizing)
- Job volume on shared VPS: monitor table growth and retention policy
- **Fallback adapters (mature Postgres-native):** pg-boss, Graphile Worker - keep JodKit Queue capability abstract so adapters can swap without module rewrites

## Related

- [Foundation section 38](../project-foundation-v0.1.md#38-cache-and-queue)
