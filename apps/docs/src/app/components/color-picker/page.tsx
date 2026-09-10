import { ColorPicker, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [{ kind: "code", code: '<ColorPicker defaultValue="#0066cc" onChange={(hex) => setColor(hex)} />' }],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ColorPicker"] ?? [] },
  {
    type: "doc-section",
    heading: "The native picker does the hard part",
    body: [
      {
        kind: "text",
        text: "The popover's preset grid covers the common case; the native `<input type=\"color\">` alongside it is the browser's own accessible, cross-platform color picker for anything else — not reimplemented as a custom hue/saturation canvas here.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="color-picker"` on the trigger button; `data-rebar-part="presets"` on the swatch grid.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "Not codemod-covered — AntD's `ColorPicker` has a fuller HSB/alpha picker this component's preset-grid-plus-native-input approach doesn't attempt to match; a migration is a deliberate upgrade, not a rename." },
    ],
  },
];

export default function ColorPickerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ColorPicker</Heading>
      <Text color="secondary">
        A color swatch that opens a popover of preset swatches plus a native color input for
        anything else.
      </Text>

      <LivePreview>
        <ColorPicker defaultValue="#0066cc" />
      </LivePreview>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>size</code> — <code>&quot;sm&quot;</code>/<code>&quot;md&quot;</code>/
          <code>&quot;lg&quot;</code> resize the visible swatch; the real clickable footprint stays
          a genuine ≥44×44px target at every size (padding included when the swatch itself is
          smaller — see ref/HEURISTICS.md #19), same as any other small tap target here.
        </Text>
        <LivePreview>
          <Stack direction="row" gap="md" style={{ alignItems: "center" }}>
            <ColorPicker size="sm" defaultValue="#d32f2f" aria-label="Small" />
            <ColorPicker size="md" defaultValue="#2e7d32" aria-label="Medium" />
            <ColorPicker size="lg" defaultValue="#7b1fa2" aria-label="Large" />
          </Stack>
        </LivePreview>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
