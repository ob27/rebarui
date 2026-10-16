"use client";

import { Button, Card, Heading, Stack, Text, Watermark } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { gbp, project } from "@/fixtures/tideline";

const CODE = `<Watermark text="CONFIDENTIAL">
  <Card title="Harbour rebrand">...</Card>
</Watermark>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Watermark"] ?? [] },
  {
    type: "doc-section",
    heading: "Also available as a prop",
    body: [
      {
        kind: "text",
        text: "`Card` and `AspectRatio` both take a `watermark` prop that wraps their own content in this component internally — the two most common places a real watermark is needed (a document/content card, a licensed or draft image) don't need the caller to reach for `Watermark` directly.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="watermark"` on the root; the overlay itself carries `data-rebar-part="overlay"` and `aria-hidden="true"` — it never blocks interaction with, or gets announced as part of, the real content.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Watermark` is a close structural match (`content`/`image`/`gap`/`rotate`/`font`) — a migration maps these props across directly.",
      },
    ],
  },
];

export default function WatermarkPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Watermark</Heading>
      <Text color="secondary">A repeating diagonal mark laid over its children.</Text>

      <DemoStage title="Draft proof" caption="The overlay never blocks clicks or text selection" code={CODE} widths={false}
        states={[
          { label: "Sparse and steep", node: <div style={{ width: 200 }}><Watermark text="DRAFT" gap={[120, 90]} rotate={-35}><div style={{ height: 110, background: "var(--rebar-color-tint-3)", borderRadius: 6 }} /></Watermark></div> },
          { label: "Subtle", node: <div style={{ width: 200 }}><Watermark text="Tideline" opacity={0.08}><div style={{ height: 110, background: "var(--rebar-color-tint-3)", borderRadius: 6 }} /></Watermark></div> },
        ]}
      >
        <div style={{ maxWidth: 360 }}>
          <Watermark text="CONFIDENTIAL">
            <Card title={harbour.name} subtitle="Launch plan">
              <Text size="sm" color="secondary">Budget {gbp(harbour.budget)}. Not for distribution before {harbour.due}.</Text>
            </Card>
          </Watermark>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Signage proof" caption="Sent to the printer with a mark until it is approved" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }} title="depot-fascia-final.pdf" subtitle="Depot signage, 1.4 MB" watermark="PROOF" actions={[<Button key="ok">Approve</Button>, <Button key="chg" variant="secondary">Request changes</Button>]}>
          <div className="cs-grain" style={{ height: 160, borderRadius: 6 }} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
