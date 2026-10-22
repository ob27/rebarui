#!/usr/bin/env node
// Builds the publishable packages and packs them into release-artifacts/ as tarballs.
// `pnpm pack` rewrites `workspace:*` ranges to the concrete version, so the tarballs are
// self-consistent. Run from anywhere: `node scripts/pack-release.mjs [--skip-build]`.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "release-artifacts");
// Add more packages here if a consumer needs them. theme-clean/theme-sketch are left out: their
// build scripts use `mkdir -p`/`cp`, which fail on the Windows dev box (fine on CI).
const PACKAGES = ["packages/core", "packages/placement", "packages/theme-basilika"];

// Use pnpm directly if present, else via corepack (the Windows dev box has no pnpm on PATH).
const has = (cmd) => spawnSync(cmd, ["--version"], { shell: true, stdio: "ignore" }).status === 0;
const pnpm = has("pnpm") ? ["pnpm"] : ["corepack", "pnpm"];
const run = (args, cwd) => {
  const r = spawnSync([...pnpm, ...args].join(" "), { cwd, shell: true, stdio: "inherit" });
  if (r.status !== 0) throw new Error(`pnpm ${args.join(" ")} failed in ${cwd}`);
};

const names = PACKAGES.map((p) => JSON.parse(readFileSync(join(root, p, "package.json"), "utf8")).name);
const versions = new Set(PACKAGES.map((p) => JSON.parse(readFileSync(join(root, p, "package.json"), "utf8")).version));
if (versions.size !== 1) throw new Error(`Package versions differ: ${[...versions].join(", ")}`);

if (!process.argv.includes("--skip-build")) {
  for (const n of names) run(["--filter", JSON.stringify(n), "run", "build"], root);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const p of PACKAGES) {
  if (!existsSync(join(root, p, "dist"))) throw new Error(`${p}/dist missing; build first`);
  run(["pack", "--pack-destination", JSON.stringify(out)], join(root, p));
}
console.log("\nPacked:\n" + readdirSync(out).map((f) => "  " + f).join("\n"));
