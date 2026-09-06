"use client";

import { Heading, SpeedDial, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<SpeedDial\n  actions={[\n    { label: "New document", onSelect: () => {} },\n    { label: "New folder", onSelect: () => {} },\n  ]}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["SpeedDial"] ?? [] },
  {
    type: "doc-section",
    heading: "Every action is a real, labeled button",
    body: [
      {
        kind: "text",
        text: "Revealed actions are never icon-only, hover-reveal affordances — each is a real, keyboard-focusable `Button` with a visible text label (per HEURISTICS #13), conditionally mounted (not just hidden) while closed so they're never in the tab order.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "One-shot commands, not toggles",
    body: [
      {
        kind: "text",
        text: 'Picking an action calls its own `onSelect` and then closes the dial — mirroring `ActionSheet`\'s "picking an action is a complete choice" convention.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="speed-dial"`, `data-rebar-direction`; the trigger and each action carry `data-rebar-part="trigger" | "action"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `FloatButton.Group` (with `trigger=\"click\"`) is a close direct equivalent.",
      },
    ],
  },
];

export default function SpeedDialPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SpeedDial</Heading>
      <Text color="secondary">
        A floating action button that expands into several labeled sub-actions on click.
      </Text>

      <div style={{ position: "relative", height: 220 }}>
        <div style={{ position: "absolute", bottom: 16, right: 16 }}>
          <SpeedDial
            actions={[
              { label: "New document", onSelect: () => {} },
              { label: "New folder", onSelect: () => {} },
              { label: "Upload file", onSelect: () => {} },
            ]}
          />
        </div>
      </div>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
