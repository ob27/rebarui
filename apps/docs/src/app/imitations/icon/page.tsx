"use client";

import { useMemo, useState } from "react";
import { Box, Heading, Input, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { ICON_MANIFEST, ICON_SOURCE_INFO } from "@/data/iconManifest";
import type { IconSource } from "@/data/iconManifest";

const SOURCES: IconSource[] = ["RemixIcon", "Ant Design"];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Props",
    body: [
      {
        kind: "text",
        text: "Every icon shares the same tiny prop shape (`IconProps`): an optional `size` (number or CSS length, default `\"1em\"` — scales with the surrounding text by default, same as any other inline glyph) plus the rest of `SVGProps<SVGSVGElement>` passed straight through (`className`, `style`, `color`, an `onClick`, whatever a real usage needs). None of the icons above have their own individual props table for this reason — one shared shape, not 1,835 near-identical tables.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Merging in more icons",
    body: [
      {
        kind: "text",
        text: 'Two sources are fully merged in — every RemixIcon "-line" icon (1,519, beyond the 29 hand-picked before the bulk merge) and every Ant Design Outlined icon with no RemixIcon equivalent (285, after dropping 157 that duplicated one) — 1,835 icons in total, real path data, none hand-traced. `packages/core/scripts/generate-icons.mjs` is the generator; re-run it via `pnpm --filter rebar-ui run generate:icons` after bumping either upstream package\'s version, then rebuild/test/typecheck before committing the regenerated output. A one-off addition outside the bulk sets (a third source, or a single icon neither library has) still goes directly in `packages/core/src/components/icons.tsx` via `createIcon(path, "Name", viewBox)` — `ICON_REGISTRY` (also in `icons.tsx`) picks it up automatically, no separate list to update. See `icons.tsx`\'s own doc comment for the full naming/dedup convention (RemixIcon keeps this project\'s `XIcon` suffix; Ant Design keeps its own exact name, so `EnterOutlined` here is the same name as [antd\'s own EnterOutlined](https://ant-design.antgroup.com/components/icon); where both libraries have the same real-world icon, RemixIcon wins).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-icon="<ComponentName>"` on every icon\'s root `<svg>` — lets devtools/tests identify which icon actually rendered without depending on path data.' },
    ],
  },
];

// At 1,835 icons, rendering everything by default is the exact "flat list of 30+" heuristic #17
// warns against — a search box alone doesn't fix that if the *unfiltered* view still dumps the
// whole set. Cap each source's default view; searching (2+ characters) reveals the true full
// match count instead of the capped preview.
const PREVIEW_LIMIT = 48;

export default function IconPage() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const searching = trimmedQuery.length >= 2;
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!searching) return ICON_MANIFEST;
    return ICON_MANIFEST.filter((entry) => entry.name.toLowerCase().includes(q));
  }, [trimmedQuery, searching]);

  return (
    <Stack gap="lg" style={{ maxWidth: 800 }}>
      <Heading level={1}>Icon</Heading>
      <Text color="secondary">
        Rebar&apos;s own merged icon set — {ICON_MANIFEST.length.toLocaleString()} icons, real
        licensed path data vendored in as plain React components (no icon-font or npm icon-package
        runtime dependency). Two sources are fully merged in: every RemixIcon icon, and every Ant
        Design Outlined icon that isn&apos;t a duplicate of one RemixIcon already has.
      </Text>

      <Input
        type="search"
        placeholder="Search icons… (2+ characters)"
        aria-label="Search icons"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {SOURCES.map((source) => {
        const matches = filtered.filter((entry) => entry.source === source);
        if (matches.length === 0) return null;
        const entries = searching ? matches : matches.slice(0, PREVIEW_LIMIT);
        const info = ICON_SOURCE_INFO[source];
        return (
          <Stack key={source} gap="sm">
            <Stack direction="row" align="center" gap="sm" style={{ justifyContent: "space-between" }}>
              <Heading level={2}>{source}</Heading>
              <Text size="sm" color="secondary">
                <a href={info.url} className="rebar-link" target="_blank" rel="noreferrer">
                  {info.license}
                </a>
              </Text>
            </Stack>
            {!searching && matches.length > PREVIEW_LIMIT ? (
              <Text size="sm" color="secondary">
                Showing {PREVIEW_LIMIT} of {matches.length.toLocaleString()} — search to find a specific one.
              </Text>
            ) : null}
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
                gap: "var(--rebar-space-sm)",
              }}
            >
              {entries.map(({ name, Icon }) => (
                <Stack
                  key={name}
                  gap="xs"
                  align="center"
                  style={{
                    border: "1px solid var(--rebar-color-border, #e0e0e0)",
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
              ))}
            </Box>
          </Stack>
        );
      })}

      {filtered.length === 0 ? (
        <Text color="secondary">No icons match &quot;{query}&quot;.</Text>
      ) : null}

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
