"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { DeviceFrame, Heading, Stack, Steps, Text } from "rebar-ui";
import type { StepItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, person } from "@/fixtures/tideline";

const launch = EVENTS[0]!;

const RELEASE: StepItem[] = [
  { title: "Brief", description: person("maya").name },
  { title: "Design", description: launch.date },
  { title: "Review", description: person("priya").name },
  { title: "Ship", description: "25 Oct" },
];

const CODE = `<Steps
  current={1}
  items={[
    { title: "Brief", description: "Maya Chen" },
    { title: "Design", description: "24 Oct" },
    { title: "Review", description: "Priya Nair" },
    { title: "Ship", description: "25 Oct" },
  ]}
/>`;

const PHONE_STYLE = {
  margin: "0 auto",
  "--rebar-device-frame-max-width": "300px",
  "--rebar-device-frame-bezel-color": "var(--rebar-color-bg-inverse)",
  "--rebar-device-frame-status-bg": "var(--rebar-color-bg-inverse)",
} as CSSProperties;

function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DeviceFrame variant="phone" style={PHONE_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
        <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "8px 18px 14px", fontFamily: "var(--rebar-font-family-display)", fontWeight: "var(--rebar-font-weight-semibold)", fontSize: "1.1rem" }}>{title}</div>
        <div style={{ flex: 1, padding: 18 }}>{children}</div>
      </div>
    </DeviceFrame>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Steps"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`current` (an index) derives each step\'s status: before it "finish" (✓), at it "process", after it "wait"; the active step is marked `aria-current="step"`. Any item can set its own `status` (including `"error"`). With `onItemClick` every step is a real button.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="steps"`, `data-rebar-direction`, `data-rebar-part="item" | "icon" | "content"`, `data-rebar-status="wait" | "process" | "finish" | "error"` on each item.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "AntD's `Steps` takes the same `items`/`current`/`direction` shape almost verbatim. Not yet codemod-covered." },
    ],
  },
];

function Clickable() {
  const [current, setCurrent] = useState(1);
  return <Steps current={current} direction="vertical" items={RELEASE.slice(0, 3)} onItemClick={setCurrent} />;
}

export default function StepsPage() {
  const errored: StepItem[] = [RELEASE[0]!, { ...RELEASE[1]!, status: "error" }, RELEASE[2]!];
  return (
    <Stack gap="lg">
      <Heading level={1}>Steps</Heading>
      <Text color="secondary">Where you are in a sequence.</Text>

      <DemoStage
        title="Release path"
        caption="Horizontal and vertical"
        code={CODE}
        states={[
          { label: "Error", node: <Steps current={1} direction="vertical" items={errored} /> },
          { label: "Complete", node: <Steps current={3} direction="vertical" items={RELEASE.slice(0, 3)} /> },
          { label: "Clickable", node: <Clickable /> },
        ]}
      >
        <Stack direction="row" gap="xl" align="start" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 360px", minWidth: 0 }}>
            <Steps current={1} items={RELEASE} />
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <Steps current={2} direction="vertical" items={RELEASE} />
          </div>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="New project" caption="A wizard's progress on a phone" padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <Phone title="New project">
            <Stack gap="md">
              <Heading level={3}>Step 2 of 4</Heading>
              <Steps current={1} direction="vertical" items={[{ title: "Name" }, { title: "Crew" }, { title: "Dates" }, { title: "Review" }]} />
            </Stack>
          </Phone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
