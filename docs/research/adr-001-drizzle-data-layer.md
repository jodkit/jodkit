# ADR-001: JodKit data layer - Drizzle with SQL escape hatch on PostgreSQL

## Status

**Accepted** (direction for planning). **Implementation validation:** required spike - see [implementation-spikes.md](implementation-spikes.md#spike-1-metadata-to-drizzle-migrations). Amend this ADR if spike favors Kysely + custom migrator.

## Context

- PostgreSQL is **selected** ([stack-direction-v0.2.md](stack-direction-v0.2.md), Foundation section 53).
- JodKit needs plugin-owned schemas, reviewable SQL migrations, TypeScript-native ergonomics, and a SQL escape hatch for advanced PostgreSQL features ([orm-comparison.md](orm-comparison.md)).
- Foundation section 54 listed ORM/data layer as research required; comparison research is complete.

## Decision

1. **Primary data access:** **Drizzle ORM** on PostgreSQL with **tagged raw SQL** as an documented escape hatch for PG-specific features.
2. **Boundary:** Modules and plugins use **JodKit Data Layer** interfaces. Direct Drizzle imports from arbitrary plugins are **not** a supported public pattern without going through that boundary.
3. **Migrations:** Drizzle Kit **generate + migrate** workflow with reviewable SQL files; platform runs migrations in dependency order (core, enabled modules, enabled plugins).
4. **Alternatives documented, not default:**
   - **Kysely** for legacy DB-first integrations or hand-written SQL-only plugin migrations.
   - **Prisma** deferred unless a future ADR finds a superior plugin/multi-schema story.

## Alternatives considered

| Option | Outcome |
|--------|---------|
| Drizzle + SQL escape hatch | **Chosen** - TS schema, generated SQL, strong PG fit, plugin-friendly globs |
| Kysely only | Rejected as sole default - weaker unified code-first schema across core + modules |
| Prisma | Deferred - heavier DSL, higher "ORM shapes the product" risk |

Full comparison: [orm-comparison.md](orm-comparison.md).

## Consequences

**Positive**

- Aligns with Fastify + PostgreSQL stack and AI-readable TypeScript schema.
- Generated migration SQL supports VPS ops and recoverable upgrades.
- Clear path for plugin-owned tables with prefixed names and versioned upgrades.

**Negative / follow-up**

- Kernel must implement migration registry and ledger policy (design before coding):

  1. Single `drizzle.config` vs per-module configs merged by CLI
  2. How disabled plugins skip migrations but remain on disk
  3. Uninstall policy (drop tables vs retain data)
  4. Multi-site: one migration run per site database

- Document when `db.execute(sql)` is allowed, transaction boundaries, and forbidden DDL-in-request patterns.

## Foundation / roadmap updates

- [x] Foundation section 53 - data layer established
- [x] Foundation section 54 - removed from research required
- [x] [roadmap.md](../roadmap.md) - ORM ADR closed

## Alignment with architectural rules

- Provider abstraction and small core: Drizzle stays behind Data Layer interfaces.
- Modularity: plugins ship schema + migrations; core orchestrates apply order.
- No silent defaults in code until kernel exists; this ADR is implementation guidance.

## Supersedes

Decision authority for ORM choice: supersedes the preliminary recommendation in [orm-comparison.md](orm-comparison.md). Comparison content remains reference.

## Related

- [orm-comparison.md](orm-comparison.md)
- [stack-direction-v0.2.md](stack-direction-v0.2.md)
- [Foundation section 36](../project-foundation-v0.1.md#36-database)
- [Foundation section 53](../project-foundation-v0.1.md#53-decisions-already-established)
