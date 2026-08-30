import { Descriptions, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Descriptions\n  title="Project details"\n  column={2}\n  items={[\n    { label: "Team", value: "Engineering" },\n    { label: "Lead", value: "Priya Shah" },\n    { label: "Status", value: "Active", span: 2 },\n  ]}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Descriptions"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<dl>` with a `<dt>`/`<dd>` pair per item — the same semantic structure a screen reader already understands as label/value data, not a table or a plain grid of divs pretending to be one.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="descriptions"`, `data-rebar-part="title" | "item"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Descriptions` uses nested `Descriptions.Item` children rather than a flat `items` array, and its `column` can be a responsive object (breakpoint → count) rather than a single number — a structural rewrite, not a mechanical rename.",
      },
    ],
  },
];

export default function DescriptionsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Descriptions</Heading>
      <Text color="secondary">
        A label/value grid for read-only structured data — a details view, not a form. Each item
        can span more than one column via <code>span</code>.
      </Text>

      <LivePreview>
        <Descriptions
          title="Project details"
          column={2}
          items={[
            { label: "Team", value: "Engineering" },
            { label: "Lead", value: "Priya Shah" },
            { label: "Started", value: "2026-01-15" },
            { label: "Status", value: "Active" },
            { label: "Description", value: "Redesign of the public marketing site.", span: 2 },
          ]}
        />
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
