"use client";

import { useState } from "react";
import { Box, Heading, Stack, Sticky, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Sticky title="Fast turnaround on reviews" seed="went1" tags={["team"]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Sticky"] ?? [] },
  {
    type: "doc-section",
    heading: "Deterministic, not random",
    body: [
      {
        kind: "text",
        text: "`seed` (defaulting to `title`) picks the rotation and, unless `color` is set, the background color from a small pastel palette — the same seed always looks the same, so a re-render never reshuffles a board full of notes. Pass a stable id (a card's own id) once you have more than a couple of notes with similar titles.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Text color survives dark mode",
    body: [
      {
        kind: "text",
        text: "A postit's paper color doesn't change with the room's lighting, and neither does its ink — the title/body text color is computed from the note's own background luminance, not the ambient theme, so it stays legible in both light and dark mode regardless of which pastel (or custom) color the note has.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Closable, colored tags",
    body: [
      {
        kind: "text",
        text: '`tags` accepts a plain string (read-only, today\'s default) or a `{ label, tone }` object for a colored `Tag`. Pass `onTagClose` and every tag gets a real "×" — the demo below removes a tag from the note\'s own array on close, the same closable-tag convention `Card` already has.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Extracted from Kanban",
    body: [
      {
        kind: "text",
        text: "`Kanban`'s `cardVariant=\"sticky\"` renders this component for each card — a real, independent component rather than markup drawn inline inside the board, so it has its own visual identity and can be reused anywhere a postit note fits, not just inside a kanban column.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="sticky"` on the root; `data-rebar-part` is `"title"`, `"body"`, or `"tags"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no postit/sticky-note component; a migration reimplements the visual (rotation, shadow, color) directly, or drops it in favor of a plain Card.",
      },
    ],
  },
];

export default function StickyPage() {
  const [tags, setTags] = useState([
    { label: "team", tone: "info" as const },
    { label: "urgent", tone: "error" as const },
  ]);

  return (
    <Stack gap="lg">
      <Heading level={1}>Sticky</Heading>
      <Text color="secondary">
        A postit-style note — procedurally varied rotation and a caller-or-auto-assigned color,
        deterministic per seed. The building block behind <code>Kanban</code>&apos;s{" "}
        <code>cardVariant=&quot;sticky&quot;</code>.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
          display: "flex",
          gap: "var(--rebar-space-md)",
          flexWrap: "wrap",
        }}
      >
        <Sticky title="Fast turnaround on reviews" seed="went1" tags={["team"]} />
        <Sticky title="Good test coverage" seed="went2" />
        <Sticky title="Standup ran long" seed="improve1">
          Timebox to 10 minutes next sprint
        </Sticky>
        <Sticky title="Custom color" seed="custom1" color="#c8e6c9" />
      </Box>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          Closable, toned tags — click a tag&apos;s <code>×</code> to remove it.
        </Text>
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "var(--rebar-space-lg)",
          }}
        >
          <Sticky
            title="Closable tags demo"
            seed="closable-demo"
            tags={tags}
            onTagClose={(closed) => setTags((prev) => prev.filter((t) => t.label !== closed))}
          />
        </Box>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
