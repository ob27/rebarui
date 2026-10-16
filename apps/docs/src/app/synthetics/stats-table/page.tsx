import { Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { HOURS_BY_PERSON, KPIS, PROJECTS, gbp, person } from "@/fixtures/tideline";

const CODE = `{
  type: "stats-table",
  headers: ["Project", "Done", "Budget"],
  rows: [["Harbour rebrand", "84%", "GBP 48,200"], ["Tideline mobile", "61%", "GBP 72,900"]],
}`;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "stats-table", headers: string[], rows: (string | number)[][] }` }],
  },
];

const projectRows = PROJECTS.map((p) => [p.name, `${p.done}%`, gbp(p.budget)]);

export default function StatsTablePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Stats Table</Heading>
      <Text color="secondary">A small static table: headers and a grid of cells, nothing to sort or select.</Text>

      <DemoStage
        title="Project summary"
        caption="Headers plus rows of strings and numbers"
        code={CODE}
        states={[
          { label: "Two columns", node: <NextBlockRenderer blocks={[{ type: "stats-table", headers: ["Person", "Hours"], rows: HOURS_BY_PERSON.map((h) => [person(h.person).name, h.hours]) }]} /> },
          { label: "Empty", node: <NextBlockRenderer blocks={[{ type: "stats-table", headers: ["Project", "Done"], rows: [] }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "stats-table", headers: ["Project", "Done", "Budget"], rows: projectRows }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Weekly report" caption="The table sits in a card under the headline numbers" widths={false}>
        <Card title="Week of 19 Oct" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" gap="lg" style={{ flexWrap: "wrap" }}>
              {KPIS.map((k) => (
                <Stack key={k.label} gap="xs">
                  <Text size="xs" color="secondary">{k.label}</Text>
                  <Text style={{ fontSize: 24, fontWeight: 600 }}>{k.value}</Text>
                </Stack>
              ))}
            </Stack>
            <NextBlockRenderer blocks={[{ type: "stats-table", headers: ["Person", "Hours logged"], rows: HOURS_BY_PERSON.map((h) => [person(h.person).name, h.hours]) }]} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
