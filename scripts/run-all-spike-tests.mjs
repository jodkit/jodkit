import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

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

const spike2EnvPath = path.join(root, "apps/spike-2-schema/.env");
const spike2Env = loadDotEnv(spike2EnvPath);
const baseEnv = { ...process.env, ...spike2Env };

const SPIKES = [
  { id: "Spike 1", dir: "apps/spike-1" },
  { id: "Spike 2", dir: "apps/spike-2-schema" },
  { id: "Spike 3", dir: "apps/spike-3-api" },
  { id: "Spike 4", dir: "apps/spike-4-modules" },
  { id: "Spike 5", dir: "apps/spike-5-disable" },
];

const results = [];

console.log("JodKit spike test run (all apps)\n");

for (const spike of SPIKES) {
  const cwd = path.join(root, spike.dir);
  console.log("=".repeat(60));
  console.log(spike.id, "-", spike.dir);
  console.log("=".repeat(60));

  const run = spawnSync("npm", ["test"], {
    cwd,
    stdio: "inherit",
    shell: true,
    env: spike.dir === "apps/spike-2-schema" ? baseEnv : process.env,
  });

  results.push({
    id: spike.id,
    dir: spike.dir,
    ok: run.status === 0,
    status: run.status ?? 1,
  });
}

console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));

let passedApps = 0;
for (const r of results) {
  const label = r.ok ? "PASS" : "FAIL";
  console.log(`${label.padEnd(6)}  ${r.id}  (${r.dir})`);
  if (r.ok) passedApps += 1;
}

const allOk = passedApps === results.length;
console.log("");
console.log(`Apps: ${passedApps}/${results.length} passed`);
const dbUrl = baseEnv.DATABASE_URL ?? process.env.DATABASE_URL;
if (!dbUrl) {
  console.log(
    "Note: Spike 2 integration tests skip without DATABASE_URL (copy apps/spike-2-schema/.env.example to .env)."
  );
} else {
  console.log("Spike 2 DATABASE_URL loaded (integration tests enabled).");
}
console.log(allOk ? "\nAll spike test suites passed." : "\nOne or more spike test suites failed.");

process.exit(allOk ? 0 : 1);
