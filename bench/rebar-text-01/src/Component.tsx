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

export function PreviewPanel() {
  return (
    <Box style={{ maxWidth: 480, margin: "0 auto" }}>
      <Card>
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
              style={{ minHeight: 28, padding: "0 10px", fontSize: 16, lineHeight: 1 }}
            >
              ×
            </Button>
          </Stack>

          {/* Info banner */}
          <Alert
            type="info"
            style={{ backgroundColor: "#e3f2fd", borderColor: "#90caf9" }}
          >
            <Stack direction="row" align="center" justify="between" gap="sm">
              <Stack direction="row" align="center" gap="sm">
                <span aria-hidden="true" style={{ fontSize: 16 }}>
                  ⓘ
                </span>
                <Text size="sm">
                  Preview — nothing entered here is saved
                </Text>
              </Stack>
              <Button variant="secondary" size="sm">
                <span aria-hidden="true">⟳</span>
                Reset
              </Button>
            </Stack>
          </Alert>

          {/* Checklist section */}
          <Heading level={3} style={{ margin: 0 }}>
            Checklist
          </Heading>

          <Stack gap="sm">
            {CHECKLIST_ITEMS.map((label) => (
              <Card key={label} style={{ padding: 12 }}>
                <Checkbox>{label}</Checkbox>
              </Card>
            ))}
          </Stack>

          {/* Final status callout */}
          <Alert type="warning">
            <Stack direction="row" gap="sm" align="start">
              <span aria-hidden="true" style={{ fontSize: 18 }}>
                🕐
              </span>
              <Stack gap="xs">
                <Text style={{ fontWeight: 700, color: "inherit" }}>
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
    </Box>
  );
}
