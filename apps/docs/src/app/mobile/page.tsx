import { Alert, Box, Heading, Stack, Text } from "rebar-ui";

export default function MobileComponentsPage() {
  return (
    <Box as="main" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level={1}>Mobile Components</Heading>
          <Text color="secondary">
            Touch-optimized components and mobile-specific archetypes (an action sheet, a tab bar,
            a picker, pull-to-refresh, swipe actions) — scoped, not started.
          </Text>
        </Stack>
        <Alert type="info" title="Coming soon, not yet built">
          <Text size="sm">
            This isn&apos;t a rewrite of the web component set for mobile — it&apos;s a small,
            genuinely mobile-only set of archetypes for the handful of patterns a touch interface
            actually needs that a web page doesn&apos;t. Nothing here yet. If there&apos;s a
            specific pattern you need, open an issue on{" "}
            <a href="https://github.com/ob27/rebarui/issues" className="rebar-link">
              GitHub
            </a>{" "}
            — real, specific requests will shape this ahead of an abstract roadmap.
          </Text>
        </Alert>
      </Stack>
    </Box>
  );
}
