# ORM / data layer comparison (Priority 1)

**Status:** Research reference - decision **Accepted** in [ADR-001](adr-001-drizzle-data-layer.md).  
**Context:** [stack-direction-v0.2.md](stack-direction-v0.2.md) proposes **Drizzle + raw SQL escape hatch**. PostgreSQL is **selected**.

**Sources consulted (2026):** Drizzle ORM docs (migrations, generate, migrate); Prisma vs Drizzle vs Kysely analysis (sph.sh); Prisma vs Drizzle SaaS comparison (achromatic.dev); JodKit requirements from Foundation sections 8-9, 36, 41-42.

## JodKit requirements

| Requirement | Why it matters |
|-------------|----------------|
| PostgreSQL-first | JSONB, FTS, pgvector, RLS, extensions, transactions |
| Plugin-owned tables/schemas | Plugins add migrations without rewriting core |
| Reviewable SQL migrations | Ops on single VPS; recoverable upgrades |
| SQL escape hatch | Advanced queries, CTEs, DB-specific features |
| TypeScript-native | Fastify stack, AI-readable code |
| Small runtime surface | Modular install; no heavy ORM in kernel |
| Multi-tenant / multi-site (future) | Per-site DB; migration ledger per database |

## Candidates

### Drizzle ORM

- **Schema:** TypeScript schema files (code-first); multiple globs across packages/plugins possible.
- **Migrations:** `drizzle-kit generate` produces SQL files from schema diff; `drizzle-kit migrate` or runtime `migrate()` applies ledger in `__drizzle_migrations` (configurable table/schema).
- **Workflow:** Supports push (dev only), generate+migrate (production), export for external tools (Atlas).
- **SQL visibility:** High - queries are SQL-shaped; team can read generated migration SQL before apply.
- **Fit for plugins:** Each plugin can ship `schema/` + `drizzle/` migration folder; platform merges config or runs plugin migrators in dependency order (JodKit design TBD).

Official docs: https://orm.drizzle.team/docs/migrations

### Kysely

- **Schema:** No first-class schema DSL - database is often source of truth.
- **Migrations:** Hand-written `up`/`down` via `Migrator`; optional `kysely-ctl`; `kysely-codegen` generates types from live DB.
- **SQL visibility:** Maximum - you write SQL.
- **Fit for plugins:** Strong when plugins only extend via SQL migrations; weaker for unified code-first schema generation across core + modules.
- **Runtime:** Minimal dependencies (good for constrained deploys).

Reference: https://sph.sh/en/posts/prisma-vs-drizzle-vs-kysely/

### Prisma

- **Schema:** Prisma Schema Language (not TypeScript); `prisma migrate dev` / `deploy`.
- **DX:** Excellent tooling, client generation, nested writes.
- **SQL visibility:** Lower by default; TypedSQL/raw paths exist in modern Prisma.
- **Fit for plugins:** Heavier - multiple schemas/generators possible but not aligned with "JodKit owns architecture"; more "Prisma-shaped" apps.
- **Ops note:** Connection pooling / serverless adapters require planning (PgBouncer, driver adapters).

References: https://www.prisma.io/docs/orm , https://www.achromatic.dev/blog/prisma-vs-drizzle-orm

## Comparison matrix (JodKit-weighted)

| Criterion | Drizzle | Kysely | Prisma |
|-----------|---------|--------|--------|
| TS schema in repo | Yes | Types from DB or manual | DSL file |
| Generated reviewable SQL | Yes | Manual | Yes (via migrate) |
| Plugin ships schema+migrations | Good (multi glob) | Good (SQL only) | Possible, heavier |
| PG advanced features | Strong + escape hatch | Strong | Good with raw |
| Learning curve for contributors | Medium | Medium-high | Medium |
| Risk of "ORM becomes product" | Medium | Low | High |
| AI/codegen readability | High (TS schema) | High (SQL) | Medium (DSL) |

## Plugin migration patterns (from ecosystem)

WordPress-style plugins typically:

- Use **prefixed table names** per plugin
- Store **schema version per plugin** (or per table) in options/metadata
- Run migrations on upgrade, not every request
- Separate **marketing version** from **schema version**

References: WordPress Plugin Handbook (Creating Tables with Plugins); wp-db-schema / stellarwp/schema patterns for version hashes and `after_update` hooks.

**JodKit implication:** Kernel should expose a **migration registry**:

```text
Platform migrate:
  core migrations
  -> enabled module migrations (ordered by dependency)
  -> enabled plugin migrations (ordered by dependency)
```

Each contributor should use one **ledger** per database (Drizzle migrate table or JodKit wrapper). Plugins must not run DDL on every HTTP request.

## Raw SQL escape hatch (all options)

Regardless of ORM choice, JodKit should document:

- When modules may call `db.execute(sql)` (or equivalent)
- Transaction boundaries (request-scoped vs job-scoped)
- Forbidden patterns (DDL in request path)

Proposed default: **Drizzle for 90%**; **tagged SQL** for PG-specific features.

## Preliminary recommendation (for ADR)

**Accept for implementation planning:** **Drizzle + SQL escape hatch**, wrapped in **JodKit Data Layer** interfaces (not direct Drizzle imports from random plugins without boundary).

**Keep Kysely** documented as alternative for:

- Legacy DB-first integrations
- Plugins that only add hand-written SQL migrations

**Defer Prisma** unless a future ADR finds plugin/multi-schema story superior.

**Open design work before coding:**

1. Single `drizzle.config` vs per-module configs merged by CLI
2. How disabled plugins skip migrations but remain on disk
3. Uninstall policy (drop tables vs retain data)
4. Multi-site: one migration run per site database

## Suggested ADR title

"ADR-001: JodKit data layer - Drizzle with SQL escape hatch on PostgreSQL"

## Related

- [ADR-001](adr-001-drizzle-data-layer.md)
- [stack-direction-v0.2.md](stack-direction-v0.2.md)
- [Foundation section 36](../project-foundation-v0.1.md#36-database)
- [roadmap](../roadmap.md#decisions-not-yet-final)
