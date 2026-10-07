import { buildOpenApiDoc, registerAdminCollectionRoutes } from "@jodkit/api";
import {
  createMigrationRegistry,
  defaultMigrationsDir,
  PostgresPageStore,
  PostgresPostStore,
  PostgresProductStore,
  PostgresUserStore,
  runRegisteredMigrations,
} from "@jodkit/data";
import { runWithRequestAuth, Kernel } from "@jodkit/kernel";
import { buildMcpTools, invokeTool, type McpTool } from "@jodkit/mcp";
import { getCollections } from "@jodkit/schema";
import "@jodkit/schema/pages";
import "@jodkit/schema/posts";
import "@jodkit/schema/products";
import "@jodkit/schema/users";
import { pagesCollection } from "@jodkit/schema/pages";
import { postsCollection } from "@jodkit/schema/posts";
import { productsCollection } from "@jodkit/schema/products";
import { usersCollection } from "@jodkit/schema/users";
import Fastify, { type FastifyInstance } from "fastify";
import pg from "pg";
import { parseRequestSubject } from "./auth/requestSubject.js";
import { helloPlugin } from "./plugins/helloPlugin.js";
import { createProductsModule, PRODUCTS_MODULE_ID } from "./modules/productsModule.js";
import { createPagesModule, PAGES_MODULE_ID } from "./modules/pagesModule.js";
import { createPostsModule, POSTS_MODULE_ID } from "./modules/postsModule.js";
import { createUsersModule, USERS_MODULE_ID } from "./modules/usersModule.js";
import { stubStorageModule } from "./modules/stubStorageModule.js";

export type PlaygroundApp = {
  app: FastifyInstance;
  kernel: Kernel;
  productStore: PostgresProductStore;
  userStore: PostgresUserStore;
  pageStore: PostgresPageStore;
  postStore: PostgresPostStore;
  pool: pg.Pool;
  mcpTools: McpTool[];
};

export async function buildPlaygroundApp(databaseUrl: string): Promise<PlaygroundApp> {
  const migrationRegistry = createMigrationRegistry();
  migrationRegistry.register("products", defaultMigrationsDir());
  await runRegisteredMigrations(databaseUrl, migrationRegistry, {
    coreDir: defaultMigrationsDir(),
  });

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const productStore = new PostgresProductStore(pool);
  const userStore = new PostgresUserStore(pool);
  const pageStore = new PostgresPageStore(pool);
  const postStore = new PostgresPostStore(pool);

  const kernel = new Kernel();
  await kernel.boot();

  const app = Fastify({ logger: false });

  app.addHook("onRequest", (req, reply, done) => {
    const subject = parseRequestSubject(req);
    runWithRequestAuth(subject, () => done());
  });

  kernel.registerModule(createProductsModule(productStore));
  kernel.registerModule(createUsersModule(userStore));
  kernel.registerModule(createPagesModule(pageStore));
  kernel.registerModule(createPostsModule(postStore));
  kernel.registerModule(stubStorageModule);
  kernel.registerPlugin(helloPlugin);

  const productMcp = buildMcpTools(productsCollection, productStore, {
    isEnabled: () => kernel.isModuleEnabled(PRODUCTS_MODULE_ID),
    can: (action) => kernel.can(action, `collection:${productsCollection.slug}`),
  });
  const userMcp = buildMcpTools(usersCollection, userStore, {
    isEnabled: () => kernel.isModuleEnabled(USERS_MODULE_ID),
    can: (action) => kernel.can(action, `collection:${usersCollection.slug}`),
  });
  const pageMcp = buildMcpTools(pagesCollection, pageStore, {
    isEnabled: () => kernel.isModuleEnabled(PAGES_MODULE_ID),
    can: (action) => kernel.can(action, `collection:${pagesCollection.slug}`),
  });
  const postMcp = buildMcpTools(postsCollection, postStore, {
    isEnabled: () => kernel.isModuleEnabled(POSTS_MODULE_ID),
    can: (action) => kernel.can(action, `collection:${postsCollection.slug}`),
  });
  const mcpTools = [...productMcp, ...userMcp, ...pageMcp, ...postMcp];

  registerAdminCollectionRoutes(app, {
    can: (action) => kernel.can(action),
  });

  app.get("/health", async () => ({ ok: true, version: kernel.version }));

  const openApi = buildOpenApiDoc(getCollections(), {
    title: "JodKit Playground API",
    version: kernel.version,
  });
  app.get("/openapi.json", async () => openApi);

  app.post("/mcp/invoke", async (req, reply) => {
    const body = req.body as { name?: string; args?: Record<string, unknown> };
    if (!body.name) {
      return reply.code(400).send({ error: "MISSING_TOOL_NAME" });
    }
    try {
      const result = await invokeTool(mcpTools, body.name, body.args ?? {});
      return { result };
    } catch (e) {
      if (e instanceof Error && e.message === "MODULE_DISABLED") {
        return reply.code(503).send({ error: "MODULE_DISABLED" });
      }
      if (e instanceof Error && e.message === "FORBIDDEN") {
        return reply.code(403).send({ error: "FORBIDDEN" });
      }
      if (e instanceof Error && e.message === "NOT_FOUND") {
        return reply.code(404).send({ error: "NOT_FOUND" });
      }
      throw e;
    }
  });

  app.addHook("onClose", async () => {
    await kernel.shutdown();
    await pool.end();
  });

  return { app, kernel, productStore, userStore, pageStore, postStore, pool, mcpTools };
}

export async function enableWalkingSkeletonModules(playground: PlaygroundApp): Promise<void> {
  const ctx = { kernel: playground.kernel, app: playground.app };
  await playground.kernel.enableModule(PRODUCTS_MODULE_ID, ctx);
  await playground.kernel.enableModule(USERS_MODULE_ID, ctx);
  await playground.kernel.enableModule(PAGES_MODULE_ID, ctx);
  await playground.kernel.enableModule(POSTS_MODULE_ID, ctx);
  await playground.kernel.enableModule("stub-storage-demo", ctx);
  await playground.kernel.enableModule("hello-plugin", ctx);
}
