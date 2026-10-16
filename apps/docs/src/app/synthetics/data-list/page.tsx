import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `{ type: "data-list", items: [{ title: "Harbour rebrand", badge: "On track" }, { title: "Crew interviews", badge: "Late" }] }`;

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "data-list", items: { title: string, badge?: string }[] }` }],
  },
];

const items = PROJECTS.map((p) => ({ title: p.name, badge: p.status }));

export default function DataListPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Data List</Heading>
      <Text color="secondary">A stack of title and badge rows, lighter than a table.</Text>

      <DemoStage
        title="Project status"
        caption="Name and status badge per row"
        code={CODE}
        states={[
          { label: "No badge", node: <NextBlockRenderer blocks={[{ type: "data-list", items: [{ title: "Rota export" }] }]} /> },
          { label: "Long title", node: <NextBlockRenderer blocks={[{ type: "data-list", items: [{ title: "Wayfinding for the three northern depots, phase two", badge: "Review" }] }]} /> },
          { label: "Empty", node: <NextBlockRenderer blocks={[{ type: "data-list", items: [] }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "data-list", items: items.slice(0, 3) }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Dashboard" caption="Every project at a glance" widths={false}>
        <Stack gap="md" style={{ maxWidth: 520, margin: "0 auto" }}>
          <Heading level={3}>Projects</Heading>
          <NextBlockRenderer blocks={[{ type: "data-list", items }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
