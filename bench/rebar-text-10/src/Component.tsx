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
      <circle cx="8" cy="4.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3"
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
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PreviewPanel() {
  return (
    <Box style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <Stack direction="row" align="center" justify="between" style={{ marginBottom: 16 }}>
        <Text as="span" style={{ fontWeight: 700, fontSize: "1.1em" }}>
          Preview
        </Text>
        <button
          type="button"
          aria-label="Close preview"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
            color: "inherit",
          }}
        >
          &times;
        </button>
      </Stack>

      <Alert type="info" style={{ marginBottom: 24 }}>
        <Stack direction="row" align="center" justify="between" gap="sm">
          <Stack direction="row" align="center" gap="sm">
            <InfoIcon />
            <Text as="span" size="sm">
              Preview &mdash; nothing entered here is saved
            </Text>
          </Stack>
          <Button variant="tertiary" size="sm">
            <Stack direction="row" align="center" gap="xs">
              <RefreshIcon />
              <span>Reset</span>
            </Stack>
          </Button>
        </Stack>
      </Alert>

      <Heading level={3} style={{ marginBottom: 12 }}>
        Checklist
      </Heading>

      <Stack direction="column" gap="sm" style={{ marginBottom: 24 }}>
        {CHECKLIST_ITEMS.map((label) => (
          <Card key={label} style={{ padding: "12px 16px" }}>
            <Checkbox>
              <Text as="span" size="sm">
                {label}
              </Text>
            </Checkbox>
          </Card>
        ))}
      </Stack>

      <Card
        style={{
          padding: 16,
          background: "#fdf3e0",
          borderColor: "#e8b64f",
        }}
      >
        <Stack direction="row" align="start" gap="sm">
          <ClockIcon />
          <Stack direction="column" gap="xs">
            <Text as="span" style={{ fontWeight: 700 }}>
              DPK can now move to Post-fab In Progress
            </Text>
            <Text as="span" size="sm" color="secondary">
              Some required items in this section are still incomplete
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
