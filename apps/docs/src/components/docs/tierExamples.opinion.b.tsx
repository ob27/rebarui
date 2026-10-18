"use client";

import { useRef, useState } from "react";
import {
  Avatar,
  Button,
  CalendarIcon,
  Card,
  ChatIcon,
  LockIcon,
  MultiSelect,
  NodeLinkGraph,
  NumberKeyboard,
  Onboarding,
  OrgChart,
  PackedBubbleChart,
  PertChart,
  PhoneInput,
  PickerWheel,
  Popconfirm,
  Popover,
  PullToRefresh,
  Puppet,
  RadarChart,
  ResizablePanels,
  RibbonChart,
  RichTextEditor,
  SchematicHeatmap,
  ScrollRail,
  Select,
  ShapeGallery,
  SignaturePad,
  SlashCommandMenu,
  SpeedDial,
  SplitButton,
  StackedAreaChart,
  StackedLineChart,
  StepChart,
  SwipeActions,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Tag,
  TagInput,
  Text,
  TextToSpeechBar,
  ThemeToggle,
  TimePicker,
  Toast,
  ToastProvider,
  TodoItem,
  Tooltip,
  Tour,
  Transfer,
  TreeSelect,
  TreeView,
  UMAPPlot,
  UploadQueue,
  VersionHistory,
  VideoPlayer,
  VoiceComposer,
  VoiceInputBar,
  WaveformAudioPlayer,
  WorkspaceSwitcher,
} from "rebar-ui";
import type {
  HeatmapBrush,
  HeatmapRegion,
  HeatmapValue,
  PertTask,
  TableColumn,
  TtsState,
  UploadQueueItem,
  VoiceComposerState,
  VoiceInputBarState,
} from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneList, PhoneRow } from "@/app/imitations/device-frame/TidelinePhone";
import { CON, CON_CANVAS, CON_LINES } from "@/data/conLayers";
import { ONBOARDING_SLIDES } from "@/fixtures/athic-mobile";
import {
  COLUMN_TITLES,
  DONE_BY_TAG,
  FILES,
  INVOICES,
  INVOICE_TONE,
  PEOPLE,
  PEOPLE_OPTIONS,
  PROJECTS,
  STATUS_TONE,
  TASKS,
  WEEK_LABELS,
  avatarOf,
  gbp,
  gbpPence,
  person,
  project,
} from "@/fixtures/tideline";
import type { Invoice } from "@/fixtures/tideline";
import { ex } from "./tierExamples.types";
import type { ExampleMap } from "./tierExamples.types";

const FRAME = {
  border: "1px solid var(--rebar-color-border)",
  borderRadius: 12,
  overflow: "hidden",
  background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))",
} as const;

/* ---- shared small data ---- */

const WEEKS = WEEK_LABELS.slice(-6);
const TAG_SERIES = Object.entries(DONE_BY_TAG).map(([label, values]) => ({ label, values }));
const AREAS = ["Design", "Eng", "Research", "Ops", "Review"];

// ---- NodeLinkGraph / OrgChart ----
const GRAPH_NODES = [
  { id: "studio", label: "Tideline" },
  ...PEOPLE.map((p) => ({ id: p.id, label: p.name, parentId: "studio" })),
  ...PROJECTS.slice(0, 3).map((p) => ({ id: p.id, label: p.name, parentId: p.owner })),
];
const GRAPH_EDGES = GRAPH_NODES.filter((n) => "parentId" in n).map((n) => ({ source: (n as { parentId: string }).parentId, target: n.id }));
const TEAM = PEOPLE.map((p) => (p.id === "leo" ? { id: p.id, name: p.name, role: p.role } : { id: p.id, name: p.name, role: p.role, parentId: "leo" }));

// ---- PertChart ----
const PERT_TASKS: PertTask[] = [
  { id: "palette", label: "Brand palette", duration: 3 },
  { id: "home", label: "Homepage", duration: 4, dependsOn: ["palette"] },
  { id: "livery", label: "Van livery", duration: 2, dependsOn: ["palette"] },
  { id: "launch", label: "Launch", duration: 2, dependsOn: ["home", "livery"] },
];

// ---- SchematicHeatmap ----
const BRUSHES: HeatmapBrush[] = [
  { id: "building", label: "Building", color: "var(--rebar-color-primary)" },
  { id: "outdoor", label: "Outdoor", color: "var(--rebar-color-success)", showLabel: true },
  { id: "service", label: "Service", color: "var(--rebar-color-text-secondary)", showLabel: false },
];
const REGIONS: HeatmapRegion[] = [
  { id: "north-shed", kind: "building", label: "North shed", rects: [[0, 0, 220, 90]] },
  { id: "east-shed", kind: "building", label: "East shed", rects: [[230, 0, 380, 90], [290, 90, 380, 190]] },
  { id: "office", kind: "building", label: "Depot office", rects: [[0, 100, 120, 190]] },
  { id: "quay-yard", kind: "outdoor", label: "Quay yard", rects: [[130, 100, 280, 120], [130, 170, 280, 190], [130, 120, 150, 170], [260, 120, 280, 170]] },
  { id: "van-park", kind: "outdoor", label: "Van park", rects: [[0, 200, 280, 260]] },
  { id: "generator", kind: "service", label: "Generator", rects: [[290, 200, 380, 260]] },
  { id: "pump-house", kind: "service", label: "Pump house", rects: [[390, 0, 430, 40]] },
];
const HEAT_VALUES: Record<string, HeatmapValue> = {
  "north-shed": { done: 182, expected: 200 },
  "east-shed": { done: 96, expected: 210 },
  office: { done: 12, expected: 140 },
  "quay-yard": 0.55,
  "van-park": { done: 40, expected: 40 },
};

// ---- ShapeGallery ----
const shapeSvg = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const SHAPES = [
  { id: "plate", label: "Plate", category: "Fascia", preview: shapeSvg(<rect x="3" y="6" width="18" height="12" />) },
  { id: "rounded", label: "Rounded plate", category: "Fascia", preview: shapeSvg(<rect x="3" y="6" width="18" height="12" rx="5" />) },
  { id: "roundel", label: "Roundel", category: "Fascia", preview: shapeSvg(<circle cx="12" cy="12" r="9" />) },
  { id: "arrow", label: "Arrow right", category: "Wayfinding", preview: shapeSvg(<path d="M3 12h16m-6-6l6 6l-6 6" />) },
  { id: "chevron", label: "Chevron", category: "Wayfinding", preview: shapeSvg(<path d="M9 5l7 7l-7 7" />) },
  { id: "pin", label: "Pin", category: "Wayfinding", preview: shapeSvg(<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4z" />) },
  { id: "diamond", label: "Diamond", category: "Hazard", preview: shapeSvg(<path d="M12 2l10 10l-10 10L2 12z" />) },
  { id: "triangle", label: "Warning triangle", category: "Hazard", preview: shapeSvg(<path d="M12 3l10 18H2z" />) },
];

// ---- Select ----
const STATUS_OPTIONS = [
  { value: "todo", label: COLUMN_TITLES.todo },
  { value: "doing", label: COLUMN_TITLES.doing },
  { value: "review", label: "In review" },
  { value: "done", label: COLUMN_TITLES.done },
  { value: "archived", label: "Archived", disabled: true },
];

// ---- SlashCommandMenu ----
const COMMANDS = [
  { key: "text", label: "Text", description: "Plain paragraph", category: "Basic blocks", onSelect: () => {} },
  { key: "heading", label: "Heading", description: "A section heading", category: "Basic blocks", onSelect: () => {} },
  { key: "task", label: "Task", description: "A checkbox with an assignee", category: "Basic blocks", onSelect: () => {} },
  { key: "project", label: "Project link", description: "Link to a Tideline project", category: "Embeds", onSelect: () => {} },
];

// ---- Ribbon / stacked bar / scatter / sticky kanban / wizard blocks ----
const RIBBON_SERIES = [
  { label: "Maya Chen", values: [9, 8, 10, 12, 11] },
  { label: "Jonas Weber", values: [7, 10, 9, 8, 12] },
  { label: "Priya Nair", values: [4, 6, 8, 9, 7] },
  { label: "Leo Santos", values: [3, 4, 4, 2, 3] },
];
const STACKED_BAR: Construct = {
  type: "stacked-bar-chart",
  title: "Spend so far",
  bars: [
    { label: "Harbour rebrand", segments: [{ label: "Design", value: 21000 }, { label: "Print", value: 14200 }, { label: "Contractors", value: 8000 }] },
    { label: "Tideline mobile", segments: [{ label: "Design", value: 9000 }, { label: "Print", value: 0 }, { label: "Contractors", value: 41000 }] },
    { label: "Depot signage", segments: [{ label: "Design", value: 4200 }, { label: "Print", value: 9800 }, { label: "Contractors", value: 5100 }] },
  ],
};
const SCATTER: Construct = {
  type: "scatter-chart",
  title: "Days from start to done",
  series: [
    { label: "Maya Chen", values: [1.5, 2, 3, 2.5, 1, 4, 2] },
    { label: "Jonas Weber", values: [3, 5, 4, 6, 2.5, 7, 4.5] },
    { label: "Priya Nair", values: [2, 2.5, 6, 3, 2, 8, 3.5] },
  ],
};
const STICKY: Construct = {
  type: "sticky-kanban",
  title: "Harbour rebrand retro",
  columns: [
    { id: "went-well", title: "Went well", sections: [{ id: "went-well-main", cardIds: ["w1", "w2"] }] },
    { id: "improve", title: "To improve", sections: [{ id: "improve-main", cardIds: ["i1", "i2"] }] },
    { id: "ideas", title: "Ideas", sections: [{ id: "ideas-main", cardIds: ["d1"] }] },
  ],
  cards: {
    w1: { id: "w1", title: "Brand palette signed off in one round" },
    w2: { id: "w2", title: "Homepage shipped to staging early" },
    i1: { id: "i1", title: "Interview notes ran late" },
    i2: { id: "i2", title: "Too many threads for livery photos" },
    d1: { id: "d1", title: "A weekly digest for the crew" },
  },
};
const WIZARD: Construct = {
  type: "wizard",
  steps: [
    { label: "Who", fields: [{ kind: "text", label: "Crew member", placeholder: "Niamh Byrne", required: true }, { kind: "select", label: "Role", options: ["Ferry crew", "Night watch", "Dock supervisor"] }] },
    { label: "When", fields: [{ kind: "date", label: "Interview date", required: true }] },
  ],
  submitLabel: "Book interview",
  nextLabel: "Continue",
};

// ---- Table ----
const INVOICE_COLUMNS: TableColumn<Invoice>[] = [
  { key: "id", header: "Invoice", render: (v) => <strong>{String(v)}</strong> },
  { key: "supplier", header: "Supplier" },
  { key: "status", header: "Status", render: (v) => <Tag tone={INVOICE_TONE[v as Invoice["status"]]}>{String(v)}</Tag> },
  { key: "amount", header: "Amount", align: "right", render: (v) => gbpPence(Number(v)) },
];

// ---- Transfer / tree data ----
const REVIEWERS = PEOPLE.map((p) => ({ key: p.id, label: `${p.name}, ${p.role}` }));
const KICKERS = Array.from(new Set(PROJECTS.map((p) => p.kicker)));
const PROJECT_TREE = KICKERS.map((k) => ({ value: k, label: k, children: PROJECTS.filter((p) => p.kicker === k).map((p) => ({ value: p.id, label: p.name })) }));
const FILE_TREE = [
  {
    value: "brand",
    label: "Brand",
    children: [
      { value: "logos", label: "Logos", children: [{ value: "mark-stacked.svg", label: "mark-stacked.svg" }] },
      { value: "van-livery-photos.zip", label: "van-livery-photos.zip" },
    ],
  },
  { value: "depot-fascia-final.pdf", label: "depot-fascia-final.pdf" },
  { value: "interview-03-walkthrough.mp4", label: "interview-03-walkthrough.mp4" },
];

// ---- UMAPPlot ----
const CLUSTERS = [
  {
    label: "Shift swaps",
    points: [
      { x: 3.1, y: 1.4, id: "int-04", preview: "We still sort swaps out in the group chat and someone always misses it." },
      { x: 3.6, y: 0.9, id: "int-07", preview: "I would pay for one place that shows who is covering Friday." },
      { x: 2.7, y: 1.9, id: "int-02" },
      { x: 3.3, y: 2.2 },
    ],
  },
  {
    label: "Notifications",
    points: [
      { x: -2.4, y: 2.1, id: "int-09", preview: "On night watch I need the phone quiet unless the pilot boat calls." },
      { x: -1.9, y: 1.6, id: "int-11", preview: "Too many pings. I stopped reading them by Tuesday." },
      { x: -2.8, y: 2.6 },
      { x: -1.5, y: 2.4, id: "int-05" },
      { x: -2.2, y: 1.1 },
    ],
  },
  {
    label: "Training",
    points: [
      { x: 0.4, y: -2.8, id: "int-06", preview: "New starters learn the rota by shadowing, not from the app." },
      { x: 0.9, y: -3.3, id: "int-10", preview: "A five-minute walkthrough on the depot screen would help." },
      { x: -0.2, y: -2.4 },
    ],
  },
];

// ---- VersionHistory ----
const VERSIONS = [
  { id: "v3", label: "Auto-saved", timestamp: new Date("2026-10-24T09:12:00"), preview: "Final edits before the launch brief goes to the harbour trust." },
  { id: "v2", label: "Before AI edit", timestamp: new Date("2026-10-23T14:40:00"), preview: "Original summary paragraph before the assistant rewrote it." },
  { id: "v1", label: "First draft", timestamp: new Date("2026-10-21T10:05:00"), preview: "Outline, launch date and the list of deliverables." },
];

/* ---- small stateful examples ---- */

// A button that opens the keypad sheet (the real one portals to the viewport) and echoes the digits.
/**
 * ThemeToggle writes the page's own theme attributes (`data-theme` on `<html>`), so a working one here would restyle the whole
 * docs site. It is shown as an inert preview: real markup and styling, but it cannot be focused or clicked.
 */
function ThemePreview() {
  return (
    <div inert style={{ pointerEvents: "none" }}>
      <ThemeToggle sections={["mode"]} />
    </div>
  );
}
function Keypad() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
      <Text style={{ fontFamily: "var(--rebar-font-family-mono, monospace)", fontSize: 24, letterSpacing: "0.3em" }}>{text.padEnd(4, "-").slice(0, 4)}</Text>
      <Button onClick={() => setOpen(true)}>Enter PIN</Button>
      <NumberKeyboard
        open={open}
        onOpenChange={setOpen}
        title="Enter PIN"
        onInput={(d) => setText((t) => (t.length < 4 ? t + d : t))}
        onDelete={() => setText((t) => t.slice(0, -1))}
        onConfirm={() => setOpen(false)}
        confirmLabel="Done"
        randomOrder
      />
    </div>
  );
}

function OnboardingFrame() {
  const icons = [<CalendarIcon key="c" />, <ChatIcon key="m" />, <LockIcon key="l" />, <CalendarIcon key="r" />];
  const slides = ONBOARDING_SLIDES.map((s, i) => ({ ...s, icon: icons[i] }));
  return (
    <div style={{ ...FRAME, position: "relative", height: 300, transform: "translateZ(0)" }}>
      <Onboarding slides={slides} onDone={() => {}} />
    </div>
  );
}

const INBOX = [
  { id: "a1", who: "maya", text: `commented on ${TASKS[4].title}`, when: "2 min ago" },
  { id: "a2", who: "jonas", text: `moved ${TASKS[3].title} to Review`, when: "10 min ago" },
  { id: "a3", who: "leo", text: `exported the ${project("rota").name.toLowerCase()}`, when: "Yesterday" },
];
const FRESH = { id: "a0", who: "priya", text: `finished ${TASKS[0].title}`, when: "Just now" };

function RefreshList() {
  const [items, setItems] = useState(INBOX);
  const refresh = async () => {
    await new Promise((r) => setTimeout(r, 900));
    setItems((prev) => (prev.some((a) => a.id === FRESH.id) ? prev : [FRESH, ...prev]));
  };
  return (
    <div style={{ ...FRAME, height: 240 }}>
      <PullToRefresh onRefresh={refresh} style={{ height: "100%" }}>
        <div style={{ minHeight: 260 }}>
          <Text size="xs" color="secondary" style={{ display: "block", margin: "12px 12px 0" }}>
            Pull down to refresh
          </Text>
          <PhoneList style={{ margin: 10 }}>
            {items.map((a) => (
              <PhoneRow key={a.id} thumb={false} trailing={<Avatar size="sm" {...avatarOf(a.who)} />} title={`${person(a.who).name.split(" ")[0]} ${a.text}`} meta={a.when} />
            ))}
          </PhoneList>
        </div>
      </PullToRefresh>
    </div>
  );
}

function TagField() {
  const [tags, setTags] = useState<string[]>(["Design", "Harbour"]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)" }}>
      <TagInput values={tags} onValuesChange={setTags} placeholder="Add a tag..." aria-label="Task tags" />
    </div>
  );
}

function ReadAloud() {
  const [state, setState] = useState<TtsState>("paused");
  return (
    <div style={{ overflowX: "auto" }}>
      <TextToSpeechBar
        state={state}
        progress={0.4}
        onGenerate={() => setState("playing")}
        onPlay={() => setState("playing")}
        onPause={() => setState("paused")}
        onStop={() => setState("idle")}
        voices={[{ id: "en-us", label: "English (US)" }, { id: "en-gb", label: "English (UK)" }]}
        selectedVoiceId="en-gb"
      />
    </div>
  );
}

const TOASTS = [
  { type: "success", title: "Task moved to Done", description: TASKS[5].title, button: "Move to Done" },
  { type: "error", title: "Could not export", description: "Rota is empty for 24 Oct.", button: "Export rota" },
] as const;

function ToastTriggers() {
  const [open, setOpen] = useState([false, false]);
  const set = (i: number, v: boolean) => setOpen((o) => o.map((x, j) => (j === i ? v : x)));
  return (
    <ToastProvider>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {TOASTS.map((t, i) => (
          <Button key={t.type} variant={i === 0 ? "primary" : "secondary"} onClick={() => set(i, true)}>
            {t.button}
          </Button>
        ))}
      </div>
      {TOASTS.map((t, i) => (
        <Toast key={t.type} open={open[i]} onOpenChange={(v) => set(i, v)} type={t.type} title={t.title} description={t.description} duration={4000} />
      ))}
    </ToastProvider>
  );
}

function TodoList() {
  const [done, setDone] = useState<string[]>(["palette"]);
  const rows = [TASKS[5], TASKS[2], TASKS[4]];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map((t) => {
        const completed = done.includes(t.id);
        return (
          <TodoItem
            key={t.id}
            label={<Text size="sm">{t.title}</Text>}
            completed={completed}
            onToggle={(c) => setDone((p) => (c ? [...p, t.id] : p.filter((i) => i !== t.id)))}
            toggleLabel={`Mark "${t.title}" as ${completed ? "incomplete" : "complete"}`}
          />
        );
      })}
    </div>
  );
}

function TourExample() {
  const [open, setOpen] = useState(false);
  const newRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button ref={newRef} onClick={() => setOpen(true)}>New task</Button>
        <Button ref={filterRef} variant="secondary">Filters</Button>
        <Button ref={shareRef} variant="secondary">Share</Button>
      </div>
      <Text size="xs" color="secondary" style={{ display: "block", marginTop: 8 }}>
        Press New task to start the tour.
      </Text>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: () => newRef.current, title: "Add work", description: "Start a task for any Tideline project." },
          { target: () => filterRef.current, title: "Narrow the board", description: "Filter by person, tag or project." },
          { target: () => shareRef.current, title: "Bring in the crew", description: "Share the board with Jonas, Priya and Leo." },
        ]}
      />
    </div>
  );
}

function ReviewerTransfer() {
  const [selected, setSelected] = useState<string[]>(["priya"]);
  return <Transfer items={REVIEWERS} value={selected} onValueChange={setSelected} sourceTitle="Available" targetTitle="Reviewers" />;
}

const UPLOADS: UploadQueueItem[] = [
  { id: "1", name: FILES[1].name, progress: 62, status: "uploading" },
  { id: "2", name: FILES[4].name, progress: 100, status: "done" },
];

function UploadExample() {
  const [items, setItems] = useState<UploadQueueItem[]>([]);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button onClick={() => setItems(UPLOADS)}>Start uploading</Button>
        <Button variant="secondary" onClick={() => setItems([])}>Clear all</Button>
      </div>
      <Text size="xs" color="secondary" style={{ display: "block", marginTop: 8 }}>
        The panel floats at the bottom right of the window.
      </Text>
      <UploadQueue items={items} onPause={() => {}} onResume={() => {}} onRetry={() => {}} onDismiss={(id) => setItems((cur) => cur.filter((i) => i.id !== id))} />
    </div>
  );
}

const VOICE_NOTE = "Can you move the mobile design review to 14:00 on 22 Oct?";

function VoiceNote() {
  const [state, setState] = useState<VoiceComposerState>("ready");
  const [draft, setDraft] = useState(VOICE_NOTE);
  return (
    <div style={{ overflowX: "auto" }}>
      <VoiceComposer
        state={state}
        draftText={draft}
        onDraftTextChange={setDraft}
        onStartRecording={() => {
          setState("recording");
          setDraft("Listening...");
        }}
        onStopRecording={() => {
          setDraft(VOICE_NOTE);
          setState("ready");
        }}
        onSend={() => {
          setState("idle");
          setDraft("");
        }}
        onCancel={() => {
          setState("idle");
          setDraft("");
        }}
      />
    </div>
  );
}

function MicBar() {
  const [state, setState] = useState<VoiceInputBarState>("listening");
  const press = () => setState((s) => (s === "idle" ? "listening" : s === "listening" ? "processing" : "idle"));
  return (
    <div style={{ ...FRAME, overflowX: "auto" }}>
      <VoiceInputBar state={state} barCount={20} onMicPress={press} onKeyboardToggle={() => setState("idle")} />
    </div>
  );
}

function ProjectTabs() {
  const tasks = TASKS.filter((t) => t.project === "harbour");
  const harbour = project("harbour");
  return (
    <Tabs defaultValue="overview">
      <TabList aria-label="Project views">
        <Tab value="overview">Overview</Tab>
        <Tab value="tasks">Tasks</Tab>
        <Tab value="files">Files</Tab>
      </TabList>
      <TabPanel value="overview">
        <Text size="sm" color="secondary">
          {harbour.summary} {harbour.done}% done, launch {harbour.due}.
        </Text>
      </TabPanel>
      <TabPanel value="tasks">
        <Text size="sm" color="secondary">
          {tasks.map((t) => t.title).join(", ")}
        </Text>
      </TabPanel>
      <TabPanel value="files">
        <Text size="sm" color="secondary">
          {FILES.filter((f) => f.project === "harbour").map((f) => f.name).join(", ")}
        </Text>
      </TabPanel>
    </Tabs>
  );
}

const framed = (height: number, node: React.ReactNode) => (
  <div style={{ position: "relative", height, borderRadius: 8, background: "var(--rebar-color-tint-3)", overflow: "hidden", transform: "translateZ(0)" }}>{node}</div>
);

export const OPINION_B: ExampleMap = {
  MultiSelect: ex(<MultiSelect options={PEOPLE_OPTIONS} defaultValues={["maya", "jonas"]} placeholder="Select teammates" aria-label="Share with" />),
  NodeLinkGraph: ex(<NodeLinkGraph layout="hierarchical" title="Studio structure" nodes={GRAPH_NODES} edges={GRAPH_EDGES} width={580} height={300} />, { wide: true }),
  NumberKeyboard: ex(<Keypad />),
  Onboarding: ex(<OnboardingFrame />),
  OrgChart: ex(<OrgChart title="Tideline team" people={TEAM} width={440} height={230} />, { wide: true }),
  PackedBubbleChart: ex(<PackedBubbleChart title="Budget by project" height={230} items={PROJECTS.map((p) => ({ label: p.name, value: p.budget }))} valueFormat={gbp} />),
  PertChart: ex(<PertChart title="Harbour launch" tasks={PERT_TASKS} width={560} height={300} />, { wide: true }),
  PhoneInput: ex(<PhoneInput defaultValue="+44 7700 900142" aria-label="Phone number" />),
  PickerWheel: ex(
    <div style={{ width: 120 }}>
      <PickerWheel options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]} defaultValue="9" visibleCount={5} aria-label="Hour" />
    </div>,
  ),
  Popconfirm: ex(
    <Popconfirm trigger={<Button variant="destructive">Delete project</Button>} title={`Delete ${project("signage").name}?`} description="8 tasks and 2 files go with it." destructive onConfirm={() => {}} />,
  ),
  Popover: ex(
    <Popover trigger={<Button variant="secondary">Filters</Button>}>
      <div style={{ display: "grid", gap: 8, minWidth: 200 }}>
        <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>Filter by status</Text>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(STATUS_TONE) as (keyof typeof STATUS_TONE)[]).map((s) => (
            <Tag key={s} tone={STATUS_TONE[s]}>{s}</Tag>
          ))}
        </div>
      </div>
    </Popover>,
  ),
  PullToRefresh: ex(<RefreshList />),
  Puppet: ex(
    <div style={{ display: "flex", justifyContent: "center", overflow: "hidden", paddingTop: 56 }}>
      <Puppet layers={CON} canvas={CON_CANVAS} size={170} weight="heavy" says={CON_LINES} label="Con, a concrete block with rebar sticking out of its head" />
    </div>,
  ),
  RadarChart: ex(<RadarChart title="Hours by area" axes={AREAS} series={[{ label: "Maya Chen", values: [30, 6, 8, 4, 14] }, { label: "Jonas Weber", values: [5, 34, 6, 8, 10] }]} />),
  ResizablePanels: ex(
    <div style={{ ...FRAME, height: 220 }}>
      <ResizablePanels
        direction="vertical"
        defaultSplit={0.5}
        first={
          <div style={{ display: "grid", gap: 6, padding: 12 }}>
            {TASKS.slice(0, 4).map((t) => (
              <Text key={t.id} size="sm">{t.title}</Text>
            ))}
          </div>
        }
        second={
          <div style={{ display: "grid", gap: 4, padding: 12 }}>
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{TASKS[3].title}</Text>
            <Text size="sm" color="secondary">{project(TASKS[3].project).name}, assigned to {person(TASKS[3].assignee).name}</Text>
          </div>
        }
      />
    </div>,
  ),
  RibbonChart: ex(<RibbonChart title="Tasks closed, by rank" xLabels={WEEK_LABELS.slice(-5)} series={RIBBON_SERIES} height={230} />, { wide: true }),
  RichTextEditor: ex(
    <RichTextEditor
      defaultValue="<p><b>Harbour launch is on for 24 Oct.</b> Fascia artwork is signed off.</p><ul><li>Maya: homepage copy to review</li><li>Leo: payroll cut-off is 28 Oct</li></ul>"
      minHeight={100}
    />,
  ),
  ScatterChart: ex(<NextBlockRenderer blocks={[SCATTER]} />, { wide: true }),
  SchematicHeatmap: ex(
    <SchematicHeatmap ariaLabel="Signage installed by area, northern depot" regions={REGIONS} brushes={BRUSHES} values={HEAT_VALUES} crop={[-10, -10, 440, 270]} defaultSelectedId="east-shed" />,
    { wide: true },
  ),
  ScrollRail: ex(
    <ScrollRail aria-label="Projects" style={{ "--rebar-scroll-rail-item-width": "13rem" } as React.CSSProperties}>
      {PROJECTS.map((p) => (
        <Card key={p.id} title={p.name} subtitle={`${p.kicker}, due ${p.due}`} extra={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>} />
      ))}
    </ScrollRail>,
  ),
  Select: ex(<Select options={STATUS_OPTIONS} defaultValue="doing" aria-label="Status" />),
  ShapeGallery: ex(<ShapeGallery items={SHAPES} defaultFavoriteIds={["arrow", "roundel"]} onSelect={() => {}} />),
  SignaturePad: ex(<SignaturePad allowTypedName defaultTypedName="Maya Chen" aria-label="Sign here" />),
  SlashCommandMenu: ex(<SlashCommandMenu commands={COMMANDS} query="" onClose={() => {}} />),
  SpeedDial: ex(
    framed(
      230,
      <div style={{ position: "absolute", bottom: 16, right: 16 }}>
        <SpeedDial actions={[{ label: "New task", onSelect: () => {} }, { label: "New project", onSelect: () => {} }, { label: "Upload file", onSelect: () => {} }]} />
      </div>,
    ),
  ),
  SplitButton: ex(<SplitButton label="Send report" onClick={() => {}} items={[{ label: "Send and archive", onSelect: () => {} }, { label: "Schedule for Friday", onSelect: () => {} }]} />),
  StackedAreaChart: ex(<StackedAreaChart title="Tasks done per week" xLabels={WEEKS} series={TAG_SERIES} height={230} />, { wide: true }),
  StackedBarChart: ex(<NextBlockRenderer blocks={[STACKED_BAR]} />, { wide: true }),
  StackedLineChart: ex(<StackedLineChart title="Tasks done per week" xLabels={WEEKS} series={TAG_SERIES} height={230} />, { wide: true }),
  StepChart: ex(<StepChart title="Crew on shift" xLabels={["Mon 20", "Tue 21", "Wed 22", "Thu 23", "Fri 24", "Sat 25"]} series={[{ label: "Crew", values: [8, 8, 10, 10, 12, 6] }]} height={230} />, { wide: true }),
  "Sticky Kanban": ex(<NextBlockRenderer blocks={[STICKY]} />, { wide: true }),
  SwipeActions: ex(
    <PhoneList>
      <SwipeActions actions={[{ label: "Assign", onSelect: () => {} }, { label: "Delete", destructive: true, onSelect: () => {} }]}>
        <PhoneRow thumb={false} title={TASKS[4].title} meta={`${person(TASKS[4].assignee).name.split(" ")[0]}, Fri 24 Oct`} trailing={<span style={{ width: 36 }} />} />
      </SwipeActions>
    </PhoneList>,
  ),
  Table: ex(<Table columns={INVOICE_COLUMNS} data={INVOICES} rowKey="id" caption="October invoices" />, { wide: true }),
  Tabs: ex(<ProjectTabs />),
  TagInput: ex(<TagField />),
  TextToSpeechBar: ex(<ReadAloud />),
  ThemeToggle: ex(<ThemePreview />),
  TimePicker: ex(<TimePicker defaultValue="09:00" minuteStep={15} aria-label="Start time" />),
  Toast: ex(<ToastTriggers />),
  TodoItem: ex(<TodoList />),
  Tooltip: ex(
    <Tooltip content="Saves your current changes">
      <Button>Save changes</Button>
    </Tooltip>,
  ),
  Tour: ex(<TourExample />),
  Transfer: ex(<ReviewerTransfer />, { wide: true }),
  TreeSelect: ex(<TreeSelect data={PROJECT_TREE} defaultValue="mobile" />),
  TreeView: ex(<TreeView data={FILE_TREE} defaultExpanded={["brand", "logos"]} defaultSelected="mark-stacked.svg" aria-label="Project files" />),
  UMAPPlot: ex(<UMAPPlot title="Interview excerpts, by theme" clusters={CLUSTERS} height={230} />, { wide: true }),
  UploadQueue: ex(<UploadExample />),
  VersionHistory: ex(<VersionHistory trigger={<Button>Version history</Button>} versions={VERSIONS} currentVersionId="v3" onRestore={() => {}} />),
  VideoPlayer: ex(<VideoPlayer src="/reference-orb.mp4" poster="/art/grain-dusk.svg" preload="none" aria-label="Sample clip" />),
  VoiceComposer: ex(<VoiceNote />),
  VoiceInputBar: ex(<MicBar />),
  WaveformAudioPlayer: ex(
    <div style={{ overflowX: "auto" }}>
      <WaveformAudioPlayer src="/audio/empty-state-waiting-music.mp3" barCount={24} aria-label="Voice note from Priya" />
    </div>,
  ),
  Wizard: ex(<NextBlockRenderer blocks={[WIZARD]} />),
  WorkspaceSwitcher: ex(
    <WorkspaceSwitcher
      workspaces={[{ id: "studio", name: "Tideline Studio" }, { id: "harbour", name: "Harbour Trust" }, { id: "depots", name: "Northern Depots" }]}
      activeId="studio"
      onSelect={() => {}}
      onCreateNew={() => {}}
    />,
  ),
};
