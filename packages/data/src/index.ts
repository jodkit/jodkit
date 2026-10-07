export {
  defaultMigrationsDir,
  runMigrations,
  tableExists,
  type MigrateResult,
} from "./migrate.js";
export {
  createMigrationRegistry,
  runRegisteredMigrations,
  type MigrationRegistry,
  type RunRegisteredMigrationsResult,
} from "./migrationRegistry.js";
export {
  PostgresProductStore,
} from "./postgresProductStore.js";
export type {
  CreateProductInput,
  PatchProductInput,
  ProductRecord,
  ProductStore,
} from "./productStore.js";
