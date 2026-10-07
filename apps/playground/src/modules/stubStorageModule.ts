import type { ModuleDefinition, StorageProvider } from "@jodkit/kernel";

export const STUB_STORAGE_MODULE_ID = "stub-storage-demo";

function createStubStorageProvider(): StorageProvider {
  return {
    id: "stub-storage",
    capabilityId: "storage",
    async ping() {
      return { ok: true, providerId: "stub-storage" };
    },
  };
}

/** Minimal capability proof (Spike 4) for walking skeleton. */
export const stubStorageModule: ModuleDefinition = {
  manifest: { id: STUB_STORAGE_MODULE_ID, version: "0.1.0" },

  async onEnable(ctx) {
    ctx.kernel.capabilities.register(createStubStorageProvider());

    ctx.app.get("/demo/storage/ping", async (_req, reply) => {
      if (!ctx.kernel.isModuleEnabled(STUB_STORAGE_MODULE_ID)) {
        return reply.code(503).send({ error: "MODULE_DISABLED" });
      }
      const resolved = ctx.kernel.capabilities.resolveStorage();
      if (!resolved) {
        return reply.code(500).send({ error: "NO_PROVIDER" });
      }
      return resolved.ping();
    });
  },

  async onDisable(ctx) {
    ctx.kernel.capabilities.unregisterProvider("stub-storage");
  },
};
