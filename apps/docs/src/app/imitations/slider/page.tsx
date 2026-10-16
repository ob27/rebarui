"use client";

import { Avatar, Card, Heading, Slider, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf, gbp } from "@/fixtures/tideline";
import { useState } from "react";

const CODE = `<Slider value={value} onValueChange={setValue} min={0} max={100} step={5} aria-label="Budget" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Slider"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="slider"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "AntD's `Slider` takes the same `value`/`onChange`/`min`/`max`/`step` shape — a close, low-risk rename." },
    ],
  },
];

export default function SliderPage() {
  const [value, setValue] = useState(50);
  const [done, setDone] = useState(61);

  return (
    <Stack gap="lg">
      <Heading level={1}>Slider</Heading>
      <Text color="secondary">A single-value slider.</Text>

      <DemoStage title="Budget cap" caption="Drag, or use the arrow keys, Home and End" code={CODE} widths={false}
        states={[
          { label: "Disabled", node: <div style={{ width: 200 }}><Slider defaultValue={30} disabled aria-label="Disabled" /></div> },
          { label: "At minimum", node: <div style={{ width: 200 }}><Slider defaultValue={0} aria-label="At minimum" /></div> },
          { label: "At maximum", node: <div style={{ width: 200 }}><Slider defaultValue={100} aria-label="At maximum" /></div> },
        ]}
      >
        <Stack gap="sm" style={{ maxWidth: 360 }}>
          <Stack direction="row" justify="between">
            <Text size="sm" color="secondary">Harbour rebrand budget</Text>
            <Text size="sm">{gbp(value * 1000)}</Text>
          </Stack>
          <Slider value={value} onValueChange={setValue} min={0} max={100} step={5} aria-label="Budget in thousands of pounds" />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Set progress" caption="A card that moves a project's percent complete" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Update progress" avatar={<Avatar {...avatarOf("jonas")} />} subtitle="Jonas Weber, Tideline mobile">
          <Stack gap="sm">
            <Stack direction="row" justify="between">
              <Text size="sm" color="secondary">Complete</Text>
              <Text size="sm">{done}%</Text>
            </Stack>
            <Slider value={done} onValueChange={setDone} aria-label="Percent complete" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
