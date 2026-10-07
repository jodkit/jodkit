# JodKit conventions (for agents)

**Repository phase:** documentation only. No application code or CLI yet.

**Authoritative rules:** [docs/principles.md](../docs/principles.md) and [Foundation section 46](../docs/project-foundation-v0.1.md#46-most-important-architectural-rules).

## Keyboard-only text (strict)

Never use characters that are not on a standard English QWERTY keyboard anywhere in the repo (docs, templates, `.ai/`, future code strings). No smart quotes, em/en dashes, Unicode ellipsis, section sign, Unicode arrows, box-drawing characters, or emoji. Use ASCII only; see [docs/writing-standards.md](../docs/writing-standards.md).

## Architectural rules (checklist)

1. Keep core/kernel small - no business domains in core.
2. Optional features -> modules or plugins.
3. Core defines contracts; modules implement capabilities; plugins provide implementations.
4. Never hard-code providers (no `if provider === "stripe"` in core/modules).
5. Do not couple backend architecture to one frontend framework.
6. Use public extension points - no editing platform internals for integrations.
7. Disabled modules must not run unnecessary routes/jobs/handlers.
8. Deployment topology (VPS vs split) is independent of app architecture.
9. Security applies to plugins/themes, not only core.
10. Prefer predictable, typed, small modules over large abstractions.
11. AI should rely on `.ai/`, manifests, and docs before scanning entire repo.

## Documentation conventions

- **Canonical narrative:** [docs/project-foundation-v0.1.md](../docs/project-foundation-v0.1.md)
- **Thematic docs** summarize and link to foundation sections - do not contradict them.
- Open technical choices live in [docs/roadmap.md](../docs/roadmap.md); do not implement as if decided.

## Anti-patterns

```text
// BAD - vendor in core/module logic
if (config.paymentGateway === 'razorpay') { ... }

// GOOD - capability resolution
const payment = capabilities.resolve('payment', config.paymentProviderId)
await payment.createPayment(input)
```

## Future naming (informative)

- Modules: `modules/<name>/` with manifest (dependencies + capabilities).
- Plugins: implement one or more capabilities; unique `id` per provider.
- Events: dotted names (`order.created`, `post.published`).
- Overrides: dotted service paths (`commerce.checkout.calculateTotal`).

Exact APIs will be specified when the kernel is implemented.

## When suggesting code changes

Implementation phase: primary build doc is [docs/implementation-guide.md](../docs/implementation-guide.md). Scope: [docs/v0.1-scope.md](../docs/v0.1-scope.md). Contracts: [docs/architecture/contracts.md](../docs/architecture/contracts.md). Run **spikes** ([implementation-spikes.md](../docs/research/implementation-spikes.md)) before large data-layer work. License ADR does not block private pre-release code.
