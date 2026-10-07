# JodKit documentation

**Project status:** Architecture / Research - no application kernel or fixed technology stack yet.

This folder contains the authoritative product and architecture documentation for [JodKit](../README.md). When anything disagrees with a thematic summary, **[Project Foundation v0.1](project-foundation-v0.1.md)** wins.

**Writing:** All docs use keyboard-only (ASCII) characters. See [writing-standards.md](writing-standards.md).

## Reading order (project development)

0. [Writing standards](writing-standards.md) - keyboard-only (ASCII) text rule (strict)
1. [Vision](vision.md) - why JodKit exists and what it is not
2. [Principles](principles.md) - modularity, contracts, providers, architectural rules
3. [Architecture](architecture.md) - kernel, APIs, CMS/admin concepts, deployment, security
4. Extension model (pick what you need):
   - [Modules](modules.md)
   - [Plugins](plugins.md)
   - [Themes](themes.md)
   - [Providers](providers.md)
5. [AI-native](ai-native.md) - MCP, manifests, CLI ideas, north star workflow
6. [Roadmap](roadmap.md) - established vs open decisions, milestones, research next steps
7. [Research tracker](research/README.md) - technical comparisons (phase 2)

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

Start with [../.ai/architecture.md](../.ai/architecture.md), [../.ai/conventions.md](../.ai/conventions.md), [../.ai/capabilities.json](../.ai/capabilities.json) (machine-readable example schema), and [../.ai/capabilities.md](../.ai/capabilities.md) (purpose and usage). Not live platform state.
