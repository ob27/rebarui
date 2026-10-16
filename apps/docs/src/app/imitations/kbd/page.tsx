import { Card, Heading, Kbd, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<Kbd>Cmd</Kbd> + <Kbd>K</Kbd>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Kbd"] ?? [] },
  {
    type: "doc-section",
    heading: "Semantics",
    body: [{ kind: "text", text: "Wraps the real `<kbd>` element, so assistive tech and find-in-page treat it as keyboard input. Pass several `Kbd`s for a chord, separated by plain text." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="kbd"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no shortcut chip; keep a plain styled `<kbd>`." }],
  },
];

const SHORTCUTS = [
  { action: "Open the command palette", keys: ["Ctrl", "K"] },
  { action: "New task", keys: ["N"] },
  { action: "Jump to Harbour rebrand", keys: ["G", "H"] },
  { action: "Mark task done", keys: ["Shift", "Enter"] },
];

export default function KbdPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Kbd</Heading>
      <Text color="secondary">A keyboard-shortcut chip.</Text>

      <DemoStage
        title="Shortcuts"
        caption="Single keys and chords"
        code={CODE}
        states={[
          { label: "Single key", node: <Kbd>N</Kbd> },
          { label: "Chord", node: <Stack direction="row" gap="xs" align="center"><Kbd>Shift</Kbd><Text size="sm" color="secondary">+</Text><Kbd>Enter</Kbd></Stack> },
          { label: "Long key name", node: <Kbd>Page Down</Kbd> },
          { label: "Inline in text", node: <Text size="sm">Press <Kbd>Esc</Kbd> to close.</Text> },
        ]}
      >
        <Stack direction="row" gap="xs" align="center">
          <Kbd>Ctrl</Kbd>
          <Text size="sm" color="secondary">+</Text>
          <Kbd>K</Kbd>
          <Text size="sm" color="secondary">to open the command palette</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Shortcut help" caption="A cheat sheet card in Tideline" widths={false}>
        <Card title="Keyboard shortcuts" style={{ maxWidth: 420, margin: "0 auto" }}>
          <Stack gap="sm">
            {SHORTCUTS.map((s) => (
              <Stack key={s.action} direction="row" gap="sm" align="center" style={{ justifyContent: "space-between" }}>
                <Text size="sm">{s.action}</Text>
                <Stack direction="row" gap="xs" align="center">
                  {s.keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
