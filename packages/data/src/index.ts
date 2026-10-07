export {
  defaultMigrationsDir,
  runMigrations,
  tableExists,
  type MigrateResult,
} from "./migrate.js";
export {
  PostgresProductStore,
} from "./postgresProductStore.js";
export type {
  CreateProductInput,
  PatchProductInput,
  ProductRecord,
  ProductStore,
} from "./productStore.js";
