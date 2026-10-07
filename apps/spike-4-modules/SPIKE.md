# Spike 4 log

## Question

Can a module register a capability provider, HTTP route, and event handler through a minimal kernel?

## Experiment

`demo` module with manifest, `storage` provider (`stub-storage`), `GET /demo/storage/ping` resolves provider at runtime, emits `demo.storage.ping` on each ping.

## Result

`npm test`: 2/2 passed - `GET /demo/storage/ping` resolves `stub-storage` and increments `demo.storage.ping` listener; `disableModule` unregisters provider and route returns **503** `MODULE_DISABLED` (route stays registered; gate in handler).

## Decision

Minimal kernel + module lifecycle is viable for Spike 4 scope. **Disable behavior** is deferred to Spike 5 (`apps/spike-5-disable/`); production enable/disable may need reload for true route removal (ADR-004+ if we standardize).

## Follow-up

Spike 5: disabled module must not run routes/handlers (`apps/spike-5-disable/`).
