"use client";

import { useState } from "react";
import { Heading, RichTextEditor, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `const [html, setHtml] = useState("<p>Hello</p>");\n\n<RichTextEditor value={html} onValueChange={setHtml} />`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["RichTextEditor"] ?? [] },
  {
    type: "doc-section",
    heading: "A deliberately minimal editor, not a ProseMirror competitor",
    body: [
      {
        kind: "text",
        text: "A real `contentEditable` region with a small formatting toolbar (bold/italic/underline/lists/link) — not a full rich-text engine. That's a deliberate scope call matching this project's low-fidelity philosophy (see [Design Philosophy](/docs/design-philosophy)): ship the real, correct *shape* of the interaction rather than compete with a dedicated editor library on polish, the same reasoning that kept `CodeBlock` free of syntax highlighting. Formatting uses the browser's `document.execCommand` — formally deprecated by spec, but still universally supported for exactly these basic commands in every current browser.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Real HTML in, real HTML out",
    body: [
      {
        kind: "text",
        text: "`value` is a plain HTML string, matching what a server-rendered rich-text field or a `dangerouslySetInnerHTML` consumer already expects. The controlled sync only overwrites the live DOM when `value` genuinely differs from the editor's own current content, so typing never fights the cursor position mid-edit.",
      },
    ],
  },
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
  const [html, setHtml] = useState("<p>Start typing to try the toolbar above.</p>");

  return (
    <Stack gap="lg">
      <Heading level={1}>RichTextEditor</Heading>
      <Text color="secondary">
        A minimal, honest WYSIWYG editor — a real formatting toolbar over a real{" "}
        <code>contentEditable</code> region.
      </Text>

      <RichTextEditor value={html} onValueChange={setHtml} />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
