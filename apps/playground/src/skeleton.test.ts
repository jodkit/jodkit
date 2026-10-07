import { productsCollection } from "@jodkit/schema/products";
import { invokeTool } from "@jodkit/mcp";
import pg from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  buildPlaygroundApp,
  enableWalkingSkeletonModules,
  type PlaygroundApp,
} from "./app.js";
import { PRODUCTS_MODULE_ID } from "./modules/productsModule.js";

const url = process.env.DATABASE_URL;
const describeDb = url ? describe : describe.skip;

async function truncateProducts(connectionString: string): Promise<void> {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query('TRUNCATE TABLE "jodkit_products" RESTART IDENTITY CASCADE');
  } finally {
    await client.end();
  }
}

describeDb("walking skeleton", () => {
  let playground: PlaygroundApp;

  beforeAll(async () => {
    if (!url) return;
    playground = await buildPlaygroundApp(url);
    await enableWalkingSkeletonModules(playground);
  });

  beforeEach(async () => {
    if (!url) return;
    await truncateProducts(url);
  });

  afterAll(async () => {
    if (playground) await playground.app.close();
  });

  it("POST then GET product via REST (PostgreSQL)", async () => {
    const create = await playground.app.inject({
      method: "POST",
      url: "/api/products",
      payload: { name: "Widget", slug: "widget", price: 9.99 },
    });
    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string };
    expect(created.id).toBeTruthy();

    const get = await playground.app.inject({
      method: "GET",
      url: `/api/products/${created.id}`,
    });
    expect(get.statusCode).toBe(200);
    expect(get.json()).toMatchObject({ name: "Widget", slug: "widget", price: 9.99 });
  });

  it("OpenAPI document includes products paths", async () => {
    const res = await playground.app.inject({ method: "GET", url: "/openapi.json" });
    expect(res.statusCode).toBe(200);
    const doc = res.json() as { paths: Record<string, unknown> };
    expect(doc.paths["/api/products"]).toBeDefined();
    expect(doc.paths["/api/products/{id}"]).toBeDefined();
  });

  it("MCP tools read same store as REST", async () => {
    const create = await playground.app.inject({
      method: "POST",
      url: "/api/products",
      payload: { name: "MCP Item", slug: "mcp-item", price: 1 },
    });
    const { id } = create.json() as { id: string };

    const listed = await invokeTool(playground.mcpTools, "products_list", {});
    expect(Array.isArray(listed)).toBe(true);
    expect((listed as { id: string }[]).some((r) => r.id === id)).toBe(true);

    const got = await invokeTool(playground.mcpTools, "products_get", { id });
    expect(got).toMatchObject({ slug: "mcp-item" });
  });

  it("metadata slug matches API base path", () => {
    expect(`/api/${productsCollection.slug}`).toBe("/api/products");
  });

  it("disabled products module gates REST and MCP", async () => {
    await playground.kernel.disableModule(PRODUCTS_MODULE_ID, {
      kernel: playground.kernel,
      app: playground.app,
    });

    const res = await playground.app.inject({ method: "GET", url: "/api/products" });
    expect(res.statusCode).toBe(503);
    expect(res.json()).toEqual({ error: "MODULE_DISABLED" });

    const mcp = await playground.app.inject({
      method: "POST",
      url: "/mcp/invoke",
      payload: { name: "products_list", args: {} },
    });
    expect(mcp.statusCode).toBe(503);

    await playground.kernel.enableModule(PRODUCTS_MODULE_ID, {
      kernel: playground.kernel,
      app: playground.app,
    });
  });
});
