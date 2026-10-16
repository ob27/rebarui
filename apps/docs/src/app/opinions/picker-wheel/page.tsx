"use client";

import { useState } from "react";
import { Button, Card, Heading, PickerWheel, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneSheet, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { EVENTS, project } from "@/fixtures/tideline";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ["00", "15", "30", "45"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CODE = `const [hour, setHour] = useState("9");

<PickerWheel options={HOURS} value={hour} onValueChange={setHour} aria-label="Hour" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PickerWheel"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="picker-wheel"`; parts: `track`, `option` (selected one carries `data-rebar-selected`), `highlight`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD (the web-focused library) has no direct equivalent — a spinning-wheel picker is a mobile-native pattern (Cupertino's `UIPickerView`, React Native's `Picker`). antd-mobile's `PickerView` is the closer sibling library if the migration target is genuinely mobile.",
      },
    ],
  },
];

export default function PickerWheelPage() {
  const [value, setValue] = useState("9");
  return (
    <Stack gap="lg">
      <Heading level={1}>PickerWheel</Heading>
      <Text color="secondary">A spinning-wheel value selector. Drag, scroll, or click any visible option.</Text>

      <DemoStage
        title="Hour"
        caption="Spin to 9 for the harbour launch"
        code={CODE}
        widths={false}
        states={[
          { label: "Minutes", node: <div style={{ width: 120 }}><PickerWheel options={MINUTES} defaultValue="30" aria-label="Minutes" /></div> },
          { label: "Days", node: <div style={{ width: 120 }}><PickerWheel options={DAYS} defaultValue="Fri" aria-label="Day" /></div> },
          { label: "Three rows", node: <div style={{ width: 120 }}><PickerWheel options={HOURS} defaultValue="4" visibleCount={3} aria-label="Hour" /></div> },
        ]}
      >
        <Stack gap="sm" style={{ maxWidth: 200 }}>
          <PickerWheel options={HOURS} value={value} onValueChange={setValue} aria-label="Hour" />
          <Text size="sm" color="secondary">Selected: {value}</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Reminder time" caption="Setting a reminder for the launch, on a phone" widths={false} padding="none">
        <Stack direction="row" gap="lg" align="start" justify="center" style={{ flexWrap: "wrap", padding: 24 }}>
          <TidelinePhone title="Calendar" tabs={2} height={470}>
            <Stack gap="sm">
              {EVENTS.map((e) => (
                <Card key={e.id} title={e.title} subtitle={`${e.date}${e.time ? `, ${e.time}` : ""}`} extra={<Tag>{project(e.project).name}</Tag>} />
              ))}
            </Stack>
          </TidelinePhone>
          <TidelinePhone
            title="Calendar"
            tabs={2}
            height={470}
            dim
            overlay={
              <PhoneSheet title="Remind me at" footer={<Button style={{ width: "100%" }}>Set reminder</Button>}>
                <Stack direction="row" gap="sm" justify="center">
                  <div style={{ width: 90 }}><PickerWheel options={HOURS} defaultValue="8" aria-label="Hour" /></div>
                  <div style={{ width: 90 }}><PickerWheel options={MINUTES} defaultValue="30" aria-label="Minutes" /></div>
                </Stack>
              </PhoneSheet>
            }
          >
            <Stack gap="sm">
              <Card title={EVENTS[0].title} subtitle={`${EVENTS[0].date}, ${EVENTS[0].time}`} />
            </Stack>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
