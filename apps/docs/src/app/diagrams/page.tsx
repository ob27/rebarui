import { Alert, Box, Heading, Stack, Text } from "rebar-ui";

export default function DiagramsPage() {
  return (
    <Box as="main" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level={1}>Diagrams</Heading>
          <Text color="secondary">
            Flowcharts, sequence diagrams, and org charts as named archetypes in{" "}
            <code>@rebar-ui/placement</code> — described the same way every other page on this
            site is, not hand-drawn SVG.
          </Text>
        </Stack>
        <Alert type="info" title="Coming soon, not yet built">
          <Text size="sm">
            Not started yet — this section exists so the intent is stated plainly rather than
            silently absent. If there&apos;s a specific diagram type you&apos;d actually use, open
            an issue on{" "}
            <a href="https://github.com/ob27/rebarui/issues" className="rebar-link">
              GitHub
            </a>
            .
          </Text>
        </Alert>
      </Stack>
    </Box>
  );
}
