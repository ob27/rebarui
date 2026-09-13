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
        text: "A row of identity cards — avatar + name + optional meta line. Arguably an Avatar+Text composition, not a new primitive — exactly the case for a block.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"persona-card\", items: { name: string, meta?: string, avatarSrc?: string, avatarPlaceholder?: boolean }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the persona-card block:",
      },
    ],
  },
];

export default function PersonaCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Persona Card</Heading>
      <Text color="secondary">
        A row of identity cards — avatar + name + optional meta line. Arguably an Avatar+Text composition, not a new primitive — exactly the case for a block.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
