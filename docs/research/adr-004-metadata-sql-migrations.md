# ADR-004: Collection metadata to reviewable SQL migrations

## Status

**Accepted** (validated by Spike 2, 2026-10-07).

## Context

- [ADR-001](adr-001-drizzle-data-layer.md) chose Drizzle ORM on PostgreSQL with reviewable SQL migrations.
- Spike 2 proved **dynamic** collections via `defineCollection` compile to SQL files, applied with a platform ledger (`jodkit_schema_migrations`) using `pg`, not Drizzle Kit generate-from-static-schema as the primary engine for module-defined tables.
- Drizzle Kit remains valuable for **known** schemas; JodKit's moat is metadata-defined collections that may come from enabled modules at runtime.

## Decision

1. **Schema shape for collections:** `defineCollection` metadata compiles to **reviewable `.sql` files** (Spike 2 `compileSql` path). Operators and CI can inspect SQL before apply.
2. **Apply path:** Platform **migration ledger** + ordered SQL file apply via PostgreSQL client (`pg` in v0.1 walking skeleton).
3. **Application queries:** **Drizzle ORM** (or tagged SQL through the Data Layer) for typed CRUD against tables that migrations created. Drizzle Kit is **not** required to generate migrations for dynamic collection metadata in v0.1.
4. **Module disable / reload:** Unchanged from Spike 5; if production enable/disable UX requires a platform-wide rule, use **ADR-005** (reserved), not this ADR.

## Consequences

**Positive**

- Metadata-driven tables without forcing Drizzle Kit to be the dynamic schema engine.
- Keeps ADR-001 Drizzle choice for queries and TypeScript ergonomics.

**Negative / follow-up**

- Two paths to understand: compile/apply migrations vs Drizzle query models; document in [data-model.md](../data-model.md) when walking skeleton lands.
- ADR-001 section on migrations should be read together with this ADR (Drizzle Kit as one option, not the only collection migration path).

## References

- Spike 2 log: [apps/spike-2-schema/SPIKE.md](../../apps/spike-2-schema/SPIKE.md)
- [implementation-spikes.md](implementation-spikes.md)
