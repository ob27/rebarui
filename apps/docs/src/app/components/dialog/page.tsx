import { Button, Dialog, Heading, Stack, Text } from "rebar-ui";
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
        code: `<Dialog\n  trigger={<Button variant="destructive">Delete account</Button>}\n  title="Delete account"\n  description="This cannot be undone."\n  footer={<>\n    <Button variant="secondary">Cancel</Button>\n    <Button variant="destructive">Delete</Button>\n  </>}\n>\n  <Text size="sm">All of your data will be permanently removed.</Text>\n</Dialog>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Dialog"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`role="dialog"` with `aria-modal="true"` set explicitly — this Radix version doesn\'t set `aria-modal` itself, found by testing against real accessibility assertions, not assumed. Esc closes it, Tab cycles focus only within the dialog while open.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="dialog"` on the content; `data-rebar-part="title" | "description" | "body" | "footer" | "close"`. Radix\'s own `data-state="open"|"closed"` is read directly, not duplicated.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/migrate-antd` renames the element to `Modal` (`open`/`title`/`footer` are already compatible names). `onOpenChange` is renamed to `onCancel`, but flagged with a review comment — AntD's `onCancel` takes no argument, while `onOpenChange(open: boolean)` does. `description` (a prop `Modal` doesn't have) is promoted into a child paragraph instead of being dropped.",
      },
    ],
  },
];

export default function DialogPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Dialog</Heading>
      <Text color="secondary">
        Radix Dialog underneath — close button top-right, backdrop click and Esc both close it,
        focus is trapped while open. A flat <code>open</code>/<code>onOpenChange</code>/
        <code>title</code>/<code>footer</code> API rather than exposing Radix&apos;s nested
        composition directly.
      </Text>

      <LivePreview>
        <Dialog
          trigger={<Button variant="destructive">Delete account</Button>}
          title="Delete account"
          description="This cannot be undone."
          footer={
            <>
              <Button variant="secondary">Cancel</Button>
              <Button variant="destructive">Delete</Button>
            </>
          }
        >
          <Text size="sm">All of your data will be permanently removed.</Text>
        </Dialog>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
