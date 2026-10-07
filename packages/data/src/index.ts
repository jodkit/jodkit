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
export type { CollectionRecordStore } from "./collectionStore.js";
export {
  PostgresProductStore,
} from "./postgresProductStore.js";
export {
  PostgresUserStore,
} from "./postgresUserStore.js";
export type {
  CreateUserInput,
  PatchUserInput,
  UserRecord,
} from "./userStore.js";
export type {
  CreateProductInput,
  PatchProductInput,
  ProductRecord,
  ProductStore,
} from "./productStore.js";
