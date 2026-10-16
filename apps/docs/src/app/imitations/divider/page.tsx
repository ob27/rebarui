import { Card, Divider, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, project } from "@/fixtures/tideline";

const CODE = `<Divider />
<Divider>Or</Divider>
<Divider orientation="vertical" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Divider"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: '`role="separator"`. Horizontal is the default orientation, so `aria-orientation` is only set for `orientation="vertical"`.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="divider"`; `data-rebar-part="line" | "text"` on the labelled variant\'s two line segments and label.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Divider` takes the same orientation values and inline text children. Not yet codemod-covered, but a close, low-risk rename." }],
  },
];

export default function DividerPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Divider</Heading>
      <Text color="secondary">A rule between content, plain or with a label.</Text>

      <DemoStage
        title="Rules"
        caption="Plain and labelled"
        code={CODE}
        states={[
          { label: "Vertical", node: <Stack direction="row" gap="md" align="center" style={{ height: 32 }}><Text size="sm">Maya</Text><Divider orientation="vertical" /><Text size="sm">Jonas</Text><Divider orientation="vertical" /><Text size="sm">Priya</Text></Stack> },
          { label: "Labelled", node: <Divider>Done</Divider> },
        ]}
      >
        <Stack gap="md">
          <Text size="sm">Harbour rebrand: identity</Text>
          <Divider />
          <Text size="sm">Harbour rebrand: launch kit</Text>
          <Divider>Or</Divider>
          <Text size="sm">Depot signage</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Sign in" caption="A labelled divider between two ways to continue" widths={false}>
        <Card title="Join Tideline" style={{ maxWidth: 360, margin: "0 auto" }}>
          <Stack gap="md">
            <Text size="sm">Sign in as {PEOPLE[0]!.name} to open {harbour.name}.</Text>
            <Divider>Or</Divider>
            <Text size="sm" color="secondary">Ask a teammate for an invite link.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
