# API architecture research (REST + GraphQL + OpenAPI + MCP)

**Status:** Research reference - decision **Accepted** in [ADR-002](adr-002-api-architecture.md).  
**Proposed direction:** [stack-direction-v0.2.md](stack-direction-v0.2.md#3-api-proposed-rest--openapi--graphql--mcp)

## Requirement

JodKit is a **platform**, not a single app. Consumers differ:

| Consumer | Likely API |
|----------|------------|
| External integrators | REST + OpenAPI |
| Rich admin / storefront | REST or GraphQL |
| Mobile | REST |
| AI agents | MCP (+ OpenAPI for discovery) |
| TypeScript monolith (optional) | Internal service API only - not tRPC as public contract |

## Reference: Payload CMS (study system)

Payload generates **REST** and optional **GraphQL** from the same collection config, plus a **Local API** for in-process access (no HTTP).

- REST: CRUD per collection under `/api/{slug}` with pagination, depth, sorting, access control.
- GraphQL: `/api/graphql`, schema generated from config; can disable entirely if unused.
- Same query/access model across REST, GraphQL, Local API.

Docs: https://payloadcms.com/docs/rest-api/overview , https://payloadcms.com/docs/graphql/overview

**Lesson for JodKit:** One **metadata/schema definition** should drive multiple transports. GraphQL should be **optional at runtime** (disabled module = no GraphQL types for that domain).

## Reference: Vendure (study system)

Vendure exposes **GraphQL** for Shop and Admin APIs; architecture separates server, worker, dashboard, storefront.

**Lesson:** GraphQL shines for admin and complex commerce graphs; still keep REST/OpenAPI for simple integrations and AI tooling.

## Proposed JodKit layering

```text
Collection / module metadata (schema)
        |
        +-- Internal service API (TypeScript, in-process)
        +-- REST handlers (Fastify routes)
        +-- OpenAPI spec (generated, published)
        +-- GraphQL schema (generated, optional module)
        +-- Webhooks (events)
        +-- MCP tools (AI, module-gated)
```

### REST + OpenAPI (foundation)

- Default **public** API for every collection with standard CRUD + filters.
- OpenAPI document is the **contract** for SDKs, docs, and AI (`/openapi` or static file).
- Versioning: URL prefix or header (ADR needed).

### GraphQL (first-class, optional)

- Enable per module or site config.
- Complexity limits, disable introspection/playground in production by default (Payload pattern).
- Admin UI and headless storefronts may prefer GraphQL; simple sites may omit.

### MCP (AI)

- Tools generated from same metadata as REST (read/search/create where permitted).
- Must respect module enablement and permissions.
- MCP does **not** replace REST/GraphQL - see [ai-native.md](../ai-native.md).

### tRPC

- **Not** a platform-wide public contract (TypeScript-only clients).
- May exist inside official Next.js adapter as private app layer if ever needed.

## Generation strategy (research conclusions)

| Approach | Pros | Cons |
|----------|------|------|
| Hand-written routes per module | Simple start | Does not scale with plugins |
| Codegen from schema metadata | Consistent, AI-friendly | Upfront investment |
| Hybrid: core codegen + plugin hooks | Matches WordPress extensibility | Requires strict contracts |

**Recommendation for ADR:** Plan **codegen from collection metadata** as v0.1 goal; plugins register schema fragments that merge into OpenAPI/GraphQL/MCP.

## Security cross-cutting

- Same authz for REST, GraphQL, MCP
- Rate limiting at Fastify layer
- CSRF for cookie-based admin; tokens for API

## Open questions for ADR

1. Single GraphQL endpoint vs per-module schemas
2. OpenAPI version pinning with plugins
3. How disabled modules remove routes from all surfaces instantly

## Related

- [ADR-002](adr-002-api-architecture.md)
- [stack-direction-v0.2.md](stack-direction-v0.2.md)
- [Foundation section 24-25](../project-foundation-v0.1.md#24-api-architecture)
