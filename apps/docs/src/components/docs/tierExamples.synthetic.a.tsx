"use client";

import { useEffect, useRef, useState } from "react";
import {
  Affix,
  AiChatInput,
  Alert,
  AspectRatio,
  AuthScreen,
  AvatarGroup,
  BackTop,
  BarChart,
  BentoCard,
  BentoGrid,
  BulletGraph,
  Button,
  ButtonGroup,
  CandlestickChart,
  Card,
  Carousel,
  ChatThread,
  CodeBlock,
  Countdown,
  Descriptions,
  DeviceStage,
  DiagramMinimap,
  DiffViewer,
  Empty,
  FeatureShowcase,
  FunnelChart,
  GanttChart,
  GaugeChart,
  GeoChart,
  Heading,
  Input,
  Stack,
  Tag,
  Text,
} from "rebar-ui";
import type { ChatMessage } from "rebar-ui";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import {
  CHAT,
  CREW_FUNNEL,
  EVENTS,
  OPEN_TASK_CANDLES,
  PEOPLE,
  PROJECTS,
  STATUS_TONE,
  TASKS,
  WEEKLY_DONE,
  WEEK_LABELS,
  avatarsOf,
  gbp,
  person,
  project,
} from "@/fixtures/tideline";
import { ex } from "./tierExamples.types";
import type { ExampleMap } from "./tierExamples.types";

const INK = "var(--rebar-color-primary)";
const harbour = project("harbour");
const launch = EVENTS[0]!;
const d = (month: number, day: number) => new Date(2026, month, day);
const project_items = PROJECTS.map((p) => ({ title: p.name, badge: p.status }));

/* ---- stateful or compound examples ---- */

/** Counts to a moment fixed after mount (two days three hours on), so it can never read zero and the server render matches the first client render. */
function LaunchCountdown() {
  const [target, setTarget] = useState<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setTarget(Date.now() + (2 * 86400 + 3 * 3600) * 1000), 0);
    return () => clearTimeout(id);
  }, []);
  return target === null ? <span aria-hidden="true">2d 03h 00m 00s</span> : <Countdown target={target} />;
}

function AiComposer() {
  const [draft, setDraft] = useState(`What is due before the ${launch.title.toLowerCase()} on ${launch.date}?`);
  return <AiChatInput value={draft} onValueChange={setDraft} onSend={() => setDraft("")} placeholder="Ask about Tideline" aria-label="Ask about Tideline" dictation />;
}

function SignIn() {
  return (
    <TidelinePhone bar={<span aria-hidden="true" />} width={230} height={310} padding={0}>
      <AuthScreen
        tone="navy"
        logo={<span style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: 24, fontWeight: 600 }}>Tideline</span>}
        footer={<Button variant="tertiary" size="sm">Need an account? Sign up</Button>}
      >
        <Input type="email" placeholder="Email" aria-label="Email" />
        <Input type="password" placeholder="Password" aria-label="Password" />
        <Button>Sign in</Button>
      </AuthScreen>
    </TidelinePhone>
  );
}

function ScrollWithBackTop() {
  const boxRef = useRef<HTMLDivElement>(null);
  const rows = [...TASKS, ...TASKS];
  return (
    <div style={{ position: "relative", transform: "translateZ(0)", overflow: "hidden", borderRadius: 8, border: "1px solid var(--rebar-color-border)", background: "var(--rebar-color-bg-primary)" }}>
      <div ref={boxRef} style={{ height: 200, overflowY: "auto", padding: "var(--rebar-space-md)" }}>
        <Stack gap="sm">
          {rows.map((t, i) => (
            <Stack key={`${t.id}-${i}`} direction="row" gap="sm" align="center" justify="between">
              <Text size="sm">{t.title}</Text>
              <Tag>{t.tag}</Tag>
            </Stack>
          ))}
        </Stack>
      </div>
      <BackTop visibilityThreshold={40} target={() => boxRef.current ?? window} />
    </div>
  );
}

const THREAD: ChatMessage[] = CHAT.map((m) => {
  const user = m.from !== "assistant";
  return {
    id: m.id,
    role: user ? "user" : "assistant",
    content: m.text,
    status: "sent",
    timestamp: m.time,
    avatarFallback: user ? person(m.from).initials : "TL",
    avatarPlaceholder: user,
    actions: m.citations ? (
      <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
        {m.citations.map((c) => (
          <Tag key={c}>{c}</Tag>
        ))}
      </Stack>
    ) : undefined,
  };
});

const SYNC_PHONE = (
  <TidelinePhone title="Tideline" tabs={1} height={250} width={200} padding={10}>
    <PhoneList>
      <PhoneRow title="Offline sync" meta={project("mobile").status} tint={1} />
      <PhoneRow title="Signage brief" meta="Depot signage" tint={2} />
    </PhoneList>
  </TidelinePhone>
);

const FLOW_NODES = [
  { id: "brief", x: 280, y: 30 },
  { id: "palette", x: 140, y: 140 },
  { id: "home", x: 420, y: 140 },
  { id: "icons", x: 70, y: 250 },
  { id: "livery", x: 210, y: 250 },
  { id: "copy", x: 350, y: 250 },
  { id: "build", x: 490, y: 250 },
  { id: "launch", x: 280, y: 350 },
];

const GEO_AREAS = [
  { id: "pilot", label: "Pilot", value: 2 },
  { id: "depot-n", label: "North", value: 1 },
  { id: "ferry", label: "Ferry", value: 4 },
  { id: "office", label: "Office", value: 2 },
  { id: "quay", label: "Quay", value: 1 },
  { id: "dock", label: "Dock", value: 2 },
];
const GEO_LAYOUT = [
  { id: "depot-n", row: 0, col: 1 },
  { id: "pilot", row: 0, col: 2 },
  { id: "office", row: 1, col: 0 },
  { id: "ferry", row: 1, col: 1 },
  { id: "quay", row: 1, col: 2 },
  { id: "dock", row: 2, col: 1 },
];

const GANTT_TASKS = [
  { id: "harbour", label: "Harbour rebrand", start: d(8, 2), end: d(9, 24), progress: 0.84 },
  { id: "mobile", label: "Tideline mobile", start: d(8, 15), end: d(10, 7), progress: 0.61 },
  { id: "interviews", label: "Crew interviews", start: d(9, 1), end: d(9, 17), progress: 0.33 },
  { id: "rota", label: "Rota export", start: d(8, 15), end: d(9, 10), progress: 1 },
  { id: "signage", label: "Depot signage", start: d(9, 6), end: d(10, 21), progress: 0.48 },
];

const OLD_TEXT = `export function syncTasks(crewId) {
  const tasks = fetchTasks(crewId);
  return tasks;
}`;
const NEW_TEXT = `export function syncTasks(crewId, offline = true) {
  const tasks = offline ? readCache(crewId) : fetchTasks(crewId);
  return tasks;
}`;

const SNIPPET = `import { syncTasks } from "./sync";

export async function onReconnect(crewId: string) {
  return (await syncTasks(crewId)).length;
}`;

const weekly = WEEK_LABELS.slice(6).map((label, i) => ({ label, value: WEEKLY_DONE[i + 6]!, color: INK }));

export const SYNTHETIC_A: ExampleMap = {
  // Rest state: a very negative offset keeps the real Affix from ever pinning (it listens to the page scroll).
  Affix: ex(
    <Affix offsetTop={-100000}>
      <Card>
        <Stack direction="row" gap="sm" align="center">
          <Button size="sm">Add task</Button>
          <Text size="sm" color="secondary">{harbour.name}, {TASKS.length} tasks</Text>
        </Stack>
      </Card>
    </Affix>,
  ),
  AiChatInput: ex(<AiComposer />),
  Alert: ex(
    <Stack gap="sm">
      <Alert type="info" title={`${launch.title} moved`}>Now Friday {launch.date}, {launch.time}.</Alert>
      <Alert type="warning" title="Two tasks are due today">Offline sync and Harbour homepage.</Alert>
    </Stack>,
  ),
  AspectRatio: ex(
    <Stack gap="xs">
      <AspectRatio ratio={16 / 9} placeholder />
      <Text size="sm" color="secondary">{harbour.name} cover, 16:9</Text>
    </Stack>,
  ),
  AuthScreen: ex(<SignIn />),
  AvatarGroup: ex(<AvatarGroup avatars={avatarsOf(PEOPLE.map((p) => p.id))} max={3} />),
  BackTop: ex(<ScrollWithBackTop />),
  Banner: ex(<NextBlockRenderer blocks={[{ type: "banner", tone: "warning", icon: "info", text: "Crew interviews are 2 days late.", action: { label: "Reschedule", icon: "refresh" } }]} />),
  BarChart: ex(<BarChart title="Tasks completed per week" bars={weekly} height={190} />),
  BentoCard: ex(
    <BentoGrid>
      <BentoCard span={6} tone="tint-1" title="Tasks that work offline" body="Check things off on the quay, sync when you are back." media={<AspectRatio ratio={16 / 9} placeholder={1} />} />
    </BentoGrid>,
  ),
  BulletGraph: ex(
    <BulletGraph
      title="October targets"
      measures={[
        { label: "Tasks done", value: 33, target: 30, ranges: [20, 30, 40], color: INK },
        { label: "Hours logged", value: 109, target: 120, ranges: [80, 120, 160], color: INK },
      ]}
    />,
  ),
  ButtonGroup: ex(
    <ButtonGroup>
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>,
  ),
  Callout: ex(<NextBlockRenderer blocks={[{ type: "callout", tone: "warning", icon: "clock", title: "Crew interviews are running late", subtitle: "Eight of twelve calls done; four booked for 21 Oct." }]} />),
  CandlestickChart: ex(
    <CandlestickChart title="Open tasks, week of 20 Oct" data={OPEN_TASK_CANDLES} height={190} upColor="var(--rebar-color-danger)" downColor="var(--rebar-color-success)" />,
  ),
  Card: ex(
    <Card cover={<div aria-hidden="true" style={{ height: 80, background: "var(--rebar-color-tint-1)" }} />}>
      <Stack gap="xs">
        <Text size="xs" color="secondary" style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}>{harbour.kicker}</Text>
        <Heading level={3}>{harbour.name}</Heading>
        <Text size="sm" color="secondary">{harbour.summary}</Text>
        <Stack direction="row" justify="between" align="center">
          <AvatarGroup size="sm" avatars={avatarsOf(["maya", "jonas", "priya"])} />
          <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
        </Stack>
      </Stack>
    </Card>,
  ),
  "Card Grid": ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "card-grid",
          items: PROJECTS.slice(0, 2).map((p) => ({
            title: p.name,
            body: p.summary,
            href: "#",
            linkLabel: "Open project \u2192",
            tags: [{ label: p.status, tone: p.status === "Done" ? undefined : (STATUS_TONE[p.status] as "success" | "info" | "error") }],
          })),
        },
      ]}
    />,
  ),
  Carousel: ex(
    <Carousel aria-label="Harbour rebrand photos">
      {[0, 1, 2].map((i) => (
        <AspectRatio key={i} ratio={4 / 3} placeholder={i} />
      ))}
    </Carousel>,
  ),
  ChatThread: ex(
    <div style={{ height: 290 }}>
      <ChatThread messages={THREAD} />
    </div>,
  ),
  Checklist: ex(<NextBlockRenderer blocks={[{ type: "checklist", heading: "Harbour launch checklist", items: ["Sign off the brand palette", "Publish the homepage", "Print the van livery", "Brief the harbour office"] }]} />),
  CodeBlock: ex(<CodeBlock language="tsx" code={SNIPPET} />),
  "Construct Entry": ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "construct-entry",
          id: "Callout",
          measured: true,
          description: "A small banner pairing a tone, a title and an optional subtitle.",
          shape: '{ type: "callout", tone: Tone, title: string, subtitle?: string }',
        },
      ]}
    />,
    { wide: true },
  ),
  Countdown: ex(
    <Stack gap="xs">
      <Text size="sm" color="secondary">{launch.title}, opens in about two days</Text>
      <LaunchCountdown />
    </Stack>,
  ),
  "Data List": ex(<NextBlockRenderer blocks={[{ type: "data-list", items: project_items.slice(0, 4) }]} />),
  Descriptions: ex(
    <Descriptions
      title={harbour.name}
      column={1}
      items={[
        { label: "Owner", value: person(harbour.owner).name },
        { label: "Due", value: `${harbour.due} 2026` },
        { label: "Budget", value: gbp(harbour.budget) },
      ]}
    />,
  ),
  DeviceStage: ex(
    <DeviceStage
      glow
      floats={[
        { id: "sync", side: "start", top: "55%", label: "Offline sync", content: "In review, due 7 Nov" },
        { id: "brief", side: "end", top: "18%", label: "Signage brief", content: "Sent to Leo Santos" },
      ]}
    >
      {SYNC_PHONE}
    </DeviceStage>,
    { wide: true },
  ),
  DiagramMinimap: ex(<DiagramMinimap title="Minimap of the launch flow" width={200} height={140} nodes={FLOW_NODES} viewportBounds={{ x: 20, y: 0, width: 520, height: 210 }} />),
  DiffViewer: ex(<DiffViewer oldText={OLD_TEXT} newText={NEW_TEXT} mode="split" oldLabel="main" newLabel="offline-sync" />, { wide: true }),
  "Doc Section": ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "doc-section",
          heading: "Handover notes",
          body: [
            { kind: "text", text: "Priya Nair's interview log is in the `Crew interviews` folder." },
            { kind: "list", items: ["Read the summary", "Book the last four calls"] },
          ],
        },
      ]}
    />,
  ),
  Empty: ex(
    <Empty
      icon="container"
      description={
        <Stack gap="xs" align="center">
          <Heading level={3}>No tasks yet</Heading>
          <Text size="sm" color="secondary">Add the first task for {harbour.name}.</Text>
        </Stack>
      }
    >
      <Button>New task</Button>
    </Empty>,
  ),
  ErrorBlock: ex(
    <NextBlockRenderer
      blocks={[{ type: "error-block", status: "disconnected", fullPage: false, title: "You are offline", description: "Tasks keep working. We will sync when the signal is back.", action: { label: "Retry" } }]}
    />,
  ),
  "Feature Grid": ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "feature-grid",
          items: [
            { title: "Offline first", body: "Tasks keep working below deck.", icon: "lock" },
            { title: "A quiet inbox", body: "One digest a day, not forty pings.", icon: "mail" },
          ],
        },
      ]}
    />,
  ),
  FeatureShowcase: ex(
    <FeatureShowcase eyebrow="Offline" title="Works on the depot floor" body="Tasks sync on the device and catch up when the signal returns." media={SYNC_PHONE} />,
    { wide: true },
  ),
  FilterBar: ex(
    <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search projects\u2026", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }]} />,
    { wide: true },
  ),
  Footer: ex(
    <NextBlockRenderer
      blocks={[
        {
          type: "footer",
          label: "No more projects",
          content: "\u00a9 2026 Tideline Studio",
          links: [
            { text: "Terms", href: "#" },
            { text: "Privacy", href: "#" },
          ],
          chips: [{ text: "New" }, { text: "Send feedback", type: "link" }],
        },
      ]}
    />,
  ),
  FunnelChart: ex(<FunnelChart title="Crew interview recruitment" stages={CREW_FUNNEL} height={190} />),
  Gallery: ex(<NextBlockRenderer blocks={[{ type: "gallery", label: "antd", dir: "/benchmark-screenshots", prefix: "antd-text" }]} />),
  GanttChart: ex(<GanttChart title="Studio timeline" tasks={GANTT_TASKS} currentDate={d(9, 22)} />, { wide: true }),
  GaugeChart: ex(<GaugeChart title="Harbour rebrand" label="complete" value={harbour.done} min={0} max={100} valueFormat={(v) => `${v}%`} size={220} />),
  GeoChart: ex(<GeoChart title="Crew interviews by harbour area" regions={GEO_AREAS} layout={GEO_LAYOUT} cellSize={56} />),
};
