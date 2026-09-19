import { ColorPicker, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
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
    heading: "Real mutations: size, mode, and the eyedropper",
    body: [
      {
        kind: "text",
        text: '`size` (`"sm"`/`"md"`/`"lg"`) covers the visual scale; `mode="recent"` is the actual functional "micro" variant — instead of the full `presets` grid, it shows only the 3 most-recently-picked colors (seeded from the first few `presets` before anything\'s actually been picked), a real reduction in scope, not just a smaller version of the same grid. The native color input is still offered in both modes for anything not in the shown set. `allowEyedropper` adds a fourth, orthogonal capability — see below.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Picking a color from anywhere on screen: allowEyedropper",
    body: [
      {
        kind: "text",
        text: '`allowEyedropper` adds a button that opens the real browser `EyeDropper` API — the user can sample any pixel on the *entire screen*, not just this page\'s own DOM, the same tool a real design app\'s color picker offers. Feature-detected at mount, not assumed: only Chromium-based browsers support it as of this writing, so the button simply doesn\'t render in a browser that can\'t back it (Firefox, Safari) — no broken button, no error.',
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

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>mode=&quot;recent&quot;</code> — a real &quot;micro&quot; picker: only the 3
          most-recently-picked colors, not the full preset grid. Pick a few different colors below
          to see the shown set actually change.
        </Text>
        <LivePreview>
          <ColorPicker mode="recent" size="sm" defaultValue="#0066cc" aria-label="Recent colors" />
        </LivePreview>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>allowEyedropper</code> — click the swatch, then the eyedropper icon in the
          popover, to sample any color on your screen (Chromium browsers only; the button is
          absent elsewhere).
        </Text>
        <LivePreview>
          <ColorPicker allowEyedropper defaultValue="#0066cc" aria-label="Pick from screen" />
        </LivePreview>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
