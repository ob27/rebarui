"use client";

import { useState } from "react";
import { Button, Calendar, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, project } from "@/fixtures/tideline";

const CODE = `const [date, setDate] = useState<Date>();

<Calendar value={date} onValueChange={setDate} minDate={new Date(2026, 9, 20)} />`;

const MIN = new Date(2026, 9, 20);
const fmt = (d?: Date) => (d ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "No date yet");

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Calendar"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="calendar"`; each day cell carries `data-rebar-part="day"` plus `data-rebar-selected`, `data-rebar-today`, and `data-rebar-outside` (a leading/trailing day from an adjacent month) as boolean attributes.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Calendar` is a close direct equivalent — `value`/`onSelect` map to this component's `value`/`onValueChange`. One real difference to flag, not gloss over: AntD's `Calendar` takes a `dayjs` value, while this component uses a plain native `Date` — a migration needs to wrap the value in `dayjs(value)` at the boundary.",
      },
    ],
  },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 24));
  const [due, setDue] = useState<Date | undefined>(new Date(2026, 9, 28));
  const launch = EVENTS[0];
  const harbour = project("harbour");

  return (
    <Stack gap="lg">
      <Heading level={1}>Calendar</Heading>
      <Text color="secondary">A month grid for picking one date.</Text>

      <DemoStage
        title="Pick a launch date"
        caption="Days before 20 Oct are out of reach"
        code={CODE}
        widths={false}
        states={[
          { label: "Limited to the rest of October", node: <Calendar defaultMonth={new Date(2026, 9, 1)} minDate={MIN} maxDate={new Date(2026, 9, 30)} defaultValue={new Date(2026, 9, 22)} /> },
        ]}
      >
        <Stack gap="sm" style={{ maxWidth: 360, margin: "0 auto" }}>
          <Calendar value={date} onValueChange={setDate} minDate={MIN} />
          <Text size="sm" color="secondary">
            Selected: {fmt(date)}
          </Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Reschedule" caption="Moving the payroll cut-off" widths={false}>
        <Card
          style={{ maxWidth: 420, margin: "0 auto" }}
          title={`Move “${EVENTS[3].title}”`}
          actions={[
            <Button key="cancel" variant="secondary">Cancel</Button>,
            <Button key="save" disabled={!due}>Move to {fmt(due)}</Button>,
          ]}
        >
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center">
              <Tag tone="info">{harbour.name}</Tag>
              <Text size="sm" color="secondary">{launch.title} is on {launch.date}</Text>
            </Stack>
            <Calendar value={due} onValueChange={setDue} minDate={MIN} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
