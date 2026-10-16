import { Box, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, gbp, project } from "@/fixtures/tideline";

const CODE = `<Box as="section" style={{ padding: 16, border: "1px solid var(--rebar-color-border)" }}>
  Harbour rebrand: 84% done
</Box>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Box"] ?? [] },
  {
    type: "doc-section",
    heading: "Polymorphic",
    body: [{ kind: "text", text: "A plain `<div>`, or any tag via `as`. Accepts every native attribute for that tag. Bionic reading is skipped for code-like tags (`code`, `pre`, `kbd`, `samp`)." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: 'None. `Box` is a bare wrapper and carries no `data-rebar-component`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Replace with a plain HTML element or AntD layout primitives, depending on context." }],
  },
];

const harbour = project("harbour");

export default function BoxPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Box</Heading>
      <Text color="secondary">A plain wrapper element for one-off layout. Any tag via <code>as</code>.</Text>

      <DemoStage
        title="Wrappers"
        caption="A div by default, a section with as"
        code={CODE}
        states={[
          { label: "As article", node: <Box as="article" style={{ padding: 12, border: "1px solid var(--rebar-color-border)", borderRadius: 8 }}><Text size="sm">{harbour.summary}</Text></Box> },
          { label: "As aside", node: <Box as="aside" style={{ padding: 12, background: "var(--rebar-color-tint-3)", borderRadius: 8 }}><Text size="sm">Due {harbour.due}</Text></Box> },
          { label: "As code", node: <Box as="code" style={{ padding: "2px 6px", background: "var(--rebar-color-bg-secondary)", borderRadius: 4 }}>harbour-rebrand</Box> },
        ]}
      >
        <Stack gap="sm">
          <Box style={{ padding: 16, border: "1px solid var(--rebar-color-border)", borderRadius: 8 }}>
            A plain Box (div): {harbour.name}, {harbour.done}% done
          </Box>
          <Box as="section" style={{ padding: 16, background: "var(--rebar-color-bg-secondary)", borderRadius: 8 }}>
            A Box rendered as a real section: due {harbour.due}
          </Box>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Budget strip" caption="Boxes as the one-off cells of a custom row" widths={false}>
        <Card title="Budgets" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
            {PROJECTS.slice(0, 3).map((p) => (
              <Box key={p.id} style={{ padding: 12, background: "var(--rebar-color-bg-secondary)", borderRadius: 8 }}>
                <Text size="xs" color="secondary">{p.name}</Text>
                <Text style={{ fontWeight: 600 }}>{gbp(p.budget)}</Text>
              </Box>
            ))}
          </Box>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
