"use client";

import { useState } from "react";
import { Heading, Markdown, PageHeader, Prose, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { ARTICLE_MARKDOWN, ART_BLUE, PRIVACY_MARKDOWN, athicArt } from "@/fixtures/athic";

const CODE = `<Markdown source={privacyText} />

<Markdown size="sm" source={terms} components={{ a: RouterLink }} />

<Prose>
  <h2>Your journal</h2>
  <p>Already-rendered content, styled.</p>
</Prose>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Prose props", rows: componentProps["Prose"] ?? [] },
  { type: "props-table", heading: "Markdown props", rows: componentProps["Markdown"] ?? [] },
  {
    type: "doc-section",
    heading: "What Markdown supports",
    body: [
      { kind: "text", text: "Headings, paragraphs, bold, italic, `code`, links, ordered and unordered lists, blockquotes (a last line starting with an em dash becomes the `<cite>`), horizontal rules, pipe tables and fenced code blocks (a real `CodeBlock`). It is the same renderer `ChatThread` uses, exported as `renderMarkdown`. It is not full CommonMark: no nested lists or quotes." },
      { kind: "text", text: "Raw HTML is never rendered: tags in the source show as text. `javascript:`, `data:` and `vbscript:` link targets render as plain text. Use `components` to swap a node for your own, for example `{ a: RouterLink }`." },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      { kind: "text", text: "Plain semantic elements in source order. Links are underlined and meet 4.5:1 on both the cream and the navy surface (`tone=\"inverse\"`). Tables get `scope=\"col\"` on their header cells and scroll sideways inside their own wrapper on a narrow screen. The default 68ch measure keeps lines readable." },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="prose"` with `data-rebar-size` and `data-rebar-tone`; `Markdown` adds `data-rebar-markdown="true"`. The rendered nodes keep the `rebar-markdown-*` classes.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Ant Design's `Typography` covers headings, paragraphs and links one by one; there is no container that styles raw children, so this is a structural rewrite." }],
  },
];

const SOURCE = `## Your journal
The reconciliation journal is **encrypted on your
device**. We [cannot read it](/privacy#journal).

- Your email address
- The Masses you mark as attended

> Whose sins you shall forgive, they are forgiven them.
> — John 20:23

| Region | Used for |
| --- | --- |
| Singapore | Ask replies |`;

export default function ProsePage() {
  const [source, setSource] = useState(SOURCE);
  return (
    <Stack gap="lg">
      <Heading level={1}>Prose and Markdown</Heading>
      <Text color="secondary">Long-form text in the theme&rsquo;s reading type: a 68ch measure and a steady rhythm.</Text>

      <DemoStage
        title="Privacy summary"
        caption="Headings, lists, quote with cite, links, code and a table"
        code={CODE}
        states={[
          { label: "Small", node: <Markdown size="sm" source="Legal and terms copy at **0.94rem**, with a [link](/terms)." /> },
          { label: "Large", node: <Markdown size="lg" source="Lede-style reading at 1.2rem." /> },
          {
            label: "Inverse",
            node: (
              <div style={{ background: "var(--rebar-color-bg-inverse)", padding: 14, borderRadius: 12 }}>
                <Markdown tone="inverse" source="On a dark panel, [links turn coral](/x)." />
              </div>
            ),
          },
          { label: "Raw HTML", node: <Markdown size="sm" source={'Tags show as text: <b>bold</b> <script>alert(1)</script>'} /> },
        ]}
      >
        <Markdown source={PRIVACY_MARKDOWN} />
      </DemoStage>

      <DemoStage title="Markdown" caption="Edit the source" widths={false}>
        <div style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "start" }}>
          <textarea className="rebar-input" aria-label="Markdown source" value={source} onChange={(e) => setSource(e.target.value)} rows={14} style={{ fontFamily: "monospace", fontSize: 13, minHeight: 280 }} />
          <Markdown source={source} maxWidth="none" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Perspective article" caption="A 68ch column under the header" widths>
        <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
          <PageHeader
            align="start"
            breadcrumbs={[{ label: "Perspectives", href: "#" }, { label: "Ethics" }]}
            title="To Be Sorted At The Harvest"
            lede="What the parable of the wheat and the weeds asks of us now."
            style={{ width: "100%", maxWidth: "68ch" }}
          />
          <img src={athicArt("hills", ART_BLUE)} alt="" style={{ display: "block", width: "100%", maxWidth: "68ch", height: 220, objectFit: "cover", borderRadius: 28 }} />
          <Markdown source={ARTICLE_MARKDOWN} style={{ marginTop: 14 }} />
          <Prose size="sm" style={{ marginTop: 10, width: "100%", maxWidth: "68ch" }}>
            <p>Independent, not an official Church product.</p>
          </Prose>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
