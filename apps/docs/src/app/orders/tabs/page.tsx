import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{
  type: "tabs",
  tabs: [
    { label: "Team", blocks: [{ type: "callout", tone: "info", title: "Four people" }] },
    { label: "Details", blocks: [{ type: "checklist", items: ["Brand palette"] }] },
  ],
}`;

const MAIN: Construct[] = [
  {
    type: "tabs",
    tabs: [
      { label: "Team", blocks: [{ type: "callout", tone: "info", title: "Four people on Harbour rebrand", subtitle: "Maya Chen, Jonas Weber, Priya Nair, Leo Santos" }] },
      { label: "Checklist", blocks: [{ type: "checklist", items: ["Brand palette signed off", "Icon audit finished", "Homepage copy approved"] }] },
      { label: "Numbers", blocks: [{ type: "stats-table", headers: ["Person", "Hours this week"], rows: [["Maya Chen", 31], ["Jonas Weber", 36], ["Priya Nair", 18], ["Leo Santos", 24]] }] },
    ],
  },
];

const TWO: Construct[] = [
  { type: "tabs", tabs: [{ label: "Open", blocks: [{ type: "checklist", items: ["Book crew interviews"] }] }, { label: "Done", blocks: [{ type: "callout", tone: "success", title: "Rota export shipped" }] }] },
];

const BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Shape", body: [{ kind: "code", code: `{ type: "tabs", tabs: { label: string, blocks: Block[] }[] }` }] },
  { type: "doc-section", heading: "Nesting", body: [{ kind: "text", text: "Real Tabs underneath. Each panel holds its own blocks, so any block type can sit inside one." }] },
];

export default function TabsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Tabs</Heading>
      <Text color="secondary">Tabbed panels, each holding its own blocks.</Text>

      <DemoStage title="Project detail" caption="Team, checklist and numbers" code={CODE} states={[{ label: "Two tabs", node: <NextBlockRenderer blocks={TWO} /> }]}>
        <NextBlockRenderer blocks={MAIN} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Crew interviews" caption="Tabs inside a project page" widths={false}>
        <Stack gap="md">
          <Heading level={3}>Crew interviews</Heading>
          <NextBlockRenderer
            blocks={[
              {
                type: "tabs",
                tabs: [
                  { label: "Summary", blocks: [{ type: "callout", tone: "warning", title: "Late by 2 days", subtitle: "Twelve calls, one clear pattern." }] },
                  { label: "Schedule", blocks: [{ type: "stats-table", headers: ["Call", "Date"], rows: [["Crew interview 11", "21 Oct, 11:30"], ["Niamh Byrne", "21 Oct"], ["Tomas Larsen", "21 Oct"]] }] },
                ],
              },
            ]}
          />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
