import type { EventBus, PlatformEvent } from "./types.js";

type Handler = (event: PlatformEvent) => void | Promise<void>;

export function createEventBus(): EventBus {
  const handlers = new Map<string, Set<Handler>>();

  return {
    on(name, handler) {
      let set = handlers.get(name);
      if (!set) {
        set = new Set();
        handlers.set(name, set);
      }
      set.add(handler);
    },
    off(name, handler) {
      handlers.get(name)?.delete(handler);
    },
    async emit(event) {
      const set = handlers.get(event.name);
      if (!set) return;
      for (const h of set) {
        await h(event);
      }
    },
  };
}
