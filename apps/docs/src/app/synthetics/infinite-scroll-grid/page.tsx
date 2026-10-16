"use client";

import { useState } from "react";
import { Card, Heading, InfiniteScrollGrid, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW, FILES, PROJECTS, STATUS_TONE, gbp, person } from "@/fixtures/tideline";
import type { CrewMember } from "@/fixtures/tideline";

const CODE = `<InfiniteScrollGrid
  items={crew}
  keyExtractor={(m) => m.id}
  renderItem={(m) => <Card title={m.name} subtitle={m.role} />}
  hasMore={hasMore}
  isLoading={isLoading}
  onLoadMore={loadNextPage}
  columns={3}
/>`;

const SCROLL: React.CSSProperties = { maxHeight: 340, overflowY: "auto", border: "1px solid var(--rebar-color-border)", borderRadius: 8, padding: 16 };

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["InfiniteScrollGrid"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="infinite-scroll-grid"`; parts include `item`, `skeleton`, and `sentinel`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's own `List` supports `loadMore` but via a manual button, not scroll-triggered; compose `List` + a hand-rolled IntersectionObserver, or a dedicated infinite-scroll library.",
      },
    ],
  },
];

function useDrip<T>(all: T[], first: number, step: number) {
  const [count, setCount] = useState(first);
  const [isLoading, setLoading] = useState(false);
  const hasMore = count < all.length;
  const onLoadMore = () => {
    if (isLoading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setCount((c) => Math.min(c + step, all.length));
      setLoading(false);
    }, 600);
  };
  return { items: all.slice(0, count), hasMore, isLoading, onLoadMore };
}

const CREW_ALL: CrewMember[] = [...CREW, ...CREW.map((m) => ({ ...m, id: `${m.id}-2`, interviewed: "Follow-up" }))];

export default function InfiniteScrollGridPage() {
  const crew = useDrip(CREW_ALL, 6, 6);
  const files = useDrip(FILES, 3, 3);
  return (
    <Stack gap="lg">
      <Heading level={1}>InfiniteScrollGrid</Heading>
      <Text color="secondary">A card grid that loads the next batch when you scroll to the bottom.</Text>

      <DemoStage
        title="Crew directory"
        caption="Scroll the panel: six more load each time"
        code={CODE}
        states={[
          { label: "Loading", node: <InfiniteScrollGrid items={[]} renderItem={() => null} keyExtractor={(x: never) => String(x)} hasMore isLoading onLoadMore={() => {}} columns={3} skeletonCount={3} /> },
          { label: "Empty", node: <InfiniteScrollGrid items={[]} renderItem={() => null} keyExtractor={(x: never) => String(x)} hasMore={false} isLoading={false} onLoadMore={() => {}} emptyMessage="No crew interviewed yet" /> },
          {
            label: "Everything loaded",
            node: (
              <InfiniteScrollGrid
                items={CREW.slice(0, 2)}
                keyExtractor={(m) => m.id}
                renderItem={(m) => <Card title={m.name} subtitle={m.role} />}
                hasMore={false}
                isLoading={false}
                onLoadMore={() => {}}
                columns={1}
              />
            ),
          },
        ]}
      >
        <div style={SCROLL}>
          <InfiniteScrollGrid
            {...crew}
            keyExtractor={(m) => m.id}
            renderItem={(m) => (
              <Card title={m.name} subtitle={m.role} footer={<Text size="xs" color="secondary">Interviewed {m.interviewed}</Text>} />
            )}
            columns={3}
          />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project files" caption="Files load as you scroll" widths={false}>
        <Card title="Files" subtitle="All projects">
          <div style={{ ...SCROLL, maxHeight: 260 }}>
            <InfiniteScrollGrid
              {...files}
              keyExtractor={(f) => f.id}
              renderItem={(f) => {
                const p = PROJECTS.find((x) => x.id === f.project)!;
                return (
                  <Card title={f.name} subtitle={f.size} labels={[{ label: p.name, tone: STATUS_TONE[p.status] }]} footer={<Text size="xs" color="secondary">{person(p.owner).name} · {gbp(p.budget)}</Text>} />
                );
              }}
              columns={2}
            />
          </div>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
