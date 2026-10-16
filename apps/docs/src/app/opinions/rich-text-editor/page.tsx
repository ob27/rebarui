"use client";

import { useState } from "react";
import { Avatar, Button, Card, Heading, RichTextEditor, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";

const NOTE = "<p><b>Harbour launch is on for 24 Oct.</b> Fascia artwork is signed off and the van livery photos are in the shared folder.</p><ul><li>Maya: homepage copy to review</li><li>Leo: payroll cut-off is 28 Oct</li></ul>";

const CODE = `const [html, setHtml] = useState("<p>Harbour launch is on for 24 Oct.</p>");

<RichTextEditor value={html} onValueChange={setHtml} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["RichTextEditor"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="rich-text-editor"`; parts: `toolbar`, `content`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD ships no rich-text editor of its own — its docs point to third-party editors (TinyMCE, Quill, etc.) wrapped in an antd `Form.Item`. A migration typically keeps this component's own simple formatting or upgrades to one of those dedicated libraries, rather than a 1:1 antd component swap.",
      },
    ],
  },
];

export default function RichTextEditorPage() {
  const [html, setHtml] = useState(NOTE);
  return (
    <Stack gap="lg">
      <Heading level={1}>RichTextEditor</Heading>
      <Text color="secondary">A formatting toolbar over an editable region, with HTML in and out.</Text>

      <DemoStage
        title="Project update"
        caption="Bold, lists and links, saved as HTML"
        code={CODE}
        states={[
          { label: "Empty", node: <RichTextEditor placeholder="Write an update for the crew…" minHeight={80} /> },
          { label: "Short", node: <RichTextEditor defaultValue="<p>Icon audit is done.</p>" minHeight={60} /> },
        ]}
      >
        <RichTextEditor value={html} onValueChange={setHtml} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Post an update" caption="Writing to the Harbour rebrand channel" widths={false}>
        <Card style={{ maxWidth: 620, margin: "0 auto" }} title="Harbour rebrand" subtitle="New update" avatar={<Avatar {...avatarOf("maya")} />} actions={[<Button key="draft" variant="secondary">Save draft</Button>, <Button key="post">Post update</Button>]}>
          <RichTextEditor defaultValue={NOTE} minHeight={140} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
