import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { productsCollection } from "./collections/products.js";
import { invokeTool } from "./generate/mcpTools.js";
import { buildApp } from "./server.js";

describe("Spike 3 API from metadata", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.app.close();
  });

  it("REST CRUD for products", async () => {
    const create = await app.app.inject({
      method: "POST",
      url: "/api/products",
      payload: { name: "Widget", slug: "widget", price: 9.99 },
    });
    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string };
    expect(created.id).toBeTruthy();

    const list = await app.app.inject({ method: "GET", url: "/api/products" });
    expect(list.statusCode).toBe(200);
    const listBody = list.json() as { data: unknown[] };
    expect(listBody.data.length).toBe(1);

    const get = await app.app.inject({
      method: "GET",
      url: `/api/products/${created.id}`,
    });
    expect(get.statusCode).toBe(200);

    const patch = await app.app.inject({
      method: "PATCH",
      url: `/api/products/${created.id}`,
      payload: { name: "Widget Pro" },
    });
    expect(patch.statusCode).toBe(200);
    expect((patch.json() as { name: string }).name).toBe("Widget Pro");

    const del = await app.app.inject({
      method: "DELETE",
      url: `/api/products/${created.id}`,
    });
    expect(del.statusCode).toBe(204);
  });

  it("OpenAPI document includes products paths", async () => {
    const res = await app.app.inject({ method: "GET", url: "/openapi.json" });
    expect(res.statusCode).toBe(200);
    const doc = res.json() as { openapi: string; paths: Record<string, unknown> };
    expect(doc.openapi).toBe("3.1.0");
    expect(doc.paths["/api/products"]).toBeTruthy();
    expect(doc.paths["/api/products/{id}"]).toBeTruthy();
  });

  it("MCP tools list and get from same store", async () => {
    await app.app.inject({
      method: "POST",
      url: "/api/products",
      payload: { name: "MCP Item", slug: "mcp-item", price: 1 },
    });

    const listed = (await invokeTool(app.mcpTools, "products_list", {
      limit: 10,
      offset: 0,
    })) as unknown[];
    expect(listed.length).toBe(1);

    const id = (listed[0] as { id: string }).id;
    const one = await invokeTool(app.mcpTools, "products_get", { id });
    expect((one as { slug: string }).slug).toBe("mcp-item");
  });

  it("metadata slug matches API base path", () => {
    expect(productsCollection.slug).toBe("products");
  });
});
