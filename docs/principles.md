# Principles

These principles govern JodKit architecture and documentation. They are **laws** for implementation once coding begins.

> JodKit should own the architecture; libraries should provide infrastructure without becoming JodKit's architecture.

Stack implications: [research/stack-direction-v0.2.md](research/stack-direction-v0.2.md).

## Modularity

> **Install only what you need. Extend only what you need. Run only what you need.**

Examples: a simple site runs Core + CMS + Media + SEO + Forms + Theme; ecommerce adds Users + Ecommerce + payment/shipping **plugins**; SaaS may use Auth + Users + Organizations + Billing without CMS at all.

## Layered responsibility

| Layer | Role |
|-------|------|
| **Core / kernel** | Stable contracts and infrastructure |
| **Modules** | Platform capabilities (CMS, ecommerce, auth, ...) |
| **Plugins** | Features and third-party **implementations** |
| **Users** | Choose which provider plugin satisfies each capability |

Core understands `PaymentProvider`, not Razorpay or Stripe by name.

## Nothing important hard-coded

Integrations (payments, shipping, tax, email, SMS, storage, search, AI, CDN, auth vendors, analytics, etc.) must be **capabilities** implemented by plugins.

> **If adding a new integration requires modifying platform core, the architecture has failed.**

## Development philosophy

Optimize for predictability, convention, strong typing, small modules, stable contracts, explicit dependencies, auto-generated docs/APIs, validation, tests, and **AI readability**. Avoid a framework so large that agents must learn thousands of unrelated abstractions.

## The fourteen architectural rules

1. Core must remain small.
2. Everything optional should be a module or plugin.
3. Core defines contracts.
4. Modules provide capabilities.
5. Plugins provide implementations.
6. Providers must never be hard-coded into core.
7. Frontend framework must not be hard-coded into backend architecture.
8. Public contracts must be stable.
9. Extensions use official extension points - not internal source edits.
10. AI must understand the project without reading the entire codebase.
11. Disabled modules must not unnecessarily execute.
12. Deployment topology is independent from application architecture.
13. Security applies to extensions as well as core.
14. If an integration requires core modification, reconsider the architecture.

Agent-oriented checklist: [../.ai/conventions.md](../.ai/conventions.md).

---

**Full detail:** [Foundation section 3 Main Goals](project-foundation-v0.1.md#3-main-goals) | [section 4-5 Philosophy & hard-coding](project-foundation-v0.1.md#4-core-architectural-philosophy) | [section 33 Development Philosophy](project-foundation-v0.1.md#33-development-philosophy) | [section 46 Architectural Rules](project-foundation-v0.1.md#46-most-important-architectural-rules)
