# ADR-002: JodKit API architecture - REST, OpenAPI, optional GraphQL, MCP

## Status

**Accepted** (direction for planning). **Implementation validation:** module disable/route lifecycle spike - see [implementation-spikes.md](implementation-spikes.md#spike-2-module-enabledisable-and-fastify-routes).

## Context

- JodKit is a **platform** with diverse API consumers (integrators, admin, mobile, AI agents) ([api-architecture-research.md](api-architecture-research.md)).
- Backend **Fastify** is selected; collections/modules are metadata-driven (Payload/Vendure study patterns).
- Foundation section 54 listed API layering as research required; research draft is complete.

## Decision

1. **Single metadata source:** Collection / module **schema metadata** drives all public API surfaces.
2. **Codegen (v0.1 goal):** Generate from metadata, with plugin hooks to register fragments that merge into shared outputs:

   ```text
   Collection / module metadata (schema)
           |
           +-- Internal service API (TypeScript, in-process)
           +-- REST handlers (Fastify routes)
           +-- OpenAPI spec (generated, published contract)
           +-- GraphQL schema (generated, optional per module/site)
           +-- Webhooks (events)
           +-- MCP tools (AI, module-gated)
   ```

3. **REST + OpenAPI:** Default **public** API for every collection (CRUD, filters, pagination). OpenAPI is the **contract** for SDKs, docs, and AI discovery.
4. **GraphQL:** **First-class but optional** - enable per module or site config; disabled module must not expose GraphQL types for that domain. **v0.1 wedge:** defer GraphQL implementation to v0.5+; ship REST + OpenAPI + MCP first ([roadmap.md](../roadmap.md)).
5. **MCP:** Tools generated from same metadata as REST; respect module enablement and permissions; does not replace REST/GraphQL ([ai-native.md](../ai-native.md)).
6. **tRPC:** **Not** a platform-wide public contract. May exist only as a private layer inside an official adapter if ever needed.
7. **Security:** Same authz across REST, GraphQL, and MCP; rate limiting at Fastify layer; CSRF for cookie-based admin, tokens for API.

## Alternatives considered

| Approach | Outcome |
|----------|---------|
| Codegen from collection metadata | **Chosen** - consistent, scales with plugins, AI-friendly |
| Hand-written routes per module | Rejected as long-term default - does not scale |
| tRPC as public platform API | Rejected - TypeScript-only clients |
| GraphQL-only (Vendure-style) | Rejected as sole surface - integrators and OpenAPI need REST |

Full research: [api-architecture-research.md](api-architecture-research.md).

## Consequences

**Positive**

- One access/query model across internal, REST, GraphQL, and MCP.
- OpenAPI supports external integrations and agent tooling.
- Optional GraphQL keeps simple deployments lean.

**Negative / open design (implement during kernel/API work)**

1. Single GraphQL endpoint vs per-module schemas
2. OpenAPI version pinning when plugins add routes
3. How disabled modules remove routes from all surfaces - **working assumption:** Fastify cannot unregister routes after boot; use graceful reload or equivalent (spike required)
4. API versioning: URL prefix vs header (pick during implementation)

## Foundation / roadmap updates

- [x] Foundation section 53 - API architecture established
- [x] Foundation section 54 - removed from research required
- [x] [roadmap.md](../roadmap.md) - API ADR closed

## Alignment with architectural rules

- API-first capability and MCP support match Foundation direction.
- Metadata-driven admin and schema-driven CMS share the same metadata source.
- Plugins extend via registered fragments, not ad-hoc duplicate route definitions.

## Supersedes

Decision authority for API layering: supersedes the research draft status in [api-architecture-research.md](api-architecture-research.md). Study content remains reference.

## Related

- [api-architecture-research.md](api-architecture-research.md)
- [stack-direction-v0.2.md](stack-direction-v0.2.md)
- [Foundation section 24](../project-foundation-v0.1.md#24-api-architecture)
- [ADR-001](adr-001-drizzle-data-layer.md)
