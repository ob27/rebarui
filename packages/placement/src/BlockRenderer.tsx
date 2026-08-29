import type { ReactNode } from "react";
import { Alert, Box, Button, Card, Checkbox, Heading, Stack, Text } from "rebar-ui";
import type { Action, Block } from "./schema";
import { ICONS } from "./icons";

export interface BlockRendererProps {
  blocks: Block[];
  /**
   * How an `Action`/pillar-grid `href` becomes a link. Defaults to a plain `<a>` — pass your
   * framework's link component (e.g. Next.js `Link`) to get client-side navigation instead of a
   * full page load. Kept out of this package's own dependencies on purpose: the placement layer
   * shouldn't need to know which framework it's running inside.
   */
  renderLink?: (props: { href: string; children: ReactNode }) => ReactNode;
}

const defaultRenderLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href}>{children}</a>
);

function renderActionContent(action: Action | undefined) {
  if (!action) return null;
  const Icon = action.icon ? ICONS[action.icon] : null;
  return (
    <Stack direction="row" align="center" gap="xs">
      {Icon ? <Icon /> : null}
      {action.label ? <span>{action.label}</span> : null}
    </Stack>
  );
}

function renderAction(
  action: Action | undefined,
  renderLink: NonNullable<BlockRendererProps["renderLink"]>,
) {
  if (!action) return null;
  const fallbackLabel = action.icon
    ? action.icon.charAt(0).toUpperCase() + action.icon.slice(1)
    : "Action";
  const content = (
    <Button variant="secondary" size="sm" aria-label={action.label ?? fallbackLabel}>
      {renderActionContent(action)}
    </Button>
  );
  return action.href ? renderLink({ href: action.href, children: content }) : content;
}

function renderBlock(
  block: Block,
  index: number,
  renderLink: NonNullable<BlockRendererProps["renderLink"]>,
) {
  switch (block.type) {
    case "header": {
      const Icon = block.action?.icon ? ICONS[block.action.icon] : null;
      return (
        <Stack
          key={index}
          direction="row"
          align="center"
          justify="between"
          data-rebar-placement-block="header"
        >
          <Heading level={2} style={{ margin: 0 }}>
            {block.title}
          </Heading>
          {block.action ? (
            <Button variant="tertiary" size="sm" aria-label={block.action.label ?? "Close"}>
              {Icon ? <Icon /> : null}
            </Button>
          ) : null}
        </Stack>
      );
    }

    case "banner": {
      const Icon = block.icon ? ICONS[block.icon] : null;
      return (
        <Alert key={index} type={block.tone} data-rebar-placement-block="banner">
          <Stack direction="row" align="center" justify="between" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              {Icon ? <Icon /> : null}
              <Text as="span" size="sm">
                {block.text}
              </Text>
            </Stack>
            {renderAction(block.action, renderLink)}
          </Stack>
        </Alert>
      );
    }

    case "checklist":
      return (
        <Stack key={index} gap="sm" data-rebar-placement-block="checklist">
          {block.heading ? <Heading level={3}>{block.heading}</Heading> : null}
          <Stack gap="sm">
            {block.items.map((label) => (
              <Card key={label}>
                <Checkbox>{label}</Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>
      );

    case "callout": {
      const Icon = block.icon ? ICONS[block.icon] : null;
      return (
        <Alert key={index} type={block.tone} data-rebar-placement-block="callout">
          <Stack direction="row" align="start" gap="sm">
            {Icon ? <Icon /> : null}
            <Stack gap="xs">
              <Text as="span" style={{ fontWeight: 700 }}>
                {block.title}
              </Text>
              {block.subtitle ? (
                <Text as="span" size="sm" color="secondary">
                  {block.subtitle}
                </Text>
              ) : null}
            </Stack>
          </Stack>
        </Alert>
      );
    }

    case "feature-grid":
      return (
        <Stack
          key={index}
          direction="row"
          gap="xl"
          style={{ flexWrap: "wrap", justifyContent: "center" }}
          data-rebar-placement-block="feature-grid"
        >
          {block.items.map((item) => (
            <Stack key={item.title} gap="xs" style={{ maxWidth: 200, textAlign: "center" }}>
              <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                {item.title}
              </Text>
              <Text size="xs" color="secondary">
                {item.body}
              </Text>
            </Stack>
          ))}
        </Stack>
      );

    case "pillar-grid":
      return (
        <Stack
          key={index}
          direction="row"
          gap="lg"
          style={{ flexWrap: "wrap" }}
          data-rebar-placement-block="pillar-grid"
        >
          {block.items.map((item) => (
            <Card key={item.title} style={{ flex: "1 1 260px" }}>
              <Stack gap="sm">
                <Heading level={3}>{item.title}</Heading>
                <Text size="sm" color="secondary">
                  {item.body}
                </Text>
                {renderLink({
                  href: item.href,
                  children: (
                    <Button variant="secondary" size="sm">
                      {item.cta}
                    </Button>
                  ),
                })}
              </Stack>
            </Card>
          ))}
        </Stack>
      );

    default:
      return null;
  }
}

export function BlockRenderer({ blocks, renderLink = defaultRenderLink }: BlockRendererProps) {
  return (
    <Box data-rebar-placement-root>
      <Stack gap="lg">{blocks.map((block, index) => renderBlock(block, index, renderLink))}</Stack>
    </Box>
  );
}
