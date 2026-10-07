# Implementation spikes

**Status:** Ordered **code experiments** before the walking skeleton. Paper ADRs are not enough.

Parent: [implementation-guide.md](../implementation-guide.md) | [v0.1-scope.md](../v0.1-scope.md) | [ADR-001](adr-001-drizzle-data-layer.md) | [ADR-002](adr-002-api-architecture.md)

Run spikes in order unless noted. Time-boxes are suggestions.

---

## Spike 1: Fastify + JodKit kernel boot

**Goal:**

```text
Fastify + minimal JodKit Kernel
```

**Time-box:** 1-2 days.

**Tasks:**

- Create smallest Fastify app package
- Kernel `boot()` / `shutdown()` lifecycle
- Register kernel on app instance (context object)
- `GET /health` returns ok + kernel version placeholder

**Success criteria:**

- Server listens on configured port
- Kernel lifecycle runs without throwing
- Health route passes manual or automated check

**Artifacts:** Spike branch or `apps/spike-1` folder (team choice); notes in PR or spike log.

---

## Spike 2: PostgreSQL + Drizzle + defineCollection migration

**Goal:**

```text
PostgreSQL + Drizzle + JodKit schema/collection -> migration
```

**Time-box:** 2-5 days.

**Question:** Collections come from `defineCollection` metadata; Drizzle Kit expects static TS schema. Prove one path.

**Tasks:**

- One collection (`products` or spike-only name) in metadata
- Produce **reviewable SQL** migration
- Apply via **single ledger** per database
- Document: generated Drizzle schema files vs raw DDL vs hybrid

**Success criteria:**

- Table exists in PostgreSQL after migrate
- Migration recorded in ledger table
- Repeatable on clean DB

**Failure path:** If Drizzle Kit fight is too costly, document Kysely + custom migrator and propose ADR-001 amendment.

---

## Spike 3: Metadata to REST + OpenAPI + MCP

**Goal:**

```text
Metadata
   |
   +-- REST
   +-- OpenAPI
   +-- MCP
```

**Time-box:** 3-5 days.

**Depends on:** Spike 2 collection exists (or in-memory stub with same metadata shape).

**Tasks:**

- CRUD routes for the spike collection on Fastify
- OpenAPI fragment (paths + schemas) for that collection
- At least one MCP tool descriptor + handler (e.g. list or get)

**Success criteria:**

- Manual curl or test client can list/create/read
- OpenAPI JSON validates structurally (basic lint)
- MCP tool callable in dev harness (stdio or HTTP transport TBD)

**Contract reference:** [api-contract.md](../api-contract.md)

---

## Spike 4: Module with capability + provider + route + event

**Goal:**

```text
Module
   |
   +-- capability
   +-- provider
   +-- route
   +-- event
```

**Time-box:** 2-4 days.

**Tasks:**

- Register a minimal module manifest
- Declare a capability (use ID from [.ai/capabilities.json](../../.ai/capabilities.json) e.g. `storage` or a spike-only `demo` capability)
- Register one provider implementation
- Resolve provider from kernel registry in a route handler
- Emit and handle one domain event

**Success criteria:**

- Route returns data from resolved provider (stub OK)
- Event listener runs once when event fired
- Module enable registers; disable stops new handling (full Spike 5)

**Contract reference:** [architecture/contracts.md](../architecture/contracts.md)

---

## Spike 5: Disabled module

**Goal:** Verify platform rule: disabled module must not run.

```text
Verify:
  no routes
  no workers
  no handlers
  no unnecessary initialization
```

**Time-box:** 1-3 days.

**Question:** Fastify generally cannot unregister routes after boot.

**Tasks:**

- Enable module from Spike 4, confirm routes/events work
- Disable module
- Prove no HTTP routes, no event handlers, no background timers/workers
- Document chosen mechanism: graceful reload, route prefix gate, or hybrid

**Success criteria:**

- Automated test: disabled -> `404` or gate on module routes; events not delivered
- Written decision for production enable/disable (reload strategy)

**Update:** ADR-002 consequences or short ADR addendum with chosen pattern.

---

## Spike 6 (optional): BullMQ PostgreSQL backend under load

Not required for walking skeleton. See [queue-bullmq-postgresql.md](queue-bullmq-postgresql.md).

---

## After spikes

1. Update [ADR-001](adr-001-drizzle-data-layer.md) / [ADR-002](adr-002-api-architecture.md) with spike outcomes.
2. Build walking skeleton per [implementation-guide.md](../implementation-guide.md#walking-skeleton).
3. Do not start commerce, themes, or GraphQL.
