import { registerCollectionRestRoutes } from "@jodkit/api";
import type { CollectionRecordStore } from "@jodkit/data";
import { usersCollection } from "@jodkit/schema/users";
import type { ModuleDefinition } from "@jodkit/kernel";
import type { FastifyInstance } from "fastify";

export const USERS_MODULE_ID = "users";

const appsWithUserRoutes = new WeakSet<FastifyInstance>();

export function createUsersModule(store: CollectionRecordStore): ModuleDefinition {
  return {
    manifest: { id: USERS_MODULE_ID, version: "0.1.0" },

    async onEnable(ctx) {
      if (appsWithUserRoutes.has(ctx.app)) return;
      appsWithUserRoutes.add(ctx.app);
      registerCollectionRestRoutes(ctx.app, usersCollection, store, {
        isEnabled: () => ctx.kernel.isModuleEnabled(USERS_MODULE_ID),
        can: (action) =>
          ctx.kernel.can(action, `collection:${usersCollection.slug}`),
      });
    },
  };
}
