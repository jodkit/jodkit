import { describe, expect, it } from "vitest";
import { compileCreateTable } from "./compileSql.js";
import { pagesCollection } from "./collections/pages.js";
import { productsCollection } from "./collections/products.js";

describe("compileSql", () => {
  it("generates reviewable SQL for products collection", () => {
    const sql = compileCreateTable(productsCollection);
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "jodkit_products"');
    expect(sql).toContain('"slug" text NOT NULL UNIQUE');
  });

  it("generates optional timestamptz for pages published_at", () => {
    const sql = compileCreateTable(pagesCollection);
    expect(sql).toContain('"published_at" timestamptz');
    expect(sql).not.toContain('"published_at" timestamptz NOT NULL');
  });
});
