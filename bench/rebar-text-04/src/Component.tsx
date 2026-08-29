import { Alert, Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";

const CHECKLIST_ITEMS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented.",
];

function InfoIcon({ color }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ color, flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.25" y="6.5" width="1.5" height="5" rx="0.75" fill="currentColor" />
      <rect x="7.25" y="3.5" width="1.5" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M13.2 8a5.2 5.2 0 1 1-1.55-3.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.2 2.6v3.1h-3.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5V8l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PreviewPanel() {
  return (
    <Box
      style={{
        maxWidth: 480,
        margin: "0 auto",
        border: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
        borderRadius: "var(--rebar-radius, 4px)",
        background: "var(--rebar-color-bg-primary, #ffffff)",
        padding: "var(--rebar-space-lg, 24px)",
      }}
    >
      <Stack direction="column" gap="lg">
        {/* Header */}
        <Stack direction="row" align="center" justify="between">
          <Heading level={3} style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
            Preview
          </Heading>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close preview"
            style={{ minHeight: 32, minWidth: 32, padding: 0, fontSize: "var(--rebar-font-size-lg, 20px)" }}
          >
            ×
          </Button>
        </Stack>

        {/* Info banner */}
        <Alert
          type="info"
          style={{
            background: "color-mix(in srgb, var(--rebar-color-info, #0288d1) 12%, var(--rebar-color-bg-primary, #ffffff))",
          }}
        >
          <Stack direction="row" align="center" justify="between" gap="md">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon color="var(--rebar-color-info, #0288d1)" />
              <Text size="sm">Preview — nothing entered here is saved</Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <RefreshIcon />
              Reset
            </Button>
          </Stack>
        </Alert>

        {/* Checklist */}
        <Stack direction="column" gap="sm">
          <Heading level={3} style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
            Checklist.
          </Heading>

          <Stack direction="column" gap="sm">
            {CHECKLIST_ITEMS.map((item) => (
              <Card
                key={item}
                style={{
                  padding: "var(--rebar-space-sm, 8px) var(--rebar-space-md, 16px)",
                }}
              >
                <Stack direction="row" align="center" gap="sm">
                  <Checkbox aria-label={item} />
                  <Text size="sm">{item}</Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Callout */}
        <Alert type="warning">
          <Stack direction="row" align="start" gap="sm">
            <ClockIcon />
            <Stack direction="column" gap="xs">
              <Text style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text size="sm" color="secondary">
                Some required items in this section are still incomplete.
              </Text>
            </Stack>
          </Stack>
        </Alert>
      </Stack>
    </Box>
  );
}
