import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, "apps/spike-2-schema/.env");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return {};
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const url = process.env.DATABASE_URL ?? loadDotEnv(envPath).DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL or create apps/spike-2-schema/.env from .env.example");
  process.exit(1);
}

const parsed = new URL(url);
const dbName = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
const user = decodeURIComponent(parsed.username);
const password = decodeURIComponent(parsed.password);
const host = parsed.hostname;
const port = parsed.port || "5432";

if (!dbName) {
  console.error("DATABASE_URL must include a database name");
  process.exit(1);
}

const env = { ...process.env, PGPASSWORD: password };

const exists = spawnSync(
  "psql",
  ["-U", user, "-h", host, "-p", port, "-d", "postgres", "-w", "-tAc", `SELECT 1 FROM pg_database WHERE datname='${dbName.replace(/'/g, "''")}'`],
  { env, encoding: "utf8", shell: true },
);

if (exists.status !== 0) {
  console.error(exists.stderr || exists.stdout);
  process.exit(exists.status ?? 1);
}

if (exists.stdout.trim() === "1") {
  console.log(`Database "${dbName}" already exists.`);
  process.exit(0);
}

const create = spawnSync(
  "psql",
  ["-U", user, "-h", host, "-p", port, "-d", "postgres", "-w", "-c", `CREATE DATABASE "${dbName.replace(/"/g, '""')}"`],
  { env, encoding: "utf8", shell: true },
);

if (create.status !== 0) {
  console.error(create.stderr || create.stdout);
  process.exit(create.status ?? 1);
}

console.log(`Created database "${dbName}".`);
