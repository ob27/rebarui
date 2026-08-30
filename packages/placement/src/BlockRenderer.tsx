import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Heading,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from "rebar-ui";
import type { Action, Block, FormField } from "./schema";
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

function renderFormField(field: FormField, index: number) {
  switch (field.kind) {
    case "text":
    case "email":
    case "date":
      return (
        <Stack key={index} gap="xs">
          <Text as="label" size="sm">
            {field.label}
          </Text>
          <Input type={field.kind} placeholder={field.placeholder} />
        </Stack>
      );
    case "textarea":
      return (
        <Stack key={index} gap="xs">
          <Text as="label" size="sm">
            {field.label}
          </Text>
          <textarea className="rebar-input" placeholder={field.placeholder} rows={3} />
        </Stack>
      );
    case "select":
      return (
        <Stack key={index} gap="xs">
          <Text as="label" size="sm">
            {field.label}
          </Text>
          <Select
            aria-label={field.label}
            options={field.options.map((o) => ({ value: o, label: o }))}
            placeholder={field.options[0]}
          />
        </Stack>
      );
    case "checkbox":
      return (
        <Checkbox key={index} defaultChecked={field.checked}>
          {field.label}
        </Checkbox>
      );
    default:
      return null;
  }
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

    case "form":
      return (
        <Card key={index} data-rebar-placement-block="form">
          <Stack gap="md">
            {block.heading ? <Heading level={3}>{block.heading}</Heading> : null}
            {block.fields.map((field, fieldIndex) => renderFormField(field, fieldIndex))}
            {block.submitLabel ? <Button variant="primary">{block.submitLabel}</Button> : null}
          </Stack>
        </Card>
      );

    case "table":
      return (
        <Box
          key={index}
          as="table"
          style={{ width: "100%", borderCollapse: "collapse" }}
          data-rebar-placement-block="table"
        >
          <Box as="thead">
            <Box as="tr">
              {block.columns.map((col) => (
                <Box
                  key={col}
                  as="th"
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)",
                  }}
                >
                  {col}
                </Box>
              ))}
              {block.rows.some((r) => r.actionLabel) ? <Box as="th" /> : null}
            </Box>
          </Box>
          <Box as="tbody">
            {block.rows.map((row, rowIndex) => (
              <Box as="tr" key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <Box
                    key={cellIndex}
                    as="td"
                    style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}
                  >
                    {cell}
                  </Box>
                ))}
                {row.actionLabel ? (
                  <Box as="td" style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                    <Button variant="secondary" size="sm">
                      {row.actionLabel}
                    </Button>
                  </Box>
                ) : block.rows.some((r) => r.actionLabel) ? (
                  <Box as="td" style={{ borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }} />
                ) : null}
              </Box>
            ))}
          </Box>
        </Box>
      );

    case "data-list":
      return (
        <Stack key={index} gap="sm" data-rebar-placement-block="data-list">
          {block.items.map((item) => (
            <Card key={item.title}>
              <Stack direction="row" align="center" justify="between">
                <Text as="span">{item.title}</Text>
                {item.badge ? (
                  <Text as="span" size="xs" color="secondary">
                    {item.badge}
                  </Text>
                ) : null}
              </Stack>
            </Card>
          ))}
        </Stack>
      );

    case "filter-bar":
      return (
        <Stack
          key={index}
          direction="row"
          gap="sm"
          align="center"
          justify="between"
          style={{ flexWrap: "wrap" }}
          data-rebar-placement-block="filter-bar"
        >
          <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
            <Input placeholder={block.searchPlaceholder ?? "Search"} style={{ minWidth: 200 }} />
            {block.filterOptions ? (
              <Select
                aria-label={block.filterLabel ?? "Filter"}
                options={block.filterOptions.map((o) => ({ value: o, label: o }))}
                placeholder={block.filterOptions[0]}
              />
            ) : null}
          </Stack>
          {block.actionLabel ? <Button variant="primary">{block.actionLabel}</Button> : null}
        </Stack>
      );

    case "tabs":
      return (
        <Tabs key={index} defaultValue={block.tabs[0]?.label} data-rebar-placement-block="tabs">
          <TabList>
            {block.tabs.map((tab) => (
              <Tab key={tab.label} value={tab.label}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
          {block.tabs.map((tab) => (
            <TabPanel key={tab.label} value={tab.label}>
              <Stack gap="lg" style={{ paddingTop: "var(--rebar-space-md)" }}>
                {tab.blocks.map((inner, innerIndex) => renderBlock(inner, innerIndex, renderLink))}
              </Stack>
            </TabPanel>
          ))}
        </Tabs>
      );

    case "modal":
      return (
        <Dialog
          key={index}
          open
          title={block.title}
          footer={
            <Stack direction="row" gap="sm" justify="end">
              {block.cancelLabel ? <Button variant="secondary">{block.cancelLabel}</Button> : null}
              {block.confirmLabel ? <Button variant="primary">{block.confirmLabel}</Button> : null}
            </Stack>
          }
        >
          <Stack gap="md">
            {block.blocks.map((inner, innerIndex) => renderBlock(inner, innerIndex, renderLink))}
          </Stack>
        </Dialog>
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
