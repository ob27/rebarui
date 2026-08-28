import { Button, Heading, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";
import { PropsTable } from "@/components/PropsTable";

export default function ButtonPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Button</Heading>
      <Text color="secondary">
        A real <code>&lt;button&gt;</code> element. One primary action per screen is the
        convention (Nielsen #6 — recognition over recall); loading disables the button and shows
        a spinner, preventing double-submit.
      </Text>

      <LivePreview>
        <Stack gap="sm">
          <Stack direction="row" gap="sm">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="destructive">Destructive</Button>
          </Stack>
          <Stack direction="row" gap="sm">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
          </Stack>
        </Stack>
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
          {`<Button variant="primary">Save changes</Button>
<Button variant="destructive" onClick={handleDelete}>Delete</Button>`}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Props</Heading>
        <PropsTable component="Button" />
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Accessibility</Heading>
        <Text size="sm">
          Real <code>&lt;button type="button"&gt;</code> by default (pass <code>type="submit"</code>{" "}
          for form submission) — Tab to focus, Enter/Space to activate, native focus-visible
          outline. <code>aria-busy</code> is set while <code>loading</code>.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>data-rebar-* attributes</Heading>
        <Text size="sm">
          <code>data-rebar-component=&quot;button&quot;</code>,{" "}
          <code>data-rebar-variant</code>, <code>data-rebar-size</code>,{" "}
          <code>data-rebar-state=&quot;idle&quot; | &quot;loading&quot;</code>.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Migrating to Ant Design</Heading>
        <Text size="sm">
          <code>@rebar-ui/migrate-antd</code> renames <code>variant</code> to AntD&apos;s{" "}
          <code>type</code>/<code>danger</code> vocabulary and <code>size=&quot;sm&quot;|&quot;md&quot;|&quot;lg&quot;</code>{" "}
          to <code>&quot;small&quot;|&quot;middle&quot;|&quot;large&quot;</code>. If the element
          already has a native <code>type</code> (e.g. <code>type=&quot;submit&quot;</code>),
          it&apos;s moved to AntD&apos;s <code>htmlType</code> prop first, since AntD&apos;s own{" "}
          <code>type</code> means visual variant, not HTML button type.
        </Text>
      </Stack>
    </Stack>
  );
}
