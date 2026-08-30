#!/usr/bin/env node
/**
 * Compute statistics from Qwen benchmark results
 * 
 * Reads bench/qwen-benchmark-results.json and computes:
 * - mean, median, min, max, stdev, CV for each condition
 * 
 * Usage:
 *   npx tsx bench/compute-stats.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsFile = path.join(__dirname, "qwen-benchmark-results.json");

if (!fs.existsSync(resultsFile)) {
  console.error("No results file found. Run bench/run-qwen-benchmark.ts first.");
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));

// Filter successful runs only
const successful = results.filter((r: any) => r.success);

if (successful.length === 0) {
  console.error("No successful runs found in results.");
  process.exit(1);
}

// Group by condition
const byCondition: Record<string, any[]> = {};
for (const run of successful) {
  if (!byCondition[run.condition]) {
    byCondition[run.condition] = [];
  }
  byCondition[run.condition].push(run);
}

// Statistics functions
function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdev(arr: number[]): number {
  const avg = mean(arr);
  const squareDiffs = arr.map((value) => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

function cv(arr: number[]): number {
  const avg = mean(arr);
  return avg === 0 ? 0 : (stdev(arr) / avg) * 100;
}

// Compute stats for each condition
console.log("\n=== Qwen Benchmark Statistics ===\n");

const conditions = ["antd-text", "rebar-ui-text", "antd-image", "rebar-ui-image"];

for (const condition of conditions) {
  const runs = byCondition[condition];
  if (!runs || runs.length === 0) {
    console.log(`${condition}: No successful runs\n`);
    continue;
  }

  const tokens = runs.map((r) => r.totalTokens);
  const durations = runs.map((r) => r.duration);

  console.log(`\n${condition} (n=${runs.length}):`);
  console.log(`  Model: ${runs[0].model}`);
  console.log(`  Tokens:`);
  console.log(`    Mean:   ${mean(tokens).toFixed(0)}`);
  console.log(`    Median: ${median(tokens).toFixed(0)}`);
  console.log(`    Min:    ${Math.min(...tokens)}`);
  console.log(`    Max:    ${Math.max(...tokens)}`);
  console.log(`    Stdev:  ${stdev(tokens).toFixed(1)}`);
  console.log(`    CV:     ${cv(tokens).toFixed(2)}%`);
  console.log(`  Duration (ms):`);
  console.log(`    Mean:   ${mean(durations).toFixed(0)}`);
  console.log(`    Median: ${median(durations).toFixed(0)}`);
  console.log(`    Min:    ${Math.min(...durations)}`);
  console.log(`    Max:    ${Math.max(...durations)}`);
  console.log(`    Stdev:  ${stdev(durations).toFixed(1)}`);
  console.log(`    CV:     ${cv(durations).toFixed(2)}%`);
}

// Summary table
console.log("\n\n=== Summary Table ===\n");
console.log("Condition\t\tModel\t\tn\tTokens (mean)\tDuration (mean)\tCV tokens\tCV duration");
console.log("---------\t\t-----\t\t-\t-------------\t---------------\t---------\t-----------");

for (const condition of conditions) {
  const runs = byCondition[condition];
  if (!runs || runs.length === 0) continue;

  const tokens = runs.map((r) => r.totalTokens);
  const durations = runs.map((r) => r.duration);
  const model = runs[0].model;

  const padding = condition.length < 12 ? "\t\t" : "\t";
  console.log(
    `${condition}${padding}${model}\t${runs.length}\t${mean(tokens).toFixed(0)}\t\t${mean(durations).toFixed(0)}ms\t\t${cv(tokens).toFixed(2)}%\t\t${cv(durations).toFixed(2)}%`
  );
}

console.log("\n");
