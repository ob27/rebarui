import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE } from "@/fixtures/tideline";

const CODE = `{
  type: "card-grid",
  items: [
    { title: "Harbour rebrand", body: "Identity, site and launch kit for the harbour trust.", href: "#", linkLabel: "Open project →" },
    { title: "Depot signage", tags: [{ label: "In review", tone: "info" }] },
  ],
}`;

const items = PROJECTS.map((p) => ({
  title: p.name,
  body: p.summary,
  href: "#",
  linkLabel: "Open project →",
  tags: [{ label: p.status, tone: p.status === "Done" ? undefined : (STATUS_TONE[p.status] as "success" | "info" | "error") }],
}));

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "card-grid", items: { title: string, body?: string, href?: string, linkLabel?: string, tags?: { label: string, tone?: Tone }[] }[] }` }],
  },
];

export default function CardGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Card Grid</Heading>
      <Text color="secondary">A wrapping grid of cards for a directory of many similar things.</Text>

      <DemoStage
        title="Project directory"
        caption="Title, summary, status tag and link"
        code={CODE}
        states={[
          { label: "Title only", node: <NextBlockRenderer blocks={[{ type: "card-grid", items: [{ title: "Rota export" }] }]} /> },
          { label: "With tag", node: <NextBlockRenderer blocks={[{ type: "card-grid", items: [{ title: "Depot signage", tags: [{ label: "Review", tone: "info" }] }] }]} /> },
          { label: "Long text", node: <NextBlockRenderer blocks={[{ type: "card-grid", items: [{ title: "Offline sync for the Tideline mobile crew app", body: "Tasks, files and the quiet inbox keep working below deck, and catch up when the ferry reaches the quay.", href: "#", linkLabel: "Open project →" }] }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "card-grid", items: items.slice(0, 4) }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects index" caption="All five projects, one grid" widths={false}>
        <Stack gap="md">
          <Heading level={3}>Projects</Heading>
          <NextBlockRenderer blocks={[{ type: "card-grid", items }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
