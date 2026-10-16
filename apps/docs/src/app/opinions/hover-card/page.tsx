import { Avatar, Card, Heading, HoverCard, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, STATUS_TONE, TASKS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<HoverCard trigger={<a href="#maya">@maya</a>}>
  <Stack gap="xs">
    <Avatar alt="Maya Chen" fallback="MC" placeholder={1} />
    <Text>Maya Chen, Design</Text>
  </Stack>
</HoverCard>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["HoverCard"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Real Radix `HoverCard` underneath — opens on keyboard focus as well as pointer hover, so it's reachable without a mouse, not a hover-only pattern that silently excludes keyboard users.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="hover-card"` on the content panel.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's closest equivalent is `Popover` with `trigger=\"hover\"`, a prop-level mode switch on one component rather than two separate ones, so mapping this over is a structural change, not a rename.",
      },
    ],
  },
];


function PersonLink({ id }: { id: string }) {
  const p = person(id);
  return (
    <HoverCard
      trigger={
        <a href={`#${id}`} style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
          @{p.name.split(" ")[0]}
        </a>
      }
    >
      <Stack direction="row" gap="sm" align="center" style={{ minWidth: 200 }}>
        <Avatar {...avatarOf(id)} />
        <Stack gap="xs">
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{p.name}</Text>
          <Text size="xs" color="secondary">{p.role}</Text>
        </Stack>
      </Stack>
    </HoverCard>
  );
}

function ProjectLink({ id }: { id: string }) {
  const pr = project(id);
  return (
    <HoverCard trigger={<a href={`#${id}`} style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>{pr.name}</a>}>
      <Stack gap="xs" style={{ minWidth: 220 }}>
        <Stack direction="row" gap="sm" align="center" style={{ justifyContent: "space-between" }}>
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{pr.name}</Text>
          <Tag tone={STATUS_TONE[pr.status]}>{pr.status}</Tag>
        </Stack>
        <Text size="sm" color="secondary">{pr.summary}</Text>
        <Text size="xs" color="secondary">Due {pr.due}, {pr.done}% done</Text>
      </Stack>
    </HoverCard>
  );
}

export default function HoverCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>HoverCard</Heading>
      <Text color="secondary">A preview that opens on hover or focus and closes when the pointer leaves.</Text>

      <DemoStage
        title="Mention preview"
        caption="Hover or Tab to @Maya"
        code={CODE}
        states={[
          { label: "Person", node: <PersonLink id="jonas" /> },
          { label: "Project", node: <ProjectLink id="mobile" /> },
          {
            label: "File",
            node: (
              <HoverCard trigger={<a href="#file" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>{FILES[0]!.name}</a>}>
                <Stack gap="xs" style={{ minWidth: 200 }}>
                  <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{FILES[0]!.name}</Text>
                  <Text size="xs" color="secondary">{FILES[0]!.size}, in {project(FILES[0]!.project).name}</Text>
                </Stack>
              </HoverCard>
            ),
          },
        ]}
      >
        <Text>
          Handed the icon audit to <PersonLink id="maya" /> for the <ProjectLink id="harbour" /> launch.
        </Text>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Activity feed" caption="Names and projects preview in place" widths={false}>
        <Card title="Today" style={{ maxWidth: 520, margin: "0 auto" }}>
          <Stack gap="sm">
            {TASKS.slice(3, 6).map((t) => (
              <Text key={t.id} size="sm">
                <PersonLink id={t.assignee} /> moved <b>{t.title}</b> in <ProjectLink id={t.project} />
              </Text>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
