"use client";

import { Button, Card, Heading, Stack, Text, Toggle } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { useState } from "react";

const CODE = `<Toggle defaultPressed aria-label="Bold">B</Toggle>
<Toggle pressed={watching} onPressedChange={setWatching}>Watching</Toggle>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Toggle"] ?? [] },
  {
    type: "doc-section",
    heading: "Icon-only usage needs an aria-label",
    body: [
      {
        kind: "text",
        text: "Same convention as `Button`: if `children` is icon-only with no visible text, pass an explicit `aria-label` yourself — `Toggle` has no built-in fallback label.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="toggle"`, `data-rebar-pressed` (boolean), `data-rebar-size`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: 'Not codemod-covered — AntD has no direct single-toggle-button primitive of its own (its closest analog is a plain `Button` with `type="primary"` conditionally applied by hand). On migration, a `Toggle` becomes a `Button` whose `type` prop is computed from the pressed state.',
      },
    ],
  },
];

export default function TogglePage() {
  const [watching, setWatching] = useState(true);

  return (
    <Stack gap="lg">
      <Heading level={1}>Toggle</Heading>
      <Text color="secondary">A button that stays pressed or not.</Text>

      <DemoStage title="Text style" caption="Each button keeps its own pressed state" code={CODE} widths={false}
        states={[
          { label: "Pressed", node: <Toggle defaultPressed>Watching</Toggle> },
          { label: "Disabled", node: <Toggle disabled>Watching</Toggle> },
          { label: "Sizes", node: <Stack direction="row" gap="sm" align="center"><Toggle size="sm">Sm</Toggle><Toggle>Md</Toggle><Toggle size="lg">Lg</Toggle></Stack> },
        ]}
      >
        <Stack direction="row" gap="sm">
          <Toggle defaultPressed aria-label="Bold">B</Toggle>
          <Toggle aria-label="Italic">I</Toggle>
          <Toggle aria-label="Underline">U</Toggle>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project header" caption="A Watch toggle beside the primary action" widths={false}>
        <Card style={{ maxWidth: 480, margin: "0 auto" }} title="Harbour rebrand" subtitle="Due 24 Oct">
          <Stack direction="row" gap="sm" align="center" justify="between">
            <Text size="sm" color="secondary">{watching ? "You get an update when tasks move." : "You are not following this project."}</Text>
            <Stack direction="row" gap="sm">
              <Toggle pressed={watching} onPressedChange={setWatching}>{watching ? "Watching" : "Watch"}</Toggle>
              <Button>Share</Button>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
