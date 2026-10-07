# Roadmap

**Current stage:** **v0.2 slice 3 in progress** (minimal `apps/admin`, `relation` + `posts`). Slices 1-2 complete. v0.1 complete in [apps/playground](../apps/playground/). Scope: [v0.2-scope.md](v0.2-scope.md). ([Foundation section 59](project-foundation-v0.1.md#59-project-status)).

**Selected / Accepted for planning:** Fastify, PostgreSQL, data layer ([ADR-001](research/adr-001-drizzle-data-layer.md)), API ([ADR-002](research/adr-002-api-architecture.md)). **License** is [ADR-003 Proposed](research/adr-003-license.md) - required before **first public release**, not before private or pre-release kernel work ([GOVERNANCE.md](../GOVERNANCE.md)).

Stack detail: [research/stack-direction-v0.2.md](research/stack-direction-v0.2.md).

## Walking skeleton (start here)

Full definition, `products` proof, and run instructions: **[implementation-guide.md#walking-skeleton](implementation-guide.md#walking-skeleton)**.

Scope IN/OUT: [v0.1-scope.md](v0.1-scope.md). Spikes (run first): [research/implementation-spikes.md](research/implementation-spikes.md).

## Decisions already established

Directionally agreed (see [Foundation section 53](project-foundation-v0.1.md#53-decisions-already-established)):

- Open source (license not finalized - see research required)
- Modular architecture; optional ecommerce (deferred past v0.1 wedge)
- WordPress-like extensibility: themes, plugins, hooks, events, filters, overrides
- Provider abstraction; no hard-coded integrations in core
- API-first capability; MCP in v0.1 wedge (GraphQL deferred - see below)
- Primary differentiator: **one metadata definition** drives REST, OpenAPI, MCP, admin (when built) behind **capability contracts** - not `.ai/` folders alone ([ai-native.md](ai-native.md))
- Schema-driven CMS; metadata-driven admin (minimal field types first)
- Single VPS as primary deployment target; ability to split frontend/backend deployment
- Multi-site VPS support (tooling deferred)
- Strong security model; stable contracts; future migration tooling
- **Backend framework: Fastify** (selected)
- **Database: PostgreSQL** (selected)
- **Data layer:** Drizzle + SQL escape hatch ([ADR-001](research/adr-001-drizzle-data-layer.md)) - **spike before full commit**
- **API architecture:** REST + OpenAPI + MCP for v0.1; GraphQL optional long-term ([ADR-002](research/adr-002-api-architecture.md))

## Selected (stack)

| Area | Decision |
|------|----------|
| Backend | Fastify |
| Database | PostgreSQL |
| Data layer | Drizzle queries + metadata-driven SQL migrations (ADR-001, [ADR-004](research/adr-004-metadata-sql-migrations.md)) |
| API (v0.1) | REST + OpenAPI + MCP (ADR-002; GraphQL v0.5+) |

## Proposed direction (stack v0.2)

Strong guidance - **not all in v0.1**. Do not treat as implemented.

| Area | Direction | Detail |
|------|-----------|--------|
| Frontend | Next.js default adapter; frontend-agnostic core | [stack-direction-v0.2.md](research/stack-direction-v0.2.md#4-frontend-proposed-nextjs-default-core-independent) |
| Commerce | Native module; Medusa/Vendure study only | Deferred past v0.1 |
| Queue | BullMQ; PostgreSQL backend initially | [queue-bullmq-postgresql.md](research/queue-bullmq-postgresql.md) |
| Search | PostgreSQL first; SearchProvider | [stack-direction-v0.2.md](research/stack-direction-v0.2.md#7-search-proposed-postgresql-first--searchprovider) |
| Plugins | Trusted plugins + permission **declarations** | Not sandbox enforcement yet |
| Themes | Theme contract + Next.js renderer first | Deferred past v0.1 |
| Admin | shadcn/ui + TanStack; ~8 field types first | [stack-direction-v0.2.md](research/stack-direction-v0.2.md#11-admin-ui-proposed) |
| License | AGPL 3.0 preferred candidate | [ADR-003 Proposed](research/adr-003-license.md) |

## Research required {#decisions-not-yet-final}

| Area | Notes |
|------|--------|
| License | AGPL vs MIT vs Apache 2.0; DCO vs CLA; counsel before release - [ADR-003 Proposed](research/adr-003-license.md) |

Track progress in [research/README.md](research/README.md).

## Documentation backlog (not blocking code)

Auth, i18n, drafts/versioning, preview, backups, config-in-code vs DB (WordPress-style), marketplace isolation - capture in issues or `docs/research/` as needed.

## ADRs

1. **Accepted:** [ADR-001](research/adr-001-drizzle-data-layer.md), [ADR-002](research/adr-002-api-architecture.md); spike-validated migration path: [ADR-004](research/adr-004-metadata-sql-migrations.md)
2. **Proposed:** [ADR-003 License](research/adr-003-license.md)

**Also documented:** [BullMQ PostgreSQL queue validation](research/queue-bullmq-postgresql.md).

## Conceptual milestones (narrow wedge)

| Version | Focus |
|---------|--------|
| **v0.1** | Walking skeleton: kernel, schema (`defineCollection`), capability/provider registry, generated REST + OpenAPI, MCP from same metadata, minimal CLI/playground |
| **v0.2** | CMS fields/media, auth, users, basic admin (~8 field types) |
| **v0.3** | Commerce foundation (was v0.3; only after v0.1-0.2 stable) |
| **v0.4** | Payments, shipping, webhooks, queue workers at scale |
| **v0.5+** | GraphQL (optional surface), themes, multi-site tooling, marketplace, AI doctor |

## Implementation order

Spikes ([implementation-spikes.md](research/implementation-spikes.md)) -> walking skeleton -> modules incrementally ([Foundation section 56](project-foundation-v0.1.md#56-first-implementation-philosophy)).

## Documentation phase 1

**Baseline v0.1 complete** (foundation, thematic docs, `.ai/`, governance, keyboard-only checks). **Stack direction v0.2** in [research/stack-direction-v0.2.md](research/stack-direction-v0.2.md).

---

**Full detail:** [Foundation section 54-57, section 59](project-foundation-v0.1.md#54-decisions-not-yet-final)
