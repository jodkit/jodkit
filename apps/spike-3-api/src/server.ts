import Fastify, { type FastifyInstance } from "fastify";
import "./collections/products.js";
import { productsCollection } from "./collections/products.js";
import { getCollections } from "./defineCollection.js";
import { buildMcpTools } from "./generate/mcpTools.js";
import { buildOpenApiDoc } from "./generate/openapi.js";
import { registerCollectionRestRoutes } from "./generate/restRoutes.js";
import { MemoryProductStore } from "./store/memoryStore.js";

export type Spike3App = {
  app: FastifyInstance;
  store: MemoryProductStore;
  mcpTools: ReturnType<typeof buildMcpTools>;
};

export async function buildApp(): Promise<Spike3App> {
  const app = Fastify({ logger: false });
  const store = new MemoryProductStore();

  for (const col of getCollections()) {
    registerCollectionRestRoutes(app, col, store);
  }

  const openApi = buildOpenApiDoc(getCollections());
  app.get("/openapi.json", async () => openApi);

  const mcpTools = buildMcpTools(productsCollection, store);

  return { app, store, mcpTools };
}
