import { defaultMigrationsDir, runMigrations } from "./migrate.js";
import "./collections/products.js";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const result = await runMigrations(url, defaultMigrationsDir());
console.log(JSON.stringify(result, null, 2));
