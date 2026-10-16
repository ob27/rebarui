"use client";

import { Avatar, Card, CalendarHeatmap, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { WEEKLY_DONE, avatarOf, person } from "@/fixtures/tideline";

const CODE = `<CalendarHeatmap
  title="Tasks finished per day"
  startDate="2026-08-03"
  endDate="2026-10-25"
  data={[{ date: "2026-08-03", value: 4 }, { date: "2026-08-04", value: 3 }, /* ... */]}
/>`;

/** Weekly totals from Tideline spread over the days of each week: weekdays carry the work, weekends are quiet, a few days are missing. */
function tasksPerDay(scale = 1) {
  const data: { date: string; value: number }[] = [];
  const start = Date.UTC(2026, 7, 3);
  WEEKLY_DONE.forEach((total, w) => {
    const shape = [0.24, 0.2, 0.22, 0.18, 0.16, 0, 0];
    shape.forEach((share, d) => {
      const wobble = ((w * 7 + d * 3) % 4) - 1;
      const value = Math.max(0, Math.round(total * share * scale) + (share ? wobble : 0));
      if (share === 0 && (w + d) % 3) return;
      data.push({ date: new Date(start + (w * 7 + d) * 86_400_000).toISOString().slice(0, 10), value });
    });
  });
  return data;
}

const DATA = tasksPerDay();
const QUIET = tasksPerDay(0.35);

/** Pale tint to the action colour. */
const SCALE = (t: number): string => `color-mix(in srgb, var(--rebar-color-primary) ${Math.round(Math.max(0, Math.min(1, t)) * 100)}%, var(--rebar-color-tint-3))`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["CalendarHeatmap"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="calendar-heatmap"` on the root `<figure>`; `data-rebar-part="cell"` on a real day, `"cell-missing"` on a day absent from `data`.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically maps directly to whatever charting library's own calendar-heatmap chart the target project uses.",
      },
    ],
  },
];

export default function CalendarHeatmapPage() {
  const maya = person("maya");
  return (
    <Stack gap="lg">
      <Heading level={1}>CalendarHeatmap</Heading>
      <Text color="secondary">One small cell per day, shaded by that day&apos;s value.</Text>

      <DemoStage
        title="Tasks finished per day"
        caption="3 Aug to 25 Oct, the whole studio"
        code={CODE}
        states={[
          { label: "Hexagon cells", node: <CalendarHeatmap title="Honeycomb" data={DATA} startDate="2026-09-07" endDate="2026-10-25" cellShape="hexagon" cellSize={16} colorScale={SCALE} /> },
          { label: "Quiet stretch", node: <CalendarHeatmap title="Quiet weeks" data={QUIET.slice(0, 20)} startDate="2026-08-03" endDate="2026-10-25" cellSize={10} /> },
          { label: "No data", node: <CalendarHeatmap title="Nothing logged" data={[]} startDate="2026-10-05" endDate="2026-10-25" /> },
        ]}
      >
        <CalendarHeatmap title="Tasks finished per day" data={DATA} startDate="2026-08-03" endDate="2026-10-25" colorScale={SCALE} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Person profile" caption="A crew member's last twelve weeks" widths={false}>
        <Card style={{ maxWidth: 640, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" gap="md" align="center">
              <Avatar {...avatarOf("maya")} size="lg" />
              <Stack gap="xs" style={{ flex: 1 }}>
                <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{maya.name}</Text>
                <Text size="sm" color="secondary">{maya.role}</Text>
              </Stack>
              <Tag tone="success">Online</Tag>
            </Stack>
            <CalendarHeatmap title="Tasks finished" data={DATA} startDate="2026-08-03" endDate="2026-10-25" colorScale={SCALE} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
