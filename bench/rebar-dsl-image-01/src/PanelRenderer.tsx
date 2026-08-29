// The procedural placement engine ("rebar.js", prototype form). This is the ONLY file that
// decides layout — direction, gap, align, nesting. An agent targeting this DSL never writes
// any of that; it only picks an archetype (Section["type"]) and supplies content.
import { Alert, Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";
import type { PanelDocument, Section } from "./schema";
import { ICONS } from "./icons";

function renderAction(action: { label?: string; icon?: keyof typeof ICONS } | undefined) {
  if (!action) return null;
  const Icon = action.icon ? ICONS[action.icon] : null;
  return (
    <Stack direction="row" align="center" gap="xs">
      {Icon ? <Icon /> : null}
      {action.label ? <span>{action.label}</span> : null}
    </Stack>
  );
}

function renderSection(section: Section, index: number) {
  if (section.type === "banner") {
    const Icon = section.icon ? ICONS[section.icon] : null;
    return (
      <Alert key={index} type={section.tone} data-rebar-dsl-section="banner">
        <Stack direction="row" align="center" justify="between" gap="sm">
          <Stack direction="row" align="center" gap="sm">
            {Icon ? <Icon /> : null}
            <Text as="span" size="sm">
              {section.text}
            </Text>
          </Stack>
          {section.action ? (
            <Button variant="secondary" size="sm">
              {renderAction(section.action)}
            </Button>
          ) : null}
        </Stack>
      </Alert>
    );
  }

  if (section.type === "checklist") {
    return (
      <Stack key={index} gap="sm" data-rebar-dsl-section="checklist">
        {section.heading ? <Heading level={3}>{section.heading}</Heading> : null}
        <Stack gap="sm">
          {section.items.map((label) => (
            <Card key={label}>
              <Checkbox>{label}</Checkbox>
            </Card>
          ))}
        </Stack>
      </Stack>
    );
  }

  if (section.type === "callout") {
    const Icon = section.icon ? ICONS[section.icon] : null;
    return (
      <Alert key={index} type={section.tone} data-rebar-dsl-section="callout">
        <Stack direction="row" align="start" gap="sm">
          {Icon ? <Icon /> : null}
          <Stack gap="xs">
            <Text as="span" style={{ fontWeight: 700 }}>
              {section.title}
            </Text>
            {section.subtitle ? (
              <Text as="span" size="sm" color="secondary">
                {section.subtitle}
              </Text>
            ) : null}
          </Stack>
        </Stack>
      </Alert>
    );
  }

  return null;
}

export function PanelRenderer({ doc }: { doc: PanelDocument }) {
  return (
    <Box style={{ maxWidth: 480, margin: "0 auto" }} data-rebar-dsl-root>
      <Stack gap="lg">
        {doc.header ? (
          <Stack direction="row" align="center" justify="between" data-rebar-dsl-section="header">
            <Heading level={2} style={{ margin: 0 }}>
              {doc.header.title}
            </Heading>
            {doc.header.action ? (
              <Button
                variant="tertiary"
                size="sm"
                aria-label={doc.header.action.label ?? "Close"}
              >
                {doc.header.action.icon ? (() => {
                  const HIcon = ICONS[doc.header.action!.icon!];
                  return <HIcon />;
                })() : null}
              </Button>
            ) : null}
          </Stack>
        ) : null}
        {doc.sections.map(renderSection)}
      </Stack>
    </Box>
  );
}
