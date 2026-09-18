import { Heading, Kbd, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [{ kind: "code", code: '<Kbd>⌘</Kbd> + <Kbd>K</Kbd>' }],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Kbd"] ?? [] },
  {
    type: "doc-section",
    heading: "A real <kbd> element",
    body: [
      {
        kind: "text",
        text: 'A keyboard-shortcut chip — a standalone primitive, no composition, no state. Wraps the real semantic `<kbd>` element rather than a styled `<span>`, so assistive tech and browser find-in-page both treat it correctly as keyboard input, not decorative text. `CommandPalette`\'s own `shortcut` field currently renders as a plain unstyled span — this is the dedicated primitive that gap was missing; pass multiple `<Kbd>`s for a chord like `⌘K`, separated by whatever plain text ("+", " then ") the combination calls for.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="kbd"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated `Kbd`/shortcut-chip component; a migration typically keeps a plain styled `<kbd>`.",
      },
    ],
  },
];

export default function KbdPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Kbd</Heading>
      <Text color="secondary">A keyboard-shortcut chip.</Text>

      <Stack direction="row" gap="xs" style={{ alignItems: "center" }}>
        <Kbd>⌘</Kbd>
        <Text size="sm" color="secondary">
          +
        </Text>
        <Kbd>K</Kbd>
        <Text size="sm" color="secondary">
          to open the command palette
        </Text>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
