import { buildOpenApiDoc } from "@jodkit/api";
import {
  defaultMigrationsDir,
  PostgresProductStore,
  runMigrations,
  type ProductStore,
} from "@jodkit/data";
import { Kernel } from "@jodkit/kernel";
import { buildMcpTools, invokeTool, type McpTool } from "@jodkit/mcp";
import { productsCollection } from "@jodkit/schema/products";
import Fastify, { type FastifyInstance } from "fastify";
import pg from "pg";
import { createProductsModule, PRODUCTS_MODULE_ID } from "./modules/productsModule.js";
import { stubStorageModule } from "./modules/stubStorageModule.js";

export type PlaygroundApp = {
  app: FastifyInstance;
  kernel: Kernel;
  store: ProductStore;
  pool: pg.Pool;
  mcpTools: McpTool[];
};

export async function buildPlaygroundApp(databaseUrl: string): Promise<PlaygroundApp> {
  await runMigrations(databaseUrl, defaultMigrationsDir());

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const store = new PostgresProductStore(pool);

  const kernel = new Kernel();
  await kernel.boot();

  const app = Fastify({ logger: false });

  kernel.registerModule(createProductsModule(store));
  kernel.registerModule(stubStorageModule);

  const mcpTools = buildMcpTools(productsCollection, store, {
    isEnabled: () => kernel.isModuleEnabled(PRODUCTS_MODULE_ID),
  });

  app.get("/health", async () => ({ ok: true, version: kernel.version }));

  const openApi = buildOpenApiDoc([productsCollection], {
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

  return { app, kernel, store, pool, mcpTools };
}

export async function enableWalkingSkeletonModules(playground: PlaygroundApp): Promise<void> {
  const ctx = { kernel: playground.kernel, app: playground.app };
  await playground.kernel.enableModule(PRODUCTS_MODULE_ID, ctx);
  await playground.kernel.enableModule("stub-storage-demo", ctx);
}
