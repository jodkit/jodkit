import {
  allowAllPermissionChecker,
  denyAllPermissionChecker,
  type PermissionChecker,
} from "@jodkit/kernel";
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
import { USERS_MODULE_ID } from "./modules/usersModule.js";

const url = process.env.DATABASE_URL;
const describeDb = url ? describe : describe.skip;

const subjectRoleChecker: PermissionChecker = {
  async can(subject, action) {
    if (subject === "admin") return true;
    if (subject === "reader") {
      return action === "products:list" || action === "products:read";
    }
    return false;
  },
};

async function truncateTables(connectionString: string): Promise<void> {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query(
      'TRUNCATE TABLE "jodkit_products", "jodkit_users", "jodkit_pages" RESTART IDENTITY CASCADE',
    );
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
    await truncateTables(url);
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

  it("POST then GET user via REST (PostgreSQL)", async () => {
    const create = await playground.app.inject({
      method: "POST",
      url: "/api/users",
      payload: { email: "a@example.com", display_name: "Ada" },
    });
    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string };
    expect(created.id).toBeTruthy();

    const get = await playground.app.inject({
      method: "GET",
      url: `/api/users/${created.id}`,
    });
    expect(get.statusCode).toBe(200);
    expect(get.json()).toMatchObject({ email: "a@example.com", display_name: "Ada" });
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

  it("POST then GET page via REST (PostgreSQL)", async () => {
    const create = await playground.app.inject({
      method: "POST",
      url: "/api/pages",
      payload: {
        slug: "about",
        title: "About",
        body: "About us",
        status: "draft",
      },
    });
    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string };
    expect(created.id).toBeTruthy();

    const get = await playground.app.inject({
      method: "GET",
      url: `/api/pages/${created.id}`,
    });
    expect(get.statusCode).toBe(200);
    expect(get.json()).toMatchObject({
      slug: "about",
      title: "About",
      status: "draft",
    });
  });

  it("POST page with invalid status returns validation error", async () => {
    const res = await playground.app.inject({
      method: "POST",
      url: "/api/pages",
      payload: {
        slug: "bad",
        title: "Bad",
        body: "x",
        status: "archived",
      },
    });
    expect(res.statusCode).toBe(400);
    const body = res.json() as { error: { code: string; details: unknown[] } };
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.length).toBeGreaterThan(0);
  });

  it("OpenAPI document includes products, users, and pages paths", async () => {
    const res = await playground.app.inject({ method: "GET", url: "/openapi.json" });
    expect(res.statusCode).toBe(200);
    const doc = res.json() as { paths: Record<string, unknown> };
    expect(doc.paths["/api/products"]).toBeDefined();
    expect(doc.paths["/api/users"]).toBeDefined();
    expect(doc.paths["/api/pages"]).toBeDefined();
  });

  it("MCP pages_create and pages_list smoke", async () => {
    const created = await invokeTool(playground.mcpTools, "pages_create", {
      slug: "mcp-page",
      title: "MCP",
      body: "From MCP",
      status: "draft",
    });
    const { id } = created as { id: string };
    expect(id).toBeTruthy();

    const listed = await invokeTool(playground.mcpTools, "pages_list", {});
    expect((listed as { id: string }[]).some((r) => r.id === id)).toBe(true);
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

  it("request subject affects permissions (reader vs admin)", async () => {
    playground.kernel.setPermissionChecker(subjectRoleChecker);

    const readerList = await playground.app.inject({
      method: "GET",
      url: "/api/products",
      headers: { "x-jodkit-subject": "reader" },
    });
    expect(readerList.statusCode).toBe(200);

    const readerAdmin = await playground.app.inject({
      method: "GET",
      url: "/admin/collections",
      headers: { "x-jodkit-subject": "reader" },
    });
    expect(readerAdmin.statusCode).toBe(403);

    const adminCollections = await playground.app.inject({
      method: "GET",
      url: "/admin/collections",
      headers: { "x-jodkit-subject": "admin" },
    });
    expect(adminCollections.statusCode).toBe(200);
    const body = adminCollections.json() as { data: { slug: string }[] };
    expect(body.data.some((c) => c.slug === "products")).toBe(true);
    expect(body.data.some((c) => c.slug === "users")).toBe(true);
    expect(body.data.some((c) => c.slug === "pages")).toBe(true);
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

  it("disabled users module gates REST", async () => {
    await playground.kernel.disableModule(USERS_MODULE_ID, {
      kernel: playground.kernel,
      app: playground.app,
    });
    const res = await playground.app.inject({ method: "GET", url: "/api/users" });
    expect(res.statusCode).toBe(503);
    await playground.kernel.enableModule(USERS_MODULE_ID, {
      kernel: playground.kernel,
      app: playground.app,
    });
  });
});
