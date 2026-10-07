# JodKit data model

**Status:** Implementation contract for PostgreSQL + Drizzle ([ADR-001](research/adr-001-drizzle-data-layer.md)).

**Spike:** [Spike 2](research/implementation-spikes.md#spike-2-postgresql-drizzle-definecollection-migration)

## Principles

1. **Metadata first:** `CollectionDefinition` is source of truth for v0.1 generators.
2. **Physical tables** live in PostgreSQL; Drizzle is access layer only.
3. **Ownership is explicit:** core, module, or plugin owns each table and its migrations.
4. **Plugins may create tables** - yes, via migration registry with prefix and ledger (not ad-hoc DDL in request path).

## Who owns a table?

| Owner | Examples | Table naming | Migrations |
|-------|----------|--------------|------------|
| **Core** | users (future), migration ledger, module state | `jodkit_*` or `core_*` | Core migration bundle |
| **Module** | pages, posts (CMS v0.2+) | `{moduleId}_*` e.g. `cms_pages` | Module bundle when enabled |
| **Plugin** | reviews, custom analytics | `{pluginId}_*` e.g. `reviews_items` | Plugin bundle |
| **Walking skeleton** | products proof collection | `jodkit_products` or `skeleton_products` | Core or demo module |

Commerce tables (`orders`, `carts`) are **module-owned** when commerce module exists - **out of v0.1**.

## Metadata vs storage

```text
defineCollection(metadata)
        |
        +-- Collection registry (in memory / config)
        +-- SQL migration (generated or compiled)
        +-- Drizzle schema fragment (optional internal artifact)
        +-- REST / OpenAPI / MCP (from metadata)
```

## Collections, fields, relations

**v0.1:** flat collections with scalar fields only.

| Field type | PostgreSQL direction |
|------------|----------------------|
| string | `varchar` or `text` |
| text | `text` |
| number | `numeric` or `integer` (document cents vs decimal in collection) |
| boolean | `boolean` |
| datetime | `timestamptz` |
| json | `jsonb` |

**Relations** (belongsTo, hasMany): design in v0.2; defer foreign keys in v0.1 except optional manual spike.

## IDs

- Prefer **UUID** (`gen_random_uuid()`) for public API ids in new tables; serial acceptable in spike if documented.
- API exposes `id` as string in JSON either way.

## Timestamps

Default on generated tables:

```text
created_at  timestamptz NOT NULL DEFAULT now()
updated_at  timestamptz NOT NULL DEFAULT now()
```

Application updates `updated_at` on write.

## Soft delete

**Deferred v0.1** unless needed for permissions tests. Direction: optional `deleted_at` on collections that opt in via metadata flag `softDelete: true` (future).

## Versioning and audit

- **Row revision history** (CMS): out of v0.1
- **Audit log table:** out of v0.1 product; permission checks may log to structured logs only

## JSONB

Use for:

- Flexible plugin metadata columns
- Field type `json` in collections
- Not as a substitute for first-class relations in v0.1

## Migrations

- One **ledger** per database (Drizzle migrate table or JodKit wrapper)
- Apply order: core -> enabled modules -> enabled plugins (dependency order TBD in kernel)
- Disabled plugin: migrations already applied remain; no new applies until enabled
- Uninstall policy: **retain data by default**; optional `dropTables` on uninstall (ADR-001 open question)

## Multi-site

Separate database per site is the long-term VPS pattern; **multi-site tooling out of v0.1**. Spike uses single database.

## Related

- [architecture/contracts.md](architecture/contracts.md) (`DataLayer`, `MigrationRegistry`)
- [testing-strategy.md](testing-strategy.md) (migration tests)
