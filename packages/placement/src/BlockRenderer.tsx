import type { CSSProperties, ReactNode } from "react";
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
import type { Action, Block, FormField, ProseNode } from "./schema";
import { ICONS } from "./icons";

// Parses the tiny inline markup `doc-section` prose supports: `` `code` `` and `[label](href)`.
// Deliberately not a markdown library — two patterns, checked in document order, everything else
// passes through as plain text. Good enough for the prose this project's own docs actually need;
// anything more ambitious belongs in a real markdown renderer, not this schema.
const INLINE_MARKUP = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;

const propsTableCellStyle: CSSProperties = {
  padding: "var(--rebar-space-sm, 8px)",
  borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)",
  verticalAlign: "top",
};

function renderInline(text: string, renderLink: NonNullable<BlockRendererProps["renderLink"]>) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  INLINE_MARKUP.lastIndex = 0;
  while ((match = INLINE_MARKUP.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(<code key={key++}>{match[1]}</code>);
    } else {
      nodes.push(<span key={key++}>{renderLink({ href: match[3]!, children: match[2] })}</span>);
    }
    lastIndex = INLINE_MARKUP.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderProseNode(
  node: ProseNode,
  index: number,
  renderLink: NonNullable<BlockRendererProps["renderLink"]>,
) {
  switch (node.kind) {
    case "text":
      return (
        <Text key={index} size="sm" color="secondary">
          {renderInline(node.text, renderLink)}
        </Text>
      );
    case "code":
      return (
        <Box
          key={index}
          as="pre"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          <code>{node.code}</code>
        </Box>
      );
    case "list": {
      const ListTag = node.ordered ? "ol" : "ul";
      return (
        <Box key={index} as={ListTag} style={{ paddingLeft: "var(--rebar-space-lg)" }}>
          {node.items.map((item, itemIndex) => (
            <Box as="li" key={itemIndex} style={{ marginBottom: "var(--rebar-space-xs)" }}>
              <Text as="span" size="sm" color="secondary">
                {renderInline(item, renderLink)}
              </Text>
            </Box>
          ))}
        </Box>
      );
    }
    default:
      return null;
  }
}

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
  <a href={href} className="rebar-link">
    {children}
  </a>
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

// A stable, schema-shaped address for one block or one item inside it — e.g.
// `blocks[2].items[3]` or `blocks[1].tabs[0].blocks[1]`. Mirrors the real property names in
// schema.ts (items/rows/fields/tabs/blocks) on purpose: this is meant to be pasted directly into
// a follow-up prompt ("change blocks[2].items[3]'s badge to Draft"), not just a debugging label.
// Exposed on the DOM as `data-rebar-block-path` so the DevTools ComponentInspector can surface it
// on hover — precise, click-driven feedback into the DSL instead of describing a screenshot.
function itemPath(blockPath: string, arrayName: string, itemIndex: number) {
  return `${blockPath}.${arrayName}[${itemIndex}]`;
}

function renderFormField(field: FormField, index: number, blockPath: string) {
  const fieldPath = itemPath(blockPath, "fields", index);
  switch (field.kind) {
    case "text":
    case "email":
    case "date":
      return (
        <Stack key={index} gap="xs" data-rebar-block-path={fieldPath} data-rebar-block-item-label={field.label}>
          <Text as="label" size="sm">
            {field.label}
          </Text>
          <Input type={field.kind} placeholder={field.placeholder} />
        </Stack>
      );
    case "textarea":
      return (
        <Stack key={index} gap="xs" data-rebar-block-path={fieldPath} data-rebar-block-item-label={field.label}>
          <Text as="label" size="sm">
            {field.label}
          </Text>
          <textarea className="rebar-input" placeholder={field.placeholder} rows={3} />
        </Stack>
      );
    case "select":
      return (
        <Stack key={index} gap="xs" data-rebar-block-path={fieldPath} data-rebar-block-item-label={field.label}>
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
        <Checkbox
          key={index}
          defaultChecked={field.checked}
          data-rebar-block-path={fieldPath}
          data-rebar-block-item-label={field.label}
        >
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
  parentPath = "blocks",
) {
  const path = `${parentPath}[${index}]`;
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
          data-rebar-block-path={path}
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
        <Alert key={index} type={block.tone} data-rebar-placement-block="banner" data-rebar-block-path={path}>
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
        <Stack key={index} gap="sm" data-rebar-placement-block="checklist" data-rebar-block-path={path}>
          {block.heading ? <Heading level={3}>{block.heading}</Heading> : null}
          <Stack gap="sm">
            {block.items.map((label, itemIndex) => (
              <Card
                key={label}
                data-rebar-block-path={itemPath(path, "items", itemIndex)}
                data-rebar-block-item-label={label}
              >
                <Checkbox>{label}</Checkbox>
              </Card>
            ))}
          </Stack>
        </Stack>
      );

    case "callout": {
      const Icon = block.icon ? ICONS[block.icon] : null;
      return (
        <Alert key={index} type={block.tone} data-rebar-placement-block="callout" data-rebar-block-path={path}>
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
          data-rebar-block-path={path}
        >
          {block.items.map((item, itemIndex) => (
            <Stack
              key={item.title}
              gap="xs"
              style={{ maxWidth: 200, textAlign: "center" }}
              data-rebar-block-path={itemPath(path, "items", itemIndex)}
              data-rebar-block-item-label={item.title}
            >
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
          data-rebar-block-path={path}
        >
          {block.items.map((item, itemIndex) => (
            <Card
              key={item.title}
              style={{ flex: "1 1 260px" }}
              data-rebar-block-path={itemPath(path, "items", itemIndex)}
              data-rebar-block-item-label={item.title}
            >
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
        <Card key={index} data-rebar-placement-block="form" data-rebar-block-path={path}>
          <Stack gap="md">
            {block.heading ? <Heading level={3}>{block.heading}</Heading> : null}
            {block.fields.map((field, fieldIndex) => renderFormField(field, fieldIndex, path))}
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
          data-rebar-block-path={path}
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
              <Box
                as="tr"
                key={rowIndex}
                data-rebar-block-path={itemPath(path, "rows", rowIndex)}
                data-rebar-block-item-label={row.cells.join(" / ")}
              >
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
        <Stack key={index} gap="sm" data-rebar-placement-block="data-list" data-rebar-block-path={path}>
          {block.items.map((item, itemIndex) => (
            <Card
              key={item.title}
              data-rebar-block-path={itemPath(path, "items", itemIndex)}
              data-rebar-block-item-label={item.title}
            >
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
          data-rebar-block-path={path}
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
        <Tabs key={index} defaultValue={block.tabs[0]?.label} data-rebar-placement-block="tabs" data-rebar-block-path={path}>
          <TabList>
            {block.tabs.map((tab, tabIndex) => (
              <Tab
                key={tab.label}
                value={tab.label}
                data-rebar-block-path={itemPath(path, "tabs", tabIndex)}
                data-rebar-block-item-label={tab.label}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
          {block.tabs.map((tab, tabIndex) => (
            <TabPanel key={tab.label} value={tab.label}>
              <Stack gap="lg" style={{ paddingTop: "var(--rebar-space-md)" }}>
                {tab.blocks.map((inner, innerIndex) =>
                  renderBlock(inner, innerIndex, renderLink, `${itemPath(path, "tabs", tabIndex)}.blocks`),
                )}
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
          <Stack gap="md" data-rebar-placement-block="modal" data-rebar-block-path={path}>
            {block.blocks.map((inner, innerIndex) =>
              renderBlock(inner, innerIndex, renderLink, `${path}.blocks`),
            )}
          </Stack>
        </Dialog>
      );

    case "hero":
      return (
        <Stack
          key={index}
          gap="lg"
          style={{ alignItems: "center", textAlign: "center" }}
          data-rebar-placement-block="hero"
          data-rebar-block-path={path}
        >
          {block.badge ? (
            <Box
              style={{
                display: "inline-block",
                padding: "var(--rebar-space-xs) var(--rebar-space-md)",
                background: "var(--rebar-color-bg-secondary, #f5f5f5)",
                border: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
                borderRadius: 999,
                fontSize: "var(--rebar-font-size-xs)",
              }}
            >
              {renderInline(block.badge, renderLink)}
            </Box>
          ) : null}
          <Heading level={1} style={{ fontSize: 56, lineHeight: 1.1 }}>
            {block.title}
          </Heading>
          <Text size="md" color="secondary" style={{ maxWidth: 560 }}>
            {renderInline(block.subtitle, renderLink)}
          </Text>
          {block.actions && block.actions.length > 0 ? (
            <Stack direction="row" gap="sm">
              {block.actions.map((action, actionIndex) => {
                const button = (
                  <Button variant={action.variant ?? "secondary"} size="lg">
                    {action.label}
                  </Button>
                );
                return (
                  <span key={actionIndex}>
                    {action.href ? renderLink({ href: action.href, children: button }) : button}
                  </span>
                );
              })}
            </Stack>
          ) : null}
          {block.codeSnippet ? (
            <Box
              as="code"
              style={{
                display: "inline-block",
                padding: "var(--rebar-space-sm) var(--rebar-space-md)",
                background: "var(--rebar-color-bg-secondary, #f5f5f5)",
                borderRadius: 4,
                fontFamily: "monospace",
              }}
            >
              {block.codeSnippet}
            </Box>
          ) : null}
        </Stack>
      );

    case "section-header":
      return (
        <Stack
          key={index}
          gap="sm"
          style={{ alignItems: "center", textAlign: "center", maxWidth: 640, margin: "0 auto" }}
          data-rebar-placement-block="section-header"
          data-rebar-block-path={path}
        >
          {block.kicker ? (
            <Text
              size="sm"
              color="secondary"
              style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--rebar-font-weight-semibold)" }}
            >
              {block.kicker}
            </Text>
          ) : null}
          <Heading level={2}>{block.title}</Heading>
          {block.subtitle ? <Text color="secondary">{renderInline(block.subtitle, renderLink)}</Text> : null}
        </Stack>
      );

    case "doc-section":
      return (
        <Stack key={index} gap="sm" data-rebar-placement-block="doc-section" data-rebar-block-path={path}>
          {block.heading ? <Heading level={block.level ?? 2}>{block.heading}</Heading> : null}
          {block.body.map((node, nodeIndex) => renderProseNode(node, nodeIndex, renderLink))}
        </Stack>
      );

    case "props-table":
      if (block.rows.length === 0) {
        return (
          <Stack key={index} gap="sm" data-rebar-placement-block="props-table" data-rebar-block-path={path}>
            {block.heading ? <Heading level={2}>{block.heading}</Heading> : null}
            <Text size="sm" color="secondary">
              No component-specific props (only standard HTML/ARIA attributes, forwarded as-is).
            </Text>
          </Stack>
        );
      }
      return (
        <Stack key={index} gap="sm" data-rebar-placement-block="props-table" data-rebar-block-path={path}>
          {block.heading ? <Heading level={2}>{block.heading}</Heading> : null}
          <Box style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "var(--rebar-font-size-sm, 14px)" }}>
            <thead>
              <tr>
                {["Prop", "Type", "Required", "Default"].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: "left",
                      padding: "var(--rebar-space-sm, 8px)",
                      borderBottom: "2px solid var(--rebar-color-border-strong, #333)",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.name}>
                  <td style={propsTableCellStyle}>
                    <code>{row.name}</code>
                  </td>
                  <td style={propsTableCellStyle}>
                    <code>{row.type}</code>
                  </td>
                  <td style={propsTableCellStyle}>{row.required ? "Yes" : "No"}</td>
                  <td style={propsTableCellStyle}>{row.defaultValue ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </Box>
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
