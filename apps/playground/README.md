# JodKit playground (walking skeleton)

First integrated JodKit app: kernel, PostgreSQL, `products` collection, REST, OpenAPI, MCP.

```bash
# From repo root (after pnpm install)
cp apps/playground/.env.example apps/playground/.env
# Or reuse apps/spike-2-schema/.env DATABASE_URL

pnpm --filter @jodkit/playground dev
pnpm --filter @jodkit/playground test
```

Requires `DATABASE_URL` (same DB as spike-2 is fine).

Endpoints:

- `GET /health`
- `GET /openapi.json`
- CRUD `/api/products`
- `POST /mcp/invoke` with `{ "name": "products_list", "args": {} }`
- `GET /demo/storage/ping` (stub storage capability)
