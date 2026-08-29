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
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="4.6" r="0.9" fill="currentColor" />
      <rect x="7.25" y="6.8" width="1.5" height="5.2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M13.7 2.5v3.2h-3.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.3V8l2.6 1.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PreviewPanel() {
  return (
    <Box
      style={{
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "var(--rebar-font-family-sans)",
      }}
    >
      <Stack gap="lg">
        {/* Header row */}
        <Stack direction="row" justify="between" align="center">
          <Heading level={2} style={{ margin: 0 }}>
            Preview
          </Heading>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close preview"
            style={{ lineHeight: 1, padding: "4px 8px", fontSize: 18 }}
          >
            ×
          </Button>
        </Stack>

        {/* Info banner */}
        <Alert
          type="info"
          style={{
            background: "#e6f4fc",
            borderColor: "var(--rebar-color-info, #0288d1)",
          }}
        >
          <Stack direction="row" justify="between" align="center" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              <span style={{ color: "var(--rebar-color-info, #0288d1)", display: "inline-flex" }}>
                <InfoIcon />
              </span>
              <Text size="sm" style={{ margin: 0 }}>
                Preview — nothing entered here is saved.
              </Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <RefreshIcon />
                Reset
              </span>
            </Button>
          </Stack>
        </Alert>

        {/* Checklist section */}
        <Stack gap="sm">
          <Heading level={3} style={{ margin: 0 }}>
            Checklist
          </Heading>

          <Stack gap="sm">
            {CHECKLIST_ITEMS.map((label) => (
              <Card key={label} style={{ padding: "12px 16px" }}>
                <Checkbox>{label}</Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Final callout */}
        <Card
          style={{
            background: "var(--rebar-color-warning-bg, #fff3e0)",
            borderColor: "var(--rebar-color-warning, #f57c00)",
          }}
        >
          <Stack direction="row" align="start" gap="sm">
            <span
              style={{
                color: "var(--rebar-color-warning, #f57c00)",
                display: "inline-flex",
                marginTop: 2,
              }}
            >
              <ClockIcon />
            </span>
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
