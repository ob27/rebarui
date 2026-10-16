import { Card, Heading, Iframe, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<Iframe
  src="https://tideline.example/harbour/status"
  title="Harbour rebrand status page"
  style={{ width: "100%", height: 200, border: "1px solid var(--rebar-color-border)" }}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Iframe"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessible name",
    body: [{ kind: "text", text: "`title` is required, so the embedded content always has a name for screen readers. There is no default border or height; set them for your context." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="iframe"` on the element itself.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no iframe wrapper; use a native `<iframe>` with its own `title`." }],
  },
];

const harbour = project("harbour");
const doc = (body: string) => `data:text/html;charset=utf-8,${encodeURIComponent(`<!doctype html><html><body style="font-family:system-ui,sans-serif;margin:16px"><h3 style="margin:0 0 8px">${harbour.name}</h3><p style="margin:0">${body}</p></body></html>`)}`;
const frame = { width: "100%", border: "1px solid var(--rebar-color-border)", borderRadius: 8 } as const;

export default function IframePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Iframe</Heading>
      <Text color="secondary">A real iframe that must have an accessible title.</Text>

      <DemoStage
        title="Status page embed"
        caption="Sandboxed document at 200px tall"
        code={CODE}
        states={[
          { label: "Short", node: <Iframe title="Short embed" src={doc("On track.")} style={{ ...frame, height: 130 }} /> },
          { label: "Borderless", node: <Iframe title="Borderless embed" src={doc(`Due ${harbour.due}.`)} style={{ width: "100%", height: 130, border: 0 }} /> },
          { label: "Blank", node: <Iframe title="Blank embed" src="about:blank" style={{ ...frame, height: 130 }} /> },
        ]}
      >
        <Iframe title="Harbour rebrand status page" src={doc(`${harbour.summary} ${harbour.done}% done, due ${harbour.due}.`)} style={{ ...frame, height: 200 }} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project embed" caption="A live status page inside a project card" widths={false}>
        <Card title={harbour.name} style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">The public status page, as the harbour trust sees it.</Text>
            <Iframe title="Public status page" src={doc(`Launch on ${harbour.due}.`)} style={{ ...frame, height: 140 }} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
