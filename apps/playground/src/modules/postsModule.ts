import { registerCollectionRestRoutes } from "@jodkit/api";
import type { CollectionRecordStore } from "@jodkit/data";
import { postsCollection } from "@jodkit/schema/posts";
import type { ModuleDefinition } from "@jodkit/kernel";
import type { FastifyInstance } from "fastify";

export const POSTS_MODULE_ID = "posts";

const appsWithPostRoutes = new WeakSet<FastifyInstance>();

export function createPostsModule(store: CollectionRecordStore): ModuleDefinition {
  return {
    manifest: { id: POSTS_MODULE_ID, version: "0.1.0" },

    async onEnable(ctx) {
      if (appsWithPostRoutes.has(ctx.app)) return;
      appsWithPostRoutes.add(ctx.app);
      registerCollectionRestRoutes(ctx.app, postsCollection, store, {
        isEnabled: () => ctx.kernel.isModuleEnabled(POSTS_MODULE_ID),
        can: (action) => ctx.kernel.can(action, `collection:${postsCollection.slug}`),
      });
    },
  };
}
