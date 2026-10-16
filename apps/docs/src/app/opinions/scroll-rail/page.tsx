"use client";

import { Card, Heading, ScrollRail, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, PROJECTS, STATUS_TONE, project } from "@/fixtures/tideline";

const RAIL = { "--rebar-scroll-rail-item-width": "15rem" } as React.CSSProperties;

const CODE = `<ScrollRail aria-label="Projects">
  {PROJECTS.map((p) => (
    <Card key={p.id} title={p.name} subtitle={p.kicker} />
  ))}
</ScrollRail>`;

const projectCards = PROJECTS.map((p) => (
  <Card
    key={p.id}
    cover={<div className="cs-grain" style={{ height: 72 }} />}
    title={p.name}
    subtitle={`${p.kicker}, due ${p.due}`}
    extra={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>}
  />
));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ScrollRail"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'Root is `role="region"` named by the required `aria-label` (deliberately not `aria-roledescription="carousel"`); the track is a `role="list"` and each item a `role="listitem"`. The viewport is focusable so the arrow keys scroll it from the keyboard. Prev/next buttons disable at either end.',
      },
      {
        kind: "text",
        text: "Auto-scroll pauses while the pointer is over or pressing the viewport, while focus is inside it, and while the tab is hidden; it never runs under `prefers-reduced-motion` (the rail becomes a normal manual rail with prev/next). Whenever auto-scroll is active a visible Pause/Play button is rendered (WCAG 2.2.2), and the prev/next buttons are hidden. With `loop`, the duplicated items are `aria-hidden` and `inert`, so assistive tech and Tab never see them.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="scroll-rail"` on the root, with `data-rebar-state` (`static`, `scrolling` or `paused`), `data-rebar-gap`, `data-rebar-snap`, `data-rebar-can-scroll-start` and `data-rebar-can-scroll-end`. `data-rebar-part` values `viewport`, `track`, `item`, `control` (prev/next, with `data-rebar-direction`) and `toggle` (Pause/Play).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. Ant Design has no direct equivalent; the nearest idiom is a `Flex` with `overflow-x: auto` or a `Carousel` with `slidesToShow`, so this is a structural rewrite at migration time.",
      },
    ],
  },
];

export default function ScrollRailPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ScrollRail</Heading>
      <Text color="secondary">A horizontal strip of cards that scrolls instead of wrapping.</Text>

      <DemoStage
        title="Projects"
        caption="Scroll, or use the buttons to move one card"
        code={CODE}
        states={[
          { label: "No buttons", node: <ScrollRail aria-label="Projects, no buttons" controls={false} style={RAIL}>{projectCards}</ScrollRail> },
          { label: "Auto-scroll", node: <ScrollRail aria-label="Projects, auto-scroll" autoScroll loop style={RAIL}>{projectCards}</ScrollRail> },
          { label: "Few items", node: <ScrollRail aria-label="Two projects" style={RAIL}>{projectCards.slice(0, 2)}</ScrollRail> },
        ]}
      >
        <ScrollRail aria-label="Projects" style={RAIL}>{projectCards}</ScrollRail>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Home" caption="Recent files under the greeting" widths={false}>
        <Stack gap="md" style={{ maxWidth: 640, margin: "0 auto" }}>
          <Heading level={3}>Good morning, Maya</Heading>
          <Text size="sm" color="secondary">Harbour launch is on 24 Oct. Pick up where you left off.</Text>
          <ScrollRail aria-label="Recent files" style={{ "--rebar-scroll-rail-item-width": "11rem" } as React.CSSProperties}>
            {FILES.map((f) => (
              <Card key={f.id} cover={<div style={{ height: 64, background: "var(--rebar-color-tint-3)" }} />} title={f.name} titleLines={1} subtitle={`${f.size}, ${project(f.project).name}`} />
            ))}
          </ScrollRail>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
