#!/usr/bin/env node
// Fail the build if components use raw Tailwind palette classes.
//
// Per docs/DESIGN_SYSTEM.md §3: no bg-slate-*, bg-gray-*, text-slate-*,
// text-gray-*, blue-500, blue-600. Components must reference semantic
// tokens (bg-base, text-primary, accent, ...) mapped through tailwind.config.
//
// This script is intentionally grep-simple so reviewers can reason about it.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOTS = ["app", "components"];
const EXTS = [".tsx", ".ts", ".css"];
const BANNED_PATTERNS = [
  /\bbg-(slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
  /\btext-(slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
  /\bborder-(slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
  /\b(bg|text|border|ring)-(blue|indigo|violet|purple|pink|fuchsia|sky)-\d{2,3}\b/,
  /\b(bg|text|border|ring)-red-\d{2,3}\b/,
  /\brounded-2xl\b/,
  /\brounded-3xl\b/,
  /\bhover:scale-1(05|10|25)\b/,
];

const repoRoot = resolve(process.cwd());
/** @type {Array<{ file: string; line: number; snippet: string; pattern: string }>} */
const offences = [];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walk(full);
    } else if (EXTS.some((ext) => full.endsWith(ext))) {
      yield full;
    }
  }
}

for (const root of ROOTS) {
  const abs = join(repoRoot, root);
  try {
    statSync(abs);
  } catch {
    continue;
  }
  for (const file of walk(abs)) {
    const contents = readFileSync(file, "utf8");
    const lines = contents.split("\n");
    lines.forEach((line, idx) => {
      for (const pattern of BANNED_PATTERNS) {
        const match = line.match(pattern);
        if (match) {
          offences.push({
            file: relative(repoRoot, file),
            line: idx + 1,
            snippet: line.trim(),
            pattern: match[0],
          });
        }
      }
    });
  }
}

if (offences.length > 0) {
  console.error(`\nDesign-system anti-pattern check failed — ${offences.length} offence(s):\n`);
  for (const o of offences) {
    console.error(`  ${o.file}:${o.line}`);
    console.error(`    matched: ${o.pattern}`);
    console.error(`    line:    ${o.snippet}\n`);
  }
  console.error("These classes violate docs/DESIGN_SYSTEM.md §3. Use semantic tokens instead");
  console.error("(bg-base, bg-elevated, text-primary, accent, ...). See tailwind.config.ts.\n");
  process.exit(1);
}

console.log("Design-system anti-pattern check passed.");
