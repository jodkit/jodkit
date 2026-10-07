# Plugins

**Plugins** extend JodKit: features, integrations, and **provider implementations**. They are the primary vehicle for third-party services without core changes.

## What a plugin may register

Database models, collections, fields, admin pages/components, frontend components and blocks, routes, REST/GraphQL APIs, hooks/filters/events, middleware, jobs/cron, settings, permissions, webhooks, **providers**, MCP tools.

Conceptual API (not finalized):

```ts
definePlugin({
  name: "reviews",
  collections: {},
  hooks: {},
  routes: {},
  admin: {},
  blocks: {},
  mcp: {}
})
```

## Trust and security

Plugins run code. Planned levels: UI-only, sandboxed, trusted server plugin. Long term: control filesystem, DB, network, secrets, cross-site access, and admin/API permissions - essential for a marketplace.

## Hooks vs platform internals

Use **events** (observe), **filters** (transform values), and **overrides** (decorate services) instead of patching core source. See [architecture](architecture.md) and [themes](themes.md) for override resolution order.

## Relation to modules

- **Modules** - curated platform capabilities (CMS, ecommerce, ...).
- **Plugins** - community or custom extensions; often implement a **capability** (`payment`, `shipping`, ...).

---

**Full detail:** [Foundation section 13-15 Plugin system & extensibility](project-foundation-v0.1.md#13-plugin-system) | [section 14 Plugin trust](project-foundation-v0.1.md#14-plugin-trust-and-security)
