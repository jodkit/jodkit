import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileMigrationForCollections } from "../src/compileSql.js";
import { getCollections } from "../src/defineCollection.js";
import "../src/collections/products.js";

const sql = compileMigrationForCollections(getCollections());
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");
await fs.mkdir(dir, { recursive: true });
const out = path.join(dir, "001_jodkit_products.sql");
await fs.writeFile(out, sql, "utf8");
console.log(`Wrote ${out}`);
