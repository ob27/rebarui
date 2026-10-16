import { Avatar, Box, Card, Container, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf, gbp, person, project, STATUS_TONE } from "@/fixtures/tideline";

const CODE = `<Container maxWidth="lg" verticalPadding="var(--rebar-space-xl)">
  <Heading level={1}>Harbour rebrand</Heading>
  <Text>Identity, site and launch kit for the harbour trust.</Text>
</Container>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Container"] ?? [] },
  {
    type: "doc-section",
    heading: "Width and padding",
    body: [
      {
        kind: "text",
        text: '`maxWidth` takes `"sm"` (480px), `"md"` (640px), `"lg"` (800px, the default), `"xl"` (1040px), `"full"`, a number of pixels, or any CSS length. `padding` is horizontal only; set `verticalPadding` when nothing else spaces the page from its header and footer.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="container"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. AntD's `Layout.Content` does not constrain width; keep a plain CSS max-width rule or compose the target library's grid.",
      },
    ],
  },
];

const PAGE_BG = { background: "var(--rebar-color-bg-secondary)", borderRadius: 8 } as const;
const BAND = {
  background: "var(--rebar-color-bg-primary)",
  border: "1px solid var(--rebar-color-border)",
  borderRadius: 6,
  padding: "var(--rebar-space-sm)",
  textAlign: "center",
} as const;

function Band({ children }: { children: string }) {
  return (
    <Box style={BAND}>
      <Text size="sm" color="secondary">{children}</Text>
    </Box>
  );
}

function Preset({ size }: { size: "sm" | "md" | "lg" | "xl" | "full" }) {
  return (
    <Box style={{ ...PAGE_BG, width: "100%" }}>
      <Container maxWidth={size} padding="var(--rebar-space-sm)">
        <Band>{`maxWidth="${size}"`}</Band>
      </Container>
    </Box>
  );
}

export default function ContainerPage() {
  const harbour = project("harbour");
  const owner = person(harbour.owner);
  return (
    <Stack gap="lg">
      <Heading level={1}>Container</Heading>
      <Text color="secondary">Centres page content and caps its width.</Text>

      <DemoStage
        title="Project page"
        caption="A centred column at the default width"
        code={CODE}
        states={[
          { label: "sm", node: <Preset size="sm" /> },
          { label: "md", node: <Preset size="md" /> },
          { label: "xl", node: <Preset size="xl" /> },
          { label: "full", node: <Preset size="full" /> },
          {
            label: "verticalPadding",
            node: (
              <Box style={{ ...PAGE_BG, width: "100%" }}>
                <Container maxWidth="full" padding="var(--rebar-space-sm)" verticalPadding="var(--rebar-space-xl)">
                  <Band>verticalPadding set</Band>
                </Container>
              </Box>
            ),
          },
        ]}
      >
        <Box style={PAGE_BG}>
          <Container maxWidth="lg" verticalPadding="var(--rebar-space-xl)">
            <Stack gap="sm">
              <Heading level={2}>{harbour.name}</Heading>
              <Text color="secondary">{harbour.summary}</Text>
              <Stack direction="row" gap="sm" align="center">
                <Avatar {...avatarOf(owner.id)} size="sm" />
                <Text size="sm">{owner.name}, due {harbour.due}</Text>
                <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Settings page" caption="A narrow column keeps form lines readable" widths={false}>
        <Box style={PAGE_BG}>
          <Container maxWidth="md" verticalPadding="var(--rebar-space-lg)">
            <Card title="Budget">
              <Stack gap="xs">
                <Text size="sm" color="secondary">Harbour rebrand</Text>
                <Text>{gbp(harbour.budget)} agreed, {harbour.done}% complete.</Text>
              </Stack>
            </Card>
          </Container>
        </Box>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
