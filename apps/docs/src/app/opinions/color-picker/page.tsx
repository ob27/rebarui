"use client";

import { useState } from "react";
import { Card, ColorPicker, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `<ColorPicker defaultValue="#0066cc" onChange={(hex) => setLabelColour(hex)} aria-label="Label colour" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ColorPicker"] ?? [] },
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
  const [colour, setColour] = useState("#0066cc");
  return (
    <Stack gap="lg">
      <Heading level={1}>ColorPicker</Heading>
      <Text color="secondary">A swatch that opens preset colours plus the browser&apos;s own picker.</Text>

      <DemoStage
        title="Label colour"
        caption="Presets, or any colour from the native input"
        code={CODE}
        widths={false}
        states={[
          { label: "Sizes", node: (
            <Stack direction="row" gap="md" align="center">
              <ColorPicker size="sm" defaultValue="#d32f2f" aria-label="Small" />
              <ColorPicker size="md" defaultValue="#2e7d32" aria-label="Medium" />
              <ColorPicker size="lg" defaultValue="#7b1fa2" aria-label="Large" />
            </Stack>
          ) },
          { label: "Recent colours only", node: <ColorPicker mode="recent" size="sm" defaultValue="#0066cc" aria-label="Recent colours" /> },
          { label: "With eyedropper", node: <ColorPicker allowEyedropper defaultValue="#0066cc" aria-label="Pick from screen" /> },
          { label: "Disabled", node: <ColorPicker disabled defaultValue="#0066cc" aria-label="Disabled" /> },
        ]}
      >
        <Stack direction="row" gap="md" align="center">
          <ColorPicker defaultValue="#0066cc" aria-label="Label colour" />
          <Text size="sm" color="secondary">Harbour rebrand</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project colours" caption="One swatch per project" widths={false}>
        <Card style={{ maxWidth: 460, margin: "0 auto" }} title="Project colours">
          <Stack gap="sm">
            {PROJECTS.slice(0, 3).map((p, i) => (
              <Stack key={p.id} direction="row" gap="md" align="center">
                <ColorPicker size="sm" value={i === 0 ? colour : undefined} defaultValue={["#0066cc", "#2e7d32", "#c2410c"][i]} onChange={i === 0 ? setColour : undefined} aria-label={`${p.name} colour`} />
                <Text style={{ flex: 1 }}>{p.name}</Text>
                <Tag>{p.kicker}</Tag>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
