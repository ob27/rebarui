"use client";

import { useState } from "react";
import { Avatar, Card, Descriptions, Heading, Stack, Tag, Text } from "rebar-ui";
import type { DescriptionItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { avatarOf, gbp, person, project, STATUS_TONE } from "@/fixtures/tideline";

const harbour = project("harbour");

const CODE = `<Descriptions
  title="Harbour rebrand"
  column={2}
  items={[
    { label: "Project", value: "Harbour rebrand" },
    { label: "Owner", value: "Maya Chen" },
    { label: "Due", value: "24 Oct 2026" },
    { label: "Budget", value: "£48,200" },
    { label: "Summary", value: "Identity, site and launch kit for the harbour trust.", span: 2 },
  ]}
/>`;

const ITEMS: DescriptionItem[] = [
  { label: "Project", value: harbour.name },
  { label: "Owner", value: person(harbour.owner).name },
  { label: "Due", value: `${harbour.due} 2026` },
  { label: "Budget", value: gbp(harbour.budget) },
  { label: "Summary", value: harbour.summary, span: 2 },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Descriptions"] ?? [] },
  {
    type: "doc-section",
    heading: "Editable values",
    body: [
      {
        kind: "text",
        text: "Set `editable` on an item to make its value click-to-edit. The value must be a plain string; anything else stays static. `onItemChange(index, newValue)` fires on commit, and you hold the state, since `Descriptions` keeps none.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "A real `<dl>` with a `<dt>`/`<dd>` pair per item, the structure a screen reader already understands as label/value data." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="descriptions"`, `data-rebar-part="title" | "item"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Descriptions` uses nested `Descriptions.Item` children rather than a flat `items` array, and its `column` can be a responsive object: a structural rewrite, not a mechanical rename.",
      },
    ],
  },
];

export default function DescriptionsPage() {
  const [editable, setEditable] = useState<DescriptionItem[]>([
    { label: "Owner", value: person(harbour.owner).name, editable: true },
    { label: "Due", value: `${harbour.due} 2026`, editable: true },
    { label: "Budget", value: gbp(harbour.budget) },
  ]);

  return (
    <Stack gap="lg">
      <Heading level={1}>Descriptions</Heading>
      <Text color="secondary">A label and value grid for structured details, with optional click-to-edit values.</Text>

      <DemoStage
        title="Project details"
        caption="Two columns, one item spanning both"
        code={CODE}
        states={[
          {
            label: "Editable",
            node: (
              <Descriptions
                title="Click a value"
                column={1}
                items={editable}
                onItemChange={(i, v) => setEditable((prev) => prev.map((it, n) => (n === i ? { ...it, value: v } : it)))}
              />
            ),
          },
          { label: "Empty value", node: <Descriptions title="Signage" column={1} items={[{ label: "Owner", value: "Not assigned" }, { label: "Due", value: "21 Nov 2026" }]} /> },
          { label: "Long value", node: <Descriptions title="Depot signage" column={1} items={[{ label: "Summary", value: "Wayfinding for the three northern depots, including fascia, bay numbers and the ferry-side map." }]} /> },
        ]}
      >
        <Descriptions title={harbour.name} column={2} items={ITEMS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project panel" caption="Details above the activity, on a card and a phone" padding="none" widths={false}>
        <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap", padding: 24 }}>
          <Card title="Harbour rebrand" style={{ flex: "1 1 320px" }}>
            <Stack gap="sm">
              <Stack direction="row" gap="sm" align="center">
                <Avatar {...avatarOf(harbour.owner)} />
                <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
              </Stack>
              <Descriptions title="Details" column={1} items={ITEMS.slice(1, 4)} />
            </Stack>
          </Card>
          <TidelinePhone title="Harbour rebrand" tabs={1} height={400}>
            <Descriptions title="Details" column={1} items={ITEMS.slice(1, 4)} />
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
