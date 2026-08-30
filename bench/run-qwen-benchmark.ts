#!/usr/bin/env node
/**
 * Qwen Benchmark Runner
 * 
 * Calls DashScope API to run a single benchmark iteration, captures metrics,
 * writes the implementation, verifies with tsc, and saves results to JSON.
 * 
 * Usage:
 *   npx tsx bench/run-qwen-benchmark.ts <condition> <run-number>
 * 
 * Conditions:
 *   - antd-text
 *   - rebar-ui-text
 *   - antd-image
 *   - rebar-ui-image
 * 
 * Example:
 *   npx tsx bench/run-qwen-benchmark.ts antd-text 1
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("ERROR: bench/.env.local not found. Create it with DASHSCOPE_API_KEY=...");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const apiKeyMatch = envContent.match(/DASHSCOPE_API_KEY=(.+)/);
if (!apiKeyMatch || apiKeyMatch[1].trim() === "your_api_key_here") {
  console.error("ERROR: DASHSCOPE_API_KEY not set in bench/.env.local");
  process.exit(1);
}
const API_KEY = apiKeyMatch[1].trim();

// Parse args
const [condition, runNumberStr] = process.argv.slice(2);
if (!condition || !runNumberStr) {
  console.error("Usage: npx tsx bench/run-qwen-benchmark.ts <condition> <run-number>");
  console.error("Conditions: antd-text, rebar-ui-text, antd-image, rebar-ui-image");
  process.exit(1);
}

const runNumber = parseInt(runNumberStr, 10);
if (runNumber < 1 || runNumber > 15) {
  console.error("Run number must be 1-15");
  process.exit(1);
}

// Map condition to scaffold directory and target file. Points at dedicated *-qwen-NN clones,
// never the original Claude-benchmark scaffolds — a previous version of this script pointed
// straight at those, and a bug below (no writeFileSync call) meant every one of those 60 files
// got reset to a placeholder and never restored with real content. Isolating Qwen's runs to
// their own clones means that class of accident can't touch the Claude-run reference artifacts
// again, whatever else goes wrong here.
const scaffoldMap: Record<string, { dir: string; target: string; model: string }> = {
  "antd-text": {
    dir: `bench/antd-text-qwen-${String(runNumber).padStart(2, "0")}`,
    target: "src/Component.tsx",
    model: "qwen3.7-max",
  },
  "rebar-ui-text": {
    dir: `bench/rebar-dsl-qwen-${String(runNumber).padStart(2, "0")}`,
    target: "src/panel.ts",
    model: "qwen3.7-max",
  },
  "antd-image": {
    dir: `bench/antd-image-qwen-${String(runNumber).padStart(2, "0")}`,
    target: "src/Component.tsx",
    model: "qwen3.7-plus",
  },
  "rebar-ui-image": {
    dir: `bench/rebar-dsl-image-qwen-${String(runNumber).padStart(2, "0")}`,
    target: "src/panel.ts",
    model: "qwen3.7-plus",
  },
  // Simple/Composite/Complex tiers — n=1, text-only, one-shot across both models. Dedicated
  // "-qwen" scaffold clones, NEVER the bare bench/antd-simple etc. paths — those are Claude's
  // one-shot outputs, and a first pass of this pointed straight at them, so Claude's later
  // dispatch silently overwrote Qwen's already-measured source code. The token/duration numbers
  // recorded before that happened were unaffected (saved to JSON independent of the file), but
  // the actual code was gone, unrecoverable (never committed). Isolating scaffolds per model,
  // same fix as the earlier PreviewPanel n=15 batches.
  // A third, genuinely different model family (not another Qwen tier) — DashScope's intl endpoint
  // also hosts third-party models beyond Qwen, e.g. Moonshot's Kimi. kimi-k3 confirmed reachable
  // and reliable via a pilot on both real prompts below (DeepSeek's deepseek-v4-pro-0813, tried
  // first, burned its entire 4096-token budget on internal reasoning with zero actual output —
  // not viable at this max_tokens; not pursued further). Dedicated *-kimi-NN scaffold clones,
  // same isolation discipline as every other batch.
  "antd-text-kimi": {
    dir: `bench/antd-text-kimi-${String(runNumber).padStart(2, "0")}`,
    target: "src/Component.tsx",
    model: "kimi-k3",
  },
  "rebar-ui-text-kimi": {
    dir: `bench/rebar-dsl-kimi-${String(runNumber).padStart(2, "0")}`,
    target: "src/panel.ts",
    model: "kimi-k3",
  },
  "antd-simple": { dir: "bench/antd-simple-qwen", target: "src/Component.tsx", model: "qwen3.7-max" },
  "rebar-ui-simple": { dir: "bench/rebar-ui-simple-qwen", target: "src/blocks.ts", model: "qwen3.7-max" },
  "antd-composite": { dir: "bench/antd-composite-qwen", target: "src/Component.tsx", model: "qwen3.7-max" },
  "rebar-ui-composite": { dir: "bench/rebar-ui-composite-qwen", target: "src/blocks.ts", model: "qwen3.7-max" },
  "antd-complex": { dir: "bench/antd-complex-qwen", target: "src/Component.tsx", model: "qwen3.7-max" },
  "rebar-ui-complex": { dir: "bench/rebar-ui-complex-qwen", target: "src/blocks.ts", model: "qwen3.7-max" },
};

if (!scaffoldMap[condition]) {
  console.error(`Unknown condition: ${condition}`);
  process.exit(1);
}

const { dir: scaffoldDir, target: targetFile, model } = scaffoldMap[condition];
const scaffoldPath = path.join(__dirname, "..", scaffoldDir);
const targetPath = path.join(scaffoldPath, targetFile);

// Verify scaffold exists
if (!fs.existsSync(scaffoldPath)) {
  console.error(`Scaffold directory not found: ${scaffoldPath}`);
  process.exit(1);
}

// Prompts (verbatim from protocol)
const prompts: Record<string, string> = {
  "antd-text": `Implement the React component in \`src/Component.tsx\` (exported as \`PreviewPanel\`, a named export, no props) using \`antd\` components (Alert, Checkbox, Button, Typography, Card, etc. — whatever fits best) and \`@ant-design/icons\` for icons. The component is a "Preview" panel: a title bar with "Preview" on the left and a close (×) icon button on the right; below it an info-style banner with an info icon, the text "Preview — nothing entered here is saved.", and a "Reset" button (refresh icon) on the right; then a "Checklist" heading followed by six bordered rows, each an unchecked checkbox with a label — "Pre-Fab Checkprint comments resolved", "Pre-Fab Attribute Matrix comments resolved", "Pre-Fab Data Release form comments resolved", "As Built model data supplied by DE", "No blocking quality items", "All anticipated Post-fab decisions documented"; then a warning/amber callout with a clock icon, bold title "DPK can now move to Post-fab In Progress", and secondary line "Some required items in this section are still incomplete." Match antd's own defaults/spacing rather than fighting them. After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "rebar-ui-text": `Your only task: write \`src/panel.ts\`. Do NOT read \`schema.ts\`, \`PanelRenderer.tsx\`, or \`icons.tsx\` — everything you need is below (this is a single API call with no file access, so those files aren't actually reachable regardless). Write \`src/panel.ts\` with exactly this shape:

\`\`\`ts
import type { PanelDocument } from "./schema";
export const panel: PanelDocument = {
  type: "panel",
  header: { title: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } },
  sections: [ /* array of Section, see below */ ],
};
\`\`\`

A \`Section\` is one of exactly these three shapes — use these exact \`type\` strings, no others, and \`items\` must be plain strings, never objects:
- \`{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", text: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } }\`
- \`{ type: "checklist", heading?: string, items: string[] }\` — items is an array of plain strings like \`["First item", "Second item"]\`, NOT \`[{ label: "..." }]\`.
- \`{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", title: string, subtitle?: string }\`

Describe a "Preview" panel: header title "Preview" with a close-icon action; a banner section (tone "info", icon "info", text "Preview — nothing entered here is saved.", action label "Reset" with icon "refresh"); a checklist section (heading "Checklist", items: "Pre-Fab Checkprint comments resolved", "Pre-Fab Attribute Matrix comments resolved", "Pre-Fab Data Release form comments resolved", "As Built model data supplied by DE", "No blocking quality items", "All anticipated Post-fab decisions documented"); and a callout section (tone "warning", icon "clock", title "DPK can now move to Post-fab In Progress", subtitle "Some required items in this section are still incomplete."). After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "antd-image": `Read the reference image at \`bench/reference-preview-panel.png\` first, then implement the component to match it. Implement the React component in \`src/Component.tsx\` (exported as \`PreviewPanel\`, a named export, no props) using \`antd\` components (Alert, Checkbox, Button, Typography, Card, etc. — whatever fits best) and \`@ant-design/icons\` for icons. The component is a "Preview" panel: a title bar with "Preview" on the left and a close (×) icon button on the right; below it an info-style banner with an info icon, the text "Preview — nothing entered here is saved.", and a "Reset" button (refresh icon) on the right; then a "Checklist" heading followed by six bordered rows, each an unchecked checkbox with a label — "Pre-Fab Checkprint comments resolved", "Pre-Fab Attribute Matrix comments resolved", "Pre-Fab Data Release form comments resolved", "As Built model data supplied by DE", "No blocking quality items", "All anticipated Post-fab decisions documented"; then a warning/amber callout with a clock icon, bold title "DPK can now move to Post-fab In Progress", and secondary line "Some required items in this section are still incomplete." Match antd's own defaults/spacing rather than fighting them. After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "rebar-ui-image": `Your only task: write \`src/panel.ts\`. Do NOT read \`schema.ts\`, \`PanelRenderer.tsx\`, or \`icons.tsx\` — everything you need is below. First, read the reference image at \`bench/reference-preview-panel.png\`. Then write \`src/panel.ts\` with exactly this shape:

\`\`\`ts
import type { PanelDocument } from "./schema";
export const panel: PanelDocument = {
  type: "panel",
  header: { title: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } },
  sections: [ /* array of Section, see below */ ],
};
\`\`\`

A \`Section\` is one of exactly these three shapes — pick whichever matches each visual element in the image, top to bottom:
- A colored banner strip with an icon, a line of text, and (optionally) a trailing button:
  \`{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", text: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } }\`
- A heading followed by a vertical list of checkbox rows:
  \`{ type: "checklist", heading?: string, items: string[] }\`
- A colored callout box with a bold title line and a secondary (lighter) line below it:
  \`{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", title: string, subtitle?: string }\`

Transcribe all visible text exactly as shown (including punctuation). Match tone/icon choice to the visual color/icon shown. A close (×) icon top-right of the title bar maps to the header's \`action.icon: "close"\`. After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "antd-simple": `Implement the React component in \`src/Component.tsx\` (exported as \`AccountSettings\`, a named export, no props) using \`antd\` components (Form, Input, Checkbox, Button, Typography, Card). The component is an "Account Settings" panel: a heading "Account Settings"; a text field labeled "Display name" (placeholder "e.g. Jane Doe"); an email field labeled "Email address" (placeholder "you@example.com"); two checkboxes — "Email me about product updates" (unchecked) and "Email me about security alerts" (checked); and a primary submit button labeled "Save changes". Match antd's own defaults/spacing rather than fighting them. After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "rebar-ui-simple": `Your only task: write \`src/blocks.ts\`, exporting \`blocks: Block[]\` (import \`Block\` as a type from \`@rebar-ui/placement\`, already installed). Everything you need is below — you do not need to read any other file. A \`form\` block has this shape: \`{ type: "form", heading?: string, fields: FormField[], submitLabel?: string }\` where \`FormField\` is one of: \`{ kind: "text"|"email"|"date", label: string, placeholder?: string }\`, \`{ kind: "textarea", label: string, placeholder?: string }\`, \`{ kind: "select", label: string, options: string[] }\`, \`{ kind: "checkbox", label: string, checked?: boolean }\`. Write \`blocks\` as an array containing exactly one \`form\` block: heading "Account Settings"; fields: a text field "Display name" (placeholder "e.g. Jane Doe"), an email field "Email address" (placeholder "you@example.com"), a checkbox "Email me about product updates" (unchecked), a checkbox "Email me about security alerts" (checked: true); submitLabel "Save changes". After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "antd-composite": `Implement the React component in \`src/Component.tsx\` (exported as \`ProjectsList\`, a named export, no props) using \`antd\` components (Input, Select, Button, Tag for status badges, Modal, Form, Typography). The component is a "Projects" list view: a filter bar with a search input (placeholder "Search projects…"), a status select (options "All"/"Active"/"Archived", default "All"), and a "New Project" button; below it a list of 4 projects each showing a name and a status badge — "Marketing Site Redesign" (Active), "Q3 Budget Review" (Active), "Legacy API Migration" (Archived), "Customer Portal Beta" (Active); and a "New Project" modal, rendered already open (visible in a static render, not behind a click), containing a text field "Project name" (placeholder "Required") with a red inline validation message below it reading "Project name is required", a textarea "Description" (placeholder "Optional"), and "Cancel"/"Create" buttons. Match antd's own defaults/spacing rather than fighting them. After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "rebar-ui-composite": `Your only task: write \`src/blocks.ts\`, exporting \`blocks: Block[]\` (import \`Block\` as a type from \`@rebar-ui/placement\`). Everything you need is below. Relevant block shapes:
- \`{ type: "filter-bar", searchPlaceholder?: string, filterLabel?: string, filterOptions?: string[], actionLabel?: string }\`
- \`{ type: "data-list", items: { title: string, badge?: string }[] }\`
- \`{ type: "modal", title: string, blocks: Block[], confirmLabel?: string, cancelLabel?: string }\`
- \`{ type: "form", heading?: string, fields: FormField[], submitLabel?: string }\` where \`FormField\` is one of \`{ kind: "text"|"email"|"date", label: string, placeholder?: string }\`, \`{ kind: "textarea", label: string, placeholder?: string }\`

Write \`blocks\` as an array containing exactly three blocks, in this order: (1) a \`filter-bar\` with searchPlaceholder "Search projects…", filterLabel "Status", filterOptions ["All","Active","Archived"], actionLabel "New Project"; (2) a \`data-list\` with 4 items: "Marketing Site Redesign" (badge "Active"), "Q3 Budget Review" (badge "Active"), "Legacy API Migration" (badge "Archived"), "Customer Portal Beta" (badge "Active"); (3) a \`modal\` titled "New Project", confirmLabel "Create", cancelLabel "Cancel", whose \`blocks\` is a single-element array containing one \`form\` block (do NOT set submitLabel on this nested form — the modal's own Create/Cancel buttons are the only actions) with two fields: a text field "Project name" (placeholder "Required") and a textarea field "Description" (placeholder "Optional"). After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "antd-complex": `Implement the React component in \`src/Component.tsx\` (exported as \`OnboardingWizard\`, a named export, no props) using \`antd\` components (Tabs, Table, Form, Input, Select, Modal, Button, Typography). The component is an employee-onboarding wizard with three tabs: "Team", "Details", "Review" — show "Details" as the initially active tab. Tab "Team": a table with columns "Team", "Open positions", "Lead", and three rows — Engineering/4/Priya Shah, Design/2/Marcus Webb, Sales/6/Elena Torres — each row has a "Select" button. Tab "Details": a form with a text field "Full name", a date field "Start date", and a select "Role" (options "Individual Contributor"/"Team Lead"/"Manager"). Tab "Review": a heading "Ready to submit" with secondary text "Review your details above.", and a confirmation dialog rendered already open (visible in a static render, not behind a click) titled "Confirm onboarding" with body text "Are you sure you want to onboard this employee to the selected team?" and "Cancel"/"Confirm" buttons. Match antd's own defaults/spacing rather than fighting them. After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,

  "rebar-ui-complex": `Your only task: write \`src/blocks.ts\`, exporting \`blocks: Block[]\` (import \`Block\` as a type from \`@rebar-ui/placement\`). Everything you need is below. Relevant block shapes:
- \`{ type: "tabs", tabs: { label: string, blocks: Block[] }[] }\`
- \`{ type: "table", columns: string[], rows: { cells: string[], actionLabel?: string }[] }\`
- \`{ type: "form", heading?: string, fields: FormField[], submitLabel?: string }\` where \`FormField\` includes \`{ kind: "text"|"date", label: string }\` and \`{ kind: "select", label: string, options: string[] }\`
- \`{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", title: string, subtitle?: string }\`
- \`{ type: "modal", title: string, blocks: Block[], confirmLabel?: string, cancelLabel?: string }\`

Write \`blocks\` as an array containing exactly one \`tabs\` block with three tabs, in this order:
1. label "Team": one \`table\` block, columns ["Team","Open positions","Lead"], rows: ["Engineering","4","Priya Shah"] actionLabel "Select", ["Design","2","Marcus Webb"] actionLabel "Select", ["Sales","6","Elena Torres"] actionLabel "Select".
2. label "Details": one \`form\` block (no submitLabel) with fields: text "Full name", date "Start date", select "Role" with options ["Individual Contributor","Team Lead","Manager"].
3. label "Review": two blocks — a \`callout\` (tone "info", title "Ready to submit", subtitle "Review your details above."), then a \`modal\` titled "Confirm onboarding", confirmLabel "Confirm", cancelLabel "Cancel", whose \`blocks\` is a single-element array containing one \`callout\` block (tone "warning", title "Are you sure?", subtitle "This will onboard the selected employee to the selected team.").

After writing, run \`npx tsc --noEmit\` to verify it typechecks. Do not run a dev server or take screenshots.`,
};

// "*-kimi" conditions reuse the exact same prompt as their base condition — same spec, only the
// model and scaffold differ — so there's no separate prompt entry to keep in sync by hand.
const promptKey = condition.replace(/-kimi$/, "");
const prompt = prompts[promptKey];
if (!prompt) {
  console.error(`No prompt defined for condition: ${condition}`);
  process.exit(1);
}

// Read reference image for image conditions (base64 encode)
let imageBase64: string | undefined;
if (condition.includes("image")) {
  const imagePath = path.join(__dirname, "..", "bench", "reference-preview-panel.png");
  if (!fs.existsSync(imagePath)) {
    console.error(`Reference image not found: ${imagePath}`);
    process.exit(1);
  }
  const imageBuffer = fs.readFileSync(imagePath);
  imageBase64 = imageBuffer.toString("base64");
}

// Build API request (OpenAI-compatible format for international endpoint)
const apiUrl = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";

const messages: any[] = [
  {
    role: "system",
    content: "You are a React/TypeScript expert. Write clean, correct code that typechecks.",
  },
];

if (imageBase64) {
  // For vision models, include the image in OpenAI vision format
  messages.push({
    role: "user",
    content: [
      {
        type: "image_url",
        image_url: {
          url: `data:image/png;base64,${imageBase64}`,
        },
      },
      {
        type: "text",
        text: prompt,
      },
    ],
  });
} else {
  messages.push({
    role: "user",
    content: prompt,
  });
}

// kimi-k3 rejects any explicit `temperature` (400 InvalidParameter, confirmed by every one of the
// first 30 dispatches of this condition failing identically) — omit it for that model rather than
// hardcoding 0.7 for everyone.
const requestBody: Record<string, unknown> = {
  model,
  messages,
  max_tokens: 4096,
};
if (model !== "kimi-k3") {
  requestBody.temperature = 0.7;
}

console.log(`\n=== Qwen Benchmark Run ===`);
console.log(`Condition: ${condition}`);
console.log(`Run: ${runNumber}/15`);
console.log(`Model: ${model}`);
console.log(`Scaffold: ${scaffoldDir}`);
console.log(`Target: ${targetFile}`);
console.log(`\nCalling DashScope API...`);

// Every early-exit path below used to call process.exit(1) directly without writing a result —
// meaning a run that failed to even extract a code block from the API response vanished from
// the dataset entirely rather than being recorded as a failure. That silently undercounted the
// real attempt count (a condition showing "10 of 15" was actually 15 attempts, 5 of which just
// never got recorded). This ensures every attempt that reaches an API response writes SOMETHING.
function recordFailureAndExit(reason: string, tokens?: { inputTokens: number; outputTokens: number; totalTokens: number }): never {
  const duration = Date.now() - startTime;
  const result = {
    condition,
    run: runNumber,
    model,
    scaffold: scaffoldDir,
    target: targetFile,
    inputTokens: tokens?.inputTokens ?? null,
    outputTokens: tokens?.outputTokens ?? null,
    totalTokens: tokens?.totalTokens ?? null,
    duration,
    typecheckPassed: false,
    success: false,
    error: reason,
    timestamp: new Date().toISOString(),
  };
  const resultsFile = path.join(__dirname, "qwen-benchmark-results.json");
  let results: any[] = [];
  if (fs.existsSync(resultsFile)) {
    results = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));
  }
  results = results.filter((r) => !(r.condition === condition && r.run === runNumber));
  results.push(result);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.error(`\n✗ Recorded failure (${reason}) and saved to ${resultsFile}`);
  process.exit(1);
}

// Call API and measure duration
const startTime = Date.now();

try {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  const duration = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API error: ${response.status} ${response.statusText}`);
    console.error(errorText);
    recordFailureAndExit(`api_error_${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();

  // Extract metrics (OpenAI-compatible format)
  const usage = data.usage || {};
  const inputTokens = usage.prompt_tokens || 0;
  const outputTokens = usage.completion_tokens || 0;
  const totalTokens = inputTokens + outputTokens;

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    console.error("No content in API response");
    console.error(JSON.stringify(data, null, 2));
    recordFailureAndExit("no_content_in_response", { inputTokens, outputTokens, totalTokens });
  }

  console.log(`\nAPI Response:`);
  console.log(`  Input tokens: ${inputTokens}`);
  console.log(`  Output tokens: ${outputTokens}`);
  console.log(`  Total tokens: ${totalTokens}`);
  console.log(`  Duration: ${duration}ms`);

  // Extract code from response (try multiple formats)
  let code = "";
  
  // Try markdown code blocks: ```tsx ... ``` or ```ts ... ```
  const codeMatch = content.match(/```(?:tsx?|typescript)\n([\s\S]+?)```/);
  if (codeMatch) {
    code = codeMatch[1].trim();
  } else {
      // Try XML-like format: <writeFile><path>...</path><content>...</content></writeFile> or <fsWrite>... or <write_file>... or <file_write>...
      const xmlMatch = content.match(/<(?:writeFile|fsWrite|write_file|file_write)>[\s\S]*?<content>([\s\S]+?)<\/content>[\s\S]*?<\/(?:writeFile|fsWrite|write_file|file_write)>/);
    if (xmlMatch) {
      code = xmlMatch[1].trim();
    } else {
      // Try XML format with path attribute: <writeFile path="...">code</writeFile> or <write_file path="...">code</write_file>
      const xmlAttrMatch = content.match(/<(?:writeFile|fsWrite|write_file)\s+path="[^"]*">([\s\S]+?)<\/(?:writeFile|fsWrite|write_file)>/);
    if (xmlAttrMatch) {
      code = xmlAttrMatch[1].trim();
    } else {
      // Try XML tool_use format: <tool_use>...<tool_name>write_file</tool_name>...<content>code</content>...</tool_use>
      const xmlToolUseMatch = content.match(/<tool_use>[\s\S]*?<tool_name>write_file<\/tool_name>[\s\S]*?<content>([\s\S]+?)<\/content>[\s\S]*?<\/tool_use>/);
    if (xmlToolUseMatch) {
      code = xmlToolUseMatch[1].trim();
    } else {
      // Try tool_use format: <tool_use>{"name": "write_file", "arguments": {"content": "..."}}</tool_use>
      const toolUseMatch = content.match(/<tool_use>[\s\S]*?write_file[\s\S]*?"content":\s*"([\s\S]+?)"[\s\S]*?<\/tool_use>/);
      if (toolUseMatch) {
        // Unescape JSON string (handle \n, \", etc.)
        try {
          code = JSON.parse(`"${toolUseMatch[1]}"`);
        } catch {
          // If JSON parse fails, do manual unescape
          code = toolUseMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }
      } else {
        // Try [Tool: write_file, params: {path: "...", content: "..."}] format
        const toolParamsMatch = content.match(/\[Tool:\s*write_file,\s*params:\s*(\{[\s\S]*?\})\]/);
        if (toolParamsMatch) {
          try {
            const params = JSON.parse(toolParamsMatch[1]);
            code = params.content || "";
          } catch {
            // If JSON parse fails, try regex extraction
            const contentMatch = toolParamsMatch[1].match(/"content":\s*"([\s\S]+?)"/);
            if (contentMatch) {
              try {
                code = JSON.parse(`"${contentMatch[1]}"`);
              } catch {
                code = contentMatch[1]
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, '\\');
              }
            }
          }
        }
        
        if (!code) {
          // Try JSON tool calls with embedded code: [{"name": "writeFile", "arguments": {"content": "..."}}]
          const jsonToolCallMatch = content.match(/\[[\s\S]*?"name":\s*"(?:writeFile|write_file|Write)"[\s\S]*?"arguments":\s*\{[\s\S]*?"content":\s*"([\s\S]+?)"[\s\S]*?\}[\s\S]*?\]/);
          if (jsonToolCallMatch) {
            try {
              code = JSON.parse(`"${jsonToolCallMatch[1]}"`);
            } catch {
              code = jsonToolCallMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
            }
          }
        }
        
        if (!code) {
          // Check if response is JSON tool calls (model trying to use tools)
          const toolCallsMatch = content.match(/\[[\s\S]*?"name":\s*"(?:Read|Glob|Write|write_file)"[\s\S]*?\]/);
          // Also check for "[Tool calls:]" format without JSON
          const toolCallsTextMatch = content.match(/\[Tool calls?:?\]/i);
          // Check for <read_file> or <readFile> XML tags (model trying to read files)
          const readFileXmlMatch = content.match(/<(?:read_file|readFile)>/i);
          // Check for summary format (model describing code instead of outputting it)
          // kimi-k3 sometimes narrates a future-tense plan instead of just outputting code —
          // "I'll start by exploring the project setup...", "I'll write the file exactly per the
          // spec, then typecheck." — never reaching an actual code block in that same response.
          // Caught by inspecting real failures from a live batch: 5 of ~23 real attempts hit this
          // exact pattern (a genuine ~22% failure rate), none of them matched by the patterns
          // below, so they fell straight to a recorded failure instead of the same automatic
          // follow-up retry other narration/summary variants already get.
          const summaryMatch =
            content.match(/Here's a summary of the implementation/i) ||
            content.match(/The component (?:is structured|uses|includes)/i) ||
            content.match(/Here'?s a summary of what (?:was created|I created|I wrote)/i) ||
            content.match(/has been written and .{0,40}(?:typechecks?|passes?|completed)/i) ||
            content.match(/^I'?ll (?:start by|write|explore|inspect|first)\b/i);
          if (toolCallsMatch || toolCallsTextMatch || readFileXmlMatch || summaryMatch) {
          console.log("Model returned tool calls instead of code. Making follow-up request...");
          
          // Make follow-up API call requesting direct code output
          const followUpBody = {
            model,
            messages: [
              { role: "system", content: "You are a helpful assistant that writes React components." },
              { role: "user", content: prompt },
              { role: "assistant", content: content },
              { role: "user", content: "Please output the complete code directly in a markdown code block (```tsx ... ```). Do not use tools or try to read files." }
            ],
            max_tokens: 4096,
            temperature: 0
          };
          
          const followUpStart = Date.now();
          const followUpRes = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(followUpBody),
          });
          
          if (!followUpRes.ok) {
            console.error(`Follow-up API error: ${followUpRes.status}`);
            recordFailureAndExit(`followup_api_error_${followUpRes.status}`, { inputTokens, outputTokens, totalTokens });
          }
          
          const followUpData = await followUpRes.json() as any;
          const followUpContent = followUpData.choices?.[0]?.message?.content || "";
          const followUpDuration = Date.now() - followUpStart;
          
          console.log(`Follow-up API Response:`);
          console.log(`  Duration: ${followUpDuration}ms`);
          
          // Try to extract code from follow-up response (try multiple formats)
          const followUpCodeMatch = followUpContent.match(/```(?:tsx?|typescript)\n([\s\S]+?)```/);
          if (followUpCodeMatch) {
            code = followUpCodeMatch[1].trim();
          } else {
            const followUpXmlMatch = followUpContent.match(/<(?:writeFile|fsWrite|write_file|file_write)>[\s\S]*?<content>([\s\S]+?)<\/content>[\s\S]*?<\/(?:writeFile|fsWrite|write_file|file_write)>/);
            if (followUpXmlMatch) {
              code = followUpXmlMatch[1].trim();
            } else {
              const followUpXmlAttrMatch = followUpContent.match(/<(?:writeFile|fsWrite|write_file)\s+path="[^"]*">([\s\S]+?)<\/(?:writeFile|fsWrite|write_file)>/);
              if (followUpXmlAttrMatch) {
                code = followUpXmlAttrMatch[1].trim();
              } else {
                const followUpXmlToolUseMatch = followUpContent.match(/<tool_use>[\s\S]*?<tool_name>write_file<\/tool_name>[\s\S]*?<content>([\s\S]+?)<\/content>[\s\S]*?<\/tool_use>/);
                if (followUpXmlToolUseMatch) {
                  code = followUpXmlToolUseMatch[1].trim();
                } else {
                  console.error("No code block found in follow-up response");
                  console.error("Follow-up content:");
                  console.error(followUpContent);
                  recordFailureAndExit("no_code_in_followup_response", { inputTokens, outputTokens, totalTokens });
                }
              }
            }
          }
        } else {
          console.error("No code block found in response");
          console.error("Response content:");
          console.error(content);
          recordFailureAndExit("no_code_in_response", { inputTokens, outputTokens, totalTokens });
        }
        }
      }
    }
    }
    }
  }

  // Actually write the generated code to the scaffold's target file — the original version of
  // this script extracted `code` but never called writeFileSync, so no run's output was ever
  // saved or checked. That meant "success" only meant "we found a code block in the raw text,"
  // not that the code was valid.
  fs.writeFileSync(targetPath, code);
  console.log(`\nWrote ${code.length} chars to ${targetPath}`);

  // Verify: does it actually typecheck? Same bar every Claude-run benchmark result was held to.
  let typecheckPassed = false;
  let typecheckOutput = "";
  try {
    execSync("npx tsc --noEmit", { cwd: scaffoldPath, stdio: "pipe", timeout: 60000 });
    typecheckPassed = true;
    console.log(`Typecheck: PASS`);
  } catch (err: any) {
    typecheckOutput = (err.stdout?.toString() || "") + (err.stderr?.toString() || "") || String(err);
    console.log(`Typecheck: FAIL`);
    console.log(typecheckOutput.slice(0, 2000));
  }

  const result = {
    condition,
    run: runNumber,
    model,
    scaffold: scaffoldDir,
    target: targetFile,
    inputTokens,
    outputTokens,
    totalTokens,
    duration,
    typecheckPassed,
    typecheckOutput: typecheckPassed ? undefined : typecheckOutput.slice(0, 2000),
    timestamp: new Date().toISOString(),
    // Only counts as a real success if the code was both extracted AND verified to typecheck —
    // matching the same bar every Claude-run benchmark result on /benchmarks was held to.
    success: typecheckPassed,
  };

  const resultsFile = path.join(__dirname, "qwen-benchmark-results.json");
  let results: any[] = [];
  if (fs.existsSync(resultsFile)) {
    results = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));
  }

  // Remove any existing result for this condition+run (both fields are now always present, so
  // this dedup actually works — the original version omitted them from successful results,
  // silently accumulating duplicates on any re-run).
  results = results.filter((r) => !(r.condition === condition && r.run === runNumber));
  results.push(result);

  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n✓ Result saved to ${resultsFile}`);
  console.log(`\n=== Run Complete ===\n`);

  if (!typecheckPassed) {
    process.exit(1);
  }
} catch (error) {
  const duration = Date.now() - startTime;
  console.error(`\n✗ Error during API call or processing:`);
  console.error(error);

  // Save error result
  const result = {
    condition,
    run: runNumber,
    model,
    scaffold: scaffoldDir,
    target: targetFile,
    duration,
    timestamp: new Date().toISOString(),
    success: false,
    error: String(error),
  };

  const resultsFile = path.join(__dirname, "qwen-benchmark-results.json");
  let results: any[] = [];
  if (fs.existsSync(resultsFile)) {
    results = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));
  }

  results = results.filter((r) => !(r.condition === condition && r.run === runNumber));
  results.push(result);

  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  process.exit(1);
}
