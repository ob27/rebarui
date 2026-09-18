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
        text: "A component catalog entry — heading, measured/unmeasured tag, description, shape code block, optional implementation code block, and optional live demo blocks. Encapsulates the card-per-construct pattern used across the tier pages (/opinions, /synthetics, /orders) so the chrome around each entry's demo is Packer-printed, not hand-authored JSX.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"construct-entry\", id: string, measured: boolean, description: string, shape: string, code?: string, blocks?: Construct[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the construct-entry block:",
      },
    ],
  },
  {
    type: "construct-entry",
    id: "Callout",
    measured: true,
    description: "A small, static banner pairing a tone, a title, and an optional subtitle. No interaction, no internal state.",
    shape: "{ type: \"callout\", tone: Tone, icon?: IconName, title: string, subtitle?: string }",
    code: '{ type: "callout", tone: "success", title: "Shipped" }',
    blocks: [{ type: "callout", tone: "success", title: "Shipped", subtitle: "This construct-entry card is itself a live construct-entry block." }],
  },
];

export default function ConstructEntryPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Construct Entry</Heading>
      <Text color="secondary">
        A component catalog entry — heading, measured/unmeasured tag, description, shape code
        block, optional implementation code block, and optional live demo blocks.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
