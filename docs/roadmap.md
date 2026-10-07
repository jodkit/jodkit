# Roadmap

**Current stage:** Architecture / Research ([Foundation section 59](project-foundation-v0.1.md#59-project-status)).

Do **not** start large-scale implementation or create empty `packages/` / `modules/` trees until research closes open technical decisions.

## Decisions already established

Directionally agreed (see [Foundation section 53](project-foundation-v0.1.md#53-decisions-already-established)):

- Open source (license TBD)
- Modular architecture; optional ecommerce
- WordPress-like extensibility: themes, plugins, hooks, events, filters, overrides
- Provider abstraction; no hard-coded integrations in core
- API-first capability; MCP support
- AI-native architecture; AI-readable project structure
- Schema-driven CMS; metadata-driven admin
- Single VPS as primary deployment target; ability to split frontend/backend deployment
- Multi-site VPS support
- Strong security model; stable contracts; future migration tooling

## Decisions not yet final {#decisions-not-yet-final}

Requires research and ADRs - **candidates only**, not chosen stack:

| Area | Candidates |
|------|------------|
| Backend framework | Fastify, NestJS, Hono, other |
| Frontend | Next.js, Astro, Nuxt, SvelteKit, other |
| Database access | Drizzle, Prisma, Kysely, raw SQL, other |
| API style | REST, GraphQL, tRPC, combination |
| Commerce engine | Native, Medusa, Vendure, hybrid (Option C under investigation) |
| Queue | Redis/BullMQ, database-backed, other |
| Search | PostgreSQL, Meilisearch, Typesense, Elasticsearch, other |
| License | MIT, AGPL, other |
| Plugin sandboxing | TBD |
| Theme rendering | TBD |
| Admin UI framework | TBD |

Track progress in [research/README.md](research/README.md).

## Next phase: research

Before coding, produce technical comparisons ([Foundation section 55](project-foundation-v0.1.md#55-next-research-phase)): backend, frontend, database/ORM, CMS patterns, commerce engines, plugin systems, theme systems, AI-native patterns (MCP, manifests, agent workflows).

File outputs under `docs/research/` and link from the tracker.

## Conceptual milestones (subject to change)

| Version | Focus |
|---------|--------|
| **v0.1** | Kernel, module/plugin loaders, config, lifecycle, events, permissions, DB, schema system, basic admin, REST API, theme system, CLI, AI project manifest |
| **v0.2** | CMS, media, forms, SEO, auth, users |
| **v0.3** | Ecommerce foundation: products, variants, cart, orders, inventory, provider system |
| **v0.4** | Payments, shipping, coupons, promotions, webhooks, MCP |
| **v0.5+** | AI doctor/context, marketplace, migration tools, advanced deployment |

## Implementation order (after research)

Kernel -> modules -> plugins -> schema/content -> admin -> API -> themes -> AI tooling -> incremental capabilities ([Foundation section 56](project-foundation-v0.1.md#56-first-implementation-philosophy)).

## Documentation phase 1

**Baseline v0.1 complete** (foundation, thematic docs, `.ai/` artifacts, governance, keyboard-only checks). **No kernel, CLI, or MCP server.**

**Next step:** [Research tracker](research/README.md) - technical comparisons before stack decisions.

---

**Full detail:** [Foundation section 54-57, section 59](project-foundation-v0.1.md#54-decisions-not-yet-final)
