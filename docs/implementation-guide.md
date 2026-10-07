# JodKit implementation guide

**Status:** Pre-code implementation contract. For **what is in v0.1**, see [v0.1-scope.md](v0.1-scope.md). Foundation vision: [project-foundation-v0.1.md](project-foundation-v0.1.md).

## Current implementation phase

JodKit has left **documentation-only** architecture work and entered **implementation spikes + walking skeleton** ([roadmap.md](roadmap.md), [AGENTS.md](../AGENTS.md)).

- **License** ([ADR-003 Proposed](research/adr-003-license.md)) gates **public open-source release**, not private pre-release code ([GOVERNANCE.md](../GOVERNANCE.md)).
- **ADR-001/002** are Accepted for direction; **spikes** must validate before large build ([implementation-spikes.md](research/implementation-spikes.md)).
- Do not add broad product docs; extend this contract layer or ADRs when build rules change.

## v0.1 wedge

Single source: [v0.1-scope.md](v0.1-scope.md) (IN / OUT lists).

**Moat to protect:** one metadata definition (`defineCollection`) produces database shape, validation, REST, OpenAPI, and MCP behind stable contracts - not Fastify or Drizzle defining the product shape.

## Architecture rules

Non-negotiable during implementation:

1. **Core defines contracts; plugins and modules implement** ([principles.md](principles.md), [architecture/contracts.md](architecture/contracts.md)).
2. **No hard-coded providers** in kernel - resolve by capability ID at runtime ([providers.md](providers.md)).
3. **Disabled modules** must not expose routes, workers, handlers, or unnecessary initialization ([implementation-spikes.md](research/implementation-spikes.md#spike-5-disabled-module)).
4. **Data Layer boundary** - plugins do not import Drizzle directly as a public pattern ([ADR-001](research/adr-001-drizzle-data-layer.md)).
5. **API surfaces** share authz and metadata ([ADR-002](research/adr-002-api-architecture.md), [api-contract.md](api-contract.md)).

## Package boundaries

Target monorepo (create when spikes pass):

```text
jodkit/
+-- packages/
|   +-- kernel/       config, lifecycle, events, capability registry, module loader
|   +-- schema/       defineCollection, field types (metadata only)
|   +-- data/         Data Layer interfaces + Drizzle adapter
|   +-- api/          REST + OpenAPI generators on Fastify
|   +-- mcp/          MCP tools from same metadata
|   `-- cli/          only if walking skeleton requires it
+-- modules/          optional domains (after skeleton)
+-- apps/playground/  Fastify app or thin consumer for manual testing
+-- docs/             implementation contracts + ADRs
`-- AGENTS.md
```

| Package | Owns | Must not own |
|---------|------|----------------|
| kernel | Boot, registries, lifecycle, permissions hooks | Business collections, vendor SDKs |
| schema | Collection/field metadata types | HTTP, SQL |
| data | Migrations apply, query boundary | Route handlers |
| api | REST/OpenAPI registration | Collection business rules |
| mcp | Tool descriptors + handlers | Duplicate metadata definitions |

**Tooling:** pnpm workspaces, TypeScript strict, Vitest, Node.js 22+ ([package.json](../package.json)).

## Kernel responsibilities

- Application boot and shutdown lifecycle
- Module and plugin registry (install/enable/disable state)
- Capability registry and provider resolution
- Collection registry (metadata index)
- Event bus registration (minimal v0.1)
- Permission check entry points (minimal v0.1)
- Logging and configuration loading hooks

Detail: [architecture/contracts.md](architecture/contracts.md) (`KernelContext`, `Module`).

## Module responsibilities

- Declare identity, version, dependencies, capabilities offered
- Register collections, routes, events, migrations when **enabled**
- Own domain tables via platform migration registry ([data-model.md](data-model.md))
- Respect disable: tear down or gate all surfaces

Detail: [modules.md](modules.md), contracts `Module`.

## Plugin responsibilities

- Extend platform via manifest (capabilities, routes, migrations, events)
- Implement **Provider** contracts for a capability ID
- Declare permissions (metadata only in v0.1 - not enforcement)
- May own prefixed tables ([data-model.md](data-model.md))

Detail: [plugins.md](plugins.md), contracts `Plugin`, `Provider`.

## Capability and provider model

- **Capability:** named slot (`payment`, `storage`, ...) with a versioned contract ID.
- **Provider:** plugin module that registers `implements: [capabilityId]` and satisfies the contract interface.

Example capability IDs: [.ai/capabilities.json](../.ai/capabilities.json). Runtime registry API: contracts `Capability`, `Provider`.

## Data layer

- PostgreSQL + Drizzle behind **JodKit Data Layer** interfaces
- Metadata-driven collections drive physical tables and migrations ([data-model.md](data-model.md))
- Spike 2 validates metadata -> SQL path ([implementation-spikes.md](research/implementation-spikes.md#spike-2-postgresql-drizzle-definecollection-migration))

## API generation

From each enabled collection ([api-contract.md](api-contract.md)):

- REST CRUD on Fastify
- OpenAPI paths and schemas (merged document)
- MCP tools (read/list/create where permitted)

GraphQL is **out of v0.1** ([v0.1-scope.md](v0.1-scope.md)).

## MCP generation

Same collection metadata as REST. Tools namespaced by module/collection. Permissions identical to REST for the same action.

## Configuration

Layers: environment, app config file, module config, plugin/provider secrets ([configuration.md](configuration.md)).

## Errors

Use shared error types and HTTP mapping ([error-handling.md](error-handling.md)). Modules throw typed errors; API layer maps to responses.

## Logging

- Structured logs from kernel (level, moduleId, requestId when HTTP exists)
- No PII or secrets in log lines
- Provider errors wrap `ProviderError` with safe public message

## Testing

See [testing-strategy.md](testing-strategy.md). Walking skeleton must include at least one integration test for the `products` collection flow.

## Migration strategy

- One migration **ledger** per database
- Order: core -> enabled modules -> enabled plugins
- SQL files reviewable before apply (ADR-001)
- Plugin tables use agreed prefix ([data-model.md](data-model.md))

## Walking skeleton

Canonical proof before feature expansion.

### Flow

```text
User / developer
      |
      | start project (TBD)
      v
   JodKit app
      |
      +-- Fastify (HTTP)
      +-- PostgreSQL
      +-- Drizzle (via Data Layer)
      +-- Kernel
      +-- Module registry
      +-- Capability registry
      +-- Collection registry
      +-- REST generator
      +-- OpenAPI generator
      +-- MCP generator
      +-- Tests (Vitest)
```

### First collection: products

Metadata (conceptual):

```text
Collection: products
  fields:
    id      (uuid or serial - pick in Spike 2)
    name    (string, required)
    slug    (string, unique)
    price   (decimal or integer cents)
```

**Must produce automatically (same metadata):**

```text
PostgreSQL table jodkit_products (or module prefix)
      +
validation on create/update
      +
REST:
  GET    /api/products
  GET    /api/products/:id
  POST   /api/products
  PATCH  /api/products/:id
  DELETE /api/products/:id
      +
OpenAPI fragment for products paths
      +
MCP tool(s) e.g. list_products, get_product (names TBD in api-contract)
```

This is **not** ecommerce module, WordPress parity, themes, or admin UI.

### One capability proof

Register a minimal capability (e.g. `storage` or a stub `demo`) with one in-process provider resolved at runtime (Spike 4).

### How to run

```bash
pnpm install
cp apps/playground/.env.example apps/playground/.env   # set DATABASE_URL
pnpm --filter @jodkit/playground dev                   # http://127.0.0.1:3010
pnpm test:playground                                 # walking skeleton tests
pnpm test:spikes                                     # frozen spike regression archive
```

See [apps/playground/README.md](../apps/playground/README.md). Requires `DATABASE_URL` ([configuration.md](configuration.md)).

## Implementation order

1. ~~Complete [spikes 1-5](research/implementation-spikes.md)~~ **Done** (2026-10-07).
2. ~~Create `packages/kernel`, `schema`, `data`, `api`, `mcp`~~ **Done**; evolve in place.
3. ~~Implement `products` collection end-to-end.~~ **Done** in [apps/playground](../apps/playground/).
4. **v0.1 hardening:** permission check hooks, plugin `registerPlugin`, CI; defer second domain module until hooks are stable.
5. ~~Update ADRs with spike outcomes.~~ **ADR-004** accepted; **ADR-005** reserved for module disable UX if needed.

## What not to build yet

Full list: [v0.1-scope.md](v0.1-scope.md) (OUT). Includes GraphQL, commerce, themes, multi-site, marketplace, plugin sandbox enforcement, visual builder, advanced admin, external search engines, billing, AI coding agent.

## Related

- [compatibility.md](compatibility.md)
- [research/README.md](research/README.md)
