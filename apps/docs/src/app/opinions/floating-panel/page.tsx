"use client";

import { Avatar, FloatingPanel, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { PROJECTS, STATUS_TONE, avatarOf } from "@/fixtures/tideline";

const CODE = `<FloatingPanel anchors={[80, 200, 320]} defaultHeight={200} header={<Heading level={3}>Projects</Heading>}>
  <Text size="sm">Drag the bar, or focus it and use the arrow keys.</Text>
</FloatingPanel>`;

const AREA = { position: "relative", overflow: "hidden", border: "1px solid var(--rebar-color-border)", borderRadius: 12, background: "var(--rebar-color-tint-3)" } as const;

function ProjectList({ count = 5 }: { count?: number }) {
  return (
    <Stack gap="sm">
      {PROJECTS.slice(0, count).map((p) => (
        <Stack key={p.id} direction="row" gap="sm" align="center">
          <Avatar {...avatarOf(p.owner)} size="sm" />
          <Text size="sm" style={{ flex: 1 }}>{p.name}</Text>
          <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
        </Stack>
      ))}
    </Stack>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FloatingPanel"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="floating-panel"`; `data-rebar-dragging`; `data-rebar-part="handle"|"content"`.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Ant Design (web) has no direct equivalent — this ports antd-**mobile**'s `FloatingPanel`. A migration typically hand-rolls the same anchor-snap drag pattern, or a fixed `Drawer` if the multi-height behavior isn't actually needed.",
      },
    ],
  },
];

export default function FloatingPanelPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FloatingPanel</Heading>
      <Text color="secondary">A sheet you drag between a few set heights, snapping on release.</Text>

      <DemoStage
        title="Projects sheet"
        caption="Drag the bar, or use the arrow keys on it"
        code={CODE}
        states={[
          {
            label: "Starts collapsed",
            node: (
              <div style={{ ...AREA, height: 200 }}>
                <FloatingPanel anchors={[60, 160]} defaultHeight={60} style={{ position: "absolute" }} header={<Heading level={3}>Projects</Heading>} aria-label="Collapsed panel">
                  <ProjectList count={2} />
                </FloatingPanel>
              </div>
            ),
          },
          {
            label: "From the top",
            node: (
              <div style={{ ...AREA, height: 200 }}>
                <FloatingPanel anchors={[60, 140]} placement="top" defaultHeight={140} style={{ position: "absolute" }} header={<Heading level={3}>Filters</Heading>} aria-label="Top panel">
                  <Text size="sm">Status, owner, due date.</Text>
                </FloatingPanel>
              </div>
            ),
          },
        ]}
      >
        <div style={{ ...AREA, height: 360 }}>
          <FloatingPanel anchors={[80, 200, 320]} defaultHeight={200} style={{ position: "absolute" }} header={<Heading level={3}>Projects</Heading>} aria-label="Projects">
            <ProjectList />
          </FloatingPanel>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Depot map" caption="A details sheet over a map-style screen" padding="none" widths={false}>
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <TidelinePhone
            title="Northern depots"
            tabs={1}
            padding={0}
            overlay={
              <FloatingPanel anchors={[90, 200, 330]} defaultHeight={200} style={{ position: "absolute", bottom: 56 }} header={<Heading level={3}>Depot signage</Heading>} aria-label="Depot details">
                <ProjectList count={3} />
              </FloatingPanel>
            }
          >
            <div className="cs-grain" style={{ height: "100%", background: "var(--rebar-color-tint-3)" }} />
          </TidelinePhone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
