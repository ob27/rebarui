import { Box, Container, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Container maxWidth="lg">\n  <Heading level={1}>Page title</Heading>\n  <Text>Body copy...</Text>\n</Container>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Container"] ?? [] },
  {
    type: "doc-section",
    heading: "One job, done once",
    body: [
      {
        kind: "text",
        text: 'Centers and width-constrains page content — before this existed, every bare content page on this site (`/about`, `/heuristics`, `/roadmap`) hand-rolled the exact same inline style (`maxWidth: 800, margin: "0 auto", padding: "var(--rebar-space-xl)"`) independently. Real page-level governance — how wide can content get, how is it centered — the same Order-tier role `AppShell`/`SidebarNav` already play for navigation, just for width instead of chrome.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Named presets, or a literal value",
    body: [
      {
        kind: "text",
        text: '`maxWidth` accepts `"sm"` (480px) / `"md"` (640px) / `"lg"` (800px, the default — matching every existing hand-rolled instance before this component shipped) / `"xl"` (1040px) / `"full"` (no constraint at all), a bare `number` (read as pixels), or any literal CSS length string (`"90vw"`, `"60ch"`).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="container"` on the root.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's own `Layout.Content` doesn't itself width-constrain; a migration typically composes this same centering with whatever the target library's grid/layout primitive supplies, or keeps a plain CSS max-width rule.",
      },
    ],
  },
];

export default function ContainerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Container</Heading>
      <Text color="secondary">
        Centers and width-constrains page content. Every preset below is the same component,
        just a different <code>maxWidth</code>.
      </Text>

      <Stack gap="md">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Box key={size} style={{ background: "var(--rebar-color-bg-secondary, #f5f5f5)" }}>
            <Container maxWidth={size} padding="var(--rebar-space-sm)">
              <Box
                style={{
                  background: "var(--rebar-color-bg-primary, #fff)",
                  border: "1px solid var(--rebar-color-border, #e0e0e0)",
                  borderRadius: 4,
                  padding: "var(--rebar-space-sm)",
                  textAlign: "center",
                }}
              >
                <Text size="sm" color="secondary">
                  maxWidth=&quot;{size}&quot;
                </Text>
              </Box>
            </Container>
          </Box>
        ))}
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
