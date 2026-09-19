#!/usr/bin/env node
// Generates pre-recorded narration audio (the Alcuin voice, via Alibaba Cloud Model Studio /
// DashScope's qwen3-tts) for the doc-section `narration` field and the archetype essay pages'
// whole-page player. Real, deterministic content, not fabricated: NARRATION_SOURCES below is the
// single source of truth for what gets narrated, kept in sync by hand with the real page copy it
// mirrors (see CLAUDE.md's narration-regeneration rule for when to re-run this).
//
// Usage: DASHSCOPE_API_KEY=sk-... node scripts/generate-narration.mjs [--force]
//   --force regenerates every entry even if its source text hasn't changed since the last run.
//
// Output: apps/docs/public/narration/<id>.mp3, tracked via a content-hash manifest
// (apps/docs/public/narration/manifest.json) so a re-run only regenerates what actually changed —
// each real API call costs money, so this script never re-synthesizes unchanged text.
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/narration");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");

const TTS_ENDPOINT = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const CLONED_VOICE_MODEL = "qwen3-tts-vc-2026-01-22";
const ALCUIN_VOICE = "qwen-tts-vc-bailian-voice-20260802125538488-60bd";

// Conservative — DashScope's real per-request cap is around 512 tokens; this stays safely under
// that for English prose without needing exact token counting.
const MAX_CHUNK_CHARS = 1600;

// Strips this project's own tiny inline markup (see ProseNode's own doc comment in schema.ts) —
// backtick code spans and *emphasis* asterisks read aloud as literal punctuation otherwise
// ("backtick Combobox backtick"), and link syntax should speak as its label, not its URL.
function cleanForSpeech(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function splitIntoChunks(text, maxChars) {
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current = "";
  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current);
    if (paragraph.length <= maxChars) {
      current = paragraph;
      continue;
    }
    // A single paragraph longer than the cap — split on sentence boundaries instead.
    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    current = "";
    for (const sentence of sentences) {
      const withSentence = current ? `${current} ${sentence}` : sentence;
      if (withSentence.length > maxChars && current) {
        chunks.push(current);
        current = sentence;
      } else {
        current = withSentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function synthesizeChunk(apiKey, text) {
  const res = await fetch(TTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CLONED_VOICE_MODEL,
      input: { text, voice: ALCUIN_VOICE, language_type: "English" },
    }),
  });
  if (!res.ok) {
    throw new Error(`TTS request failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  const url = json.output?.audio?.url;
  if (!url) throw new Error(`No audio URL in TTS response: ${JSON.stringify(json)}`);
  const audioRes = await fetch(url);
  if (!audioRes.ok) throw new Error(`Failed to download synthesized audio (${audioRes.status})`);
  return Buffer.from(await audioRes.arrayBuffer());
}

async function synthesizeWithRetry(apiKey, text, attempt = 0) {
  try {
    return await synthesizeChunk(apiKey, text);
  } catch (err) {
    if (attempt >= 4) throw err;
    const delayMs = 2000 * 2 ** attempt;
    console.log(`  retrying chunk after error (attempt ${attempt + 1}): ${err.message}`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return synthesizeWithRetry(apiKey, text, attempt + 1);
  }
}

async function concatAndTranscode(wavBuffers, outPath) {
  const tmpDir = await fs.mkdtemp(path.join(OUT_DIR, ".tmp-"));
  try {
    const tmpFiles = await Promise.all(
      wavBuffers.map(async (buf, i) => {
        const p = path.join(tmpDir, `chunk-${i}.wav`);
        await fs.writeFile(p, buf);
        return p;
      }),
    );
    const inputArgs = tmpFiles.flatMap((f) => ["-i", f]);
    const filter = `${tmpFiles.map((_, i) => `[${i}:a]`).join("")}concat=n=${tmpFiles.length}:v=0:a=1[out]`;
    await execFileAsync("ffmpeg", ["-y", ...inputArgs, "-filter_complex", filter, "-map", "[out]", "-b:a", "96k", outPath]);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function loadManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return {};
  }
}

function hashText(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

async function generateOne(apiKey, id, rawText, manifest, force) {
  const text = cleanForSpeech(rawText).trim();
  const hash = hashText(text);
  const outPath = path.join(OUT_DIR, `${id}.mp3`);
  const existing = manifest[id];
  const fileExists = await fs
    .access(outPath)
    .then(() => true)
    .catch(() => false);
  if (!force && existing?.textHash === hash && fileExists) {
    console.log(`[skip] ${id} — unchanged`);
    return;
  }
  console.log(`[generate] ${id} — ${text.length} chars`);
  const chunks = splitIntoChunks(text, MAX_CHUNK_CHARS);
  console.log(`  ${chunks.length} chunk(s)`);
  const wavBuffers = [];
  for (const [i, chunk] of chunks.entries()) {
    console.log(`  synthesizing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
    wavBuffers.push(await synthesizeWithRetry(apiKey, chunk));
  }
  await concatAndTranscode(wavBuffers, outPath);
  manifest[id] = { textHash: hash, generatedAt: new Date().toISOString(), chars: text.length };
  console.log(`  wrote ${path.relative(process.cwd(), outPath)}`);
}

async function main() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    console.error("Set DASHSCOPE_API_KEY (an Alibaba Cloud Model Studio API key) before running this script.");
    process.exit(1);
  }
  const force = process.argv.includes("--force");

  const { NARRATION_SOURCES } = await import("../src/data/narrationSources.mjs");

  await fs.mkdir(OUT_DIR, { recursive: true });
  const manifest = await loadManifest();

  for (const { id, text } of NARRATION_SOURCES) {
    await generateOne(apiKey, id, text, manifest, force);
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
