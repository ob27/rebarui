import { Alert, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";

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
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.25" y="6.5" width="1.5" height="5" rx="0.5" fill="currentColor" />
      <rect x="7.25" y="3.75" width="1.5" height="1.5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 2.5V5.5H9"
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
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5V8L10.5 9.5"
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
    <Card style={{ maxWidth: 560 }}>
      <Stack direction="column" gap="lg">
        {/* Header row */}
        <Stack direction="row" align="center" justify="between">
          <Text as="span" size="md" style={{ fontWeight: 700 }}>
            Preview
          </Text>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close preview"
            style={{ minHeight: 28, padding: "0 8px", fontSize: 16, lineHeight: 1 }}
          >
            ×
          </Button>
        </Stack>

        {/* Info banner */}
        <Alert type="info" style={{ backgroundColor: "#e3f2fd" }}>
          <Stack direction="row" align="center" justify="between" gap="md">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon />
              <Text size="sm">Preview — nothing entered here is saved.</Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <RefreshIcon />
              Reset
            </Button>
          </Stack>
        </Alert>

        {/* Checklist */}
        <Stack direction="column" gap="md">
          <Heading level={3}>Checklist</Heading>

          <Stack direction="column" gap="sm">
            {CHECKLIST_ITEMS.map((item) => (
              <Card key={item} style={{ padding: "12px 16px" }}>
                <Checkbox>{item}</Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Callout */}
        <Alert type="warning">
          <Stack direction="row" align="start" gap="sm">
            <ClockIcon />
            <Stack direction="column" gap="xs">
              <Text style={{ fontWeight: 700 }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text size="sm" color="secondary">
                Some required items in this section are still incomplete.
              </Text>
            </Stack>
          </Stack>
        </Alert>
      </Stack>
    </Card>
  );
}
