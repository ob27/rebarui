import { Avatar, Card, Editable, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { STATUS_TONE, TASKS, avatarOf, project } from "@/fixtures/tideline";

const CODE = `<Editable defaultValue="Harbour rebrand" onSubmit={(name) => rename(name)} aria-label="Project name" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Editable"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The read-mode display is a real, focusable, keyboard-activatable `<button>` (Enter/Space enters edit mode) — never a bare `<span onClick>` that only a mouse or a screen-reader\'s click-simulation could reach.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="editable"`; `data-rebar-part` is `"display"` (read mode), `"input-wrapper"`/`"input"` (edit mode), or `"enter-hint"` (the Enter-to-save glyph, when shown).' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "Not codemod-covered — AntD has no direct equivalent; `Typography.Text editable` is the closest, but its callback shape and edit-trigger prop differ enough to need a hand rewrite." },
    ],
  },
];

export default function EditablePage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Editable</Heading>
      <Text color="secondary">Text that turns into an input when you click it. Enter saves, Escape reverts.</Text>

      <DemoStage
        title="Project name"
        caption="Click to edit"
        code={CODE}
        widths={false}
        states={[
          { label: "No Enter hint", node: <Editable defaultValue="Tideline mobile" showEnterHint={false} aria-label="Project name" /> },
          { label: "Empty, placeholder", node: <Editable defaultValue="" placeholder="Name this project" aria-label="Empty name" /> },
          { label: "Disabled", node: <Editable defaultValue="Rota export" disabled aria-label="Locked name" /> },
          { label: "Long text", node: <div style={{ maxWidth: 260 }}><Editable defaultValue="Wayfinding for the three northern depots, second round" aria-label="Long name" /></div> },
        ]}
      >
        <Editable defaultValue={harbour.name} aria-label="Project name" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project header" caption="Rename the project and its tasks in place" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" gap="sm" align="center">
              <Heading level={3}><Editable defaultValue={harbour.name} aria-label="Project name" /></Heading>
              <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
            </Stack>
            {TASKS.filter((t) => t.project === "harbour").map((t) => (
              <Stack key={t.id} direction="row" gap="sm" align="center">
                <Avatar {...avatarOf(t.assignee)} size="sm" />
                <span style={{ flex: 1 }}><Editable defaultValue={t.title} showEnterHint={false} aria-label={`Task ${t.title}`} /></span>
                <Tag>{t.tag}</Tag>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
