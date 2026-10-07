# Spike 2 log

## Question

How does JodKit turn `defineCollection` metadata into PostgreSQL tables and migrations while keeping SQL reviewable and a single ledger per database?

## Experiment

- `defineCollection` + `products` collection metadata
- `compileSql` generates reviewable SQL (checked into `migrations/`)
- `runMigrations` applies SQL files in order; ledger `jodkit_schema_migrations`
- Hybrid: metadata -> SQL file (not drizzle-kit generate from static TS schema in this spike)
- drizzle-orm dependency reserved for Spike 3+ query layer; migrate path uses `pg` for apply

## Result

Unit test passes: `compileSql` emits `CREATE TABLE jodkit_products` with expected columns. Integration tests skip without `DATABASE_URL`; with Postgres, `npm run migrate` applies `migrations/*.sql` and records names in `jodkit_schema_migrations`.

## Decision

**Provisional (Spike 2):** Use **metadata -> reviewable SQL files -> ledger + pg apply** for collection tables in v0.1 spikes; use **drizzle-orm** for typed queries in later spikes/packages, not drizzle-kit generate from hand-written static schema as the first path for dynamic collections. Confirmed as **[ADR-004](../../docs/research/adr-004-metadata-sql-migrations.md)** when promoting to `packages/schema` and `packages/data`.

## Follow-up

Spike 3 in `apps/spike-3-api/` - REST + OpenAPI + MCP from same metadata.
