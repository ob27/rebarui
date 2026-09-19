import { Button, Dialog, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [
      {
        kind: "text",
        text: "A modal dialog with a title, body content, and action buttons. Used for focused tasks or confirmations that require user attention.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: '{ type: "modal", title: string, blocks: Construct[], confirmLabel?: string, cancelLabel?: string }',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The block always renders open",
    body: [
      {
        kind: "text",
        text: 'A Packer-authored `modal` block renders its Dialog with `open` forced true and no close handler — it\'s meant for a static-render context (a mockup, a benchmark screenshot) where "what a confirmation dialog looks like" is the point, not a real open/close lifecycle. Dropping one directly into a normal page (as a live block, with no trigger and no way to dismiss it) would hold the whole page hostage, so the interactive example below wraps the real `Dialog` component with a trigger button instead — the same component the block renders under the hood, given a real open/close lifecycle a visitor can actually use.',
      },
    ],
  },
];

export default function ModalPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Modal</Heading>
      <Text color="secondary">
        A modal dialog with a title, body content, and action buttons. Used for focused tasks or confirmations that require user attention.
      </Text>

      <Stack gap="sm">
        <Heading level={3}>Example</Heading>
        <Text size="sm" color="secondary">
          A real, dismissible dialog — click to open it, then close it via Cancel, the × button, Escape, or clicking outside.
        </Text>
        <div>
          <Dialog
            trigger={<Button variant="primary">Delete this record…</Button>}
            title="Delete this record?"
            footer={
              <>
                <Button variant="secondary">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </>
            }
          >
            <Text>This can&apos;t be undone. Any linked references will also be removed.</Text>
          </Dialog>
        </div>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
