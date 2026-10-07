import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const LEDGER_TABLE = "jodkit_schema_migrations";

const LEDGER_DDL = `
CREATE TABLE IF NOT EXISTS "${LEDGER_TABLE}" (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  applied_at timestamptz NOT NULL DEFAULT now()
);
`;

export type MigrateResult = {
  applied: string[];
  skipped: string[];
};

export async function runMigrations(
  connectionString: string,
  migrationsDir: string,
): Promise<MigrateResult> {
  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    await client.query(LEDGER_DDL);

    const entries = await fs.readdir(migrationsDir);
    const sqlFiles = entries.filter((f) => f.endsWith(".sql")).sort();

    const applied: string[] = [];
    const skipped: string[] = [];

    for (const file of sqlFiles) {
      const existing = await client.query(
        `SELECT 1 FROM "${LEDGER_TABLE}" WHERE name = $1`,
        [file],
      );
      if (existing.rowCount && existing.rowCount > 0) {
        skipped.push(file);
        continue;
      }

      const fullPath = path.join(migrationsDir, file);
      const sql = await fs.readFile(fullPath, "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(`INSERT INTO "${LEDGER_TABLE}" (name) VALUES ($1)`, [file]);
        await client.query("COMMIT");
        applied.push(file);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }

    return { applied, skipped };
  } finally {
    await client.end();
  }
}

export async function tableExists(
  connectionString: string,
  tableName: string,
): Promise<boolean> {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    const res = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [tableName],
    );
    return (res.rowCount ?? 0) > 0;
  } finally {
    await client.end();
  }
}

export function defaultMigrationsDir(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, "..", "migrations");
}
