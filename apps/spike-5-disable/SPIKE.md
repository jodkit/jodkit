# Spike 5 log

## Question

When a module is disabled, can we prove it does not serve HTTP, deliver events, or run background work?

## Experiment

`disable-demo` module registers a gated route on enable, a domain event handler, and a `setInterval` worker. `onDisable` clears the timer and removes the handler. Tests cover never-enabled (404), enabled, then disabled (503 gate, frozen worker ticks, no event delivery).

## Result

`npm test`: 3/3 passed - module never enabled -> **404** on module route, `initRunCount` 0, no worker ticks; enabled -> **200**, worker and event handler counts increase; after `disableModule` -> **503** `MODULE_DISABLED`, timer cleared (ticks frozen), manual `emit` does not invoke removed handler.

## Decision

Use a **hybrid** for v0.1: register routes only in `onEnable`, **gate** disabled modules in handlers (503), and **tear down** timers and event subscriptions in `onDisable`. Fastify cannot unregister routes after registration; **process reload** remains the path to true "no routes" for routes already registered. No ADR yet; promote to **ADR-004+** when walking skeleton codifies admin enable/disable UX.

## Follow-up

Walking skeleton: apply the same disable contract to real modules; file **ADR-004+** if we mandate reload vs gate platform-wide.
