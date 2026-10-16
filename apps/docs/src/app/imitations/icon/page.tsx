"use client";

import { useMemo, useState } from "react";
import { AddIcon, BellIcon, Button, CalendarIcon, Card, CheckIcon, DownloadIcon, FileChartIcon, Heading, InfiniteScrollGrid, Input, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { ICON_MANIFEST, ICON_SOURCE_INFO } from "@/data/iconManifest";
import type { IconManifestEntry, IconSource } from "@/data/iconManifest";
import { EVENTS, FILES } from "@/fixtures/tideline";

const SOURCES: IconSource[] = ["RemixIcon", "Ant Design"];
const PAGE_SIZE = 48;

const CODE = `<CalendarIcon />
<BellIcon size={24} />
<CheckIcon size="2em" style={{ color: "var(--rebar-color-success)" }} />
<DownloadIcon aria-label="Download" onClick={download} />`;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Props",
    body: [{ kind: "text", text: "Every icon takes `size` (a number or CSS length, default `\"1em\"`, so it scales with the text) plus any `SVGProps<SVGSVGElement>` (`className`, `style`, `color`, `onClick`)." }],
  },
  {
    type: "doc-section",
    heading: "Where they come from",
    body: [{ kind: "text", text: "Every RemixIcon line icon plus every Ant Design Outlined icon with no RemixIcon equivalent, as plain React components. Regenerate with `pnpm --filter rebar-ui run generate:icons` after bumping either upstream package." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-icon="<ComponentName>"` on every icon\'s root `<svg>`.' }],
  },
];

// Each source is revealed a page at a time as the sentinel scrolls into view; keyed by the query so a new search resets it to one page.
function IconSourceSection({ source, entries, query }: { source: IconSource; entries: IconManifestEntry[]; query: string }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  if (entries.length === 0) return null;
  const info = ICON_SOURCE_INFO[source];
  const visible = entries.slice(0, visibleCount);
  return (
    <Stack gap="sm">
      <Stack direction="row" align="center" gap="sm" style={{ justifyContent: "space-between" }}>
        <Heading level={3}>
          {source} <Text as="span" size="sm" color="secondary">({entries.length.toLocaleString()})</Text>
        </Heading>
        <Text size="sm" color="secondary">
          <a href={info.url} className="rebar-link" style={{ color: "var(--rebar-color-text-primary)", textDecoration: "underline" }} target="_blank" rel="noreferrer">
            {info.license}
          </a>
        </Text>
      </Stack>
      <InfiniteScrollGrid
        items={visible}
        keyExtractor={(entry) => entry.name}
        hasMore={visibleCount < entries.length}
        isLoading={false}
        onLoadMore={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, entries.length))}
        columns={6}
        renderItem={({ name, Icon }) => (
          <Stack
            gap="xs"
            align="center"
            style={{
              border: "1px solid var(--rebar-color-border)",
              borderRadius: "var(--rebar-radius, 4px)",
              padding: "var(--rebar-space-sm)",
              textAlign: "center",
            }}
          >
            <Icon size={24} />
            <Text size="xs" color="secondary" style={{ wordBreak: "break-all" }}>
              {name}
            </Text>
          </Stack>
        )}
      />
    </Stack>
  );
}

export default function IconPage() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return ICON_MANIFEST;
    return ICON_MANIFEST.filter((entry) => entry.name.toLowerCase().includes(q));
  }, [trimmedQuery]);
  const launch = EVENTS[0]!;
  return (
    <Stack gap="lg" style={{ maxWidth: 800 }}>
      <Heading level={1}>Icon</Heading>
      <Text color="secondary">{ICON_MANIFEST.length.toLocaleString()} icons as plain React components, scaled by font size.</Text>

      <DemoStage
        title="Icon set"
        caption="Search, then scroll each source to reveal more"
        code={CODE}
        widths={false}
        states={[
          { label: "Sizes", node: <Stack direction="row" gap="sm" align="center"><CalendarIcon size={16} /><CalendarIcon size={24} /><CalendarIcon size={40} /></Stack> },
          { label: "Inherits colour", node: <Stack direction="row" gap="sm" align="center" style={{ color: "var(--rebar-color-primary)" }}><BellIcon /><Text size="sm">Primary</Text></Stack> },
          { label: "Success", node: <Stack direction="row" gap="sm" align="center" style={{ color: "var(--rebar-color-success)" }}><CheckIcon /><Text size="sm">Done</Text></Stack> },
          { label: "Scales with text", node: <Text style={{ fontSize: 28 }}><FileChartIcon /> Report</Text> },
        ]}
      >
        <Stack gap="md">
          <Input type="search" placeholder="Search icons" aria-label="Search icons" value={query} onChange={(e) => setQuery(e.target.value)} />
          {SOURCES.map((source) => (
            <IconSourceSection key={`${source}:${trimmedQuery}`} source={source} query={trimmedQuery} entries={filtered.filter((entry) => entry.source === source)} />
          ))}
          {filtered.length === 0 ? <Text color="secondary">No icons match &quot;{query}&quot;.</Text> : null}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Task toolbar" caption="Icons beside labels in buttons and a list" widths={false}>
        <Card title="Harbour rebrand" style={{ maxWidth: 520, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
              <Button><AddIcon /> New task</Button>
              <Button variant="secondary"><DownloadIcon /> Export {FILES[0]!.name}</Button>
              <Button variant="tertiary"><BellIcon /> Follow</Button>
            </Stack>
            <Stack direction="row" gap="sm" align="center">
              <CalendarIcon />
              <Text size="sm">{launch.title}, {launch.date}, {launch.time}</Text>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
