import type { StorageProvider } from "../kernel/types.js";

export function createStubStorageProvider(): StorageProvider {
  return {
    id: "stub-storage",
    capabilityId: "storage",
    async ping() {
      return { ok: true, providerId: "stub-storage" };
    },
  };
}
