"use client";

import { useState } from "react";
import { Card, Heading, NumberInput, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<NumberInput defaultValue={5} min={0} max={10} aria-label="Reviewers" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["NumberInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Constraints",
    body: [{ kind: "text", text: "Typed values and the stepper buttons both clamp to `min` and `max`. A stepper at its limit disables itself rather than silently doing nothing. It is a text input underneath, not `type=\"number\"`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="number-input"`; `data-rebar-part` is `"decrement"`, `"input"` or `"increment"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD's `InputNumber` is the structural equivalent; `min`, `max` and `step` match, but formatter and parser callbacks need a hand check." }],
  },
];

export default function NumberInputPage() {
  const mobile = project("mobile");
  const [seats, setSeats] = useState(3);
  return (
    <Stack gap="lg">
      <Heading level={1}>NumberInput</Heading>
      <Text color="secondary">A numeric field with minus and plus steppers.</Text>

      <DemoStage
        title="Reviewers"
        caption="Clamped between 0 and 10"
        code={CODE}
        states={[
          { label: "At minimum", node: <NumberInput value={0} min={0} max={10} aria-label="At minimum" /> },
          { label: "At maximum", node: <NumberInput value={10} min={0} max={10} aria-label="At maximum" /> },
          { label: "Disabled", node: <NumberInput value={4} disabled aria-label="Disabled" /> },
          { label: "Step of 5", node: <NumberInput defaultValue={20} step={5} min={0} aria-label="Step of five" /> },
          { label: "Small", node: <NumberInput size="sm" defaultValue={2} aria-label="Small" /> },
          { label: "Large", node: <NumberInput size="lg" defaultValue={2} aria-label="Large" /> },
        ]}
      >
        <NumberInput defaultValue={5} min={0} max={10} aria-label="Reviewers" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project settings" caption="Reviewers needed before a release" widths={false}>
        <Card title={`${mobile.name} settings`} style={{ maxWidth: 420, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">How many people sign off before {mobile.name} ships on {mobile.due}?</Text>
            <Stack direction="row" gap="sm" align="center">
              <NumberInput value={seats} onChange={setSeats} min={1} max={4} aria-label="Sign-offs required" />
              <Text size="sm">{seats === 1 ? "sign-off" : "sign-offs"} required</Text>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
