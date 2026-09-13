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
        text: "One entry of a heuristics/design-principles page: a heading, a bolded one-line rule, rationale prose, and an optional code sample and/or live example.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"heuristic\", id: string, title: string, rule: string, rationale: ProseNode[], code?: string, exampleBlocks?: Construct[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the heuristic block:",
      },
    ],
  },
];

export default function HeuristicPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Heuristic</Heading>
      <Text color="secondary">
        One entry of a heuristics/design-principles page: a heading, a bolded one-line rule, rationale prose, and an optional code sample and/or live example.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
