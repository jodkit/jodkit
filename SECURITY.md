# Security policy

JodKit treats security as a **platform requirement from day one**, including future plugin and theme extensions. See [docs/project-foundation-v0.1.md section 40](docs/project-foundation-v0.1.md#40-security).

## Current phase

This repository is in **pre-release development** (implementation spikes and walking skeleton). There is **no production deployment** or supported production surface yet. Report issues in application code once it exists using the channels below.

## Reporting vulnerabilities

When application code exists, report security issues **privately** before public disclosure.

**Until a dedicated security contact is published:** open a **private** security advisory via the repository host (GitHub Security Advisories) or contact maintainers through the channel listed in the repository description.

Please do **not** file public issues for exploitable vulnerabilities once code is shipped.

## Scope (future)

Expected areas: authentication and authorization, RBAC, API security, CSRF/CORS, rate limiting, webhook verification, secret handling, audit logs, plugin permissions, filesystem and database access controls, multi-site isolation.

## Safe harbor

We appreciate responsible disclosure and will work with reporters in good faith when the project has maintainers and releases.
