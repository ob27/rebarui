"use client";

import { Avatar, Card, Heading, SegmentedControl, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { HOURS_BY_PERSON, PROJECTS, avatarOf, person } from "@/fixtures/tideline";
import { useState } from "react";

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];
const VIEWS = [
  { value: "me", label: "Me" },
  { value: "team", label: "Team" },
];
const CODE = `<SegmentedControl options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} defaultValue="week" aria-label="Calendar range" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SegmentedControl"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real ARIA radio group: arrow keys (not Tab) move the selection between segments, Home/End jump to the first/last, matching the WAI-ARIA Authoring Practices radio-group pattern — the same keyboard model native radio buttons have.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="segmented-control"`; `data-rebar-part="item"` per option, `data-rebar-active` on the selected one.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: 'A close, low-risk rename — AntD\'s `Segmented` takes the same `options`/`value` shape.' },
    ],
  },
];

export default function SegmentedControlPage() {
  const [range, setRange] = useState("week");
  const [view, setView] = useState("me");

  return (
    <Stack gap="lg">
      <Heading level={1}>SegmentedControl</Heading>
      <Text color="secondary">A compact row of segments where exactly one is selected.</Text>

      <DemoStage title="Calendar range" caption="Arrow keys move the selection, Home and End jump" code={CODE} widths={false}
        states={[
          { label: "Disabled", node: <SegmentedControl options={OPTIONS} defaultValue="week" disabled aria-label="Range, disabled" /> },
          { label: "Two options", node: <SegmentedControl options={OPTIONS.slice(0, 2)} defaultValue="day" aria-label="Day or week" /> },
          { label: "Long labels", node: <SegmentedControl options={PROJECTS.slice(0, 3).map((p) => ({ value: p.id, label: p.name }))} defaultValue="mobile" aria-label="Project" /> },
        ]}
      >
        <SegmentedControl options={OPTIONS} value={range} onValueChange={setRange} aria-label="Calendar range" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Hours" caption="Switch the card between this week and the whole team" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Hours logged" extra={<SegmentedControl options={VIEWS} value={view} onValueChange={setView} aria-label="Whose hours" />}>
          <Stack gap="sm">
            {HOURS_BY_PERSON.filter((h) => view === "team" || h.person === "maya").map((h) => (
              <Stack key={h.person} direction="row" gap="sm" align="center" justify="between">
                <Stack direction="row" gap="sm" align="center">
                  <Avatar size="sm" {...avatarOf(h.person)} />
                  <Text size="sm">{person(h.person).name}</Text>
                </Stack>
                <Text size="sm" color="secondary">{h.hours} h</Text>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
