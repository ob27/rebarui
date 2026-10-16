import { Avatar, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, avatarOf, person } from "@/fixtures/tideline";

const CODE = `{
  type: "spin-card",
  tip: "Fetching projects",
  items: ["Harbour rebrand", "Tideline mobile", "Crew interviews"],
}`;

const names = PROJECTS.slice(0, 3).map((p) => p.name);

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "spin-card", tip?: string, items: string[], width?: number, minHeight?: number }` }],
  },
];

export default function SpinCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Spin Card</Heading>
      <Text color="secondary">A small card with a loading spinner laid over a few lines of content.</Text>

      <DemoStage
        title="Fetching projects"
        caption="The spinner covers the content while it loads"
        code={CODE}
        widths={false}
        states={[
          { label: "No tip", node: <NextBlockRenderer blocks={[{ type: "spin-card", items: names.slice(0, 2), width: 150, minHeight: 90 }]} /> },
          { label: "Wider card", node: <NextBlockRenderer blocks={[{ type: "spin-card", tip: "Syncing rota", items: ["Week 42", "Week 43"], width: 160, minHeight: 90 }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "spin-card", tip: "Fetching projects", items: names }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Dashboard panel" caption="A panel waits on the project list while the owner card is already there" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center" }}>
          <Card title="Owner" style={{ width: 240 }}>
            <Stack direction="row" gap="sm" align="center">
              <Avatar {...avatarOf("maya")} />
              <Stack gap="xs">
                <Text size="sm">{person("maya").name}</Text>
                <Tag tone="success">On track</Tag>
              </Stack>
            </Stack>
          </Card>
          <NextBlockRenderer blocks={[{ type: "spin-card", tip: "Loading her projects", items: ["Harbour rebrand", "Depot signage"], width: 240, minHeight: 120 }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
