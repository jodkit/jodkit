# Error handling

**Status:** Shared error model before modules diverge.

## Error types

| Type | Meaning | Typical HTTP |
|------|---------|--------------|
| ValidationError | Input failed schema/rules | 400 |
| AuthenticationError | Missing or invalid credentials | 401 |
| AuthorizationError | Permission denied | 403 |
| NotFoundError | Resource or route | 404 |
| ConflictError | Unique constraint, state conflict | 409 |
| ProviderError | External/provider call failed | 502 or 424 |
| ConfigurationError | Bad env or config | 500 (startup fail) |
| MigrationError | Migration apply failed | 500 (startup fail) |
| PluginError | Plugin manifest or hook failure | 500 |
| InternalError | Unhandled bug | 500 |

## Response shape (JSON)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable summary",
    "details": []
  }
}
```

- `details`: optional field-level errors for ValidationError
- Never expose stack traces or secrets in production responses
- Log full cause server-side with requestId

## Mapping rules

- API layer maps typed errors to HTTP once - modules throw typed errors, not raw status codes
- Provider implementations wrap vendor errors in `ProviderError` with safe `message`
- Migration failures abort boot with `MigrationError`

## Logging

Log level guide:

- ValidationError: info or warn
- AuthorizationError: warn
- InternalError / MigrationError: error with stack

## Related

- [api-contract.md](api-contract.md)
- [architecture/contracts.md](architecture/contracts.md)
