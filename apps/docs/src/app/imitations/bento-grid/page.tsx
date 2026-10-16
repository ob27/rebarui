import { Avatar, BentoCard, BentoGrid, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<BentoGrid>
  <BentoCard span={3} tone="tint-1" title="Harbour rebrand" body="Identity, site and launch kit." />
  <BentoCard span={3} tone="tint-2" title="Tideline mobile" body="Offline tasks and a quiet inbox." />
  <BentoCard span={2} tone="tint-3" title="Crew interviews" body="Twelve calls, one pattern." />
  <BentoCard span={2} tone="tint-4" title="Rota export" body="Shifts out to payroll." />
  <BentoCard span={2} title="Depot signage" body="Wayfinding for three depots." />
</BentoGrid>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BentoGrid"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [{ kind: "text", text: "Six columns from 960px up, one column below. Rows size to their cards and the grid never sets `overflow`, so card media is not clipped. Cards pick `span` 2, 3 or 6 (see `BentoCard`)." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="bento-grid"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. The nearest Ant Design shape is a `Row` with `Col span` values on a 24-column grid." }],
  },
];

const [p1, p2, p3, p4, p5] = PROJECTS;

export default function BentoGridPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>BentoGrid</Heading>
      <Text color="secondary">A six-column grid of uneven cards that stacks on a phone. Pair it with BentoCard.</Text>

      <DemoStage
        title="Projects at a glance"
        caption="Two wide cards, then three narrow"
        code={CODE}
        states={[
          { label: "Full-width card", node: <BentoGrid><BentoCard span={6} tone="tint-1" title={harbour.name} body={harbour.summary} /></BentoGrid> },
          { label: "Untinted", node: <BentoGrid><BentoCard span={6} title={p5!.name} body={p5!.summary} /></BentoGrid> },
        ]}
      >
        <BentoGrid>
          <BentoCard span={3} tone="tint-1" title={p1!.name} body={p1!.summary} />
          <BentoCard span={3} tone="tint-2" title={p2!.name} body={p2!.summary} />
          <BentoCard span={2} tone="tint-3" title={p3!.name} body={p3!.summary} />
          <BentoCard span={2} tone="tint-4" title={p4!.name} body={p4!.summary} />
          <BentoCard span={2} title={p5!.name} body={p5!.summary} />
        </BentoGrid>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Studio home" caption="Each card carries its owner and status" widths={false}>
        <BentoGrid>
          {PROJECTS.slice(0, 4).map((p, i) => (
            <BentoCard
              key={p.id}
              span={i < 2 ? 3 : 2}
              tone={(["tint-1", "tint-2", "tint-3", "tint-4"] as const)[i]}
              title={p.name}
              body={
                <Stack gap="sm">
                  <Text size="sm">{p.summary}</Text>
                  <Stack direction="row" gap="sm" align="center">
                    <Avatar {...avatarOf(p.owner)} />
                    <Text size="xs" color="secondary">{person(p.owner).name}</Text>
                    <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                  </Stack>
                </Stack>
              }
            />
          ))}
        </BentoGrid>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
