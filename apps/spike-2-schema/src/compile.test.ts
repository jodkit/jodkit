import { describe, expect, it } from "vitest";
import { productsCollection } from "./collections/products.js";
import { compileCreateTable } from "./compileSql.js";

describe("compileSql", () => {
  it("generates reviewable SQL for products collection", () => {
    const sql = compileCreateTable(productsCollection);
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "jodkit_products"');
    expect(sql).toContain('"slug" text NOT NULL UNIQUE');
    expect(sql).toContain('"price" numeric NOT NULL');
    expect(sql).toContain("gen_random_uuid()");
  });
});
