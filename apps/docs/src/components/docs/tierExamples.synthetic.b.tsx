"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Button,
  Card,
  GitGraph,
  HeroSplit,
  ImagePicker,
  InfiniteScrollGrid,
  List,
  ListItem,
  Markdown,
  Masonry,
  NoticeBar,
  PageHeader,
  PieChart,
  PivotTable,
  Prose,
  ReadingView,
  Result,
  SankeyDiagram,
  ScrollMask,
  ScrollRail,
  Section,
  Sparkline,
  Stack,
  SteppedBarChart,
  Steps,
  Sticky,
  Tag,
  Text,
  Timeline,
  ToggleGroup,
  TopBar,
  Treemap,
  WaterfallChart,
  WaybackSlider,
  WordCloud,
} from "rebar-ui";
import type { StepItem, TimelineItem } from "rebar-ui";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { BIBLE_CREDIT, COVERS, GALATIANS_3 } from "@/fixtures/athic-mobile";
import { CREW, EVENTS, PROJECTS, STATUS_TONE, WEEKLY_DONE, WEEK_LABELS, gbp, person, project } from "@/fixtures/tideline";
import type { CrewMember } from "@/fixtures/tideline";
import { ex } from "./tierExamples.types";
import type { ExampleMap } from "./tierExamples.types";

const harbour = project("harbour");

// Trimmed copies of the reference pages' data.
const COMMITS = [
  { id: "a1c4e90", parentIds: [], branch: "main", message: "Start offline sync", author: "Jonas" },
  { id: "b27d3f1", parentIds: ["a1c4e90"], branch: "main", message: "Quiet inbox layout", author: "Maya" },
  { id: "c3e8a52", parentIds: ["b27d3f1"], branch: "feature/sync", message: "Queue writes while offline", author: "Jonas" },
  { id: "f60b2d8", parentIds: ["b27d3f1", "c3e8a52"], branch: "main", message: "Merge offline sync", author: "Jonas" },
];

const PREVIEW =
  "data:text/html;charset=utf-8," +
  encodeURIComponent(
    '<!doctype html><meta name="color-scheme" content="light dark"><body style="font-family:system-ui,sans-serif;margin:20px"><h1 style="margin:0 0 8px;font-size:24px">Harbour rebrand</h1><p>Identity, site and launch kit for the harbour trust. Live on 24 Oct.</p>',
  );

const SLICES = [
  { label: "Tideline mobile", value: 72900 },
  { label: "Harbour rebrand", value: 48200 },
  { label: "Depot signage", value: 21800 },
  { label: "Other", value: 15550 },
];

const MARKDOWN = `## Your journal
The journal is **encrypted on your device**. We [cannot read it](/privacy#journal).

- Your email address
- The Masses you mark as attended`;

const BUDGET = PROJECTS.map((p) => ({ team: p.kicker, status: p.status, budget: p.budget }));

const PROPS_ROWS = [
  { name: "project", type: "Project", required: true, defaultValue: null, description: "The project to show." },
  { name: "compact", type: "boolean", required: false, defaultValue: "false", description: "Hide the summary line." },
  { name: "onOpen", type: "(id: string) => void", required: false, defaultValue: null, description: "Called when the card is opened." },
];

const TEAMS = [...new Set(PROJECTS.map((p) => p.kicker))];
const SANKEY_NODES = [
  { id: "all", label: "Studio budget" },
  ...TEAMS.map((t) => ({ id: t, label: t })),
  ...PROJECTS.map((p) => ({ id: p.id, label: p.name })),
];
const SANKEY_LINKS = [
  ...TEAMS.map((t) => ({ source: "all", target: t, value: PROJECTS.filter((p) => p.kicker === t).reduce((n, p) => n + p.budget, 0) })),
  ...PROJECTS.map((p) => ({ source: p.kicker, target: p.id, value: p.budget })),
];

const TREEMAP_DATA = TEAMS.map((k) => {
  const ps = PROJECTS.filter((p) => p.kicker === k);
  const total = ps.reduce((s, p) => s + p.budget, 0);
  return ps.length > 1 ? { label: k, value: total, children: ps.map((p) => ({ label: p.name, value: p.budget })) } : { label: k, value: total };
});

const WORDS = [
  { text: "handover", weight: 80 },
  { text: "radio", weight: 65 },
  { text: "tides", weight: 52 },
  { text: "shifts", weight: 44 },
  { text: "weather", weight: 36 },
  { text: "signage", weight: 28 },
  { text: "offline", weight: 20 },
  { text: "rota", weight: 14 },
];

const WATERFALL_START = harbour.budget;
const WATERFALL_STEPS = [
  { label: "Approved", value: WATERFALL_START, isTotal: true },
  { label: "Signage kit", value: 6400 },
  { label: "Photography", value: -5200 },
  { label: "Print overrun", value: -2300 },
  { label: "Forecast", value: WATERFALL_START + 6400 - 5200 - 2300, isTotal: true },
];

const RELEASE: StepItem[] = [
  { title: "Brief", description: person("maya").name },
  { title: "Design", description: EVENTS[0]!.date },
  { title: "Review", description: person("priya").name },
  { title: "Ship", description: "25 Oct" },
];

function Entry({ title, detail }: { title: string; detail: string }) {
  return (
    <Stack gap="xs">
      <Text as="div" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        {title}
      </Text>
      <Text size="sm" color="secondary">
        {detail}
      </Text>
    </Stack>
  );
}

const [LAUNCH, REVIEW, CALL] = EVENTS;
const ACTIVITY: TimelineItem[] = [
  { label: LAUNCH!.date, children: <Entry title={LAUNCH!.title} detail={`${person("maya").name} presents to the trust.`} /> },
  { label: REVIEW!.date, tone: "info", children: <Entry title={REVIEW!.title} detail={`${person("jonas").name} walks through offline sync.`} /> },
  { label: CALL!.date, children: <Entry title={CALL!.title} detail={`${person("priya").name}, 12 calls booked.`} /> },
];

const DATES = [new Date(2026, 9, 5), new Date(2026, 9, 12), new Date(2026, 9, 19)];

const iconBtn = (label: string, icon: ReactNode) => (
  <Button iconOnly variant="secondary" aria-label={label}>
    {icon}
  </Button>
);
const PLUS = (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

function WarningIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z" />
    </svg>
  );
}

function Notice() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <NoticeBar tone="warning" icon={<WarningIcon />} content="Payroll cut-off is 28 Oct. Send the rota export by then." wrap closable onClose={() => setVisible(false)} />
  ) : (
    <Button variant="secondary" onClick={() => setVisible(true)}>Show the notice again</Button>
  );
}

const CREW_ALL: CrewMember[] = [...CREW, ...CREW.map((m) => ({ ...m, id: `${m.id}-2`, interviewed: "Follow-up" }))];

function CrewGrid() {
  const [count, setCount] = useState(4);
  const [isLoading, setLoading] = useState(false);
  const hasMore = count < CREW_ALL.length;
  const onLoadMore = () => {
    if (isLoading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setCount((c) => Math.min(c + 4, CREW_ALL.length));
      setLoading(false);
    }, 600);
  };
  return (
    <div style={{ maxHeight: 250, overflowY: "auto", border: "1px solid var(--rebar-color-border)", borderRadius: 8, padding: 10 }}>
      <InfiniteScrollGrid
        items={CREW_ALL.slice(0, count)}
        keyExtractor={(m) => m.id}
        renderItem={(m) => <Card title={m.name} subtitle={m.role} />}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
        columns={1}
      />
    </div>
  );
}

function MaskedChips() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: "relative", maxWidth: "100%" }}>
      <ScrollMask scrollTrackRef={ref} />
      <div ref={ref} style={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: 8, padding: "6px 0" }}>
        {PROJECTS.map((p) => (
          <Tag key={p.id} tone={STATUS_TONE[p.status]}>
            {p.name}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ index, cover }: { index: number; cover: number }) {
  const p = PROJECTS[index % PROJECTS.length]!;
  return (
    <Card
      title={p.name}
      subtitle={`${p.kicker} \u00b7 ${p.status}`}
      cover={<div style={{ height: cover, background: `var(--rebar-color-tint-${(index % 4) + 1})` }} />}
    >
      <Text size="sm" color="secondary">{p.summary}</Text>
    </Card>
  );
}

// Absolute frame so a bar that positions itself stays inside the card.
const barFrame = (node: ReactNode) => (
  <div style={{ position: "relative", background: "var(--rebar-color-bg-inverse)", borderRadius: 14, overflow: "hidden", "--rebar-top-bar-safe-area": "0px" } as React.CSSProperties}>
    {node}
  </div>
);

export const SYNTHETIC_B: ExampleMap = {
  GitGraph: ex(<GitGraph title="Tideline mobile" commits={COMMITS} />),
  Header: ex(<NextBlockRenderer blocks={[{ type: "header", title: "Edit project", action: { icon: "close", label: "Close" } }]} />),
  Hero: ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "hero",
          badge: "Harbour rebrand",
          title: "A new identity for the harbour",
          subtitle: "Mark, site and launch kit, live on 24 Oct.",
          actions: [
            { label: "View the kit", variant: "primary" },
            { label: "Share feedback", variant: "secondary" },
          ],
        },
      ]}
    />,
  ),
  HeroSplit: ex(
    <HeroSplit
      eyebrow="Tideline"
      title="The quiet project app for small studios."
      lede="Tasks, files and a clear week in one place."
      minHeight="220px"
      actions={<Button size="lg">Start a project</Button>}
    />,
  ),
  Heuristic: ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "heuristic",
          id: "one-primary-action",
          title: "One primary action",
          rule: "Give each screen one primary button.",
          rationale: [{ kind: "text", text: "Two filled buttons make the crew stop and *choose*." }],
          exampleBlocks: [{ type: "checklist", heading: "Applied here", items: ["Save changes is filled", "Cancel is outlined"] }],
        },
      ]}
    />,
  ),
  Iframe: ex(<NextBlockRenderer blocks={[{ type: "iframe", src: PREVIEW, title: "Harbour homepage preview", height: 170 }]} />),
  ImagePicker: ex(<ImagePicker items={COVERS.slice(0, 6)} defaultSelectedId="cover-4" aria-label="Cover images" />),
  InfiniteScrollGrid: ex(<CrewGrid />),
  List: ex(
    <List variant="grouped" aria-label="Projects">
      {PROJECTS.slice(0, 4).map((p) => (
        <ListItem key={p.id} title={p.name} description={`${p.kicker}, due ${p.due}`} selected={p.id === "mobile"} onClick={() => {}} />
      ))}
    </List>,
  ),
  Markdown: ex(<Markdown size="sm" source={MARKDOWN} />),
  Masonry: ex(
    <Masonry columns={2} gap={10}>
      <ProjectCard index={0} cover={56} />
      <ProjectCard index={1} cover={90} />
      <ProjectCard index={2} cover={40} />
      <ProjectCard index={3} cover={70} />
    </Masonry>,
  ),
  NoticeBar: ex(<Notice />),
  PageHeader: ex(
    <PageHeader
      align="start"
      kicker={harbour.kicker}
      title={harbour.name}
      lede={harbour.summary}
      style={{ padding: 0 }}
    />,
  ),
  "Persona Card": ex(
    <NextBlockRenderer
      blocks={[{ type: "persona-card", items: ["maya", "jonas", "priya"].map((id) => ({ name: person(id).name, meta: person(id).role, avatarPlaceholder: true })) }]}
    />,
  ),
  PieChart: ex(<PieChart title="Budget by project" slices={SLICES} />),
  "Pillar Grid": ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "pillar-grid",
          items: [
            { title: "Tasks", body: "A board the whole crew can read.", href: "#", cta: "See tasks" },
            { title: "Files", body: "Livery, fascia and rota, by project.", href: "#", cta: "See files" },
          ],
        },
      ]}
    />,
  ),
  PivotTable: ex(<PivotTable title="Budget by team and status (GBP)" data={BUDGET} rowField="team" colField="status" valueField="budget" aggregate="sum" />, { wide: true }),
  "Props Table": ex(<NextBlockRenderer blocks={[{ type: "props-table", heading: "ProjectCard props", rows: PROPS_ROWS }]} />, { wide: true }),
  Prose: ex(
    <Prose>
      <h3>Harbour launch</h3>
      <p>
        The kit goes live on <strong>24 Oct</strong>. Check the <a href="#launch">launch checklist</a> first.
      </p>
      <ul>
        <li>Mark and palette</li>
        <li>Homepage</li>
      </ul>
    </Prose>,
  ),
  ReadingView: ex(
    <div style={{ maxHeight: 280, overflow: "hidden" }}>
      <ReadingView title="Galatians 3" verses={GALATIANS_3.slice(0, 4)} highlight={2} footer={BIBLE_CREDIT} />
    </div>,
  ),
  Result: ex(
    <Card>
      <Result status="success" title="Export sent" subTitle={`14 shifts are with ${person("leo").name}.`} extra={<Button size="sm">Done</Button>} />
    </Card>,
  ),
  SankeyDiagram: ex(<SankeyDiagram title="Where the budget goes" nodes={SANKEY_NODES} links={SANKEY_LINKS} width={480} height={240} />, { wide: true }),
  "Scroll Rail": ex(
    <ScrollRail aria-label="Projects" style={{ "--rebar-scroll-rail-item-width": "11rem" } as React.CSSProperties}>
      {PROJECTS.map((p) => (
        <Card key={p.id} title={p.name} subtitle={`${p.kicker}, due ${p.due}`} extra={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>} />
      ))}
    </ScrollRail>,
  ),
  ScrollMask: ex(<MaskedChips />),
  Section: ex(
    <Section tone="tint" spacing="tight" eyebrow="This week" title="Harbour launch on 24 Oct" lede="Three tasks left on the checklist.">
      <Button>Open checklist</Button>
    </Section>,
  ),
  "Section Header": ex(<NextBlockRenderer blocks={[{ type: "section-header", kicker: "This week", title: "Harbour launch on 24 Oct", subtitle: "Three tasks left on the checklist." }]} />),
  Sparkline: ex(
    <Stack gap="sm">
      <Text>
        Tasks done per week <Sparkline ariaLabel="Tasks done per week, last 12 weeks" values={WEEKLY_DONE} />
      </Text>
      <Text>
        Open tasks <Sparkline ariaLabel="Open tasks, last 12 weeks" values={[58, 55, 57, 52, 53, 49, 50, 47, 48, 46, 45, 42]} />
      </Text>
    </Stack>,
  ),
  "Spin Card": ex(<NextBlockRenderer blocks={[{ type: "spin-card", tip: "Fetching projects", items: PROJECTS.slice(0, 3).map((p) => p.name) }]} />),
  "Stats Table": ex(<NextBlockRenderer blocks={[{ type: "stats-table", headers: ["Project", "Done"], rows: PROJECTS.map((p) => [p.name, `${p.done}%`]) }]} />),
  SteppedBarChart: ex(<SteppedBarChart title="Tasks done per week" height={180} bars={WEEKLY_DONE.slice(-6).map((value, i) => ({ label: WEEK_LABELS.slice(-6)[i]!, value }))} />),
  Steps: ex(<Steps current={1} direction="vertical" items={RELEASE} />),
  Sticky: ex(
    <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
      <Sticky title="Brand palette shipped" seed="went1" tags={["Design"]} />
      <Sticky title="Interviews ran late" seed="improve1">
        Book slots a week ahead
      </Sticky>
    </Stack>,
  ),
  Timeline: ex(<Timeline items={ACTIVITY} />),
  ToggleGroup: ex(
    <ToggleGroup
      type="multiple"
      defaultValue={["bold"]}
      items={[
        { value: "bold", label: "B", "aria-label": "Bold" },
        { value: "italic", label: "I", "aria-label": "Italic" },
        { value: "underline", label: "U", "aria-label": "Underline" },
      ]}
    />,
  ),
  TopBar: ex(barFrame(<TopBar leading="back" title="Ask" trailing={iconBtn("New discussion", PLUS)} />)),
  Treemap: ex(<Treemap title="Budget by area" width={260} height={170} data={TREEMAP_DATA} />),
  WaterfallChart: ex(<WaterfallChart title="Harbour rebrand budget bridge" height={200} steps={WATERFALL_STEPS} yFormat={(v: number) => gbp(v)} />, { wide: true }),
  WaybackSlider: ex(<WaybackSlider dates={DATES} defaultValue={DATES[2]} aria-label="Report date" />),
  WordCloud: ex(<WordCloud title="What the crew said" width={260} height={160} words={WORDS} />),
};
