# AI-native architecture

AI is not a bolt-on admin chatbot. The durable differentiator is **one metadata definition** (collections, fields, permissions) that generates **REST, OpenAPI, MCP**, and (later) admin UI behind **stable capability contracts** - not copy-paste `.ai/` folders or `llms.txt` alone.

Agents should still read [AGENTS.md](../AGENTS.md), OpenAPI, and manifests to navigate a deployment without reading every plugin file.

## Machine-readable surfaces (planned)

- Docs, OpenAPI, GraphQL introspection (when implemented)
- `llms.txt` / `llms-full.txt` (candidates)
- Per-project [`.ai/`](../.ai/) - **documentation artifacts today**, not runtime state

## AI project manifest (future per-site)

Each deployed project should expose structured metadata (modules, plugins, theme, database, platform version). Example shape is in [capabilities.json](../.ai/capabilities.json) under `exampleProjectManifest`.

## MCP

MCP is a first-class **capability**. Tools (e.g. `search_products`, `get_page`) depend on **installed modules** - no ecommerce module, no ecommerce MCP tools.

MCP **complements** REST and GraphQL; it does not replace them. Human integrations and most clients use REST/OpenAPI or GraphQL; agents use MCP ([stack-direction-v0.2.md](research/stack-direction-v0.2.md#3-api-proposed-rest--openapi--graphql--mcp)).

## CLI ideas (not implemented)

```bash
platform ai inspect
platform ai doctor
platform ai context
```

**AI doctor** (future): validate migrations, plugin dependencies, permissions, routes, theme/override conflicts, API mismatches, config.

**AI context** (future): compact export of version, modules, plugins, theme, collections, routes, capabilities, providers, conventions.

## Development workflow (target)

For a request like "add customer reviews to my ecommerce site," an agent should:

1. Inspect installed capabilities and modules
2. Add schema/collection, migration, service, hooks
3. Register API, admin UI, frontend block, permissions, MCP tools, tests
4. Run AI doctor

Predictable extension points reduce one-off architecture per feature.

## North star

> If an AI can understand a user's requirement, the platform should provide predictable capabilities that allow the AI to build that feature without inventing a new architecture every time.

---

**Full detail:** [Foundation section 26-32 MCP & AI tooling](project-foundation-v0.1.md#26-mcp) | [section 58 North star](project-foundation-v0.1.md#58-final-north-star) | [section 29-30 CLI & workflow](project-foundation-v0.1.md#29-ai-cli)
