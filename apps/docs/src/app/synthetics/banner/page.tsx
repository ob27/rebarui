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
        text: "A full-width banner with a message, optional icon, and optional dismiss button. Used for announcements, warnings, or status messages.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"banner\", message: string, icon?: string, dismissible?: boolean, tone?: \"info\" | \"warning\" | \"error\" | \"success\" }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the banner block:",
      },
    ],
  },
];

export default function BannerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Banner</Heading>
      <Text color="secondary">
        A full-width banner with a message, optional icon, and optional dismiss button. Used for announcements, warnings, or status messages.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
