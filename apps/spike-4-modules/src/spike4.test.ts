import { afterEach, describe, expect, it } from "vitest";
import {
  ROUTE_PATH,
  pingEventCount,
  resetPingEventCountForTests,
} from "./modules/demoModule.js";
import { buildApp, enableDemoModule } from "./server.js";

describe("Spike 4 module + capability + event", () => {
  afterEach(async () => {
    resetPingEventCountForTests();
  });

  it("route returns data from resolved storage provider", async () => {
    const spike = await buildApp();
    let moduleEnabledHeard = false;
    spike.kernel.events.on("module.enabled", (e) => {
      if ((e.payload as { moduleId: string }).moduleId === "demo") {
        moduleEnabledHeard = true;
      }
    });

    await enableDemoModule(spike);

    const res = await spike.app.inject({ method: "GET", url: ROUTE_PATH });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, providerId: "stub-storage" });
    expect(moduleEnabledHeard).toBe(true);
    expect(pingEventCount).toBe(1);

    await spike.app.close();
  });

  it("registers capability only while module enabled", async () => {
    const spike = await buildApp();
    await enableDemoModule(spike);

    expect(spike.kernel.capabilities.resolveStorage()?.id).toBe("stub-storage");

    await spike.kernel.disableModule("demo", { kernel: spike.kernel, app: spike.app });
    expect(spike.kernel.capabilities.resolveStorage()).toBeUndefined();

    const res = await spike.app.inject({ method: "GET", url: ROUTE_PATH });
    expect(res.statusCode).toBe(503);

    await spike.app.close();
  });
});
