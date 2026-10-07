# Compatibility and versioning

**Status:** Direction before manifests are enforced in code.

## Semver targets

| Artifact | Versioning |
|----------|------------|
| Platform (kernel/packages) | semver |
| Module | semver in manifest |
| Plugin | semver in manifest |
| Theme | semver (future) |
| Provider contract | `contractVersion` on Capability |
| Database migrations | sequential per owner bundle |
| Public REST/OpenAPI | URL prefix or header TBD (ADR-002 open item) |

## Manifest requires (example)

```json
{
  "id": "reviews",
  "version": "1.2.0",
  "requires": {
    "jodkit": ">=0.1.0 <0.2.0",
    "cms": ">=0.2.0 <0.3.0"
  }
}
```

- Ranges use semver semantics
- CLI install/upgrade should refuse incompatible pairs ([Foundation section 41](project-foundation-v0.1.md#41-versioning))

## Breaking changes

- **Minor platform:** additive APIs, backward compatible migrations
- **Major platform:** breaking contract or migration requiring operator action
- Modules declare `requires.jodkit` upper bound before major platform releases

## API compatibility

- OpenAPI document versioned with platform release
- Deprecated routes: document in OpenAPI `deprecated: true` before removal

## Migration compatibility

- Migrations are forward-only in production unless documented down path
- Plugin disable does not roll back applied migrations by default

## Implementation

Compatibility checks in CLI/kernel are **deferred** until walking skeleton stable; this doc sets direction.

## Related

- [architecture/contracts.md](architecture/contracts.md) (`ModuleManifest.requires`)
- [GOVERNANCE.md](../GOVERNANCE.md)
