import { Button, Card, Heading, MindMap, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, project } from "@/fixtures/tideline";

const CODE = `<MindMap
  topic="Harbour launch"
  branches={[
    { id: "brand", label: "Brand", children: [{ id: "palette", label: "Palette" }, { id: "icons", label: "Icon audit" }] },
    { id: "site", label: "Site", children: [{ id: "home", label: "Homepage" }] },
    { id: "signage", label: "Signage" },
  ]}
/>`;

const BRANCHES = [
  { id: "brand", label: "Brand", children: [{ id: "palette", label: "Palette" }] },
  { id: "site", label: "Site", children: [{ id: "home", label: "Homepage" }, { id: "checklist", label: "Checklist" }] },
  { id: "signage", label: "Signage" },
  { id: "crew", label: "Crew comms" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["MindMap"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="mind-map"` on the root; the underlying `NodeLinkGraph`\'s own toolbar/node/edge parts render underneath unchanged.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no diagramming components of its own; a mind map typically migrates to a dedicated library (e.g. DHTMLX Diagram) rather than an antd component.",
      },
    ],
  },
];


export default function MindMapPage() {
  const harbour = project("harbour");
  const open = TASKS.filter((t) => t.project === "harbour" && t.column !== "done");
  return (
    <Stack gap="lg">
      <Heading level={1}>MindMap</Heading>
      <Text color="secondary">A central topic with branches and one level of children.</Text>

      <DemoStage
        title="Harbour launch"
        caption="Topic, four branches, a few children"
        code={CODE}
        states={[
          { label: "Topic only", node: <MindMap topic="Harbour launch" branches={[]} width={190} height={130} /> },
          { label: "Long label", node: <MindMap topic="Harbour launch" branches={[{ id: "x", label: "Wayfinding for the three northern depots" }]} width={190} height={130} /> },
        ]}
      >
        <MindMap topic="Harbour launch" branches={BRANCHES} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Planning session" caption="The map next to what is still open" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <Card title="Launch plan" subtitle={harbour.name} style={{ flex: "2 1 340px" }}>
            <MindMap topic="Harbour launch" branches={BRANCHES.slice(0, 3)} />
          </Card>
          <Card title="Still open" subtitle={`${open.length} tasks`} actions={[<Button key="add" variant="secondary">Add task</Button>]} style={{ flex: "1 1 220px" }}>
            <Stack gap="xs">
              {open.map((t) => (
                <Stack key={t.id} direction="row" gap="xs" align="center">
                  <Tag>{t.tag}</Tag>
                  <Text size="sm">{t.title}</Text>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
