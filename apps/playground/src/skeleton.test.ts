import { denyAllPermissionChecker, allowAllPermissionChecker } from "@jodkit/kernel";
import { invokeTool } from "@jodkit/mcp";
import { productsCollection } from "@jodkit/schema/products";
import pg from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  buildPlaygroundApp,
  enableWalkingSkeletonModules,
  type PlaygroundApp,
} from "./app.js";
import { HELLO_PLUGIN_ID, HELLO_PING_PATH } from "./plugins/helloPlugin.js";
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
    playground.kernel.setPermissionChecker(allowAllPermissionChecker);
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

  it("POST with invalid body returns validation error", async () => {
    const res = await playground.app.inject({
      method: "POST",
      url: "/api/products",
      payload: { name: "Only name" },
    });
    expect(res.statusCode).toBe(400);
    const body = res.json() as { error: { code: string; details: unknown[] } };
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.length).toBeGreaterThan(0);
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

  it("permission checker can deny collection list (REST)", async () => {
    playground.kernel.setPermissionChecker(denyAllPermissionChecker);
    const res = await playground.app.inject({ method: "GET", url: "/api/products" });
    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ error: "FORBIDDEN" });
  });

  it("permission checker can deny MCP list", async () => {
    playground.kernel.setPermissionChecker(denyAllPermissionChecker);
    const mcp = await playground.app.inject({
      method: "POST",
      url: "/mcp/invoke",
      payload: { name: "products_list", args: {} },
    });
    expect(mcp.statusCode).toBe(403);
    expect(mcp.json()).toEqual({ error: "FORBIDDEN" });
  });

  it("hello plugin ping when allowed", async () => {
    const res = await playground.app.inject({ method: "GET", url: HELLO_PING_PATH });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, pluginId: HELLO_PLUGIN_ID });
  });

  it("hello plugin ping forbidden when checker denies", async () => {
    playground.kernel.setPermissionChecker(denyAllPermissionChecker);
    const res = await playground.app.inject({ method: "GET", url: HELLO_PING_PATH });
    expect(res.statusCode).toBe(403);
  });

  it("hello plugin disabled returns 503", async () => {
    await playground.kernel.disableModule(HELLO_PLUGIN_ID, {
      kernel: playground.kernel,
      app: playground.app,
    });
    const res = await playground.app.inject({ method: "GET", url: HELLO_PING_PATH });
    expect(res.statusCode).toBe(503);
    await playground.kernel.enableModule(HELLO_PLUGIN_ID, {
      kernel: playground.kernel,
      app: playground.app,
    });
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
