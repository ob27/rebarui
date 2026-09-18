import { Box, Col, Heading, Row, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const swatch = (label: string) => (
  <Box
    key={label}
    style={{
      background: "var(--rebar-color-bg-secondary, #f5f5f5)",
      border: "1px solid var(--rebar-color-border, #e0e0e0)",
      borderRadius: 4,
      padding: "var(--rebar-space-md)",
      textAlign: "center",
    }}
  >
    <Text size="sm" color="secondary">
      {label}
    </Text>
  </Box>
);

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Row gutter="md">\n  <Col span={16}>...</Col>\n  <Col span={8}>...</Col>\n</Row>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Row"] ?? [] },
  { type: "props-table", heading: "Col props", rows: componentProps["Col"] ?? [] },
  {
    type: "doc-section",
    heading: "For asymmetric layouts — Grid is for uniform ones",
    body: [
      {
        kind: "text",
        text: 'A fixed 24-unit span grid, the same mental model AntD\'s own `Row`/`Col` and Bootstrap\'s grid both use: `Row` establishes the 24-column track, `Col` claims a `span` of it (and an optional `offset`). Distinct from `Grid` — which is either a fixed equal-width `columns` count or a responsive `minItemWidth` reflow, with no per-item span control. Reach for `Grid` first for a uniform card/tile layout; reach for `Row`/`Col` when different regions of the same row need deliberately different widths (a 16/8 split, a 6/12/6 split).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="row"` on the root; `data-rebar-component="col"` on each column.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Row`/`Col` use this exact fixed 24-unit span system — a near 1:1 codemod target, not yet covered.",
      },
    ],
  },
];

export default function RowPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Row / Col</Heading>
      <Text color="secondary">
        A fixed 24-unit span grid — for asymmetric layouts a uniform <code>Grid</code> can&apos;t
        express.
      </Text>

      <Stack gap="sm">
        <Text size="sm" color="secondary">
          16 / 8 split
        </Text>
        <Row gutter="sm">
          <Col span={16}>{swatch("span=16")}</Col>
          <Col span={8}>{swatch("span=8")}</Col>
        </Row>
      </Stack>

      <Stack gap="sm">
        <Text size="sm" color="secondary">
          6 / 12 / 6 split
        </Text>
        <Row gutter="sm">
          <Col span={6}>{swatch("span=6")}</Col>
          <Col span={12}>{swatch("span=12")}</Col>
          <Col span={6}>{swatch("span=6")}</Col>
        </Row>
      </Stack>

      <Stack gap="sm">
        <Text size="sm" color="secondary">
          span=12 offset=6 — a centered column (6 empty units on each side)
        </Text>
        <Row gutter="sm">
          <Col span={12} offset={6}>
            {swatch("span=12 offset=6")}
          </Col>
        </Row>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
