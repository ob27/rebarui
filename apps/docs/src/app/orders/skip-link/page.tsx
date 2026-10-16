import { Box, Card, Heading, SkipLink, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<SkipLink targetId="main-content" />
<header>...</header>
<main id="main-content">...</main>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SkipLink"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Off-screen until focused, then a visible link; never removed from the DOM or the tab order. It lets keyboard users jump past the header and navigation on every page load.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="skip-link"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no skip link; keep this pattern as a plain styled `<a>`." }],
  },
];

const FRAME = {
  position: "relative",
  border: "1px solid var(--rebar-color-border)",
  borderRadius: 8,
  padding: "var(--rebar-space-lg)",
  outline: "none",
  overflow: "hidden",
  background: "var(--rebar-color-bg-primary)",
} as const;

export default function SkipLinkPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>SkipLink</Heading>
      <Text color="secondary">&quot;Skip to main content&quot;, hidden until a keyboard user tabs to it.</Text>

      <DemoStage
        title="Press Tab"
        caption="Click the panel, then press Tab once: the link appears top left"
        code={CODE}
        widths={false}
        states={[
          {
            label: "Focused",
            node: (
              <Box style={{ ...FRAME, minHeight: 64 }}>
                <SkipLink targetId="skip-link-state-target" style={{ transform: "none", clip: "auto", position: "absolute", top: 8, left: 8 }} />
                <Box id="skip-link-state-target" />
              </Box>
            ),
          },
        ]}
      >
        <Box tabIndex={-1} style={FRAME}>
          <SkipLink targetId="skip-link-demo-target" />
          <Text size="sm" color="secondary">Tideline header and navigation sit here.</Text>
          <Box id="skip-link-demo-target" tabIndex={-1} style={{ marginTop: "var(--rebar-space-md)" }}>
            <Text size="sm">The main content the link jumps to: {harbour.name}.</Text>
          </Box>
        </Box>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="First in the tab order, before the nav" widths={false}>
        <Box tabIndex={-1} style={FRAME}>
          <SkipLink targetId="skip-link-ctx-target" />
          <Stack direction="row" gap="md" style={{ marginBottom: "var(--rebar-space-md)" }}>
            <Text size="sm" color="secondary">Projects</Text>
            <Text size="sm" color="secondary">Calendar</Text>
            <Text size="sm" color="secondary">Files</Text>
          </Stack>
          <Box id="skip-link-ctx-target" tabIndex={-1}>
            <Card title={harbour.name}>
              <Text size="sm" color="secondary">{harbour.summary}</Text>
            </Card>
          </Box>
        </Box>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
