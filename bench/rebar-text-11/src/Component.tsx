import type { SVGProps } from "react";
import { Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
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
    <Box
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "var(--rebar-space-lg)",
      }}
    >
      <Stack direction="column" gap="lg">
        {/* Header row */}
        <Stack direction="row" justify="between" align="center">
          <Text
            as="span"
            style={{ fontWeight: "var(--rebar-font-weight-bold)", fontSize: "var(--rebar-font-size-lg)" }}
          >
            Preview
          </Text>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Close preview"
            style={{ minHeight: 28, padding: "0 var(--rebar-space-sm)", fontSize: "var(--rebar-font-size-md)" }}
          >
            &times;
          </Button>
        </Stack>

        {/* Info banner */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--rebar-space-sm)",
            padding: "var(--rebar-space-sm) var(--rebar-space-md)",
            borderRadius: "var(--rebar-radius)",
            border: "var(--rebar-border-width) solid var(--rebar-color-info)",
            background: "color-mix(in srgb, var(--rebar-color-info) 12%, var(--rebar-color-bg-primary))",
            color: "var(--rebar-color-info)",
          }}
        >
          <Stack direction="row" align="center" gap="sm">
            <InfoIcon />
            <Text as="span" size="sm" style={{ color: "inherit" }}>
              Preview &mdash; nothing entered here is saved
            </Text>
          </Stack>
          <Button
            variant="secondary"
            size="sm"
            style={{ minHeight: 28, padding: "0 var(--rebar-space-sm)", gap: "var(--rebar-space-xs)" }}
          >
            <RefreshIcon />
            Reset
          </Button>
        </Box>

        {/* Checklist section */}
        <Stack direction="column" gap="sm">
          <Heading level={3} style={{ fontSize: "var(--rebar-font-size-md)" }}>
            Checklist
          </Heading>

          <Stack direction="column" gap="sm">
            {CHECKLIST_ITEMS.map((label) => (
              <Card key={label} style={{ padding: "var(--rebar-space-sm) var(--rebar-space-md)" }}>
                <Checkbox id={`checklist-${label}`} defaultChecked={false}>
                  {label}
                </Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Final callout */}
        <Box
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--rebar-space-sm)",
            padding: "var(--rebar-space-md)",
            borderRadius: "var(--rebar-radius)",
            border: "var(--rebar-border-width) solid var(--rebar-color-warning)",
            background: "var(--rebar-color-warning-bg)",
          }}
        >
          <ClockIcon style={{ color: "var(--rebar-color-warning)", flexShrink: 0, marginTop: 2 }} />
          <Stack direction="column" gap="xs">
            <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-bold)" }}>
              DPK can now move to Post-fab In Progress
            </Text>
            <Text as="span" size="sm" color="secondary">
              Some required items in this section are still incomplete
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
