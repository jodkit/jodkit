import type { ModuleContext, ModuleDefinition, PlatformEvent } from "../kernel/types.js";
import { createStubStorageProvider } from "../providers/stubStorageProvider.js";

export const ROUTE_PATH = "/demo/storage/ping";

export let pingEventCount = 0;

const pingHandler = () => {
  pingEventCount += 1;
};

export function resetPingEventCountForTests(): void {
  pingEventCount = 0;
}

export const demoModule: ModuleDefinition = {
  manifest: { id: "demo", version: "0.1.0" },

  async onEnable(ctx) {
    const provider = createStubStorageProvider();
    ctx.kernel.capabilities.register(provider);

    ctx.app.get(ROUTE_PATH, async (req, reply) => {
      if (!ctx.kernel.isModuleEnabled("demo")) {
        return reply.code(503).send({ error: "MODULE_DISABLED" });
      }
      const resolved = ctx.kernel.capabilities.resolveStorage();
      if (!resolved) {
        return reply.code(500).send({ error: "NO_PROVIDER" });
      }
      const result = await resolved.ping();
      await ctx.kernel.events.emit({
        name: "demo.storage.ping",
        payload: { providerId: result.providerId },
      });
      return result;
    });

    ctx.kernel.events.on("demo.storage.ping", pingHandler);
  },

  async onDisable(ctx) {
    ctx.kernel.capabilities.unregisterProvider("stub-storage");
    ctx.kernel.events.off("demo.storage.ping", pingHandler);
  },
};
