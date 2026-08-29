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
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="5.5" r="1" fill="currentColor" />
      <path
        d="M9 8.25V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.5 2.5v3.2h-3.2"
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
      width="22"
      height="22"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 4.75V9l3 2"
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
        border: "1px solid var(--rebar-color-border-strong, #333)",
        borderRadius: "var(--rebar-radius, 4px)",
        background: "var(--rebar-color-bg-primary, #fff)",
        padding: "var(--rebar-space-lg, 24px)",
      }}
    >
      <Stack direction="column" gap="lg">
        {/* 1. Header row */}
        <Stack direction="row" justify="between" align="center">
          <Heading level={3} style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
            Preview
          </Heading>
          <button
            type="button"
            aria-label="Close preview"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
              color: "var(--rebar-color-text-secondary, #757575)",
            }}
          >
            ×
          </button>
        </Stack>

        {/* 2. Information banner */}
        <Alert
          type="info"
          style={{
            background: "var(--rebar-color-info-bg, #e3f2fd)",
            borderColor: "var(--rebar-color-info, #0288d1)",
          }}
        >
          <Stack direction="row" align="center" justify="between" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              <span style={{ color: "var(--rebar-color-info, #0288d1)" }}>
                <InfoIcon />
              </span>
              <Text size="sm" style={{ color: "var(--rebar-color-text-primary, #212121)" }}>
                Preview — nothing entered here is saved
              </Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <RefreshIcon />
              Reset
            </Button>
          </Stack>
        </Alert>

        {/* 3. Section heading */}
        <Heading level={3} style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
          Checklist
        </Heading>

        {/* 4. Checklist rows */}
        <Stack direction="column" gap="sm">
          {CHECKLIST_ITEMS.map((label) => (
            <Card
              key={label}
              style={{
                padding: "var(--rebar-space-sm, 8px) var(--rebar-space-md, 16px)",
              }}
            >
              <Checkbox defaultChecked={false}>
                <Text size="sm">{label}</Text>
              </Checkbox>
            </Card>
          ))}
        </Stack>

        {/* 5. Final callout */}
        <Alert
          type="warning"
          style={{
            background: "var(--rebar-color-warning-bg, #fff3e0)",
            borderColor: "var(--rebar-color-warning, #f57c00)",
          }}
        >
          <Stack direction="row" align="start" gap="sm">
            <span
              style={{
                color: "var(--rebar-color-warning, #f57c00)",
                marginTop: 2,
              }}
            >
              <ClockIcon />
            </span>
            <Stack direction="column" gap="xs">
              <Text
                style={{
                  fontWeight: "var(--rebar-font-weight-bold, 700)",
                  color: "var(--rebar-color-text-primary, #212121)",
                }}
              >
                DPK can now move to Post-fab In Progress
              </Text>
              <Text size="sm" color="secondary">
                Some required items in this section are still incomplete
              </Text>
            </Stack>
          </Stack>
        </Alert>
      </Stack>
    </Box>
  );
}
