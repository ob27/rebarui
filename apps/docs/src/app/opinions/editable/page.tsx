import { Editable, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      { kind: "code", code: '<Editable defaultValue="Project Alpha" onSubmit={(v) => rename(v)} aria-label="Project name" />' },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Editable"] ?? [] },
  {
    type: "doc-section",
    heading: "Enter commits, Escape reverts",
    body: [
      {
        kind: "text",
        text: "Escape restores the value the field had *before this edit started*, not just whatever's currently typed — so an accidental Escape after several undone keystrokes never loses more than the current edit session. A small `EnterOutlined` glyph shows in the field's right side by default while editing — a real reminder of the save gesture itself, not decoration — since a click-away isn't as obvious a \"save\" signal as pressing a labeled key. Set `showEnterHint={false}` to drop it in a denser UI (a table full of these, say) where the repeated hint becomes noise once the pattern is already known.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The read-mode display is a real, focusable, keyboard-activatable `<button>` (Enter/Space enters edit mode) — never a bare `<span onClick>` that only a mouse or a screen-reader\'s click-simulation could reach.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="editable"`; `data-rebar-part` is `"display"` (read mode), `"input-wrapper"`/`"input"` (edit mode), or `"enter-hint"` (the Enter-to-save glyph, when shown).' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "Not codemod-covered — AntD has no direct equivalent; `Typography.Text editable` is the closest, but its callback shape and edit-trigger prop differ enough to need a hand rewrite." },
    ],
  },
];

export default function EditablePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Editable</Heading>
      <Text color="secondary">
        Click-to-edit text: reads as plain text until activated, then becomes a real input — Enter
        or blur commits, Escape reverts.
      </Text>

      <LivePreview>
        <Editable defaultValue="Project Alpha" aria-label="Project name" />
      </LivePreview>

      <Stack gap="sm">
        <Heading level={3}>Example: showEnterHint=false</Heading>
        <Text size="sm" color="secondary">
          Click to edit — no Enter-to-save glyph shown, for a denser UI where the pattern is
          already understood.
        </Text>
        <LivePreview>
          <Editable defaultValue="Project Beta" aria-label="Project name" showEnterHint={false} />
        </LivePreview>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
