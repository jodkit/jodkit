# Testing strategy

**Status:** Pre-code contract. Tooling: **Vitest** ([implementation-guide.md](implementation-guide.md)).

## Test layers

| Layer | Scope | Examples |
|-------|-------|----------|
| Unit | Pure functions, metadata parsers | Field validation, slugify |
| Integration | Kernel + DB + HTTP | Products CRUD against real PostgreSQL (test DB) |
| Module | Module enable/disable | Spike 4/5 scenarios |
| Plugin | Provider registration | Resolve stub storage provider |
| API contract | REST + OpenAPI | Paths exist; response shape matches schema |
| Migration | Up/down or up-only | Clean DB apply; ledger row count |
| Permission | Checker hooks | Deny when key missing |
| Provider | Contract compliance | Mock provider satisfies interface |
| MCP | Tool list + invoke | Tool disabled when module off |

## Module lifecycle (target automation)

```text
Install module
   |
   v
Run migrations
   |
   v
Enable
   |
   v
Use (API + events)
   |
   v
Disable
   |
   v
Uninstall (optional data retain)
```

v0.1: implement at least **enable -> use -> disable** for one module in integration tests.

## Walking skeleton minimum

Before calling v0.1 skeleton done:

1. One Vitest integration test: create product via POST, GET by id
2. OpenAPI contains `/api/products` paths
3. Disabled module test (Spike 5) automated or documented manual gate with issue link

## CI (future)

- `pnpm test` on PR
- Test PostgreSQL service container or docker-compose in CI
- ASCII check remains separate ([writing-standards.md](writing-standards.md))

## Fixtures

- Use transactions rolled back per test where possible
- Never run tests against production DATABASE_URL

## Related

- [error-handling.md](error-handling.md)
- [implementation-spikes.md](research/implementation-spikes.md)
