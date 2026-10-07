import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EVENT_NAME,
  MODULE_ID,
  ROUTE_PATH,
  eventHandlerCount,
  initRunCount,
  resetDisableDemoMetricsForTests,
  workerTickCount,
} from "./modules/disableDemoModule.js";
import { buildApp, enableDisableDemo } from "./server.js";

describe("Spike 5 disabled module", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetDisableDemoMetricsForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetDisableDemoMetricsForTests();
  });

  it("never-enabled module does not register routes or run init", async () => {
    const spike = await buildApp();

    const res = await spike.app.inject({ method: "GET", url: ROUTE_PATH });
    expect(res.statusCode).toBe(404);
    expect(initRunCount).toBe(0);

    await vi.advanceTimersByTimeAsync(200);
    expect(workerTickCount).toBe(0);

    await spike.app.close();
  });

  it("enabled module serves route, worker ticks, and event handlers run", async () => {
    const spike = await buildApp();
    await enableDisableDemo(spike);

    expect(initRunCount).toBe(1);

    const res = await spike.app.inject({ method: "GET", url: ROUTE_PATH });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, moduleId: MODULE_ID });

    await vi.advanceTimersByTimeAsync(100);
    expect(workerTickCount).toBeGreaterThan(0);
    expect(eventHandlerCount).toBe(workerTickCount);

    await spike.app.close();
  });

  it("disabled module gates HTTP, stops worker, and removes event handlers", async () => {
    const spike = await buildApp();
    await enableDisableDemo(spike);
    await vi.advanceTimersByTimeAsync(80);

    await spike.kernel.disableModule(MODULE_ID, { kernel: spike.kernel, app: spike.app });

    const gated = await spike.app.inject({ method: "GET", url: ROUTE_PATH });
    expect(gated.statusCode).toBe(503);
    expect(gated.json()).toEqual({ error: "MODULE_DISABLED" });

    const ticksAfterDisable = workerTickCount;
    const handlersAfterDisable = eventHandlerCount;
    await vi.advanceTimersByTimeAsync(150);
    expect(workerTickCount).toBe(ticksAfterDisable);

    await spike.kernel.events.emit({ name: EVENT_NAME, payload: { manual: true } });
    expect(eventHandlerCount).toBe(handlersAfterDisable);

    await spike.app.close();
  });
});
