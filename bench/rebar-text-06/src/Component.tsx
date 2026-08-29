import { useState } from "react";
import {
  Alert,
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
  const [checked, setChecked] = useState<boolean[]>(() =>
    CHECKLIST_ITEMS.map(() => false),
  );

  const handleReset = () => {
    setChecked(CHECKLIST_ITEMS.map(() => false));
  };

  return (
    <Stack
      direction="column"
      gap="md"
      style={{ maxWidth: 480, padding: 16, boxSizing: "border-box" }}
    >
      {/* Header row */}
      <Stack direction="row" justify="between" align="center">
        <Heading level={2} style={{ margin: 0 }}>
          Preview
        </Heading>
        <Button
          variant="tertiary"
          size="sm"
          aria-label="Close preview"
          style={{ minHeight: 28, minWidth: 28, padding: 0 }}
        >
          <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>
            ×
          </span>
        </Button>
      </Stack>

      {/* Info banner */}
      <Alert type="info">
        <Stack direction="row" align="center" justify="between" gap="sm">
          <Stack direction="row" align="center" gap="sm">
            <span aria-hidden="true" style={{ fontSize: 16 }}>
              ⓘ
            </span>
            <Text as="span" size="sm">
              Preview — nothing entered here is saved.
            </Text>
          </Stack>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <span aria-hidden="true" style={{ marginRight: 4 }}>
              ↻
            </span>
            Reset
          </Button>
        </Stack>
      </Alert>

      {/* Checklist heading */}
      <Heading level={3} style={{ margin: 0 }}>
        Checklist
      </Heading>

      {/* Checklist rows */}
      <Stack direction="column" gap="sm">
        {CHECKLIST_ITEMS.map((label, index) => (
          <Card key={label}>
            <Checkbox
              checked={checked[index]}
              onCheckedChange={(value) => {
                setChecked((prev) => {
                  const next = [...prev];
                  next[index] = value === true;
                  return next;
                });
              }}
            >
              {label}
            </Checkbox>
          </Card>
        ))}
      </Stack>

      {/* Final callout */}
      <Alert type="warning">
        <Stack direction="row" gap="sm" align="start">
          <span aria-hidden="true" style={{ fontSize: 18 }}>
            🕐
          </span>
          <Stack direction="column" gap="xs">
            <Text as="span" size="md" style={{ fontWeight: 700 }}>
              DPK can now move to Post-fab In Progress
            </Text>
            <Text as="span" size="sm" color="secondary">
              Some required items in this section are still incomplete.
            </Text>
          </Stack>
        </Stack>
      </Alert>
    </Stack>
  );
}
