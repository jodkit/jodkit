# Spike 3 log

## Question

Can one collection metadata definition drive REST, OpenAPI, and MCP tools with the same backing store?

## Experiment

Fastify routes generated from `productsCollection`, `/openapi.json` from metadata, MCP tool handlers `products_list` / `products_get` / `products_create` invoking the same in-memory store (Spike 3 avoids PostgreSQL; Spike 2 owns migrations).

## Result

`npm test`: 4/4 passed - REST CRUD (201/200/204), `/openapi.json` includes `/api/products` paths (OpenAPI 3.1.0), MCP `products_list` / `products_get` read same store as REST. In-memory store for Spike 3; wire to PostgreSQL in walking skeleton.

## Decision

Proceed with **codegen from collection metadata** for REST + OpenAPI + MCP handlers (ADR-002 direction validated). Full MCP stdio/HTTP server deferred; tool registry pattern is sufficient for Spike 3.

## Follow-up

Spike 4: `apps/spike-4-modules/` - module + capability + provider + event.
