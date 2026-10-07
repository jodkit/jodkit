# Research tracker

Research, ADRs, and **implementation spikes**. **Selected / Accepted:** Fastify, PostgreSQL, ADR-001, ADR-002 (validate via [implementation-spikes.md](implementation-spikes.md)). **Proposed:** [stack-direction-v0.2.md](stack-direction-v0.2.md). **Next code:** [roadmap walking skeleton](../roadmap.md#walking-skeleton-start-here).

Parent context: [Roadmap](../roadmap.md) | [Foundation section 55](../project-foundation-v0.1.md#55-next-research-phase).

## How to contribute

1. Open a [research issue](../../.github/ISSUE_TEMPLATE/research.md) or architecture-decision issue.
2. Add or markdown report in this folder.
3. Update the table below with status and link.

## Architecture Decision Records

| ADR | Title | Status |
|-----|-------|--------|
| [adr-001-drizzle-data-layer.md](adr-001-drizzle-data-layer.md) | Drizzle + SQL escape hatch on PostgreSQL | **Accepted** |
| [adr-002-api-architecture.md](adr-002-api-architecture.md) | REST, OpenAPI, optional GraphQL, MCP | **Accepted** |
| [adr-003-license.md](adr-003-license.md) | Platform license | **Proposed** |

## Tracker

| Area | Scope | Status | Output doc | Owner |
|------|--------|--------|------------|-------|
| Stack direction v0.2 | Selected + proposed architecture | Documented | [stack-direction-v0.2.md](stack-direction-v0.2.md) | - |
| Backend | Fastify (selected) | Decided | [roadmap](../roadmap.md) | - |
| Database | PostgreSQL (selected) | Decided | [stack-direction-v0.2.md](stack-direction-v0.2.md#1-postgresql-selected) | - |
| ORM / data layer | Drizzle vs Kysely vs Prisma; plugin migrations | **Accepted** | [ADR-001](adr-001-drizzle-data-layer.md), [orm-comparison.md](orm-comparison.md) | - |
| API architecture | REST + GraphQL + OpenAPI + MCP | **Accepted** | [ADR-002](adr-002-api-architecture.md), [api-architecture-research.md](api-architecture-research.md) | - |
| License | AGPL vs MIT vs Apache; plugins, SaaS | **ADR Proposed** | [ADR-003](adr-003-license.md), [license-research.md](license-research.md) | - |
| Implementation spikes | Spikes 1-5 (see doc) | Not started | [implementation-spikes.md](implementation-spikes.md) | - |
| Queue | BullMQ PostgreSQL backend | Draft complete (validation) | [queue-bullmq-postgresql.md](queue-bullmq-postgresql.md) | - |
| Frontend | Next.js default (proposed); adapter model | Proposed in stack doc | [stack-direction-v0.2.md](stack-direction-v0.2.md#4-frontend-proposed-nextjs-default-core-independent) | - |
| CMS architecture | WordPress, Payload, Strapi, Directus, Ghost, ... | Not started | - | - |
| Commerce | Native (proposed); study Medusa, Vendure | Not started (patterns in stack doc) | [stack-direction-v0.2.md](stack-direction-v0.2.md#5-commerce-proposed-native-module) | - |
| Plugin architecture | WordPress, Vendure, Fastify, Payload, ... | Not started | - | - |
| Theme architecture | Theme contract; Next.js renderer first (proposed) | Proposed in stack doc | [stack-direction-v0.2.md](stack-direction-v0.2.md#10-theme-rendering-proposed) | - |
| AI-native | MCP, manifests, agent workflows | Not started | - | - |

## Next ADR priority

1. Close [ADR-003 license](adr-003-license.md) (legal review + checklist)

## Evaluation criteria (reminder)

- Plugin/extensibility model
- Encapsulation and stable contracts
- AI readability and convention
- TypeScript ergonomics
- Performance and operability on a single VPS
- Long-term maintainability
