# Contributing to JodKit

Thank you for interest in JodKit. The project is in **Architecture / Research**. Contributions should strengthen documentation, research, and architectural decisions - not jump ahead to a full implementation without agreed boundaries.

## Before you start

1. Read [docs/README.md](docs/README.md) and skim [docs/project-foundation-v0.1.md](docs/project-foundation-v0.1.md).
2. Check [docs/roadmap.md](docs/roadmap.md) for what is established vs open.
3. For stack choices, use [research issues](.github/ISSUE_TEMPLATE/research.md) or [architecture-decision issues](.github/ISSUE_TEMPLATE/architecture-decision.md).

## What we welcome now

- Research notes under `docs/research/` (linked from the [tracker](docs/research/README.md))
- Clarifications and corrections to foundation/thematic docs (foundation is canonical)
- Updates to `.ai/` summaries when architectural rules or capability examples change
- Governance and process improvements

## What we are not accepting yet

- Empty `packages/`, `modules/`, `plugins/`, or `themes/` scaffolding
- Core/kernel implementation without an approved architecture decision
- Docs that present Fastify, Next.js, Drizzle, or similar as **final** choices

## Writing standards (strict)

All contributions must use **keyboard-only characters** (standard English QWERTY). No smart quotes, special dashes, Unicode ellipsis, section sign, Unicode arrows, box-drawing characters, or emoji anywhere in the repo. See [docs/writing-standards.md](docs/writing-standards.md).

## Local checks (keyboard-only)

One-time setup after cloning:

```bash
npm install
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

Requires Node 18+. Pull requests also run the check in GitHub Actions (`.github/workflows/keyboard-only.yml`).

## Documentation changes

- Thematic docs (**vision**, **architecture**, etc.) should **summarize** and link to [project-foundation-v0.1.md](docs/project-foundation-v0.1.md), not duplicate or contradict it.
- If you change rules or capability examples, update [.ai/conventions.md](.ai/conventions.md) and [.ai/capabilities.json](.ai/capabilities.json) (or [.ai/capabilities.md](.ai/capabilities.md)) in the same PR.

## Pull requests

Use the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). Keep PRs focused.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Governance

Decision process for major choices: [GOVERNANCE.md](GOVERNANCE.md).
