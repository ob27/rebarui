import { Card, Heading, Masonry, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `<Masonry columns={3} gap={16}>
  {projects.map((p) => (
    <Card key={p.id} title={p.name} subtitle={p.kicker}>{p.summary}</Card>
  ))}
</Masonry>`;

const TINTS = [1, 2, 3, 4, 1] as const;
const COVERS = [96, 150, 70, 120, 170];

function ProjectCard({ index }: { index: number }) {
  const p = PROJECTS[index % PROJECTS.length]!;
  return (
    <Card
      title={p.name}
      subtitle={`${p.kicker} · ${p.status}`}
      cover={<div style={{ height: COVERS[index % COVERS.length], background: `var(--rebar-color-tint-${TINTS[index % TINTS.length]})` }} />}
    >
      <Text size="sm" color="secondary">{p.summary}</Text>
    </Card>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Masonry"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="masonry"` on the root; each item wrapper carries `data-rebar-part="item"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD has no direct built-in equivalent (MUI's `Masonry` is the closer match) — on migration, keep the same CSS-columns technique directly, or swap to `react-masonry-css` if column-balancing needs to be exact.",
      },
    ],
  },
];

export default function MasonryPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Masonry</Heading>
      <Text color="secondary">Items of different heights packed into balanced columns.</Text>

      <DemoStage
        title="Project gallery"
        caption="Three columns; items fill top to bottom, then across"
        code={CODE}
        states={[
          { label: "Two columns", node: <Masonry columns={2} gap={12}>{[0, 1, 2, 3].map((i) => <ProjectCard key={i} index={i} />)}</Masonry> },
          { label: "One item", node: <Masonry columns={2} gap={12}><ProjectCard index={0} /></Masonry> },
          { label: "Tight gap", node: <Masonry columns={3} gap={4}>{[2, 3, 4].map((i) => <ProjectCard key={i} index={i} />)}</Masonry> },
        ]}
      >
        <Masonry columns={3} gap={16}>
          {[0, 1, 2, 3, 4, 2, 0, 3, 1].map((n, i) => <ProjectCard key={i} index={n} />)}
        </Masonry>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Moodboard" caption="Brand references for the harbour rebrand" widths={false}>
        <Card title="Harbour rebrand: moodboard" subtitle="Maya Chen, 9 references">
          <Masonry columns={4} gap={10}>
            {[110, 170, 80, 140, 100, 190, 120, 90, 150].map((h, i) => (
              <div key={i} aria-hidden="true" className={i % 3 === 0 ? "cs-grain" : undefined} style={{ height: h, borderRadius: 10, background: `var(--rebar-color-tint-${(i % 4) + 1})` }} />
            ))}
          </Masonry>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
