import { Card, CodeBlock, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SNIPPET = `import { syncTasks } from "./sync";

export async function onReconnect(crewId: string) {
  const pending = await syncTasks(crewId);
  return pending.length;
}`;

const NOTES = `# Release notes

Offline sync for **Tideline mobile** is in review.

## What changed

- Tasks keep working with no signal
- The inbox sends one digest a day

> Ship it on 7 Nov.
`;

const CODE = `<CodeBlock language="tsx" code={snippet} />
<CodeBlock markdown code={releaseNotes} />
<CodeBlock language="bash" hideCopyButton code="tideline export --week 19-oct" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["CodeBlock"] ?? [] },
  {
    type: "doc-section",
    heading: "Plain and markdown modes",
    body: [
      {
        kind: "text",
        text: "Plain mode is preformatted text with a one-click copy button and visible confirmation; there is no syntax highlighting. `markdown` renders headings, lists, blockquotes, fenced code and inline bold, italic, code and links with a small built-in parser (no tables, nested lists or raw HTML). The copy button always copies the original source. `language` is ignored when `markdown` is set.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="code-block"` on the root; `data-rebar-part` is `"header"`, `"language"`, `"copy-button"`, `"pre"` (plain mode), `"markdown"` (markdown mode).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. AntD ships no code-block component; a copyable sample typically migrates to a small wrapper around `Typography.Text code` plus a clipboard button, or a syntax-highlighting library.",
      },
    ],
  },
];

export default function CodeBlockPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>CodeBlock</Heading>
      <Text color="secondary">A code sample with a copy button, or rendered Markdown.</Text>

      <DemoStage
        title="Reconnect handler"
        caption="Language label, code and copy"
        code={CODE}
        states={[
          { label: "Markdown", node: <CodeBlock markdown code={NOTES} /> },
          { label: "No copy button", node: <CodeBlock language="bash" hideCopyButton code="tideline export --week 19-oct" /> },
          { label: "Long line", node: <CodeBlock language="bash" code="tideline export --project harbour --from 3-aug --to 19-oct --format csv --out ./exports/harbour-rebrand-weekly.csv" /> },
        ]}
      >
        <CodeBlock language="tsx" code={SNIPPET} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Docs card" caption="An install step in a help card" widths={false}>
        <Card title="Install the crew CLI" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">Leo Santos uses it to export the rota to payroll.</Text>
            <CodeBlock language="bash" code={"npm install -g @tideline/cli\ntideline login"} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
