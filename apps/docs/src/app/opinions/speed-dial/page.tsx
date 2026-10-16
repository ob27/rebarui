"use client";

import { Card, Heading, SpeedDial, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { PROJECTS, STATUS_TONE } from "@/fixtures/tideline";

const ACTIONS = [
  { label: "New task", onSelect: () => {} },
  { label: "New project", onSelect: () => {} },
  { label: "Upload file", onSelect: () => {} },
];
const PEN = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20L15.5 8.5a2.121 2.121 0 0 0-3-3L1 17v3h3zM14 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const corner = { position: "relative", height: 230, borderRadius: 8, background: "var(--rebar-color-tint-3)" } as const;

const CODE = `<SpeedDial
  actions={[
    { label: "New task", onSelect: addTask },
    { label: "New project", onSelect: addProject },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SpeedDial"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="speed-dial"`, `data-rebar-direction`; the trigger and each action carry `data-rebar-part="trigger" | "action"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `FloatButton.Group` (with `trigger=\"click\"`) is a close direct equivalent.",
      },
    ],
  },
];

export default function SpeedDialPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SpeedDial</Heading>
      <Text color="secondary">A floating button that opens into a short list of labelled actions.</Text>

      <DemoStage
        title="Create menu"
        caption="Click the button to fan out the actions"
        code={CODE}
        states={[
          { label: "Custom icon", node: <div style={corner}><div style={{ position: "absolute", bottom: 16, right: 16 }}><SpeedDial icon={PEN} actions={ACTIONS.slice(0, 2)} /></div></div> },
          { label: "Opens left", node: <div style={corner}><div style={{ position: "absolute", bottom: 16, right: 16 }}><SpeedDial direction="left" actions={ACTIONS.slice(0, 2)} /></div></div> },
        ]}
      >
        <div style={corner}>
          <div style={{ position: "absolute", bottom: 16, right: 16 }}>
            <SpeedDial actions={ACTIONS} />
          </div>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects tab" caption="The button floats above the tab bar, closed and open" widths={false} padding="none">
        <Stack direction="row" gap="lg" align="start" justify="center" style={{ flexWrap: "wrap", padding: 24 }}>
          {[false, true].map((open) => (
            <TidelinePhone
              key={String(open)}
              title="Projects"
              tabs={1}
              height={470}
              dim={open}
              overlay={
                <div style={{ position: "absolute", right: 16, bottom: 76, zIndex: 1002 }}>
                  <SpeedDial defaultOpen={open} actions={[...ACTIONS, { label: "Log hours", onSelect: () => {} }]} />
                </div>
              }
            >
              <Stack gap="sm">
                {PROJECTS.slice(0, 4).map((p) => (
                  <Card key={p.id} title={p.name} subtitle={`${p.kicker}, due ${p.due}`} extra={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>} />
                ))}
              </Stack>
            </TidelinePhone>
          ))}
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
