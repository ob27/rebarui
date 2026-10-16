"use client";

import { Button, Card, Heading, Spin, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE } from "@/fixtures/tideline";
import { useState } from "react";

const CODE = `<Spin variant="drums" />
<Spin variant="hourglass" tip="Loading projects…" />
<Spin spinning={isLoading} variant="papers">
  <ProjectList />
</Spin>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Spin"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`role="status"` with an `aria-label` of the `tip` text (or "Loading" if none given) — announced once by assistive tech without needing a separate live region. Wrapped content gets `aria-busy="true"` and is visually dimmed and non-interactive while spinning.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="spin"`, `data-rebar-part="content" | "overlay" | "indicator" | "tip"`. Note that `variant="classic"` always renders `.rebar-spin-icon-vector` — the other three variants only fall back to it under `[data-theme="dark"]`, since their raster art has no other way to adapt to a dark background.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Spin` has the same `spinning`/`tip`/children-wrapping shape and a comparable `size` union — a close, low-risk rename, not yet codemod-covered. `variant` has no AntD equivalent (AntD's own indicator isn't swappable this way) — drop it during migration, or pass a custom `indicator` element built from AntD's own icon set to keep a similar look.",
      },
    ],
  },
];

export default function SpinPage() {
  const [busy, setBusy] = useState(true);

  return (
    <Stack gap="lg">
      <Heading level={1}>Spin</Heading>
      <Text color="secondary">A loading indicator, alone or over content that dims while it loads.</Text>

      <DemoStage title="Loading" caption="Four indicators; pick one for the whole app" code={CODE} widths={false}
        states={[
          { label: "With a tip", node: <Spin tip="Loading projects…" /> },
          { label: "Small", node: <Spin size="sm" variant="classic" /> },
          { label: "Large", node: <Spin size="lg" variant="classic" /> },
          {
            label: "Over content",
            node: (
              <Card style={{ width: 220, minHeight: 120 }}>
                <Spin spinning variant="papers" tip="Fetching">
                  <Stack gap="sm">{PROJECTS.slice(0, 3).map((p) => <Text key={p.id} size="sm">{p.name}</Text>)}</Stack>
                </Spin>
              </Card>
            ),
          },
        ]}
      >
        <Stack direction="row" gap="xl" align="center" style={{ flexWrap: "wrap" }}>
          {(["drums", "hourglass", "papers", "classic"] as const).map((v) => (
            <Stack key={v} gap="xs" align="center">
              <Spin variant={v} />
              <Text size="xs" color="secondary">{v}</Text>
            </Stack>
          ))}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects" caption="The list dims and stops taking clicks while it refreshes" widths={false}>
        <Card style={{ maxWidth: 460, margin: "0 auto", minHeight: 280 }} title="Projects" extra={<Button size="sm" variant="secondary" onClick={() => setBusy((b) => !b)}>{busy ? "Stop" : "Refresh"}</Button>}>
          <Spin spinning={busy} variant="hourglass" tip="Syncing">
            <Stack gap="md">
              {PROJECTS.map((p) => (
                <Stack key={p.id} direction="row" justify="between" align="center">
                  <Text size="sm">{p.name}</Text>
                  <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                </Stack>
              ))}
            </Stack>
          </Spin>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
