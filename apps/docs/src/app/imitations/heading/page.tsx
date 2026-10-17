import { Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { HeadingMobile } from "./HeadingMobile";
import { project } from "@/fixtures/tideline";

const CODE = `<Heading level={1}>Harbour rebrand</Heading>
<Heading level={2}>Launch kit</Heading>
<Heading level={3}>Print files</Heading>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Heading"] ?? [] },
  {
    type: "doc-section",
    heading: "Semantics",
    body: [{ kind: "text", text: "`level` (1 to 3) renders a real `<h1>`, `<h2>` or `<h3>`, so screen-reader heading navigation and outline tools see it. Use one `level={1}` per page and nest the rest." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="heading"`, `data-rebar-level` set to the current level.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD's `Typography.Title` covers the same role with a `level` prop (1 to 5)." }],
  },
];

export default function HeadingPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Heading</Heading>
      <Text color="secondary">A real h1, h2 or h3, not styled text.</Text>

      <DemoStage
        title="Levels"
        caption="One title, then nested sections"
        code={CODE}
        states={[
          { label: "Long title", node: <Heading level={2}>Identity, site and launch kit for the harbour trust</Heading> },
          { label: "Level 3 under text", node: <Stack gap="xs"><Text size="sm" color="secondary">Launch kit</Text><Heading level={3}>Print files</Heading></Stack> },
        ]}
      >
        <Stack gap="sm">
          <Heading level={1}>{harbour.name}</Heading>
          <Heading level={2}>Launch kit</Heading>
          <Heading level={3}>Print files</Heading>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="Levels give the page its outline" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Heading level={1}>{harbour.name}</Heading>
            <Text color="secondary">{harbour.summary}</Text>
            <Heading level={2}>Milestones</Heading>
            <Text size="sm">Launch on {harbour.due}.</Text>
            <Heading level={3}>This week</Heading>
            <Text size="sm">Homepage in progress, palette signed off.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <HeadingMobile />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
