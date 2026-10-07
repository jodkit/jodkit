# ADR-003: JodKit platform license

## Status

**Proposed** (not Accepted - legal review and checklist incomplete; do not change [LICENSE.md](../../LICENSE.md))

## Context

- JodKit is open source with plugins, themes, and a possible future hosted offering ([Foundation section 44](../project-foundation-v0.1.md#44-open-source)).
- [license-research.md](license-research.md) compares AGPL 3.0, MIT, Apache 2.0, and ecosystem patterns (WordPress GPL, Directus AGPL, Payload/Strapi MIT).
- **Public open-source release** remains gated on **license ADR acceptance** until this ADR moves to Accepted and LICENSE.md is updated. Pre-release implementation may proceed privately.

## Decision (proposed)

**If** the primary product goal is keeping **network-deployed modifications to JodKit core** open to users of that service:

- **Propose AGPL 3.0** as the license for **JodKit core** (platform/kernel/modules distributed as the product).

**If** the primary goal shifts to **maximum adoption** with acceptance of closed SaaS forks of modified core:

- **Propose MIT or Apache 2.0** instead.

Until business model and counsel review complete, **no final license is selected** and LICENSE.md stays TBD.

## Alternatives considered

| License | When it fits |
|---------|----------------|
| AGPL 3.0 | Network copyleft; discourages proprietary hosted forks of modified core |
| MIT | Lowest friction; allows closed SaaS on modified core |
| Apache 2.0 | Permissive + patent grant; no network source obligation |
| Dual license / commercial edition | Common escape hatch; adds business and legal complexity |

Detail: [license-research.md](license-research.md).

## Consequences

**If AGPL is Accepted later**

- Plugin and theme **default license recommendations** must be documented (MIT plugins on AGPL core is a common pattern but needs explicit policy).
- Enterprise procurement may exclude AGPL; plan messaging and optional unmodified self-host story.
- Official JodKit cloud/SaaS requires compliance analysis with counsel.

**Regardless of final license**

- Trademark policy separate from copyright
- CLA or DCO for contributions
- Theme asset licensing (fonts, templates)
- Compatibility matrix for common plugin dependencies

## Checklist before Acceptance

- [ ] Intended business model: self-host only vs official cloud vs both
- [ ] Default plugin license recommendation (MIT? same as core?)
- [ ] Theme asset licensing (fonts, templates)
- [ ] Trademark policy (separate from copyright)
- [ ] CLA or DCO for contributions (**prefer DCO** unless planning commercial dual-license, which typically needs CLA)
- [ ] Compatibility matrix for common plugin dependencies (MIT, Apache, GPL)
- [ ] Legal review of chosen license

## Foundation / roadmap updates

- [ ] Update Foundation section 53 when **Accepted**
- [ ] Update [LICENSE.md](../../LICENSE.md) only when **Accepted** and counsel agrees
- [x] Linked from research tracker as Proposed ADR

## Alignment with architectural rules

License choice does not change modularity or provider rules; it affects **distribution, SaaS, and plugin ecosystem expectations**.

## Supersedes

None. When Accepted, will supersede "license not finalized" placeholders in roadmap and Foundation section 54.

## Related

- [license-research.md](license-research.md)
- [stack-direction-v0.2.md](stack-direction-v0.2.md#8-license-proposed-candidate-agpl-30---research-required)
- [GOVERNANCE.md](../../GOVERNANCE.md)
