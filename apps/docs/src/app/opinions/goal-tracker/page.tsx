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
        text: "A progress tracker with an optional aspiration and a list of focus areas — each with an id, text, and nested goals. Presentational only.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"goal-tracker\", aspiration?: string, focusAreas?: GoalTrackerFocusAreaData[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the goal-tracker block:",
      },
    ],
  },
];

export default function GoalTrackerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Goal Tracker</Heading>
      <Text color="secondary">
        A progress tracker with an optional aspiration and a list of focus areas — each with an id, text, and nested goals. Presentational only.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
