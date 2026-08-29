import { Alert, Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";

const CHECKLIST_ITEMS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="7" x2="8" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.5" r="1" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3.2h-3.2"
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
      <path
        d="M8 4.5v3.8l2.5 1.5"
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
    <Box style={{ maxWidth: 480 }}>
      <Stack direction="column" gap="lg">
        {/* Header */}
        <Stack direction="row" align="center" justify="between">
          <Text as="span" style={{ fontWeight: 700 }}>
            Preview
          </Text>
          <button
            type="button"
            aria-label="Close"
            style={{
              width: 24,
              height: 24,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              color: "inherit",
            }}
          >
            ×
          </button>
        </Stack>

        {/* Info banner */}
        <Alert type="info">
          <Stack direction="row" align="center" justify="between" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon />
              <Text as="span" size="sm">
                Preview — nothing entered here is saved.
              </Text>
            </Stack>
            <Button type="button" variant="secondary" size="sm">
              <Stack direction="row" align="center" gap="xs">
                <RefreshIcon />
                <span>Reset</span>
              </Stack>
            </Button>
          </Stack>
        </Alert>

        {/* Checklist */}
        <Stack direction="column" gap="sm">
          <Heading level={3}>Checklist</Heading>

          <Stack direction="column" gap="sm">
            {CHECKLIST_ITEMS.map((label) => (
              <Card key={label}>
                <Stack direction="row" align="center" gap="sm">
                  <Checkbox aria-label={label} />
                  <Text as="span" size="sm">
                    {label}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Final callout */}
        <Card
          style={{
            background: "#fdf3e0",
            borderColor: "#e8c37a",
          }}
        >
          <Stack direction="row" align="start" gap="sm">
            <Box style={{ color: "#a86b12", marginTop: 2 }}>
              <ClockIcon />
            </Box>
            <Stack direction="column" gap="xs">
              <Text as="span" style={{ fontWeight: 700 }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text as="span" size="sm" color="secondary">
                Some required items in this section are still incomplete.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
