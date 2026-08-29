import { Alert, Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="7" x2="8" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.87M13.5 2.5v3.5H10"
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
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CHECKLIST_ITEMS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export function PreviewPanel() {
  return (
    <Box style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <Stack gap="lg">
        <Stack direction="row" align="center" justify="between">
          <Text as="span" size="md" style={{ fontWeight: 700 }}>
            Preview
          </Text>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close"
            style={{ minHeight: "auto", padding: 4, lineHeight: 1 }}
          >
            ×
          </Button>
        </Stack>

        <Alert type="info" style={{ background: "#e3f2fd" }}>
          <Stack direction="row" align="center" justify="between">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon />
              <Text as="span" size="sm">
                Preview — nothing entered here is saved.
              </Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <RefreshIcon />
              Reset
            </Button>
          </Stack>
        </Alert>

        <Stack gap="sm">
          <Heading level={3}>Checklist</Heading>
          <Stack gap="sm">
            {CHECKLIST_ITEMS.map((label) => (
              <Card key={label} style={{ padding: 12 }}>
                <Checkbox>{label}</Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>

        <Alert type="warning">
          <Stack direction="row" align="start" gap="sm">
            <Box style={{ marginTop: 2 }}>
              <ClockIcon />
            </Box>
            <Stack gap="xs">
              <Text as="span" size="sm" style={{ fontWeight: 700, color: "var(--rebar-color-text-primary, #212121)" }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text as="span" size="xs" color="secondary">
                Some required items in this section are still incomplete.
              </Text>
            </Stack>
          </Stack>
        </Alert>
      </Stack>
    </Box>
  );
}
