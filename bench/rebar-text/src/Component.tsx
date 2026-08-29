import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Heading,
  Stack,
  Text,
} from "rebar-ui";

const CHECKLIST_LABELS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented.",
];

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7.25" y="6.75" width="1.5" height="4.5" rx="0.75" fill="currentColor" />
      <rect x="7.25" y="3.75" width="1.5" height="1.5" rx="0.75" fill="currentColor" />
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
      focusable="false"
    >
      <path
        d="M13 4.5A5.5 5.5 0 1 0 14.2 8.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13 1.5v3.3h-3.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 4.5V8l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PreviewPanel() {
  return (
    <Box style={{ maxWidth: 560, margin: "0 auto", padding: 16 }}>
      <Stack direction="column" gap="lg">
        <Stack direction="row" align="center" justify="between">
          <Text as="span" style={{ fontWeight: 700 }}>
            Preview
          </Text>
          <Button variant="tertiary" size="sm" aria-label="Close preview">
            ×
          </Button>
        </Stack>

        <Alert type="info">
          <Stack direction="row" align="center" justify="between" gap="md">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon />
              <Text size="sm">Preview — nothing entered here is saved,</Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <RefreshIcon />
              Reset
            </Button>
          </Stack>
        </Alert>

        <Stack direction="column" gap="md">
          <Heading level={3}>Checklist.</Heading>
          <Stack direction="column" gap="sm">
            {CHECKLIST_LABELS.map((label) => (
              <Card key={label}>
                <Checkbox>{label}</Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>

        <Alert type="warning">
          <Stack direction="row" align="start" gap="md">
            <Box style={{ flexShrink: 0, marginTop: 2 }}>
              <ClockIcon />
            </Box>
            <Stack direction="column" gap="xs">
              <Text style={{ fontWeight: 700 }}>
                DPK can now move to Post-fab In Progress,
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
