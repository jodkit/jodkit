# Spike 1 log

## Question

Can Fastify provide the HTTP runtime without becoming JodKit architecture (kernel stays a thin lifecycle shell)?

## Experiment

Minimal `Kernel` with `boot()` / `shutdown()`, Fastify app, `GET /health` returning `{ ok, version }`, Vitest using `inject`.

## Result

`npm test` passes: `GET /health` returns HTTP 200, `{ "ok": true, "version": "0.1.0" }`. Kernel `boot()` runs before routes; `shutdown()` runs on Fastify `onClose`.

## Decision

Use Fastify as the HTTP server for JodKit; keep `Kernel` as a thin lifecycle wrapper in Spike 1 (promote to `packages/kernel` after later spikes). No new ADR required for Spike 1.

## Follow-up

Spike 2 in `apps/spike-2-schema/` - PostgreSQL + Drizzle + `defineCollection` (no DB in Spike 1).
