# Governance

JodKit is in **Architecture / Research**. Governance here describes how we intend to make and record decisions until a formal maintainer team and release process exist.

## Decision tiers

| Tier | Meaning | Where recorded |
|------|---------|----------------|
| **Selected** | Team commitment for planning/docs; implementation may still wait on other ADRs | Foundation section 53, roadmap "Selected" |
| **Proposed** | Strong direction; not ADR-accepted | [docs/research/stack-direction-v0.2.md](docs/research/stack-direction-v0.2.md), roadmap "Proposed direction", Foundation section 54 |
| **Research required** | Comparison + ADR before **Accepted** | Roadmap, research tracker |
| **Accepted** | Closed ADR; treat as implementation guidance | Foundation section 53/54 updates; research doc status |

Rule: **Proposed** items start in research docs; **Selected** updates Foundation section 53; **Accepted** removes items from "research required" in section 54 when appropriate.

## Decision types

| Type | Examples | Process |
|------|----------|---------|
| **Product / architecture direction** | Modularity, provider model, AI-native goals | Document in foundation; discuss via issues/PRs |
| **Open technical choices** | ORM, API layering, license (backend and DB selected) | Research doc + architecture-decision issue; no silent "defaults" in code |
| **Documentation** | Thematic docs, `.ai/` artifacts | PR review; foundation remains canonical |

## Architecture decisions

For items listed in [docs/roadmap.md section  Decisions not yet final](docs/roadmap.md#decisions-not-yet-final):

1. File a [research](.github/ISSUE_TEMPLATE/research.md) or [architecture-decision](.github/ISSUE_TEMPLATE/architecture-decision.md) issue.
2. Add or link a report under `docs/research/`.
3. Record outcome in [`docs/research/adr-*.md`](docs/research/README.md#architecture-decision-records) and update [roadmap](docs/roadmap.md); keep comparison research linked from the ADR.
4. Update Foundation section 53 when the decision is **Accepted**; section 54 for remaining **Proposed** / **Research required** items - not while still evaluating candidates.

## Versioning (future)

When software exists, expect semver for:

- Platform (kernel/packages)
- Modules and plugins (declared compatibility in manifests)
- Public APIs and database migrations

Compatibility rules are described in [Foundation section 41-42](docs/project-foundation-v0.1.md#41-versioning).

## Roles (initial)

Until expanded: contributors propose via PR; maintainers (to be listed) merge when aligned with foundation and roadmap.

## License decision

Requires explicit discussion before **first public release** - see [Foundation section 44](docs/project-foundation-v0.1.md#44-open-source), [ADR-003 Proposed](docs/research/adr-003-license.md), and [LICENSE.md](LICENSE.md). License choice does **not** block private or pre-release implementation work.

## Implementation vs release gates

| Gate | Blocks |
|------|--------|
| Accepted ADRs + spikes | Large-scale data/API build without validation |
| License ADR Accepted + LICENSE.md | Public open-source release |
| Proposed stack items | Treating Next.js, queue, admin scope as shipped product |

## Security

See [SECURITY.md](SECURITY.md) for reporting; security principles in [Foundation section 40](docs/project-foundation-v0.1.md#40-security).
