#!/usr/bin/env node
/**
 * Fail if any scanned file contains non-ASCII characters (code point > 127).
 * See docs/writing-standards.md
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const configPath = join(__dirname, "ascii-check.config.json");

const config = JSON.parse(readFileSync(configPath, "utf8"));
const extensions = new Set(config.extensions ?? []);
const ignoreSegments = new Set(config.ignorePathSegments ?? [".git", "node_modules"]);
const ignoreFiles = new Set(config.ignoreFiles ?? []);

const args = process.argv.slice(2);
const modeStaged = args.includes("--staged");
const modeAll = args.includes("--all");

if (!modeStaged && !modeAll) {
  console.error("Usage: node scripts/check-keyboard-only.mjs --staged | --all");
  process.exit(2);
}

function shouldIgnore(relativePath) {
  const normalized = relativePath.split(sep).join("/");
  if (ignoreFiles.has(normalized)) return true;
  const parts = normalized.split("/");
  for (const part of parts) {
    if (ignoreSegments.has(part)) return true;
  }
  const ext = normalized.includes(".")
    ? normalized.slice(normalized.lastIndexOf("."))
    : "";
  return !extensions.has(ext);
}

function walkAllFiles(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    const rel = relative(repoRoot, abs).split(sep).join("/");
    if (entry.isDirectory()) {
      if (ignoreSegments.has(entry.name)) continue;
      walkAllFiles(abs, acc);
    } else if (entry.isFile() && !shouldIgnore(rel)) {
      acc.push(rel);
    }
  }
  return acc;
}

function listAllFiles() {
  try {
    const tracked = execSync("git ls-files -z", { cwd: repoRoot, encoding: "buffer" })
      .toString("utf8")
      .split("\0")
      .filter(Boolean);
    const walked = walkAllFiles(repoRoot);
    const set = new Set([...tracked, ...walked].map((p) => p.split(sep).join("/")));
    return [...set].sort();
  } catch {
    return walkAllFiles(repoRoot);
  }
}

function listStagedFiles() {
  try {
    const out = execSync("git diff --cached --name-only --diff-filter=ACM -z", {
      cwd: repoRoot,
      encoding: "buffer",
    });
    return out
      .toString("utf8")
      .split("\0")
      .filter(Boolean);
  } catch {
    console.error("ERROR: --staged requires a git repository.");
    process.exit(2);
  }
}

function scanFile(absolutePath, displayPath) {
  let text;
  try {
    text = readFileSync(absolutePath, "utf8");
  } catch (err) {
    console.error(`ERROR: cannot read ${displayPath}: ${err.message}`);
    return [{ file: displayPath, line: 0, column: 0, codePoint: 0, reason: "read failed" }];
  }

  const violations = [];
  const lines = text.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let column = 0;
    for (const char of line) {
      column += 1;
      const cp = char.codePointAt(0);
      if (cp !== undefined && cp > 127) {
        violations.push({
          file: displayPath,
          line: lineIndex + 1,
          column,
          codePoint: cp,
        });
      }
    }
  }
  return violations;
}

const relativePaths = modeStaged ? listStagedFiles() : listAllFiles();
const toScan = relativePaths.filter((p) => !shouldIgnore(p));

if (toScan.length === 0) {
  process.exit(0);
}

const allViolations = [];
for (const rel of toScan) {
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) continue;
  allViolations.push(...scanFile(abs, rel.replace(/\\/g, "/")));
}

if (allViolations.length === 0) {
  console.log(`keyboard-only check passed (${toScan.length} file(s)).`);
  process.exit(0);
}

console.error("keyboard-only check FAILED. Non-ASCII characters are not allowed.");
console.error("See docs/writing-standards.md\n");
for (const v of allViolations) {
  const hex = v.codePoint.toString(16).toUpperCase().padStart(4, "0");
  console.error(`  ${v.file}:${v.line}:${v.column}  U+${hex}`);
}
process.exit(1);
