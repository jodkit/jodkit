import { runMigrations, type MigrateResult } from "./migrate.js";

export type MigrationRegistry = {
  register(moduleId: string, migrationsDir: string): void;
  list(): ReadonlyArray<{ moduleId: string; migrationsDir: string }>;
};

export function createMigrationRegistry(): MigrationRegistry {
  const entries: { moduleId: string; migrationsDir: string }[] = [];
  const seen = new Set<string>();

  return {
    register(moduleId, migrationsDir) {
      if (seen.has(moduleId)) return;
      seen.add(moduleId);
      entries.push({ moduleId, migrationsDir });
    },
    list() {
      return entries;
    },
  };
}

export type RunRegisteredMigrationsResult = {
  core: MigrateResult;
  modules: Record<string, MigrateResult>;
};

export async function runRegisteredMigrations(
  connectionString: string,
  registry: MigrationRegistry,
  options: { coreDir: string },
): Promise<RunRegisteredMigrationsResult> {
  const core = await runMigrations(connectionString, options.coreDir);
  const modules: Record<string, MigrateResult> = {};

  for (const entry of registry.list()) {
    modules[entry.moduleId] = await runMigrations(connectionString, entry.migrationsDir);
  }

  return { core, modules };
}
