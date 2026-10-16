import { Affix, Box, Button, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project, PROJECTS, STATUS_TONE, TASKS } from "@/fixtures/tideline";

const CODE = `<Affix offsetTop={96}>
  <Button size="sm">Add task</Button>
</Affix>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Affix"] ?? [] },
  {
    type: "doc-section",
    heading: "Behaviour",
    body: [
      {
        kind: "text",
        text: "A same-sized placeholder keeps the layout from jumping when the content pins. Measurement is rAF-throttled. It listens to the real `window` scroll, not a scrollable container, so scroll this page to see it pin and un-pin.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="affix"` on the root; the pinned content and its placeholder each carry their own `data-rebar-part`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Affix` is a close direct equivalent: `offsetTop` maps across, `onAffixChange` is `onChange`." }],
  },
];

export default function AffixPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Affix</Heading>
      <Text color="secondary">Pins its children in place once the page scrolls past them, and releases them on the way back.</Text>

      <DemoStage
        title="Task list"
        caption="Scroll the page: the Add task bar pins under the site header"
        code={CODE}
        widths={false}
        states={[
          { label: "Pinned look", node: <Card style={{ boxShadow: "var(--rebar-shadow-float)" }}><Stack direction="row" gap="sm" align="center"><Button size="sm">Add task</Button><Text size="sm" color="secondary">Pinned</Text></Stack></Card> },
        ]}
      >
        <Stack gap="sm">
          <Affix offsetTop={96}>
            <Card>
              <Stack direction="row" gap="sm" align="center">
                <Button size="sm">Add task</Button>
                <Text size="sm" color="secondary">{harbour.name}, {TASKS.length} tasks</Text>
              </Stack>
            </Card>
          </Affix>
          {[...TASKS, ...TASKS].map((t, i) => (
            <Card key={`${t.id}-${i}`}>
              <Stack direction="row" gap="sm" align="center" justify="between">
                <Text>{t.title}</Text>
                <Tag>{t.tag}</Tag>
              </Stack>
            </Card>
          ))}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects overview" caption="A pinned status strip above a long list" widths={false}>
        <Stack gap="sm">
          <Affix offsetTop={96}>
            <Box style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", borderRadius: 8, padding: "var(--rebar-space-sm) var(--rebar-space-md)" }}>
              <Text size="sm" style={{ color: "inherit" }}>5 projects, 1 late, launch on 24 Oct</Text>
            </Box>
          </Affix>
          {PROJECTS.map((p) => (
            <Card key={p.id} title={p.name}>
              <Stack direction="row" gap="sm" align="center" justify="between">
                <Text size="sm" color="secondary">{p.summary}</Text>
                <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
              </Stack>
            </Card>
          ))}
          <Box style={{ height: 160 }} aria-hidden="true" />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
