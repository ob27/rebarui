import { Box, Heading, Stack, Text } from "rebar-ui";

function Code({ children }: { children: string }) {
  return (
    <Box
      as="pre"
      style={{
        background: "var(--rebar-color-bg-secondary, #f5f5f5)",
        padding: "var(--rebar-space-md)",
        borderRadius: 4,
        overflowX: "auto",
      }}
    >
      <code>{children}</code>
    </Box>
  );
}

export default function GettingStartedPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Getting Started</Heading>

      <Stack gap="sm">
        <Heading level={2}>1. Install</Heading>
        <Code>{`npm install rebar-ui @rebar-ui/theme-sketch`}</Code>
        <Text size="sm" color="secondary">
          Rebar is headless-first: the component logic lives in <code>rebar-ui</code>, the look
          lives in a separate theme package. Swap <code>@rebar-ui/theme-sketch</code> for{" "}
          <code>@rebar-ui/theme-clean</code> any time without touching component code.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>2. Import the stylesheets and set a theme attribute</Heading>
        <Code>{`import "rebar-ui/style.css";
import "@rebar-ui/theme-sketch/theme.css";`}</Code>
        <Text size="sm" color="secondary">
          Then set <code>data-rebar-theme=&quot;sketch&quot;</code> on your root element (
          <code>&lt;html&gt;</code> in Next.js&apos;s App Router). Dark mode is orthogonal — add{" "}
          <code>data-theme=&quot;dark&quot;</code> alongside it.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>3. Use a component</Heading>
        <Code>{`import { Button } from "rebar-ui";

export function SaveButton() {
  return <Button variant="primary">Save changes</Button>;
}`}</Code>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Next</Heading>
        <Text size="sm" color="secondary">
          Browse the <a href="/components">component reference</a>, or read about{" "}
          <a href="/docs/theming">the default heuristics baked in</a>.
        </Text>
      </Stack>
    </Stack>
  );
}
