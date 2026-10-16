import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "pillar-grid", items: { title: string, body: string, href: string, cta: string }[] }` }],
  },
];

const CODE = `{
  type: "pillar-grid",
  items: [
    { title: "Tasks", body: "A board the whole crew can read.", href: "/tasks", cta: "See tasks" },
    { title: "Files", body: "Livery, fascia and rota, filed by project.", href: "/files", cta: "See files" },
    { title: "Chat", body: "Ask what slipped, get an answer.", href: "/chat", cta: "See chat" },
  ],
}`;

const ITEMS = [
  { title: "Tasks", body: "A board the whole crew can read.", href: "/components", cta: "See tasks" },
  { title: "Files", body: "Livery, fascia and rota, filed by project.", href: "/components", cta: "See files" },
  { title: "Chat", body: "Ask what slipped, get an answer.", href: "/components", cta: "See chat" },
];

export default function PillarGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Pillar Grid</Heading>
      <Text color="secondary">A row of cards, each with a title, a line of copy and a link.</Text>

      <DemoStage
        title="Three pillars"
        caption="Tasks, files, chat"
        code={CODE}
        states={[
          { label: "One card", node: <NextBlockRenderer blocks={[{ type: "pillar-grid", items: ITEMS.slice(0, 1) }]} /> },
          { label: "Two cards", node: <NextBlockRenderer blocks={[{ type: "pillar-grid", items: ITEMS.slice(0, 2) }]} /> },
          {
            label: "Long copy",
            node: <NextBlockRenderer blocks={[{ type: "pillar-grid", items: [{ ...ITEMS[0]!, body: "A board the whole crew can read at a glance, with owners, dates and the tag for each task, kept in step across phones on the quay and laptops in the office." }] }]} />,
          },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "pillar-grid", items: ITEMS }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Landing section" caption="A section header, then the pillars" widths={false}>
        <NextBlockRenderer
          blocks={[
            { type: "section-header", kicker: "Why Tideline", title: "Run the week without the spreadsheet", subtitle: "Harbour trust, depots and crew in one place." },
            { type: "pillar-grid", items: ITEMS },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
