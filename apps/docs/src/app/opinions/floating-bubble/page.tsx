"use client";

import { FloatingBubble, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone, PhoneList, PhoneRow } from "@/app/imitations/device-frame/TidelinePhone";
import { TASKS, person, project } from "@/fixtures/tideline";

const CODE = `<FloatingBubble axis="xy" magnetic="x" style={{ bottom: 24, right: 24 }} onClick={() => newTask()}>
  +
</FloatingBubble>`;

const AREA = { position: "relative", height: 150, overflow: "hidden", border: "1px solid var(--rebar-color-border)", borderRadius: 12, background: "var(--rebar-color-tint-3)" } as const;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FloatingBubble"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="floating-bubble"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Ant Design (web) has no direct equivalent — this ports antd-**mobile**'s `FloatingBubble`. A migration typically hand-rolls the same pointer-drag-plus-magnetic-snap pattern, or drops the drag affordance for a fixed-position button if the design doesn't need it.",
      },
    ],
  },
];

export default function FloatingBubblePage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>FloatingBubble</Heading>
      <Text color="secondary">A round button you can drag anywhere, optionally snapping to the nearest edge.</Text>

      <DemoStage
        title="Quick-add bubble"
        caption="Drag it around; a tap still clicks"
        code={CODE}
        widths={false}
        states={[
          { label: "Horizontal only", node: <div style={AREA}><FloatingBubble axis="x" style={{ position: "absolute", bottom: 16, left: 16 }}>+</FloatingBubble></div> },
          { label: "Vertical only, snaps to edge", node: <div style={AREA}><FloatingBubble axis="y" magnetic="y" style={{ position: "absolute", top: 16, right: 16 }}>+</FloatingBubble></div> },
        ]}
      >
        <div style={{ ...AREA, height: 220 }}>
          <Stack gap="xs" style={{ padding: 16 }}>
            <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{harbour.name}</Text>
            <Text size="sm" color="secondary">{harbour.summary}</Text>
          </Stack>
          <FloatingBubble axis="xy" magnetic="x" style={{ position: "absolute", bottom: 16, right: 16 }}>+</FloatingBubble>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Tasks on a phone" caption="A quick-add bubble above the tab bar" padding="none" widths={false}>
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <TidelinePhone
            title="My tasks"
            tabs={1}
            overlay={<FloatingBubble axis="xy" magnetic="x" style={{ position: "absolute", bottom: 80, right: 16 }}>+</FloatingBubble>}
          >
            <PhoneList>
              {TASKS.slice(0, 5).map((t, i) => (
                <PhoneRow key={t.id} title={t.title} meta={`${person(t.assignee).name} · ${project(t.project).name}`} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
              ))}
            </PhoneList>
          </TidelinePhone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
