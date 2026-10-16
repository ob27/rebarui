import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{
  type: "construct-entry",
  id: "Callout",
  measured: true,
  description: "A small banner pairing a tone, a title and an optional subtitle.",
  shape: "{ type: \\"callout\\", tone: Tone, title: string, subtitle?: string }",
  blocks: [{ type: "callout", tone: "success", title: "Rota export shipped" }],
}`;

const ENTRY: Construct = {
  type: "construct-entry",
  id: "Callout",
  measured: true,
  description: "A small banner pairing a tone, a title and an optional subtitle.",
  shape: '{ type: "callout", tone: Tone, title: string, subtitle?: string }',
  blocks: [{ type: "callout", tone: "success", title: "Rota export shipped", subtitle: "Payroll has the March shifts." }],
};

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"construct-entry\", id: string, measured: boolean, description: string, shape: string, code?: string, blocks?: Construct[] }",
      },
    ],
  },
];

export default function ConstructEntryPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Construct Entry</Heading>
      <Text color="secondary">A catalog entry for one construct: tag, description, shape, code and live demos.</Text>

      <DemoStage
        title="Catalog entry"
        caption="The card every tier page prints per construct"
        code={CODE}
        states={[
          { label: "Unmeasured", node: <NextBlockRenderer blocks={[{ type: "construct-entry", id: "Countdown", measured: false, description: "A ticking countdown to a target time.", shape: "<Countdown target />" }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[ENTRY]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Tier page" caption="Two entries stacked, as on /synthetics" widths={false}>
        <Stack gap="md">
          <NextBlockRenderer blocks={[ENTRY]} />
          <NextBlockRenderer blocks={[{ type: "construct-entry", id: "Checklist", measured: true, description: "A heading and a stack of checkable rows.", shape: '{ type: "checklist", items: string[] }', blocks: [{ type: "checklist", items: ["Book crew interviews", "Icon audit"] }] }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
