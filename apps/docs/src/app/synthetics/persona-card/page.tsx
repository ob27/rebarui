import { Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, project } from "@/fixtures/tideline";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "persona-card", items: { name: string, meta?: string, avatarSrc?: string, avatarPlaceholder?: boolean }[] }` }],
  },
];

const CODE = `{
  type: "persona-card",
  items: [
    { name: "Maya Chen", meta: "Design", avatarPlaceholder: true },
    { name: "Jonas Weber", meta: "Engineering", avatarPlaceholder: true },
  ],
}`;

const ITEMS = PEOPLE.map((p) => ({ name: p.name, meta: p.role, avatarPlaceholder: true }));

export default function PersonaCardPage() {
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>Persona Card</Heading>
      <Text color="secondary">A row of people: avatar, name and an optional line underneath.</Text>

      <DemoStage
        title="The team"
        caption="Four people from the studio"
        code={CODE}
        states={[
          { label: "One person", node: <NextBlockRenderer blocks={[{ type: "persona-card", items: ITEMS.slice(0, 1) }]} /> },
          { label: "No meta line", node: <NextBlockRenderer blocks={[{ type: "persona-card", items: ITEMS.slice(0, 2).map(({ name, avatarPlaceholder }) => ({ name, avatarPlaceholder })) }]} /> },
          { label: "Initials only", node: <NextBlockRenderer blocks={[{ type: "persona-card", items: [{ name: "Leo Santos", meta: "Operations" }] }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "persona-card", items: ITEMS }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project team" caption="Who is on Tideline mobile" widths={false}>
        <Card title={mobile.name} subtitle={`Due ${mobile.due}`}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">{mobile.summary}</Text>
            <NextBlockRenderer blocks={[{ type: "persona-card", items: ITEMS.filter((_, i) => i < 2) }]} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
