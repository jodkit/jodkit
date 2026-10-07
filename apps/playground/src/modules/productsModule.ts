import { registerCollectionRestRoutes } from "@jodkit/api";
import type { CollectionRecordStore } from "@jodkit/data";
import { productsCollection } from "@jodkit/schema/products";
import type { ModuleDefinition } from "@jodkit/kernel";
import type { FastifyInstance } from "fastify";

export const PRODUCTS_MODULE_ID = "products";

const appsWithProductRoutes = new WeakSet<FastifyInstance>();

export function createProductsModule(store: CollectionRecordStore): ModuleDefinition {
  return {
    manifest: { id: PRODUCTS_MODULE_ID, version: "0.1.0" },

    async onEnable(ctx) {
      if (appsWithProductRoutes.has(ctx.app)) return;
      appsWithProductRoutes.add(ctx.app);
      registerCollectionRestRoutes(ctx.app, productsCollection, store, {
        isEnabled: () => ctx.kernel.isModuleEnabled(PRODUCTS_MODULE_ID),
        can: (action) =>
          ctx.kernel.can(action, `collection:${productsCollection.slug}`),
      });
    },
  };
}
