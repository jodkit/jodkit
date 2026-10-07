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
- CRUD `/api/products`, `/api/users`
- `GET /admin/collections` (requires `admin:collections:read`; use header `X-JodKit-Subject: admin` with dev checker)
- `POST /mcp/invoke` with `{ "name": "products_list", "args": {} }`
- `GET /demo/storage/ping` (stub storage capability)
- `GET /plugins/hello/ping` (sample plugin)

Dev auth stub: `X-JodKit-Subject: <subject>` or `Authorization: Bearer <subject>`.
