# Configuration

**Status:** Pre-code contract. Secrets never committed.

## Layers (precedence low to high)

```text
Defaults in code
  -> config file (jodkit.config.ts or .json - TBD)
  -> environment variables
  -> module/plugin config files
  -> provider secrets (env or secret store)
```

## Environment variables (v0.1 minimum)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NODE_ENV` | yes | development, test, production |
| `HOST` | no | Bind host (default 127.0.0.1) |
| `PORT` | no | HTTP port (default 3000) |
| `APP_URL` | no | Public URL for OpenAPI links |
| `LOG_LEVEL` | no | debug, info, warn, error |

## Secrets

- API keys for providers: env vars only in v0.1
- No secrets in repo, logs, or OpenAPI
- Future: encrypted site config in DB

## Module configuration

Each module may ship `defaults.json` + schema; merged at enable time. Invalid config fails enable with `ConfigurationError`.

## Plugin configuration

Same as modules; provider plugins read credentials via `KernelContext.config` scoped namespace:

```text
plugins.{pluginId}.{key}
```

## Environment-specific

- **development:** verbose logs, optional open permissions
- **test:** separate DATABASE_URL (CI)
- **production:** strict permissions, no debug routes

## .env.example (when code exists)

Placeholder file at repo root (not created until packages land):

```text
DATABASE_URL=postgresql://user:pass@localhost:5432/jodkit_dev
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
LOG_LEVEL=debug
```

## Related

- [implementation-guide.md](implementation-guide.md#configuration)
- [SECURITY.md](../SECURITY.md)
