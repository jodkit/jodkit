import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createMigrationRegistry,
  runRegisteredMigrations,
} from "./migrationRegistry.js";

const url = process.env.DATABASE_URL;
const describeDb = url ? describe : describe.skip;

describeDb("migrationRegistry", () => {
  let extraDir: string;

  beforeAll(async () => {
    if (!url) return;
    extraDir = await fs.mkdtemp(path.join(os.tmpdir(), "jodkit-mig-"));
    await fs.writeFile(
      path.join(extraDir, "902_registry_test_marker.sql"),
      `CREATE TABLE IF NOT EXISTS "jodkit_registry_test_marker" (id serial PRIMARY KEY);\n`,
    );
  });

  afterAll(async () => {
    if (extraDir) await fs.rm(extraDir, { recursive: true, force: true });
  });

  it("applies core then registered module dirs", async () => {
    if (!url) return;
    const registry = createMigrationRegistry();
    registry.register("test-module", extraDir);

    const coreDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");
    const first = await runRegisteredMigrations(url, registry, { coreDir });
    expect(first.core.applied.length + first.core.skipped.length).toBeGreaterThan(0);
    expect(first.modules["test-module"]?.applied).toContain("902_registry_test_marker.sql");

    const second = await runRegisteredMigrations(url, registry, { coreDir });
    expect(second.modules["test-module"]?.applied).toHaveLength(0);
    expect(second.modules["test-module"]?.skipped).toContain("902_registry_test_marker.sql");
  });
});

describe("migrationRegistry (unit)", () => {
  it("dedupes module registration", () => {
    const registry = createMigrationRegistry();
    registry.register("a", "/tmp/one");
    registry.register("a", "/tmp/two");
    expect(registry.list()).toHaveLength(1);
    expect(registry.list()[0]?.migrationsDir).toBe("/tmp/one");
  });
});
