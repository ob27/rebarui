"use client";

import { useRef } from "react";
import { Card, Heading, ScrollMask, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, TAGS } from "@/fixtures/tideline";

const CODE = `const scrollRef = useRef<HTMLDivElement>(null);

<div style={{ position: "relative" }}>
  <ScrollMask scrollTrackRef={scrollRef} />
  <div ref={scrollRef} style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
    {projects.map((p) => <Tag key={p.id}>{p.name}</Tag>)}
  </div>
</div>`;

const ROW: React.CSSProperties = { overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: 8, padding: "6px 0" };

function MaskedRow({ children, maxWidth = 360 }: { children: React.ReactNode; maxWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: "relative", maxWidth }}>
      <ScrollMask scrollTrackRef={ref} />
      <div ref={ref} style={ROW}>{children}</div>
    </div>
  );
}

const chips = PROJECTS.map((p) => <Tag key={p.id} tone={STATUS_TONE[p.status]}>{p.name}</Tag>);

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ScrollMask"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="scroll-mask"`; `data-rebar-part="start"|"end"`.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Ant Design (web) has no direct equivalent — this ports antd-**mobile**'s `ScrollMask`. A migration typically hand-rolls the same scroll-listener-plus-gradient-overlay pattern, or drops the affordance entirely if the design doesn't need it.",
      },
    ],
  },
];

export default function ScrollMaskPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ScrollMask</Heading>
      <Text color="secondary">Soft edge fades on a scrolling row, showing there is more to see past either end.</Text>

      <DemoStage
        title="Project chips"
        caption="Scroll sideways: the fade shows only on the side with more"
        code={CODE}
        states={[
          { label: "Fits, no fade", node: <MaskedRow maxWidth={420}>{chips.slice(0, 2)}</MaskedRow> },
          { label: "Tags", node: <MaskedRow maxWidth={200}>{TAGS.map((t) => <Tag key={t}>{t}</Tag>)}</MaskedRow> },
        ]}
      >
        <MaskedRow maxWidth={320}>{chips}</MaskedRow>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Filter row" caption="Project filters above a task list" widths={false}>
        <Card title="Tasks" subtitle="Filter by project">
          <Stack gap="sm">
            <MaskedRow maxWidth={420}>{[<Tag key="all">All projects</Tag>, ...chips]}</MaskedRow>
            <Text size="sm" color="secondary">7 tasks across 5 projects.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
