import type { ModuleDefinition } from "../kernel/types.js";

export const MODULE_ID = "disable-demo";
export const ROUTE_PATH = "/demo/disable/ping";
export const EVENT_NAME = "disable-demo.tick";

export let initRunCount = 0;
export let workerTickCount = 0;
export let eventHandlerCount = 0;

let workerTimer: ReturnType<typeof setInterval> | undefined;

const tickEventHandler = () => {
  eventHandlerCount += 1;
};

export function resetDisableDemoMetricsForTests(): void {
  initRunCount = 0;
  workerTickCount = 0;
  eventHandlerCount = 0;
}

export const disableDemoModule: ModuleDefinition = {
  manifest: { id: MODULE_ID, version: "0.1.0" },

  async onEnable(ctx) {
    initRunCount += 1;

    ctx.app.get(ROUTE_PATH, async (_req, reply) => {
      if (!ctx.kernel.isModuleEnabled(MODULE_ID)) {
        return reply.code(503).send({ error: "MODULE_DISABLED" });
      }
      return { ok: true, moduleId: MODULE_ID };
    });

    ctx.kernel.events.on(EVENT_NAME, tickEventHandler);

    workerTimer = setInterval(async () => {
      if (!ctx.kernel.isModuleEnabled(MODULE_ID)) return;
      workerTickCount += 1;
      await ctx.kernel.events.emit({ name: EVENT_NAME, payload: { tick: workerTickCount } });
    }, 25);
  },

  async onDisable(ctx) {
    if (workerTimer !== undefined) {
      clearInterval(workerTimer);
      workerTimer = undefined;
    }
    ctx.kernel.events.off(EVENT_NAME, tickEventHandler);
  },
};
