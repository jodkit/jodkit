# JodKit stack direction v0.2

**Status:** Architecture / Research + implementation spikes; **data layer and API are ADR-Accepted** ([ADR-001](adr-001-drizzle-data-layer.md), [ADR-002](adr-002-api-architecture.md)) with [validation spikes](implementation-spikes.md); **public release** waits on **license ADR** ([ADR-003 Proposed](adr-003-license.md)), not private kernel work.

**Canonical tiers:** [Foundation section 53](../project-foundation-v0.1.md#53-decisions-already-established) (selected) | [section 54](../project-foundation-v0.1.md#54-decisions-not-yet-final) (proposed + research required) | [roadmap](../roadmap.md)

## Guiding principle

> JodKit should own the architecture; libraries should provide infrastructure without becoming JodKit's architecture.

Libraries (Fastify, Drizzle, BullMQ, Next.js, etc.) sit **under** JodKit contracts - not the other way around.

## Decision summary

| Tier | Area | Direction |
|------|------|-----------|
| Selected | Backend | Fastify |
| Selected | Database | PostgreSQL |
| Accepted (ADR-001) | Database access | Drizzle + raw SQL escape hatch |
| Accepted (ADR-002) | API | REST + OpenAPI + MCP (v0.1); GraphQL optional v0.5+; not tRPC as public contract |
| Proposed | Frontend | Next.js as default distribution; frontend-agnostic platform core |
| Proposed | Commerce | Native JodKit commerce module; Medusa and Vendure as study references only |
| Proposed | Queue | BullMQ abstraction; PostgreSQL backend initially; Redis optional later |
| Proposed | Search | PostgreSQL baseline; SearchProvider for external engines |
| Proposed | Plugins | Trusted plugins; permission declarations (not sandbox yet) |
| Proposed | Themes | Framework-independent theme contract; Next.js renderer first |
| Proposed | Admin | JodKit-owned React/TypeScript metadata-driven admin |
| Proposed | License | AGPL 3.0 preferred candidate (not finalized) |
| Research required | License | AGPL vs MIT vs Apache 2.0 vs dual licensing; [ADR-003 Proposed](adr-003-license.md) |

---

## 1. PostgreSQL (selected)

PostgreSQL fits modular JodKit: transactions, JSONB, full-text search, extensions, pgvector, row-level security, schemas, mature migrations, strong relational model.

Example modular data layout (research before mandating one schema per module):

```text
PostgreSQL
|
+-- jodkit_core
+-- jodkit_users
+-- jodkit_cms
+-- jodkit_commerce
+-- plugin_reviews
+-- plugin_custom_x
```

---

## 2. Database access (Accepted: ADR-001 Drizzle + SQL escape hatch)

JodKit is not a simple CRUD SaaS. We need JSONB, indexes, CTEs, transactions, custom functions, FTS, pgvector, RLS, advanced joins, and database-specific features.

**Contract:**

```text
JodKit Data Layer
        |
        +-- Drizzle (Accepted default access layer)
        |
        +-- PostgreSQL (selected)
        |
        +-- SQL escape hatch (always available)
```

Modules should use **JodKit data interfaces** where appropriate; lower layers may use Drizzle directly when needed. JodKit must not become "Drizzle everywhere" as the product identity.

**Validate before large build:** [implementation-spikes.md](implementation-spikes.md#spike-1-metadata-to-drizzle-migrations) (metadata-driven collections vs Drizzle Kit workflow).

**Alternatives (documented, not default):** Kysely for SQL-first plugins; Prisma deferred - see [ADR-001](adr-001-drizzle-data-layer.md).

---

## 3. API (Accepted: ADR-002 REST + OpenAPI + GraphQL + MCP)

Do not expose only one public API style.

```text
                    JodKit
                       |
        +--------------+--------------+
        |              |              |
       REST         GraphQL          MCP
        |
     OpenAPI
```

- **REST + OpenAPI:** Baseline public API - simple, universal, integrations, mobile, AI tools reading OpenAPI.
- **GraphQL:** First-class for complex clients (CMS, commerce, admin, rich storefronts). Study Vendure Shop/Admin GraphQL patterns without adopting Vendure as a dependency.
- **MCP:** First-class AI interface; does **not** replace REST/GraphQL.

```text
Human developer / integrations  -> REST / GraphQL
Frontend / mobile               -> REST / GraphQL
AI agent                        -> MCP
```

**tRPC:** Possible internal TypeScript convenience only - **not** a public platform contract.

**v0.1 wedge:** REST + OpenAPI + MCP from metadata; **GraphQL deferred to v0.5+** ([roadmap.md](../roadmap.md)).

**Validate:** [implementation-spikes.md](implementation-spikes.md#spike-2-module-enabledisable-and-fastify-routes) (module disable vs Fastify routes).

---

## 4. Frontend (proposed: Next.js default, core independent)

```text
JodKit Platform (frontend-agnostic)
       |
       +---- Next.js adapter (proposed default)
       +---- Astro adapter (future)
       +---- Nuxt adapter (future)
       +---- SvelteKit adapter (future)
       +---- Custom frontend
```

Start with **Next.js** for SSR, SSG, dynamic apps, ecommerce, auth, dashboards, React ecosystem, and deployment options. Backend kernel must not depend on Next.js internals.

---

## 5. Commerce (proposed: native module)

**Not** embed Medusa or Vendure as JodKit's commerce engine.

```text
JodKit Commerce (native module, proposed)
       |
       +-- Products, Variants, Pricing, Inventory
       +-- Cart, Checkout, Orders
       +-- Payments, Shipping, Tax (providers)
       +-- Promotions
```

**Study references:** Medusa (workflows, modules, PostgreSQL-oriented architecture). Vendure (plugins, GraphQL, worker, strategy-based integrations). Learn patterns; do not copy wholesale or hard-depend.

Aligns with Foundation Option C direction - now **proposed** as native commerce informed by those systems.

---

## 6. Queue (proposed: BullMQ, PostgreSQL backend first)

```text
JodKit Queue
     |
     v
BullMQ abstraction (proposed)
     |
     v
PostgreSQL backend (initial)
     |
     +-- Redis backend (optional later)
```

Goal: basic install may run **Fastify + PostgreSQL + JodKit** without Redis. BullMQ supports PostgreSQL backend with the same Queue/Worker API (verify in implementation research).

---

## 7. Search (proposed: PostgreSQL first + SearchProvider)

Do not require Elasticsearch/Meilisearch/Typesense on every site.

```text
JodKit Search
      |
      v
PostgreSQL (baseline)
      |
      +-- SearchProvider plugins
            +-- Meilisearch
            +-- Typesense
            +-- Elasticsearch
            +-- Custom
```

Small site: PostgreSQL only. Large catalog: add external SearchProvider.

---

## 8. License (proposed candidate: AGPL 3.0 - research required)

AGPL aligns with open platform + reducing proprietary hosted forks without contributing back. MIT favors adoption but weak copyleft for hosted variants.

Research before **Accepted:** AGPL, MIT, Apache 2.0, LGPL, dual licensing, plugin/theme licensing, SaaS and commercial extensions.

Do **not** change [LICENSE.md](../../LICENSE.md) until ADR complete.

---

## 9. Plugin trusted plugins + permission declarations (proposed)

Do not build full sandbox before kernel exists.

**Phase 1:** Trusted in-process Node plugins + explicit permission **declarations** (db.read, db.write, network, filesystem, secrets, events). These are **metadata for review and future enforcement**, not a security boundary - in-process plugins cannot be truly sandboxed without separate processes, workers, or WASM (marketplace phase).

**Later:** Restricted and sandboxed tiers with real isolation.

---

## 10. Theme rendering (proposed)

Framework-independent **theme contract** (theme.json, templates, layouts, components, blocks, styles, assets). Backend must not reference Next.js-specific APIs.

```text
JodKit Theme API
       |
       v
Next.js renderer (proposed first adapter)
```

Future: Astro, Nuxt, SvelteKit renderers.

---

## 11. Admin UI (proposed)

Do not adopt a foreign admin framework (e.g. PHP Filament). JodKit admin must understand modules, collections, fields, permissions, plugins, themes, providers, workflows, MCP, and AI context.

**Proposed:** React + TypeScript + **shadcn/ui**, **TanStack Table/Form**, JodKit-owned screens driven by metadata (Foundation section 20). **v0.2 scope:** roughly **8 field types** first; defer plugin-contributed admin UI.

```text
JodKit Admin
     |
     +-- Core UI, Forms, Tables, Fields
     +-- Permissions, Module screens, Plugin screens
     +-- Dashboard widgets
```

---

## Resulting architecture (documentation view)

```text
                         JodKit
                            |
          +-----------------+-----------------+
          |                 |                 |
       Frontend           API              MCP
    (Next.js default) REST + OpenAPI (v0.1)   |
          |        GraphQL (v0.5+ optional)   |
          +----------------+-----------------+
                           |
                        Fastify (selected)
                           |
                     JodKit Kernel
                           |
       +-------------------+-------------------+
       |                   |                   |
    Modules             Plugins            Themes (later)
                           |
                    JodKit Data Layer (ADR-001)
                           |
                        Drizzle (Accepted)
                           |
                      PostgreSQL (selected)
                           |
          +----------------+----------------+
          |                |                |
         JSONB            FTS           pgvector
```

Infrastructure on PostgreSQL (proposed): data, queue (BullMQ PG backend), search baseline, vector data - external providers when needed.

---

## Related research (deep dives)

- [ADR-001](adr-001-drizzle-data-layer.md), [orm-comparison.md](orm-comparison.md)
- [ADR-002](adr-002-api-architecture.md), [api-architecture-research.md](api-architecture-research.md)
- [implementation-spikes.md](implementation-spikes.md)
- [license-research.md](license-research.md) - AGPL vs MIT (not legal advice)
- [queue-bullmq-postgresql.md](queue-bullmq-postgresql.md) - BullMQ PostgreSQL backend validation

## Related docs

- [Roadmap](../roadmap.md)
- [Architecture](../architecture.md)
- [Providers](../providers.md)
- [Modules](../modules.md) (commerce)
- [AI-native](../ai-native.md) (MCP)

**Full detail for product vision:** [Project Foundation v0.1](../project-foundation-v0.1.md)
