import { Button, Dialog, Heading, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";
import { PropsTable } from "@/components/PropsTable";

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

      <Stack gap="xs">
        <Heading level={2}>Code</Heading>
        <Text
          as="pre"
          size="sm"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          {`<Dialog
  trigger={<Button variant="destructive">Delete account</Button>}
  title="Delete account"
  description="This cannot be undone."
  footer={<>
    <Button variant="secondary">Cancel</Button>
    <Button variant="destructive">Delete</Button>
  </>}
>
  <Text size="sm">All of your data will be permanently removed.</Text>
</Dialog>`}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Props</Heading>
        <PropsTable component="Dialog" />
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Accessibility</Heading>
        <Text size="sm">
          <code>role=&quot;dialog&quot;</code> with <code>aria-modal=&quot;true&quot;</code> set
          explicitly — this Radix version doesn&apos;t set <code>aria-modal</code> itself, found
          by testing against real accessibility assertions, not assumed. Esc closes it, Tab cycles
          focus only within the dialog while open.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>data-rebar-* attributes</Heading>
        <Text size="sm">
          <code>data-rebar-component=&quot;dialog&quot;</code> on the content;{" "}
          <code>data-rebar-part=&quot;title&quot; | &quot;description&quot; | &quot;body&quot; |
          &quot;footer&quot; | &quot;close&quot;</code>. Radix&apos;s own{" "}
          <code>data-state=&quot;open&quot;|&quot;closed&quot;</code> is read directly, not
          duplicated.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Migrating to Ant Design</Heading>
        <Text size="sm">
          <code>@rebar-ui/migrate-antd</code> renames the element to <code>Modal</code>
          (<code>open</code>/<code>title</code>/<code>footer</code> are already compatible names).{" "}
          <code>onOpenChange</code> is renamed to <code>onCancel</code>, but flagged with a review
          comment — AntD&apos;s <code>onCancel</code> takes no argument, while{" "}
          <code>onOpenChange(open: boolean)</code> does. <code>description</code> (a prop{" "}
          <code>Modal</code> doesn&apos;t have) is promoted into a child paragraph instead of
          being dropped.
        </Text>
      </Stack>
    </Stack>
  );
}
