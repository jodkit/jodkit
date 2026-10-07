# JodKit architecture (agent summary)

**Phase:** Architecture / Research - no runtime platform in this repository yet.  
**Canonical source:** [docs/project-foundation-v0.1.md](../docs/project-foundation-v0.1.md)

**Writing:** Keyboard-only (ASCII) characters only. See [docs/writing-standards.md](../docs/writing-standards.md).

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

## Stack status

Backend framework, ORM, default frontend, API style, commerce engine, license - **not chosen**. Treat mentions of Fastify, Next.js, Drizzle, etc. as research candidates only. See [docs/roadmap.md](../docs/roadmap.md).

## Intended future monorepo (not on disk yet)

`packages/` (core, cli, admin, api, mcp, ...), `modules/`, `plugins/`, `themes/` - documented in foundation; do not assume directories exist.

## North star

Agents should discover capabilities -> reuse modules/plugins -> extend schema/API/admin/theme through official extension points -> validate with future `platform ai doctor`.
