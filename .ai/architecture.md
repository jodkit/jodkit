# JodKit architecture (agent summary)

**Phase:** Architecture / Research - walking skeleton + spikes next ([roadmap](../docs/roadmap.md)).  
**Entry:** [AGENTS.md](../AGENTS.md)  
**Canonical source:** [docs/project-foundation-v0.1.md](../docs/project-foundation-v0.1.md)

**Writing:** Keyboard-only (ASCII) characters only. See [docs/writing-standards.md](../docs/writing-standards.md).

## Stack status (v0.2)

**Selected / Accepted (planning commitment - not implemented):**

- Backend: Fastify
- Database: PostgreSQL
- Data layer: Drizzle + SQL escape hatch ([ADR-001](../docs/research/adr-001-drizzle-data-layer.md))
- API: REST + OpenAPI + MCP for v0.1; GraphQL v0.5+ ([ADR-002](../docs/research/adr-002-api-architecture.md))
- Validate ADR-001/002 via [implementation-spikes.md](../docs/research/implementation-spikes.md)

**v0.1 wedge (build first):** defineCollection, capability/provider registry, generated REST + OpenAPI + MCP - not commerce, themes, multi-site, or GraphQL.

**Proposed (strong direction - NOT implemented; do not code as if decided):**

- Frontend: Next.js default adapter; core frontend-agnostic
- Commerce: native module; Medusa/Vendure study only (deferred)
- Queue: BullMQ, PostgreSQL backend first; pg-boss/Graphile as fallback adapters
- Search: PostgreSQL first + SearchProvider
- Plugins: trusted + permission **declarations** (not sandbox enforcement)
- Themes: contract + Next.js renderer first (deferred)
- Admin: shadcn/ui + TanStack; ~8 field types first (v0.2)
- License: AGPL 3.0 preferred candidate

**Before public release:**

- License final choice ([ADR-003 Proposed](../docs/research/adr-003-license.md)) - does not block private kernel work

Detail: [docs/research/stack-direction-v0.2.md](../docs/research/stack-direction-v0.2.md).

## Layer model

1. **Kernel** - Small infrastructure: config, DI, module/plugin loading, lifecycle, events/hooks, permissions, DB/cache/storage/queue abstractions, capability registry, API registration, logging, security primitives.
2. **Modules** - Optional domains (CMS, auth, ecommerce, ...). Lifecycle: install, enable, disable, update, uninstall. Disabled modules must not unnecessarily execute routes, workers, admin, or handlers.
3. **Plugins** - Extensions and vendor implementations (routes, admin, blocks, providers, MCP tools, ...).
4. **Themes** - Layouts, templates, components, blocks, overrides (not CSS-only).

## Capability / provider pattern

- Core defines **capabilities** (`payment`, `shipping`, `storage`, `search`, ...) and **contracts** (e.g. `PaymentProvider`).
- Plugins **implement** capabilities. Core and modules must not branch on vendor names.
- Rule: if a new integration requires core changes, architecture has failed.

## Extensibility

- **Events** - side effects after facts (`order.created`).
- **Filters** - transform values (`checkout.total`).
- **Overrides** - wrap services (`commerce.checkout.calculateTotal`).
- Resolution order: site -> child theme -> theme -> plugin -> platform default.

## CMS / admin (target)

Schema-driven collections; metadata-driven admin from field types. Auto-generate APIs, types, permissions, search, webhooks, MCP from schema where possible.

## Intended future monorepo (not on disk yet)

`packages/` (core, cli, admin, api, mcp, ...), `modules/`, `plugins/`, `themes/` - documented in foundation; do not assume directories exist.

## North star

Agents should discover capabilities -> reuse modules/plugins -> extend schema/API/admin/theme through official extension points -> validate with future `platform ai doctor`.
