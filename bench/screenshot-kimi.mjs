#!/usr/bin/env node
// One-off screenshot capture for the kimi-k3 benchmark batch, matching the 560x620 viewport
// convention used for every other benchmark-screenshots-* gallery. Not a persisted/reusable
// script for other conditions — spins up each scaffold's own Vite dev server briefly, screenshots
// it, and tears it down, since these are 30 independent small Vite apps with no shared server.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = "/Users/tom/Documents/GitHub/rebarui";
const OUT_DIR = path.join(REPO_ROOT, "apps/docs/public/benchmark-screenshots-kimi");
mkdirSync(OUT_DIR, { recursive: true });

const targets = [];
for (let i = 1; i <= 15; i++) {
  const n = String(i).padStart(2, "0");
  targets.push({ dir: `antd-text-kimi-${n}`, out: `antd-text-${n}.png` });
  targets.push({ dir: `rebar-dsl-kimi-${n}`, out: `rebar-ui-text-${n}.png` });
}

function waitForPort(port, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      fetch(`http://localhost:${port}/`)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() - start > timeoutMs) reject(new Error("timeout waiting for dev server"));
          else setTimeout(check, 200);
        });
    };
    check();
  });
}

const browser = await chromium.launch();
const results = [];

for (let idx = 0; idx < targets.length; idx++) {
  const { dir, out } = targets[idx];
  const cwd = path.join(REPO_ROOT, "bench", dir);
  const port = 5800 + idx;
  const proc = spawn("npx", ["vite", "--port", String(port), "--strictPort"], {
    cwd,
    stdio: "pipe",
  });
  let errored = false;
  proc.on("error", () => {
    errored = true;
  });
  try {
    await waitForPort(port);
    const page = await browser.newPage({ viewport: { width: 560, height: 620 } });
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle", timeout: 15000 });
    await page.screenshot({ path: path.join(OUT_DIR, out) });
    await page.close();
    results.push({ dir, out, consoleErrors, ok: true });
    console.log(`OK ${dir} -> ${out}${consoleErrors.length ? ` (console errors: ${consoleErrors.length})` : ""}`);
  } catch (err) {
    results.push({ dir, out, ok: false, error: String(err) });
    console.log(`FAIL ${dir}: ${err}`);
  } finally {
    proc.kill();
  }
}

await browser.close();
const failures = results.filter((r) => !r.ok);
console.log(`\nDone. ${results.length - failures.length}/${results.length} succeeded.`);
if (failures.length) console.log("Failures:", JSON.stringify(failures, null, 2));
