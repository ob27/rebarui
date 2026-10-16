import { AvatarGroup, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarsOf, PEOPLE, PROJECTS, person, STATUS_TONE } from "@/fixtures/tideline";

const CODE = `<AvatarGroup avatars={avatarsOf(["maya", "jonas", "priya", "leo"])} max={3} />`;

const ALL = avatarsOf(PEOPLE.map((p) => p.id));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AvatarGroup"] ?? [] },
  {
    type: "doc-section",
    heading: "Overflow",
    body: [{ kind: "text", text: 'Renders real `Avatar`s with negative-margin overlap. Anything past `max` (default 5) collapses into one overflow `Avatar` whose `fallback` is `"+N"`.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="avatar-group"` on the root; each item is a real `Avatar` with its own attributes.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Avatar.Group` is a close direct equivalent: `avatars` / `max` map to `children` / `maxCount`." }],
  },
];

export default function AvatarGroupPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>AvatarGroup</Heading>
      <Text color="secondary">A stacked, overlapping row of avatars with a &quot;+N&quot; overflow.</Text>

      <DemoStage
        title="Project team"
        caption="Four people, two shown and the rest folded into +2"
        code={CODE}
        widths={false}
        states={[
          { label: "One person", node: <AvatarGroup avatars={ALL.slice(0, 1)} /> },
          { label: "All shown", node: <AvatarGroup avatars={ALL} max={5} /> },
          { label: "Small", node: <AvatarGroup avatars={ALL} max={3} size="sm" /> },
          { label: "Large", node: <AvatarGroup avatars={ALL} max={3} size="lg" /> },
        ]}
      >
        <AvatarGroup avatars={ALL} max={2} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project cards" caption="Who is on each project" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          {PROJECTS.slice(0, 3).map((p, i) => (
            <Card key={p.id} title={p.name} style={{ flex: "1 1 220px" }}>
              <Stack gap="sm">
                <Text size="sm" color="secondary">Led by {person(p.owner).name}</Text>
                <Stack direction="row" gap="sm" align="center" justify="between">
                  <AvatarGroup avatars={ALL.slice(0, 2 + i)} size="sm" />
                  <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
