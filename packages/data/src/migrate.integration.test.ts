import { productsCollection } from "@jodkit/schema/products";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { defaultMigrationsDir, runMigrations, tableExists } from "./migrate.js";

const url = process.env.DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb("migrate (integration)", () => {
  beforeAll(async () => {
    if (!url) return;
    await runMigrations(url, defaultMigrationsDir());
  });

  afterAll(async () => {});

  it("creates jodkit_products table", async () => {
    if (!url) return;
    const exists = await tableExists(url, productsCollection.tableName!);
    expect(exists).toBe(true);
  });

  it("skips already-applied migration on second run", async () => {
    if (!url) return;
    const second = await runMigrations(url, defaultMigrationsDir());
    expect(second.applied).toHaveLength(0);
    expect(second.skipped.length).toBeGreaterThan(0);
  });
});
