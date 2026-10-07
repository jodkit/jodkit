import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dir = path.dirname(fileURLToPath(import.meta.url));

function loadDotEnv(file: string): Record<string, string> {
  if (!fs.existsSync(file)) return {};
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const spike2Env = loadDotEnv(path.join(dir, "..", "..", "apps", "spike-2-schema", ".env"));

export default defineConfig({
  test: {
    env: { ...spike2Env, ...loadDotEnv(path.join(dir, ".env")) },
    fileParallelism: false,
  },
});
