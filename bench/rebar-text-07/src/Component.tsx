import type { CSSProperties, ReactNode } from "react";
import { Alert, Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";

const CHECKLIST_ITEMS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented.",
];

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path
        d="M1 1 L11 11 M11 1 L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="5.5" r="1" fill="currentColor" />
      <path d="M9 8.5 V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.87"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M13.5 2.5 V5.5 H10.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 4.5 V9 L12 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const infoBannerStyle: CSSProperties = {
  background: "var(--rebar-color-info-bg, #e1f5fe)",
};

const calloutCardStyle: CSSProperties = {
  background: "var(--rebar-color-warning-bg, #fff3e0)",
  borderColor: "var(--rebar-color-warning, #f57c00)",
};

const iconButtonStyle: CSSProperties = {
  padding: "4px",
  lineHeight: 0,
  minHeight: 0,
};

function ChecklistRow({ label }: { label: string }): ReactNode {
  return (
    <Card style={{ padding: "12px 16px" }}>
      <Stack direction="row" align="center" gap="sm">
        <Checkbox aria-label={label} />
        <Text as="span">{label}</Text>
      </Stack>
    </Card>
  );
}

export function PreviewPanel() {
  return (
    <Box
      style={{
        maxWidth: 520,
        margin: "0 auto",
        background: "var(--rebar-color-bg-primary, #ffffff)",
      }}
    >
      <Stack direction="column" gap="md">
        {/* Header */}
        <Stack direction="row" align="center" justify="between">
          <Heading level={2} style={{ margin: 0 }}>
            Preview
          </Heading>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close preview"
            style={iconButtonStyle}
          >
            <CloseIcon />
          </Button>
        </Stack>

        {/* Info banner */}
        <Alert type="info" style={infoBannerStyle}>
          <Stack direction="row" align="center" justify="between" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              <InfoIcon />
              <Text as="span" size="sm" style={{ margin: 0 }}>
                Preview — nothing entered here is saved
              </Text>
            </Stack>
            <Button variant="secondary" size="sm">
              <Stack direction="row" align="center" gap="xs">
                <RefreshIcon />
                <span>Reset</span>
              </Stack>
            </Button>
          </Stack>
        </Alert>

        {/* Checklist */}
        <Heading level={3} style={{ margin: 0 }}>
          Checklist
        </Heading>

        <Stack direction="column" gap="sm">
          {CHECKLIST_ITEMS.map((label) => (
            <ChecklistRow key={label} label={label} />
          ))}
        </Stack>

        {/* Callout */}
        <Card style={calloutCardStyle}>
          <Stack direction="row" gap="sm" align="start">
            <ClockIcon />
            <Stack direction="column" gap="xs">
              <Text as="span" style={{ margin: 0, fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text as="span" size="sm" color="secondary" style={{ margin: 0 }}>
                Some required items in this section are still incomplete.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
