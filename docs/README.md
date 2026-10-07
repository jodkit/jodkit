# JodKit documentation

**Project status:** Pre-release **implementation spikes + walking skeleton** ([roadmap](roadmap.md)). **Selected / Accepted:** Fastify, PostgreSQL, [ADR-001](research/adr-001-drizzle-data-layer.md), [ADR-002](research/adr-002-api-architecture.md). **Agents:** [AGENTS.md](../AGENTS.md). **License (public release):** [ADR-003 Proposed](research/adr-003-license.md).

When thematic summaries disagree with foundation, **[Project Foundation v0.1](project-foundation-v0.1.md)** wins. For **current build phase**, implementation contracts below take precedence over duplicate prose in thematic docs.

## Implementation phase (read before coding)

1. [v0.1-scope.md](v0.1-scope.md) - IN / OUT boundary
2. [implementation-guide.md](implementation-guide.md) - bridge to code; walking skeleton
3. [architecture/contracts.md](architecture/contracts.md) - platform interfaces
4. [research/implementation-spikes.md](research/implementation-spikes.md) - five spikes
5. [research/README.md](research/README.md) - ADRs and tracker

Supporting contracts: [data-model.md](data-model.md) | [api-contract.md](api-contract.md) | [testing-strategy.md](testing-strategy.md) | [configuration.md](configuration.md) | [error-handling.md](error-handling.md) | [compatibility.md](compatibility.md)

## Reading order (product and architecture)

0. [Writing standards](writing-standards.md)
1. [Vision](vision.md)
2. [Principles](principles.md)
3. [Architecture](architecture.md)
4. Extension model: [Modules](modules.md) | [Plugins](plugins.md) | [Themes](themes.md) | [Providers](providers.md)
5. [AI-native](ai-native.md)
6. [Roadmap](roadmap.md)
7. [Research tracker](research/README.md)

Deep read: [Project Foundation v0.1](project-foundation-v0.1.md) (sections 1-59).

## Glossary

| Term | Meaning |
|------|---------|
| **Platform** | Whole JodKit stack: kernel, modules, and extensions together. See [section 6](project-foundation-v0.1.md#6-platform-architecture). |
| **Kernel** | Minimal infrastructure: config, DI, lifecycle, events, permissions, abstractions - not business features. Informal docs may say "core". |
| **Module** | Optional platform capability (CMS, ecommerce, auth, ...) with install/enable/disable lifecycle. |
| **Extensions** | **Plugins** and **Themes** - extension types under the platform, not a third layer beside modules. |
| **Plugin** | Extensions and third-party implementations; may register providers, routes, admin UI, MCP tools. |
| **Capability** | Named integration slot (`payment`, `storage`, `search`, ...) discovered at runtime. |
| **Provider** | Plugin that implements a capability contract (e.g. `PaymentProvider`). |
| **Theme** | First-class frontend extension: templates, layouts, blocks, overrides - not CSS-only. |

See foundation: [section 6 Platform Architecture](project-foundation-v0.1.md#6-platform-architecture), [section 10 Capability System](project-foundation-v0.1.md#10-capability-system).

## For AI agents

Start with [AGENTS.md](../AGENTS.md), then [implementation-guide.md](implementation-guide.md) and [architecture/contracts.md](architecture/contracts.md). Also [.ai/architecture.md](../.ai/architecture.md), [.ai/conventions.md](../.ai/conventions.md), [.ai/capabilities.json](../.ai/capabilities.json).
