# Governance

JodKit is in **Architecture / Research**. Governance here describes how we intend to make and record decisions until a formal maintainer team and release process exist.

## Decision types

| Type | Examples | Process |
|------|----------|---------|
| **Product / architecture direction** | Modularity, provider model, AI-native goals | Document in foundation; discuss via issues/PRs |
| **Open technical choices** | Backend framework, ORM, default frontend, license | Research doc + architecture-decision issue; no silent "defaults" in code |
| **Documentation** | Thematic docs, `.ai/` artifacts | PR review; foundation remains canonical |

## Architecture decisions

For items listed in [docs/roadmap.md section  Decisions not yet final](docs/roadmap.md#decisions-not-yet-final):

1. File a [research](.github/ISSUE_TEMPLATE/research.md) or [architecture-decision](.github/ISSUE_TEMPLATE/architecture-decision.md) issue.
2. Add or link a report under `docs/research/`.
3. Record outcome in roadmap and, when appropriate, a short ADR section in the research doc.
4. Update foundation only when the decision is **established** - not when still evaluating candidates.

## Versioning (future)

When software exists, expect semver for:

- Platform (kernel/packages)
- Modules and plugins (declared compatibility in manifests)
- Public APIs and database migrations

Compatibility rules are described in [Foundation section 41-42](docs/project-foundation-v0.1.md#41-versioning).

## Roles (initial)

Until expanded: contributors propose via PR; maintainers (to be listed) merge when aligned with foundation and roadmap.

## License decision

Requires explicit discussion - see [Foundation section 44](docs/project-foundation-v0.1.md#44-open-source) and [LICENSE.md](LICENSE.md).

## Security

See [SECURITY.md](SECURITY.md) for reporting; security principles in [Foundation section 40](docs/project-foundation-v0.1.md#40-security).
