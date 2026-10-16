import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{
  type: "comparison",
  leftLabel: "Before",
  leftBlocks: [{ type: "checklist", heading: "Launch checklist", items: ["Brand palette signed off"] }],
  rightLabel: "After",
  rightBlocks: [{ type: "callout", tone: "success", title: "Ready for 24 Oct" }],
}`;

const MAIN: Construct[] = [
  {
    type: "comparison",
    leftLabel: "Harbour rebrand: to do",
    leftBlocks: [
      { type: "checklist", heading: "Launch checklist", items: ["Brand palette signed off", "Icon audit finished", "Homepage copy approved", "Van livery photographed"] },
    ],
    rightLabel: "Harbour rebrand: status",
    rightBlocks: [
      { type: "callout", tone: "success", title: "On track for 24 Oct", subtitle: "84% complete, owner Maya Chen" },
      { type: "stats-table", headers: ["Task", "Owner", "Due"], rows: [["Harbour homepage", "Maya Chen", "Fri"], ["Launch checklist", "Priya Nair", "Fri"]] },
    ],
  },
];

const EMPTY: Construct[] = [
  { type: "comparison", leftLabel: "Open", leftBlocks: [{ type: "checklist", items: ["Book crew interviews"] }], rightLabel: "Done", rightBlocks: [{ type: "callout", tone: "info", title: "Nothing here yet" }] },
];

const IN_CONTEXT: Construct[] = [
  {
    type: "comparison",
    leftLabel: "Tideline mobile",
    leftBlocks: [
      { type: "callout", tone: "info", title: "In review", subtitle: "61% complete, due 7 Nov" },
      { type: "checklist", items: ["Offline sync for tasks", "Quiet inbox", "Crew sign-in"] },
    ],
    rightLabel: "Depot signage",
    rightBlocks: [
      { type: "callout", tone: "info", title: "In review", subtitle: "48% complete, due 21 Nov" },
      { type: "checklist", items: ["Depot fascia final", "Wayfinding map", "Print proofs"] },
    ],
  },
];

const BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Shape", body: [{ kind: "code", code: `{ type: "comparison", leftLabel: string, leftBlocks: Block[], rightLabel: string, rightBlocks: Block[] }` }] },
  {
    type: "doc-section",
    heading: "Matched heights",
    body: [{ kind: "text", text: "The right panel takes the left panel's measured height, so an embedded `iframe` on either side always matches its sibling." }],
  },
];

export default function ComparisonPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Comparison</Heading>
      <Text color="secondary">Two labelled panels side by side, each holding its own blocks.</Text>

      <DemoStage
        title="Project status"
        caption="A checklist beside a status summary"
        code={CODE}
        states={[
          { label: "Light content", node: <NextBlockRenderer blocks={EMPTY} /> },
        ]}
      >
        <NextBlockRenderer blocks={MAIN} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Two projects" caption="Same shape, one panel each" widths={false}>
        <NextBlockRenderer blocks={IN_CONTEXT} />
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
