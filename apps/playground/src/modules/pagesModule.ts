import { registerCollectionRestRoutes } from "@jodkit/api";
import type { CollectionRecordStore } from "@jodkit/data";
import { pagesCollection } from "@jodkit/schema/pages";
import type { ModuleDefinition } from "@jodkit/kernel";
import type { FastifyInstance } from "fastify";

export const PAGES_MODULE_ID = "pages";

const appsWithPageRoutes = new WeakSet<FastifyInstance>();

export function createPagesModule(store: CollectionRecordStore): ModuleDefinition {
  return {
    manifest: { id: PAGES_MODULE_ID, version: "0.1.0" },

    async onEnable(ctx) {
      if (appsWithPageRoutes.has(ctx.app)) return;
      appsWithPageRoutes.add(ctx.app);
      registerCollectionRestRoutes(ctx.app, pagesCollection, store, {
        isEnabled: () => ctx.kernel.isModuleEnabled(PAGES_MODULE_ID),
        can: (action) => ctx.kernel.can(action, `collection:${pagesCollection.slug}`),
      });
    },
  };
}
