# Contributing to JodKit

Thank you for interest in JodKit. The **walking skeleton** lives in [apps/playground](apps/playground/) and `packages/*`; spike apps are frozen regression archives. See [docs/roadmap.md](docs/roadmap.md).

## Before you start

1. Read [AGENTS.md](AGENTS.md) (agents) or [docs/README.md](docs/README.md) (humans).
2. For code: [docs/v0.1-scope.md](docs/v0.1-scope.md), [docs/implementation-guide.md](docs/implementation-guide.md), [docs/architecture/contracts.md](docs/architecture/contracts.md).
3. Skim [docs/project-foundation-v0.1.md](docs/project-foundation-v0.1.md) and [docs/roadmap.md](docs/roadmap.md).
4. For new decisions, use [research issues](.github/ISSUE_TEMPLATE/research.md) or [architecture-decision issues](.github/ISSUE_TEMPLATE/architecture-decision.md).

## What we welcome now

- **Implementation spikes** and walking-skeleton code per [docs/research/implementation-spikes.md](docs/research/implementation-spikes.md) and [docs/implementation-guide.md](docs/implementation-guide.md)
- Research notes under `docs/research/` (linked from the [tracker](docs/research/README.md))
- Clarifications to foundation/thematic docs (foundation is canonical; ADRs are decision source of truth for stack)
- Updates to `.ai/` and [AGENTS.md](AGENTS.md) when rules change
- Governance and process improvements

## What we are not accepting yet

- Full product scope outside [v0.1-scope.md](docs/v0.1-scope.md) OUT list
- Docs that contradict **Accepted** ADRs ([ADR-001](docs/research/adr-001-drizzle-data-layer.md), [ADR-002](docs/research/adr-002-api-architecture.md)) or present **Proposed** items (Next.js default, license) as shipped
- Changing [LICENSE.md](LICENSE.md) until [ADR-003](docs/research/adr-003-license.md) is Accepted and counsel agrees

## Writing standards (strict)

Repo **documentation and tooling** use **keyboard-only characters** (standard English QWERTY). **Runtime i18n** (locale files, user content, CMS fields) will use Unicode and are exempt when implemented - see [docs/writing-standards.md](docs/writing-standards.md).

## Local checks (keyboard-only)

One-time setup after cloning:

```bash
pnpm install          # workspace: packages + playground
npm install           # root husky only; spike apps use npm per folder
```

The `prepare` script installs [Husky](https://typicode.github.io/husky/) so **pre-commit** runs ASCII checks on **staged** files only.

Manual full-repo scan (same as CI):

```bash
npm run check:ascii -- --all
```

Staged-only (what the hook runs):

```bash
npm run check:ascii -- --staged
```

Requires Node 22+. Pull requests also run the check in GitHub Actions (`.github/workflows/keyboard-only.yml`).

## Documentation changes

- Thematic docs should **summarize** and link to foundation + ADRs, not duplicate long sections.
- If you change rules or capability examples, update [.ai/conventions.md](.ai/conventions.md) and [.ai/capabilities.json](.ai/capabilities.json) (or [.ai/capabilities.md](.ai/capabilities.md)) and [AGENTS.md](AGENTS.md) in the same PR.

## Pull requests

Use the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). Keep PRs focused.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Governance

Decision process: [GOVERNANCE.md](GOVERNANCE.md).
