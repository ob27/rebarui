import { BentoCard, BentoGrid, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<BentoGrid>\n  <BentoCard span={3} tone="tint-1" title="Readings" body="..." media={<DeviceFrame>...</DeviceFrame>} />\n  <BentoCard span={3} tone="tint-2" title="Prayers" body="..." />\n  <BentoCard span={2} title="Journal" />\n  <BentoCard span={2} title="Record" />\n  <BentoCard span={2} title="Bible" />\n</BentoGrid>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["BentoGrid"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [
      {
        kind: "text",
        text: "A 6-column grid from 960px up and a single column below (viewport media query). Rows size to their cards' content, and the grid never sets `overflow`, so a card's media is not clipped. Cards choose their column span with `span` (2, 3 or 6; see `BentoCard`).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="bento-grid"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. The nearest Ant Design shape is a `Row` with `Col span` values on a 24-column grid." }],
  },
];

export default function BentoGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BentoGrid</Heading>
      <Text color="secondary">
        A six-column grid of uneven cards, one column on a phone. Pair it with <code>BentoCard</code>.
      </Text>
      <LivePreview>
        <BentoGrid>
          <BentoCard span={3} tone="tint-1" title="Today's readings" body="Laid out to read straight through." />
          <BentoCard span={3} tone="tint-2" title="Prayers" body="With narration." />
          <BentoCard span={2} tone="tint-3" title="Journal" body="Private." />
          <BentoCard span={2} tone="tint-4" title="Record" body="Week by week." />
          <BentoCard span={2} title="Bible" body="Search and read." />
        </BentoGrid>
      </LivePreview>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
