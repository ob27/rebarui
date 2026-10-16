import { BentoCard, BentoGrid, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { EVENTS, project, PROJECTS } from "@/fixtures/tideline";

const CODE = `<BentoGrid>
  <BentoCard
    span={3}
    tone="tint-1"
    title="Tasks that work offline"
    body="Check things off on the quay."
    media={<TidelinePhone ... />}
  />
  <BentoCard span={6} mediaPosition="end" title="A quiet inbox" body="..." media={...} />
</BentoGrid>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BentoCard"] ?? [] },
  {
    type: "doc-section",
    heading: "Sizing and media",
    body: [
      {
        kind: "text",
        text: "A card sizes to its content: `media` is a whole `DeviceFrame` and is never cropped. `mediaPosition=\"below\"` puts the media under the text; `\"end\"` puts it beside the text on the wide grid (use with `span` 3 or 6). Tints use `--rebar-color-tint-1` to `-4`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "The title is a real heading (`headingLevel` 3 by default, or 2) and the media keeps its own alt text. DOM order is text, then media." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="bento-card"`, `data-rebar-span`, `data-rebar-tone` and `data-rebar-media-position` on the root; `data-rebar-part` values `text`, `title`, `body` and `media`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. The nearest Ant Design shape is a `Card` inside a `Col`." }],
  },
];

function Tasks() {
  return (
    <TidelinePhone title="Projects" tabs={1} height={300} width={220}>
      <PhoneList>
        {PROJECTS.slice(0, 3).map((p, i) => (
          <PhoneRow key={p.id} title={p.name} meta={`${p.status}, due ${p.due}`} tint={(i + 1) as 1 | 2 | 3} />
        ))}
      </PhoneList>
    </TidelinePhone>
  );
}
function Calendar() {
  return (
    <TidelinePhone title="Calendar" tabs={2} height={300} width={220}>
      <PhoneList>
        {EVENTS.slice(0, 3).map((e, i) => (
          <PhoneRow key={e.id} title={e.title} meta={`${e.date}${e.time ? `, ${e.time}` : ""}`} tint={(i + 2) as 2 | 3 | 4} />
        ))}
      </PhoneList>
    </TidelinePhone>
  );
}

export default function BentoCardPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>BentoCard</Heading>
      <Text color="secondary">One tile of a BentoGrid: a title, optional body and media, on a neutral or tinted surface.</Text>

      <DemoStage
        title="Tideline mobile"
        caption="Two half tiles and a wide one, each on its own tint"
        code={CODE}
        states={[
          { label: "Default tone", node: <BentoGrid><BentoCard span={6} title="Offline tasks" body="Check things off on the quay." /></BentoGrid> },
          { label: "tint-1", node: <BentoGrid><BentoCard span={6} tone="tint-1" title="Offline tasks" body="Check things off on the quay." /></BentoGrid> },
          { label: "tint-2", node: <BentoGrid><BentoCard span={6} tone="tint-2" title="Quiet inbox" body="Only what is yours." /></BentoGrid> },
          { label: "tint-4", node: <BentoGrid><BentoCard span={6} tone="tint-4" title="Crew calendar" body="Shifts and reviews." /></BentoGrid> },
        ]}
      >
        <div id="bento-demo">
          <BentoGrid>
            <BentoCard span={3} tone="tint-1" title="Tasks that work offline" body="Check things off on the quay, sync when you are back." media={<Tasks />} />
            <BentoCard span={3} tone="tint-2" title="A calendar for the crew" body="Reviews, launches and payroll cut-offs." media={<Calendar />} />
            <BentoCard span={6} tone="tint-3" mediaPosition="end" title="A quiet inbox" body="Only what is yours, with the Harbour launch on 24 Oct pinned to the top." media={<Tasks />} />
          </BentoGrid>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project landing" caption="Text-only tiles summarising a project" widths={false}>
        <BentoGrid>
          <BentoCard span={3} tone="tint-1" title={harbour.name} body={harbour.summary} />
          <BentoCard span={3} tone="tint-2" title={`${harbour.done}% complete`} body={`Due ${harbour.due}, owned by Maya Chen.`} />
          <BentoCard span={6} tone="tint-3" title="Launch is on 24 Oct" body="Crew briefing at 09:00, then the site goes live." />
        </BentoGrid>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
