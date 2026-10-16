"use client";

import { useState } from "react";
import { Card, Heading, Stack, Text, TimePicker } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, project } from "@/fixtures/tideline";

const CODE = "const [time, setTime] = useState(\"09:00\");\n\n<TimePicker value={time} onValueChange={setTime} minuteStep={15} />";


const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TimePicker"] ?? [] },
  {
    type: "doc-section",
    heading: "Value and display",
    body: [{ kind: "text", text: "`value` is always 24-hour `\"HH:MM\"`; `format` only changes how the label and hour list read." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"time-picker\"` on the trigger; `data-rebar-part=\"panel\"|\"hours\"|\"minutes\"|\"hour\"|\"minute\"|\"period-toggle\"|\"period-am\"|\"period-pm\"`, with `data-rebar-selected` on the picked hour, minute or period." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `TimePicker` is a close equivalent (`minuteStep` maps directly). It takes a `dayjs` value; this one uses a plain `\"HH:MM\"` string, so convert at the boundary." }],
  },
];

export default function TimePickerPage() {
  const [time, setTime] = useState("09:00");
  const review = EVENTS[1];
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("15:00");
  return (
    <Stack gap="lg">
      <Heading level={1}>TimePicker</Heading>
      <Text color="secondary">A trigger that opens scrollable hour and minute columns.</Text>

      <DemoStage title="Start time" caption="Pick an hour, then a minute; both apply at once" code={CODE} widths={false}
        states={[
          { label: "Default", node: <TimePicker aria-label="Empty time" /> },
          { label: "12-hour", node: <TimePicker defaultValue="14:30" format="12h" minuteStep={15} /> },
          { label: "5-minute steps", node: <TimePicker defaultValue="09:05" minuteStep={5} /> },
        ]}>
        <Stack gap="sm" align="start">
          <TimePicker value={time} onValueChange={setTime} minuteStep={15} />
          <Text size="sm" color="secondary">Selected: {time}</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Schedule a review" caption="Start and end of the mobile design review" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title={review.title} subtitle={`${review.date}, ${project(review.project).name}`}>
          <Stack direction="row" gap="lg" align="center" style={{ flexWrap: "wrap" }}>
            <Stack gap="xs"><Text size="xs" color="secondary">Starts</Text><TimePicker value={start} onValueChange={setStart} minuteStep={15} /></Stack>
            <Stack gap="xs"><Text size="xs" color="secondary">Ends</Text><TimePicker value={end} onValueChange={setEnd} minuteStep={15} /></Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
