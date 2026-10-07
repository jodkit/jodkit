# License research (AGPL vs MIT vs others)

**Status:** Research draft - **license not finalized**. [LICENSE.md](../../LICENSE.md) remains TBD.  
**Proposed candidate:** AGPL 3.0 - see [stack-direction-v0.2.md](stack-direction-v0.2.md#8-license-proposed-candidate-agpl-30---research-required)

**Not legal advice.** Founders should confirm with counsel before selecting a license.

## JodKit goals (from Foundation)

- Open source platform with plugins, themes, ecosystem
- Possible hosted JodKit / SaaS offerings later
- Desire that improvements to the **platform** remain available to the community
- Commercial plugins/themes may exist

## Summary comparison

| License | SaaS with modifications | Fork + proprietary hosted fork | Adoption friction | Plugin ecosystem |
|---------|-------------------------|--------------------------------|-------------------|------------------|
| MIT | No source release required for network use | Allowed | Lowest | Easiest (permissive plugins) |
| Apache 2.0 | Similar to MIT + patent grant | Allowed | Low | Easy |
| AGPL 3.0 | Must offer source to **users interacting over network** with modified AGPL software | Harder to run modified proprietary network service without source | Higher for some enterprises | AGPL plugins affect combined work |

References: https://ossalt.com/guides/oss-licensing-guide-mit-apache-agpl-2026 , https://licensecompat.com/guides/agpl-saas/

## AGPL and SaaS (key point)

AGPL closes the "SaaS loophole" of GPL: **network use** can trigger obligation to provide corresponding source to users of the modified program.

- **Internal use** (employees only) is often treated differently from **public network service** (verify with counsel).
- **Unmodified** AGPL deployment may have simpler compliance than heavily forked core.

## Ecosystem examples (CMS / platforms)

| Project | Community license | Note |
|---------|-------------------|------|
| Payload CMS | MIT (self-hosted) | Easy commercial SaaS on top |
| Strapi | MIT (community) | Similar |
| Directus | AGPL | Common for self-host; SaaS builders must review AGPL |
| WordPress | GPL v2+ | Large plugin ecosystem under GPL-compatible rules |

Reference: https://dev.to/nayankyada/sanity-vs-payload-cms-vs-directus-pricing-comparison-2026-482o

## AGPL as JodKit platform license (pros / cons)

**Pros**

- Aligns with "platform stays open" narrative
- Discourages proprietary hosted forks of **modified core** without contributing back
- Used by many open SaaS-adjacent projects (Grafana, Nextcloud, etc.)

**Cons**

- Some companies ban AGPL dependencies in procurement
- **Plugin licensing** must be designed: MIT plugin on AGPL core is generally compatible for combined distribution, but plugin authors need clarity
- **Themes** (often MIT assets + PHP/TS code) need a clear policy
- Dual licensing / commercial edition is common escape hatch (extra business complexity)

## MIT as alternative (pros / cons)

**Pros**

- Maximum adoption and contributor comfort
- Easier for commercial hosting providers and MIT-licensed plugins

**Cons**

- Competitors can run modified core as closed SaaS without sharing changes

## Apache 2.0

Middle ground: permissive like MIT with explicit patent grant. Does **not** require network source disclosure.

## Research checklist before ADR

- [ ] Intended business model: self-host only vs official cloud vs both
- [ ] Default plugin license recommendation (MIT? same as core?)
- [ ] Theme asset licensing (fonts, templates)
- [ ] Trademark policy (separate from copyright)
- [ ] CLA or DCO for contributions
- [ ] Compatibility matrix for common plugin dependencies (MIT, Apache, GPL)

## Preliminary direction (not final)

**AGPL 3.0** remains the **preferred candidate** for **JodKit core** if the primary goal is keeping **network-deployed modifications** open.

If the primary goal is **maximum adoption** at the cost of closed SaaS forks, **MIT** (or Apache 2.0) wins.

**Do not update LICENSE.md** until ADR and legal review complete.

## Related

- [ADR-003 Proposed](adr-003-license.md)
- [Foundation section 44](../project-foundation-v0.1.md#44-open-source)
- [GOVERNANCE.md](../../GOVERNANCE.md)
