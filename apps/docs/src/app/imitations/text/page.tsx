"use client";

import { Button, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TextMobile } from "./TextMobile";
import { person, project } from "@/fixtures/tideline";

const CODE = `<Text size="md">Identity, site and launch kit.</Text>
<Text size="sm" color="secondary">Owned by Maya Chen.</Text>
<Text size="xs" color="secondary" as="span">Updated 17 Oct</Text>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Text"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="text"`, `data-rebar-size`/`data-rebar-color` set to the current values.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: 'Not codemod-covered — AntD\'s `Typography.Text` covers the same "small, secondary, inline text" role with a similar `type` prop for color.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Typed label",
    body: [
      {
        "kind": "text",
        "text": "With `as=\"label\"` the props are a `<label>`'s, so `htmlFor` is typed (and rejected on a plain `<p>` Text). Any other element works the same way: `as=\"span\"` takes span props."
      },
      {
        "kind": "code",
        "code": "<Text as=\"label\" htmlFor=\"email\" size=\"sm\">Email</Text>"
      }
    ],
  },
];

export default function TextPage() {
  const harbour = project("harbour");
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>Text</Heading>
      <Text color="secondary">The default paragraph, with a size and a colour scale.</Text>

      <DemoStage title="Sizes and colours" caption="Default, helper text, and an inline span" code={CODE} widths={false}
        states={[
          { label: "As a span", node: <Text as="span" size="sm">Due <Text as="span" size="sm" color="secondary">24 Oct</Text></Text> },
          { label: "Long text", node: <Text size="sm" style={{ maxWidth: 260 }}>Offline sync keeps tasks readable on the ferry, then catches up with the server as soon as the crew reaches the quay.</Text> },
        ]}
      >
        <Stack gap="xs">
          <Text size="md">{harbour.summary}</Text>
          <Text size="sm" color="secondary">Owned by {person(harbour.owner).name}. Due {harbour.due}.</Text>
          <Text size="xs" color="secondary" as="span">Updated 17 Oct, rendered as a span.</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project summary" caption="Body, helper text and a muted footer in one card" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title={mobile.name} actions={[<Button key="open">Open project</Button>]}>
          <Stack gap="xs">
            <Text>{mobile.summary}</Text>
            <Text size="sm" color="secondary">{mobile.done}% complete, {mobile.status.toLowerCase()}.</Text>
            <Text size="xs" color="secondary">Next milestone: {mobile.due}</Text>
          </Stack>
        </Card>
      </DemoStage>

      <TextMobile />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
