# Modules

**Modules** are optional platform capabilities - not part of the minimal kernel. They implement business domains and register routes, admin, jobs, and events when **enabled**.

## Official modules (potential)

CMS, Auth, Users, Media, Forms, SEO, Ecommerce, Search, Memberships, Bookings, Subscriptions, Analytics, Organizations, Notifications - not all required for v1.

## Lifecycle

```text
install -> enable -> disable -> update -> uninstall
```

When **disabled**, a module should not unnecessarily run routes, services, workers, admin pages, cron jobs, or event handlers.

## Module manifest

Each module declares dependencies and what it provides (for humans, CLI, and AI):

```json
{
  "name": "ecommerce",
  "version": "1.0.0",
  "dependencies": ["core", "users", "media"],
  "optionalDependencies": ["forms", "seo"],
  "capabilities": ["products", "cart", "checkout", "orders", "payments", "inventory"]
}
```

Manifest shape will be specified further during technical design.

## CMS module (conceptual)

Schema-driven collections with generated persistence, validation, admin, APIs, permissions, search config, webhooks, and MCP tools - see [architecture](architecture.md).

## Ecommerce module (conceptual)

Optional first-class module: catalog, variants, cart, checkout, orders, inventory, promotions, etc. Payment/shipping/tax/storage use **provider plugins**, not hard-coded vendors.

**Proposed (stack v0.2):** Native JodKit commerce module; Medusa and Vendure as **study references only** - not embedded engines. Detail: [research/stack-direction-v0.2.md](research/stack-direction-v0.2.md#5-commerce-proposed-native-module).

## Example compositions

| Use case | Typical modules |
|----------|-----------------|
| Marketing site | Core, CMS, Media, SEO, Forms, Theme |
| Store | Above + Users, Ecommerce + payment/shipping plugins |
| SaaS | Core, Auth, Users, Organizations, Billing, API, Admin |

---

**Full detail:** [Foundation section 8-9 Modules & manifest](project-foundation-v0.1.md#8-modules) | [section 19-21 CMS & ecommerce](project-foundation-v0.1.md#19-cms) | [section 47-49 Examples](project-foundation-v0.1.md#47-example-complete-platform)
