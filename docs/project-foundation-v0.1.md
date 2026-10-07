# JodKit - AI-Native Full-Stack Web Platform

## Project Foundation Document v0.1

**Status:** Initial Foundation  
**Purpose:** Define the product vision, architectural principles, major capabilities, and open technical decisions before implementation.  
**Document version:** 0.1  
**Last updated:** 2026-10-07

---

## 1. Project Vision

We want to build an **open-source, AI-native, modular full-stack web application platform** designed to become a modern alternative to WordPress.

The goal is not simply to create another CMS.

The platform should allow developers and businesses to build:

- Websites
- Blogs
- Corporate websites
- Ecommerce stores
- Portals
- Membership platforms
- SaaS applications
- Booking systems
- Custom business applications
- AI-powered applications
- API-first applications
- Custom web applications

The platform should combine the flexibility and ecosystem philosophy of WordPress with the modern developer experience of the TypeScript/Node.js ecosystem and the capabilities required for AI-assisted development.

### Core idea

> **A WordPress-like platform built for the modern web and designed from the beginning for AI-assisted development.**

A more complete positioning is:

> **An open-source, AI-native, modular full-stack web application platform for building websites, ecommerce, portals, SaaS applications and custom web applications.**

---

## 2. Why This Project Exists

WordPress succeeded because it combined several things into one ecosystem:

- CMS
- Themes
- Plugins
- Hooks
- Templates
- Admin
- Content management
- Ecommerce through WooCommerce
- Huge ecosystem
- Easy deployment
- Developer extensibility

Modern Node.js CMS platforms solve individual parts of this problem, but there is still a gap.

Existing platforms often fall into one of these categories:

- CMS only
- API-first CMS
- Ecommerce engine
- Developer framework
- Website builder
- Headless CMS
- Backend framework

There is no clear modern platform that combines all of these into one coherent architecture while also being designed around AI-assisted development.

This project aims to fill that gap.

---

## 3. Main Goals

### 3.1 Modular by default

The platform must be genuinely modular.

A user who only wants a CMS should not be forced to install:

- Ecommerce
- Payments
- Shipping
- Subscriptions
- Booking
- Analytics
- Search
- Other unnecessary systems

For example:

#### Simple website

```text
Core
CMS
Media
SEO
Forms
Theme
```

#### Ecommerce website

```text
Core
CMS
Media
SEO
Users
Ecommerce
Payments
Shipping
Theme
```

#### SaaS application

```text
Core
Auth
Users
Organizations
Billing
API
Admin
```

The platform should load only what the project actually needs.

### Core principle

> **Install only what you need. Extend only what you need. Run only what you need.**

---

## 4. Core Architectural Philosophy

The architecture should follow these principles:

### 4.1 Core defines contracts

The core should define stable interfaces and contracts.

### 4.2 Modules provide capabilities

Modules implement platform capabilities.

### 4.3 Plugins provide implementations

Plugins add functionality and third-party integrations.

### 4.4 Users choose implementations

The platform should not force users to use a specific provider.

For example:

```text
Payment capability
        |
        +-- Stripe
        +-- Razorpay
        +-- Cashfree
        +-- PayPal
        +-- Custom provider
```

The core understands the concept of a payment provider, not Razorpay or Stripe specifically.

---

## 5. Nothing Important Should Be Hard-Coded

This is one of the most important project principles.

The platform must not hard-code specific companies, providers, services or integrations into the core.

For example, ecommerce should not contain:

```text
if provider == "razorpay"
```

Instead:

```text
PaymentProvider
```

should be a standard capability.

A plugin can then implement:

```text
RazorpayProvider
StripeProvider
CashfreeProvider
CustomProvider
```

The same philosophy applies to:

- Payments
- Shipping
- Tax
- Email
- SMS
- Storage
- Search
- AI
- CDN
- Authentication
- Analytics
- Maps
- Video
- Image processing
- Notifications

### Hard architectural rule

> **If adding a new integration requires modifying platform core, the architecture has failed.**

---

## 6. Platform Architecture

Conceptually the platform will contain several layers.

```text
                         PLATFORM
                            |
        +-------------------+-------------------+
        |                   |                   |
      Kernel             Modules             Extensions
        |                   |                   |
        |             +-----+-----+       +-----+------+
        |             |     |     |       |            |
      Config         CMS   Auth  Media  Plugins      Themes
      DI             SEO   Users Forms  Providers    Overrides
      Events         Shop  Search ...    Adapters
      Permissions
      Lifecycle
      Storage
      Cache
      Logging
      DB abstraction
```

The exact implementation is still open.

---

## 7. Platform Kernel

The kernel should remain as small as practical.

It should provide fundamental infrastructure rather than business functionality.

Potential responsibilities:

- Configuration
- Dependency injection
- Module loading
- Plugin loading
- Lifecycle management
- Event system
- Hook system
- Permissions
- Database abstraction
- Logging
- Cache abstraction
- Storage abstraction
- Queue abstraction
- Environment configuration
- Security primitives
- API registration
- Capability registry

The kernel should **not** contain:

- Products
- Orders
- Blog posts
- Shipping rules
- Payment providers
- Booking logic
- Forms
- SEO-specific business logic

Those belong to modules.

---

## 8. Modules

Modules represent platform capabilities.

Potential official modules:

```text
CMS
Auth
Users
Media
Forms
SEO
Ecommerce
Search
Memberships
Bookings
Subscriptions
Analytics
Organizations
Notifications
```

Not every module needs to ship in the initial release.

Modules should have lifecycle operations:

```text
install
enable
disable
update
uninstall
```

When a module is disabled, its:

- routes
- services
- workers
- admin pages
- scheduled jobs
- event handlers

should not unnecessarily run.

---

## 9. Module Manifest

Every module should declare its requirements and capabilities.

Example:

```json
{
  "name": "ecommerce",
  "version": "1.0.0",
  "dependencies": [
    "core",
    "users",
    "media"
  ],
  "optionalDependencies": [
    "forms",
    "seo"
  ],
  "capabilities": [
    "products",
    "cart",
    "checkout",
    "orders",
    "payments",
    "inventory"
  ]
}
```

This allows the platform and AI tools to understand the project automatically.

---

## 10. Capability System

The platform should have a central concept of **capabilities**.

Examples:

```text
payment
shipping
tax
email
sms
storage
search
ai
analytics
authentication
cdn
image-processing
```

A plugin declares that it implements a capability.

For example:

```text
Razorpay plugin
    implements: payment
```

```text
Shiprocket plugin
    implements: shipping
```

```text
S3 plugin
    implements: storage
```

The platform then discovers implementations dynamically.

---

## 11. Provider Architecture

A provider should implement a standard contract.

Example:

```ts
interface PaymentProvider {
  id: string
  name: string

  createPayment(
    input: CreatePaymentInput
  ): Promise<PaymentResult>

  verifyPayment(
    input: VerifyPaymentInput
  ): Promise<PaymentResult>

  refund(
    input: RefundInput
  ): Promise<RefundResult>
}
```

Shipping could follow the same model:

```ts
interface ShippingProvider {
  id: string
  name: string

  getRates(
    input: ShippingRateInput
  ): Promise<ShippingRate[]>

  createShipment(
    input: ShipmentInput
  ): Promise<Shipment>

  cancelShipment(
    input: CancelShipmentInput
  ): Promise<void>

  trackShipment(
    input: TrackingInput
  ): Promise<TrackingResult>
}
```

This allows users to create their own integrations without modifying the platform.

---

## 12. Future Provider Builder

A future feature could allow users to create integrations without writing a complete plugin.

For example:

```text
Provider Builder

API Base URL
Authentication
Endpoints
Request mapping
Response mapping
Webhook mapping
Error mapping
```

A user could describe an external service and configure:

```text
POST /payment/create
POST /payment/verify
POST /payment/refund
POST /webhook
```

The platform could generate a provider implementation.

AI could make this even more powerful.

For example:

> "Here is the API documentation for my shipping provider. Create a shipping provider plugin."

The AI could generate:

- provider implementation
- configuration
- API mapping
- webhook handler
- validation
- tests
- documentation

---

## 13. Plugin System

Plugins are one of the most important parts of the project.

A plugin should be able to add:

- Database models
- Collections
- Fields
- Admin pages
- Admin components
- Frontend components
- Blocks
- Routes
- REST APIs
- GraphQL APIs
- Hooks
- Filters
- Events
- Middleware
- Jobs
- Cron tasks
- Settings
- Permissions
- Webhooks
- Providers
- MCP tools

Example concept:

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

The exact API is intentionally not finalized yet.

---

## 14. Plugin Trust and Security

Plugins execute code and therefore need a security model.

Potential plugin levels:

```text
UI-only
Sandboxed
Trusted server plugin
```

The platform should eventually control:

- filesystem access
- database access
- network access
- secrets
- cross-site access
- API permissions
- admin permissions

This becomes especially important for a future plugin marketplace.

---

## 15. Hooks, Events and Overrides

The platform should provide WordPress-like extensibility but with a more structured architecture.

There should be three distinct concepts.

### Events

Something happened.

```text
order.created
user.created
payment.completed
post.published
```

### Filters

Modify a value.

```text
product.price
checkout.total
email.content
```

### Overrides

Replace or decorate a service implementation.

Example:

```ts
override(
  "commerce.checkout.calculateTotal",
  async ({ original, cart, customer }) => {

    const total = await original()

    if (customer.vip) {
      return total * 0.90
    }

    return total
  }
)
```

This provides WordPress-like flexibility without encouraging arbitrary modification of internal source files.

---

## 16. Override Resolution

Instead of physically replacing platform files, overrides should use a controlled resolution system.

Conceptually:

```text
Site Override
      v
Child Theme
      v
Theme
      v
Plugin
      v
Platform Default
```

This should apply where appropriate to:

- templates
- components
- services
- configuration
- presentation
- behavior

The platform should maintain clear boundaries between public APIs and private internals.

---

## 17. Theme System

Themes should be first-class platform extensions.

A theme should not simply be a CSS package.

Potential theme structure:

```text
theme/
    theme.json
    layouts/
    templates/
    components/
    blocks/
    styles/
    assets/
    config/
```

Themes should support:

- Parent themes
- Child themes
- Template overrides
- Component overrides
- Blocks
- Layouts
- Theme settings
- Styling
- Assets
- Hooks
- Custom frontend behavior

---

## 18. Frontend Framework Independence

The platform should not make the core dependent on one frontend framework.

Next.js is a strong candidate for the official/default frontend experience, but it should not be treated as a permanent architectural requirement before evaluation.

Potential future frontend targets:

```text
Next.js
Astro
React
Vue / Nuxt
Svelte
Custom frontend
Mobile applications
API-only applications
```

The backend platform should expose stable contracts so that different frontend technologies can consume it.

---

## 19. CMS

The CMS should be schema-driven.

A developer should be able to define something conceptually like:

```ts
defineCollection({
  name: "products",

  fields: {
    title: text(),
    price: money(),
    images: media(),
    category: relation("categories")
  }
})
```

From this definition, the platform should ideally generate:

- Database structure
- Validation
- Types
- Admin UI
- REST API
- GraphQL API
- OpenAPI
- Permissions
- Search configuration
- Webhooks
- MCP tools

This could become one of the central architectural advantages of the platform.

---

## 20. Metadata-Driven Admin

The admin system should not contain custom hard-coded screens for every possible module.

It should understand metadata.

For example:

```ts
field("price", money())
```

should allow the admin system to understand:

- label
- type
- validation
- currency
- formatting
- filtering
- sorting
- editing
- API representation

The same concept should work for:

```text
Text
Number
Money
Date
Media
Relation
Rich Text
JSON
Boolean
Select
Multi-select
Address
Email
URL
```

Modules and plugins can introduce their own field types.

---

## 21. Ecommerce

Ecommerce should be a first-class **optional module**.

Potential domain model:

```text
Catalog
Products
Variants
Categories
Brands
Attributes
Pricing
Inventory
Warehouses
Customers
Cart
Checkout
Orders
Payments
Refunds
Coupons
Promotions
Taxes
Shipping
Subscriptions
Digital Products
```

The commerce engine should be designed around the same capability/provider architecture.

---

## 22. Ecommerce Providers

The ecommerce module should not hard-code providers.

Examples:

### Payments

```text
Stripe
Razorpay
Cashfree
PayPal
Custom
```

### Shipping

```text
Shiprocket
Delhivery
DHL
FedEx
India Post
Custom
```

### Tax

```text
Tax provider A
Tax provider B
Custom
```

### Storage

```text
Local
S3
Cloudflare R2
Backblaze
Custom
```

The exact provider list is not part of the core.

---

## 23. Commerce Engine Decision

One major technical decision remains open.

Possible approaches:

### Option A

Build the complete commerce engine independently.

### Option B

Integrate an existing commerce engine such as Medusa or Vendure.

### Option C

Study existing systems such as Medusa and Vendure and build a native commerce engine that follows our platform contracts.

**Proposed direction (stack v0.2):** Native JodKit commerce module informed by Medusa and Vendure as **study references only** - not embedded engines (Option C). Not ADR-accepted yet.

The goal is to avoid reinventing proven concepts while ensuring commerce fits naturally into the platform architecture. Detail: [docs/research/stack-direction-v0.2.md](research/stack-direction-v0.2.md).

---

## 24. API Architecture

The platform should not depend on only one API style.

Potential API layers:

```text
Internal TypeScript service API
REST
OpenAPI
GraphQL
Webhooks
TypeScript SDK
MCP
```

Different clients should be able to consume the same underlying platform capabilities.

**Accepted direction:** Metadata-driven codegen across REST, OpenAPI, optional GraphQL, webhooks, and MCP - see [ADR-002](research/adr-002-api-architecture.md).

---

## 25. Automatic API Generation

A collection or module should ideally be able to expose APIs automatically.

For example:

```text
Product
```

could automatically expose:

```text
REST
GraphQL
OpenAPI
TypeScript types
Webhooks
MCP
```

This avoids developers repeatedly implementing the same API plumbing.

---

## 26. MCP

MCP should be treated as a first-class platform capability.

The platform should be able to expose controlled tools such as:

```text
search_products
get_product
search_pages
get_page
search_orders
get_customer
create_cart
apply_coupon
get_inventory
```

The exact tools should depend on installed modules.

If ecommerce is not installed, ecommerce MCP tools should not exist.

This keeps the system modular.

---

## 27. AI-Native Architecture

AI should not simply be a chatbot added to the admin.

The entire platform should be designed to be understood by AI systems.

The AI should be able to understand:

```text
Architecture
Modules
Plugins
Themes
Capabilities
Schemas
Permissions
APIs
Routes
Database
Conventions
Tests
```

The platform should expose machine-readable information.

Potential files/endpoints:

```text
/docs
/openapi
/graphql
/llms.txt
/llms-full.txt
```

Project metadata could include:

```text
.ai/
    architecture.md
    conventions.md
    capabilities.json
    permissions.json
```

---

## 28. AI Project Manifest

Every project should have machine-readable project information.

Example:

```json
{
  "platformVersion": "1.0",
  "modules": [
    "cms",
    "auth",
    "media",
    "commerce",
    "seo"
  ],
  "plugins": [
    "reviews",
    "razorpay"
  ],
  "theme": "storefront",
  "database": "postgresql"
}
```

An AI coding agent should be able to inspect this before making changes.

---

## 29. AI CLI

Potential CLI commands:

```bash
platform create mysite

platform dev

platform add ecommerce

platform add seo

platform add forms

platform create plugin reviews

platform create theme fashion

platform create block hero

platform create collection property

platform build

platform deploy

platform ai inspect

platform ai doctor

platform ai context
```

The exact command structure is still open.

---

## 30. AI Development Workflow

The AI should work through capabilities instead of randomly creating files.

Example request:

> "Add customer reviews to my ecommerce website."

The AI should reason approximately:

```text
Requirement
    v
Inspect installed capabilities
    v
Inspect ecommerce module
    v
Create review collection
    v
Create migration
    v
Create service
    v
Register hooks
    v
Add API
    v
Add admin UI
    v
Add frontend block
    v
Add permissions
    v
Add MCP tools
    v
Add tests
    v
Run AI doctor
```

This predictable architecture is critical for reliable AI-generated code.

---

## 31. AI Doctor

The platform should eventually have an architecture validation tool.

Example:

```bash
platform ai doctor
```

It could detect:

- Missing migrations
- Broken plugins
- Invalid dependencies
- Missing permissions
- Unused permissions
- Broken routes
- Theme conflicts
- Override conflicts
- API mismatches
- Invalid module versions
- Missing tests
- Configuration problems

This becomes a major part of making the platform AI-friendly.

---

## 32. AI Context

The platform should be able to generate a compact machine-readable description of the project.

Example:

```bash
platform ai context
```

Potential output:

```text
Platform version
Installed modules
Installed plugins
Active theme
Database
Collections
Routes
Capabilities
Providers
Permissions
Important conventions
```

This allows an AI agent to understand a project without reading the entire codebase.

---

## 33. Development Philosophy

The platform should optimize for:

```text
Predictability
Convention
Strong typing
Small modules
Stable contracts
Explicit dependencies
Automatic documentation
Automatic API generation
Automatic validation
Automated tests
AI readability
```

We should avoid creating an enormous framework where AI has to understand thousands of unrelated abstractions.

---

## 34. Deployment

Deployment architecture should remain independent of application architecture.

The primary deployment target should be:

> **A single VPS.**

A single VPS should be capable of running:

```text
Frontend
Backend
PostgreSQL
Optional Redis
Workers
Multiple websites
```

A user should also be able to split the deployment.

Example:

```text
Vercel
   |
Frontend

VPS
   |
Backend
   |
PostgreSQL
```

The application architecture should work in both cases.

---

## 35. Multi-Site VPS

A single VPS should be able to host multiple independent websites.

Each site should have its own:

- Configuration
- Database
- Theme
- Plugins
- Uploads
- Cache
- Environment variables
- API
- Users

Process management can be handled by infrastructure such as PM2.

The multi-site management layer should remain separate from the platform's core application architecture.

Potential future commands:

```bash
platform site create
platform site list
platform site backup
platform site update
platform site disable
platform site clone
platform site delete
platform site logs
platform site export
platform site import
```

---

## 36. Database

**PostgreSQL is the selected database.** Data layer: **Drizzle + raw SQL escape hatch** via JodKit Data Layer interfaces - [ADR-001](research/adr-001-drizzle-data-layer.md).

Important requirements:

- Strong relational support
- Good performance
- JSON support
- Migrations
- Transactions
- Extensions
- Search capability
- AI-friendly schema
- Good TypeScript ecosystem

**Accepted:** Drizzle as primary ORM; tagged raw SQL escape hatch; Kysely documented for legacy SQL-only plugin paths; Prisma deferred. Comparison: [orm-comparison.md](research/orm-comparison.md).

---

## 37. Search

Search should be modular.

A small website should not be forced to run a separate search server.

Potential architecture:

```text
PostgreSQL search
       |
       +-- Meilisearch
       +-- Typesense
       +-- Elasticsearch
       +-- Custom provider
```

The actual search provider should be selected through capability/provider architecture.

---

## 38. Cache and Queue

Caching and background jobs should be optional infrastructure.

Potential technologies:

```text
Redis
BullMQ
Database-backed queues
Other queue systems
```

A basic CMS should not require Redis simply to start.

Commerce, email processing, imports and other heavy workloads may activate additional infrastructure.

---

## 39. Storage

Storage should be provider-based.

Potential implementations:

```text
Local filesystem
S3
Cloudflare R2
Backblaze
Other S3-compatible storage
Custom provider
```

Media management should use the storage capability rather than directly depending on one storage vendor.

---

## 40. Security

Security must be designed into the platform from the beginning.

Important areas:

- Authentication
- Authorization
- RBAC
- Permissions
- API security
- CSRF
- CORS
- Rate limiting
- Webhook verification
- Secret management
- Audit logs
- Plugin permissions
- File access
- Database access
- Cross-site isolation
- Secure defaults

Security cannot be left until the plugin marketplace stage.

---

## 41. Versioning

The platform needs explicit compatibility rules.

Compatibility should exist between:

```text
Platform
Modules
Plugins
Themes
Database schema
API
```

Example:

```json
{
  "platform": ">=1.2 <2.0",
  "dependencies": {
    "commerce": "^1.4"
  }
}
```

The CLI should detect incompatible extensions before installation or upgrade.

---

## 42. Migrations and Upgrades

Database migrations must be first-class.

A platform update should be able to determine:

```text
Current version
Target version
Required migrations
Module migrations
Plugin migrations
Theme compatibility
```

The upgrade process should be predictable and recoverable.

---

## 43. Import and Migration Strategy

The platform should eventually provide migration tools from existing ecosystems.

Potential future importers:

```text
WordPress
WooCommerce
Strapi
Payload
Medusa
Shopify
Other CMS/ecommerce platforms
```

WordPress migration could become particularly important for adoption.

This does not need to be part of the first implementation, but the architecture should not make migration impossible.

---

## 44. Open Source

The project is intended to be open source and freely usable.

The exact license is not yet finalized.

Candidates previously considered:

```text
MIT
AGPL
Other open-source license
```

This decision should be made deliberately based on:

- Community adoption
- Commercial ecosystem
- SaaS usage
- Plugin marketplace
- Hosted versions
- Protection against closed forks

---

## 45. What We Are NOT Building

The project should not become:

### Only a CMS

It must support broader application development.

### Only an ecommerce platform

Ecommerce is optional.

### Only a website builder

Developers must have deep control.

### Only a backend framework

It needs themes, admin, CMS and frontend capabilities.

### Only an AI coding assistant

AI is part of the architecture, not the entire product.

### A giant monolithic framework

Modules must remain independently manageable.

### A collection of unrelated packages

There must be a coherent platform contract tying everything together.

---

## 46. Most Important Architectural Rules

The following principles should be treated as project laws.

### Rule 1

**Core must remain small.**

### Rule 2

**Everything optional should be a module or plugin.**

### Rule 3

**Core defines contracts.**

### Rule 4

**Modules provide capabilities.**

### Rule 5

**Plugins provide implementations.**

### Rule 6

**Providers must never be hard-coded into core.**

### Rule 7

**Frontend framework should not be hard-coded into backend architecture.**

### Rule 8

**Public contracts must be stable.**

### Rule 9

**Extensions should use official extension points instead of modifying internal source code.**

### Rule 10

**AI must be able to understand the project without reading the entire codebase.**

### Rule 11

**Disabled modules should not unnecessarily execute.**

### Rule 12

**Deployment topology must remain independent from application architecture.**

### Rule 13

**Security must apply to extensions as well as core.**

### Rule 14

**If an integration requires core modification, reconsider the architecture.**

---

## 47. Example Complete Platform

A user could create:

```bash
platform create my-store
```

Then:

```bash
platform add ecommerce
platform add seo
platform add forms
```

Install:

```text
Razorpay
Shiprocket
Google Analytics
Reviews
```

Select:

```text
Storefront theme
```

The resulting system could look like:

```text
                    MY STORE
                        |
              +---------+---------+
              |                   |
            Theme              Admin
              |                   |
              +---------+---------+
                        |
                     Platform
                        |
        +---------------+----------------+
        |               |                |
       CMS           Ecommerce          SEO
        |               |                |
       Media      +-----+-----+          |
                  |     |     |
                Cart Orders Payments
                            |
                     +------+------+
                     |             |
                 Razorpay      Shiprocket
```

None of these providers need to be part of the platform core.

---

## 48. Example Non-Ecommerce Website

A user could instead install only:

```text
Core
CMS
Media
Forms
SEO
Theme
```

There would be no:

```text
Cart
Checkout
Orders
Payments
Shipping
Inventory
```

This keeps the installation lightweight.

---

## 49. Example Custom SaaS

A SaaS application could use:

```text
Core
Auth
Users
Organizations
Billing
API
Admin
```

Then add plugins for:

```text
Stripe
Email
AI
Analytics
CRM
```

The same underlying platform would power the application.

---

## 50. The Long-Term Ecosystem

The long-term platform could contain:

```text
Core
Modules
Plugins
Themes
Blocks
Providers
Templates
CLI
AI tools
MCP tools
Marketplace
Documentation
Migration tools
Deployment tools
```

This is how the project could eventually develop a WordPress-like ecosystem without copying WordPress's technical architecture.

---

## 51. Potential Differentiation

The platform's strongest differentiation should not simply be:

> "WordPress but written in Node.js."

That would not be enough.

The real differentiation should be:

```text
WordPress ecosystem philosophy
        +
Modern TypeScript architecture
        +
True modularity
        +
Provider abstraction
        +
Modern APIs
        +
MCP
        +
AI-native development
        +
Developer-first extensibility
        +
Modern deployment
```

---

## 52. Initial Product Definition

For now, the project can be defined as:

> **An open-source, modular, AI-native full-stack web application platform that combines CMS, themes, plugins, APIs, ecommerce and application development under a unified extensible architecture.**

The platform should allow a developer to start with a minimal CMS and progressively add capabilities without being forced to install or run functionality they do not need.

---

## 53. Decisions Already Established

The following are strong project directions:

- Open source
- Modular architecture
- WordPress-like extensibility
- Themes
- Plugins
- Hooks
- Events
- Filters
- Overrides
- Optional ecommerce
- Provider abstraction
- No hard-coded integrations
- API-first capability
- MCP support
- AI-native architecture
- AI-readable project structure
- Metadata-driven admin
- Schema-driven CMS
- Single VPS as a primary deployment target
- Ability to split frontend/backend deployment
- Multi-site VPS support
- Strong security model
- Stable contracts
- Future migration tooling
- **Backend framework: Fastify** (selected)
- **Database: PostgreSQL** (selected)
- **Data layer:** Drizzle + raw SQL escape hatch via JodKit Data Layer interfaces ([ADR-001](research/adr-001-drizzle-data-layer.md))
- **API architecture:** REST + OpenAPI baseline; optional GraphQL; MCP for AI; metadata-driven generation ([ADR-002](research/adr-002-api-architecture.md))
- Stack direction v0.2 (remaining proposed items): [docs/research/stack-direction-v0.2.md](research/stack-direction-v0.2.md)

---

## 54. Decisions NOT Yet Final

Technical stack uses three tiers: **Selected** (section 53), **Proposed direction** (strong guidance, not ADR-accepted), **Research required** (comparison + ADR before Accepted). Full rationale: [docs/research/stack-direction-v0.2.md](research/stack-direction-v0.2.md).

### Selected (see section 53)

- Backend: Fastify
- Database: PostgreSQL

### Proposed direction (stack v0.2)

- **Frontend:** Next.js as default distribution adapter; platform core remains frontend-agnostic
- **Commerce:** Native JodKit commerce; study Medusa/Vendure - do not integrate as core dependency
- **Queue:** BullMQ abstraction; PostgreSQL backend initially; Redis optional later
- **Search:** PostgreSQL baseline; SearchProvider for Meilisearch, Typesense, Elasticsearch, etc.
- **Plugins:** Trusted server plugins initially; permissions (db, network, filesystem, secrets, events) from day one
- **Themes:** Framework-independent theme contract; Next.js renderer first
- **Admin:** JodKit-owned React/TypeScript metadata-driven admin
- **License:** AGPL 3.0 preferred candidate - not finalized

### Research required before acceptance

- **License:** AGPL vs MIT vs Apache 2.0 vs dual licensing; plugins, themes, SaaS, commercial extensions ([ADR-003 Proposed](research/adr-003-license.md))

**Public release** remains gated until the **license ADR is Accepted** and [LICENSE.md](../LICENSE.md) is updated (per [GOVERNANCE.md](../GOVERNANCE.md)). Pre-release kernel work may proceed in private or all-rights-reserved repos. ORM and API direction is closed via [ADR-001](research/adr-001-drizzle-data-layer.md) and [ADR-002](research/adr-002-api-architecture.md) but must be **validated by implementation spikes** ([implementation-spikes.md](research/implementation-spikes.md)) before large-scale build-out.

---

## 55. Next Research Phase

The next stage should not immediately start coding.

We should first create a proper technical comparison of existing technologies and projects.

Research areas:

### Backend

**Selected:** Fastify (see section 53). Comparison notes below may still inform plugin and DI patterns.

Compare:

```text
Fastify
NestJS
Hono
Other Node.js architectures
```

Evaluate:

- Plugin system
- Dependency injection
- Performance
- Encapsulation
- AI readability
- TypeScript support
- Testing
- Ecosystem
- Long-term maintainability

### Frontend

Compare:

```text
Next.js
Astro
Nuxt
SvelteKit
Other
```

Evaluate:

- Theme architecture
- SSR
- Static generation
- Dynamic applications
- Ecommerce
- Developer experience
- AI development
- Deployment

### Database

Compare:

```text
PostgreSQL
ORM/query builders
```

### CMS architecture

Study:

```text
WordPress
Payload
Strapi
ApostropheCMS
Directus
Ghost
```

### Commerce

Study:

```text
Medusa
Vendure
Saleor
WooCommerce
Shopify architecture
```

### Plugin architecture

Study:

```text
WordPress
Vendure
Fastify
NestJS
Payload
```

### Theme architecture

Study:

```text
WordPress
Shopify
Ghost
Modern frontend frameworks
```

### AI-native architecture

Study:

```text
MCP
llms.txt
AI-readable schemas
Agentic coding workflows
Code generation
Project manifests
```

---

## 56. First Implementation Philosophy

Once the architecture research is complete, implementation should begin with the smallest useful kernel.

Not:

```text
CMS + Ecommerce + AI + Marketplace + Everything
```

Instead:

```text
Kernel
   v
Module system
   v
Plugin system
   v
Schema/content system
   v
Admin
   v
API
   v
Theme system
   v
AI tooling
```

Then capabilities can be added incrementally.

---

## 57. Initial Milestone Concept

A possible first meaningful milestone:

### Platform v0.1

```text
Core kernel
Module loader
Plugin loader
Configuration
Lifecycle
Events
Permissions
Database
Schema system
Basic admin
REST API
Theme system
CLI
AI project manifest
```

Then:

### v0.2

```text
CMS
Media
Forms
SEO
Authentication
Users
```

Then:

### v0.3

```text
Ecommerce foundation
Products
Variants
Cart
Orders
Inventory
Provider system
```

Then:

### v0.4

```text
Payments
Shipping
Coupons
Promotions
Webhooks
MCP
```

Then:

### v0.5+

```text
AI tooling
AI doctor
AI context
Marketplace
Migration tools
Advanced deployment
```

These versions are conceptual only and should be changed after technical planning.

---

## 58. Final North Star

The most important statement for this project is:

> **If an AI can understand a user's requirement, the platform should provide predictable capabilities that allow the AI to build that feature without inventing a new architecture every time.**

The platform should make the following workflow possible:

```text
User requirement
       v
AI understands requirement
       v
Platform capabilities discovered
       v
Existing modules/plugins reused
       v
Schema generated
       v
Backend generated
       v
API generated
       v
Admin generated
       v
Frontend/theme generated
       v
Permissions configured
       v
Tests generated
       v
AI Doctor validates project
       v
Application ready
```

That is the central idea behind the project.

---

## 59. Project Status

**Current stage: Architecture / Research + pre-code implementation contracts**

For **what to build now**, [implementation-guide.md](implementation-guide.md) and [v0.1-scope.md](v0.1-scope.md) supersede this section until walking skeleton lands. We should **not start large-scale product features** outside v0.1 scope.

The immediate objective is to turn this foundation into a detailed technical architecture after researching the strongest existing systems and deciding what should be:

```text
Core
Module
Plugin
Provider
Theme
API
AI layer
Infrastructure
```

Only after those boundaries are clear should we freeze the technology stack and begin implementation.

---

## Intended future repository layout (not implemented yet)

When implementation begins, the monorepo may resemble:

```text
jodkit/
+-- packages/
|   +-- core
|   +-- cli
|   +-- cms
|   +-- admin
|   +-- api
|   +-- mcp
|   `-- ...
+-- modules/
|   +-- auth
|   +-- media
|   +-- ecommerce
|   +-- forms
|   `-- ...
+-- plugins/
+-- themes/
+-- docs/
+-- examples/
`-- .ai/
```

This layout is documented for planning only. Empty directories must not be created until the project exits the research phase.
