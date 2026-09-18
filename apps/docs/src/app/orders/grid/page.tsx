import { Box, Grid, Heading, Stack, Text } from "rebar-ui";
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
        code: '<Grid minItemWidth={240} gap="md">\n  <Card>...</Card>\n  <Card>...</Card>\n  <Card>...</Card>\n</Grid>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Grid"] ?? [] },
  {
    type: "doc-section",
    heading: "A primitive, not a purpose-shaped block",
    body: [
      {
        kind: "text",
        text: "Distinct from `Stack` (flexbox row/column, for lining things up) and from the placement layer's own `card-grid`/`feature-grid`/`pillar-grid` blocks (each a fixed shape for one specific kind of content — cards, feature tiles, pillar cards — not a primitive a caller lays arbitrary content into). `Grid` is real CSS Grid with no opinion about what's inside it.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Responsive with zero breakpoints",
    body: [
      {
        kind: "text",
        text: 'The default strategy is `minItemWidth` (real `repeat(auto-fit, minmax(...))` CSS), not a fixed `columns` count — resize the window and the demo below reflows down toward one column on its own, with no breakpoint prop, media query, or JS measurement involved. Pass `columns` instead for a fixed count that never reflows (e.g. a strict two-up layout regardless of width).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="grid"` on the root.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Row`/`Col` use a fixed 24-unit span system rather than CSS Grid's `auto-fit`/`minmax` — not a 1:1 codemod target; a migration typically recomputes fixed `columns` spans from the rendered item count instead.",
      },
    ],
  },
];

export default function GridPage() {
  const demoBox = (n: number) => (
    <Box
      key={n}
      style={{
        background: "var(--rebar-color-bg-secondary, #f5f5f5)",
        border: "1px solid var(--rebar-color-border, #e0e0e0)",
        borderRadius: 4,
        padding: "var(--rebar-space-md)",
        textAlign: "center",
      }}
    >
      <Text size="sm" color="secondary">
        Item {n}
      </Text>
    </Box>
  );

  return (
    <Stack gap="lg">
      <Heading level={1}>Grid</Heading>
      <Text color="secondary">
        A general responsive column grid. Resize the window — the row below reflows on its own,
        no breakpoint configuration required.
      </Text>

      <Grid minItemWidth={160} gap="sm">
        {[1, 2, 3, 4, 5, 6].map(demoBox)}
      </Grid>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          Fixed <code>columns=3</code> instead — never reflows:
        </Text>
        <Grid columns={3} gap="sm">
          {[1, 2, 3, 4, 5, 6].map(demoBox)}
        </Grid>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
