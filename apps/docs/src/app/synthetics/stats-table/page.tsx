import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [
      {
        kind: "text",
        text: "A small, static, presentational summary table — headers plus a plain grid of string/number cells, no sorting/selection/pagination.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"stats-table\", headers: string[], rows: (string | number)[][] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the stats-table block:",
      },
    ],
  },
];

export default function StatsTablePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Stats Table</Heading>
      <Text color="secondary">
        A small, static, presentational summary table — headers plus a plain grid of string/number cells, no sorting/selection/pagination.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
