#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";

const transformPath = path.join(__dirname, "transform.js");
const jscodeshiftBin = require.resolve("jscodeshift/bin/jscodeshift.js");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: rebar-migrate-antd <path-or-glob> [jscodeshift options...]");
  console.error("Example: rebar-migrate-antd src/");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [jscodeshiftBin, "-t", transformPath, "--parser=tsx", ...args],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
