import type { CapabilityRegistry, StorageProvider } from "./types.js";

export function createCapabilityRegistry(): CapabilityRegistry {
  const storageProviders = new Map<string, StorageProvider>();

  return {
    register(provider) {
      storageProviders.set(provider.id, provider);
    },
    resolveStorage(providerId) {
      if (providerId) return storageProviders.get(providerId);
      const first = storageProviders.values().next();
      return first.done ? undefined : first.value;
    },
    unregisterProvider(providerId) {
      storageProviders.delete(providerId);
    },
  };
}
