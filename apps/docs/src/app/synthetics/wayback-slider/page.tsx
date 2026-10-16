"use client";

import { useState } from "react";
import { Card, Heading, Stack, Tag, Text, WaybackSlider } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const DATES = [new Date(2026, 9, 5), new Date(2026, 9, 12), new Date(2026, 9, 19)];

const CODE = `<WaybackSlider
  dates={[new Date(2026, 9, 5), new Date(2026, 9, 12), new Date(2026, 9, 19)]}
  value={reportDate}
  onValueChange={setReportDate}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["WaybackSlider"] ?? [] },
  {
    type: "doc-section",
    heading: "How it pairs",
    body: [{ kind: "text", text: "It only knows a list of dates. Keep one copy of your data per date and feed the one the slider reports into `GanttChart` or `PertChart`. Built on the real `Slider`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="wayback-slider"` on the root; parts: `current-date`, `latest-badge`, `ticks`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD's `Slider` with `marks` is the closest shape; it has no snapshot-scrubbing pattern." }],
  },
];

const SNAPSHOTS = [62, 73, 84];

export default function WaybackSliderPage() {
  const harbour = project("harbour");
  const [reportDate, setReportDate] = useState<Date>(DATES[DATES.length - 1]!);
  const [early, setEarly] = useState<Date>(DATES[0]!);
  const idx = DATES.findIndex((d) => d.getTime() === reportDate.getTime());
  return (
    <Stack gap="lg">
      <Heading level={1}>WaybackSlider</Heading>
      <Text color="secondary">A scrubber over a list of past report dates.</Text>

      <DemoStage
        title="Weekly report date"
        caption="Drag or use the arrow keys to move between reports"
        code={CODE}
        states={[
          { label: "Earliest selected", node: <WaybackSlider dates={DATES} value={early} onValueChange={setEarly} aria-label="Report date" /> },
          { label: "Two dates", node: <WaybackSlider dates={DATES.slice(1)} aria-label="Report date" /> },
          { label: "Short format", node: <WaybackSlider dates={DATES} dateFormat={(d) => `${d.getDate()} Oct`} aria-label="Report date" /> },
        ]}
      >
        <WaybackSlider dates={DATES} value={reportDate} onValueChange={setReportDate} aria-label="Report date" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project history" caption="Scrub the weekly report to see how far along the project was" widths={false}>
        <Card title={harbour.name} style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="md">
            <WaybackSlider dates={DATES} value={reportDate} onValueChange={setReportDate} aria-label="Report date" />
            <Stack direction="row" gap="sm" align="center">
              <Tag tone={idx === DATES.length - 1 ? "success" : "info"}>{idx === DATES.length - 1 ? "Latest" : "Past report"}</Tag>
              <Text size="sm">{SNAPSHOTS[Math.max(idx, 0)]}% complete, due {harbour.due}</Text>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
