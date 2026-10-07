# API implementation contract

**Status:** Implements [ADR-002](research/adr-002-api-architecture.md) at the code boundary. Not a second ADR.

**Metadata source:** [architecture/contracts.md](architecture/contracts.md) (`CollectionDefinition`)

## Pipeline

```text
defineCollection("products")
        |
        +-- REST (Fastify)
        +-- OpenAPI (paths + schemas)
        +-- MCP (tools)
```

GraphQL is **out of v0.1** ([v0.1-scope.md](v0.1-scope.md)).

## REST surface (default per collection)

Base path: `/api/{collectionSlug}`

| Method | Path | Action |
|--------|------|--------|
| GET | `/api/products` | List |
| GET | `/api/products/:id` | Read one |
| POST | `/api/products` | Create |
| PATCH | `/api/products/:id` | Partial update |
| DELETE | `/api/products/:id` | Delete |

**v0.1 list query params (minimal):**

| Param | Purpose | Default |
|-------|---------|---------|
| `limit` | Page size | 20 |
| `offset` | Skip rows | 0 |
| `sort` | Field name | `created_at` |
| `order` | `asc` or `desc` | `desc` |

Filtering by field equality may be added in skeleton; document supported filters per release.

## Request and response body

- JSON only for v0.1
- Body fields match collection metadata (unknown fields rejected or stripped - pick one in spike, document here)
- Errors: [error-handling.md](error-handling.md)

## OpenAPI

- Document version: OpenAPI 3.1 (target)
- One merged spec at `/openapi.json` (or static file) with fragments per collection
- Plugins/modules merge paths without overwriting core paths (prefix by moduleId if collision)

## MCP

Tool naming convention (v0.1):

```text
{collectionSlug}_list
{collectionSlug}_get
{collectionSlug}_create   // if permission allows
```

- Tool input schema mirrors REST params/body
- Same **PermissionChecker** as REST for the action
- Disabled module: tools not advertised

## Internal service API

In-process TypeScript API for modules (no HTTP) may mirror repository methods; not exposed as tRPC public contract.

## Auth (v0.1)

Walking skeleton may use single API key or open routes in dev only. Production auth module is v0.2+. Contract: every generated route calls `permissions.can` when `CollectionPermissions` set.

## Related

- [implementation-guide.md](implementation-guide.md#api-generation)
- [testing-strategy.md](testing-strategy.md) (API contract tests)
