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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="11" x2="12" y2="16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1.15" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M4 4v6h6M20 20v-6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 15a7.5 7.5 0 0 0 13-4.5M18.5 9A7.5 7.5 0 0 0 5.5 13.5"
        stroke="currentColor"
        strokeWidth="2"
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
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, color: "var(--rebar-color-warning, #f57c00)" }}
    >
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5.3l3.6 2.1"
        stroke="currentColor"
        strokeWidth="2"
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
        maxWidth: 560,
        margin: "0 auto",
        padding: "var(--rebar-space-lg, 24px)",
      }}
    >
      <Stack gap="lg">
        {/* Header row */}
        <Stack direction="row" justify="between" align="center">
          <Heading level={2} style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
            Preview
          </Heading>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close preview"
            style={{ lineHeight: 1, fontSize: "var(--rebar-font-size-lg, 20px)" }}
          >
            ×
          </Button>
        </Stack>

        {/* Info banner */}
        <Alert type="info">
          <Stack direction="row" justify="between" align="center" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon />
              <Text size="sm" style={{ margin: 0 }}>
                Preview — nothing entered here is saved.
              </Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <RefreshIcon />
              Reset
            </Button>
          </Stack>
        </Alert>

        {/* Section heading */}
        <Heading level={3} style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
          Checklist
        </Heading>

        {/* Checklist rows */}
        <Stack gap="sm">
          {CHECKLIST_ITEMS.map((label) => (
            <Card key={label} style={{ padding: "var(--rebar-space-sm, 8px) var(--rebar-space-md, 16px)" }}>
              <Checkbox aria-label={label}>{label}</Checkbox>
            </Card>
          ))}
        </Stack>

        {/* Final callout */}
        <Card
          style={{
            backgroundColor: "var(--rebar-color-warning-bg, #fff3e0)",
            borderColor: "var(--rebar-color-warning, #f57c00)",
          }}
        >
          <Stack direction="row" align="start" gap="sm">
            <ClockIcon />
            <Stack gap="xs">
              <Text style={{ margin: 0, fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text size="sm" color="secondary" style={{ margin: 0 }}>
                Some required items in this section are still incomplete.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
