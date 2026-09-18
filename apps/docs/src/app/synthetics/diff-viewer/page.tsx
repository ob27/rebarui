"use client";

import { useState } from "react";
import { DiffViewer, Heading, SegmentedControl, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const OLD_TEXT = `function greet(name) {
  console.log("Hello " + name);
}

greet("world");`;

const NEW_TEXT = `function greet(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}!\`);
}

greet("world");
greet("rebar");`;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<DiffViewer oldText={before} newText={after} mode="split" oldLabel="Before" newLabel="After" />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["DiffViewer"] ?? [] },
  {
    type: "doc-section",
    heading: "A real LCS alignment, not a naive line-by-line compare",
    body: [
      {
        kind: "text",
        text: "Computes an actual longest-common-subsequence alignment between the two texts' lines, so an insertion or deletion in the middle doesn't falsely mark every line after it as changed — try the demo above: only the function signature and its body line are marked, everything else aligns as unchanged even though a whole new line was added at the end.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Static, like CodeBlock",
    body: [
      {
        kind: "text",
        text: "No interactivity — the same Synthetic tier as `CodeBlock`, whose own scope deliberately stops at syntax display rather than a full editing surface. Fits this project's existing developer-tooling lean (`GitGraph`, `VersionHistory`).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="diff-viewer"`, `data-rebar-mode="split" | "unified"`; each line carries `data-rebar-line-type="same" | "add" | "remove" | "empty"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated diff component; a migration typically keeps this exact LCS-diff logic and re-skins the rendering.",
      },
    ],
  },
];

export default function DiffViewerPage() {
  const [mode, setMode] = useState<"split" | "unified">("split");

  return (
    <Stack gap="lg">
      <Heading level={1}>DiffViewer</Heading>
      <Text color="secondary">A real, computed line-level diff.</Text>

      <SegmentedControl
        options={[
          { value: "split", label: "Split" },
          { value: "unified", label: "Unified" },
        ]}
        value={mode}
        onValueChange={(v) => setMode(v as "split" | "unified")}
      />

      <LivePreview>
        <DiffViewer oldText={OLD_TEXT} newText={NEW_TEXT} mode={mode} />
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
