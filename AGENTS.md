# Agent instructions (JodKit)

Coding agents: read this file first, then the linked artifacts.

## Project phase

**v0.2 slice 1** (pre-release): auth subject hooks, `users` collection, minimal admin API. v0.1 complete in `packages/*` and [apps/playground](apps/playground/). Spikes under `apps/spike-*` are frozen regression evidence (`npm run test:spikes`). Scope: [docs/v0.2-scope.md](docs/v0.2-scope.md). License ADR is **not** a blocker for private pre-release code; public release needs [ADR-003](docs/research/adr-003-license.md) and [LICENSE.md](LICENSE.md).

## Canonical docs (build tasks)

| Priority | Path |
|----------|------|
| 1 | [docs/v0.1-scope.md](docs/v0.1-scope.md) (IN / OUT) |
| 2 | [docs/implementation-guide.md](docs/implementation-guide.md) (walking skeleton) |
| 3 | [docs/architecture/contracts.md](docs/architecture/contracts.md) (interfaces) |
| 4 | [docs/research/implementation-spikes.md](docs/research/implementation-spikes.md) (five spikes) |
| 5 | [docs/research/adr-*.md](docs/research/README.md#architecture-decision-records) |
| 6 | [docs/project-foundation-v0.1.md](docs/project-foundation-v0.1.md) (product vision) |
| 7 | [.ai/architecture.md](.ai/architecture.md), [.ai/conventions.md](.ai/conventions.md), [.ai/capabilities.json](.ai/capabilities.json) |

Data/API/testing: [data-model.md](docs/data-model.md), [api-contract.md](docs/api-contract.md), [testing-strategy.md](docs/testing-strategy.md).

## Rules (short)

- **Capabilities/providers:** core defines contracts; plugins implement providers - no hard-coded vendors in kernel.
- **Disabled modules** must not run routes, workers, or handlers ([implementation-spikes.md](docs/research/implementation-spikes.md#spike-5-disabled-module)).
- **v0.1 wedge:** [v0.1-scope.md](docs/v0.1-scope.md) - not GraphQL, commerce, themes, or multi-site in first slice.
- **Writing:** keyboard-only (ASCII) in repo docs and tooling strings; **i18n/locale content** may use Unicode - [writing-standards.md](docs/writing-standards.md).
- **Plugin permissions** are **declarations** today, not a sandbox.

## Moat (product story)

**One metadata definition** generates REST, OpenAPI, MCP, and admin (later) behind **stable capability contracts** - not generic AI manifest folders.

## Build path

Canonical app: [apps/playground](apps/playground/). Spike history: [docs/research/implementation-spikes.md](docs/research/implementation-spikes.md).
