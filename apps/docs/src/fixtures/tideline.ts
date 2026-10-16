/**
 * Tideline: the one sample world every live example on the site draws from, so the demos read as one coherent app rather than
 * 200 unrelated snippets. A small studio's project app: four people, five projects, their tasks, files, numbers and a chat.
 * Import from here instead of inventing data inline (apps/docs/scripts/audit-examples.mjs checks for it).
 * Currency is GBP; dates sit around 24 October.
 */
import type { KanbanCard, KanbanColumn } from "rebar-ui";

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Index into Rebar's built-in illustrated portraits (`<Avatar placeholder={n} />`). */
  placeholder: number;
}

export const PEOPLE: Person[] = [
  { id: "maya", name: "Maya Chen", initials: "MC", role: "Design", placeholder: 1 },
  { id: "jonas", name: "Jonas Weber", initials: "JW", role: "Engineering", placeholder: 2 },
  { id: "priya", name: "Priya Nair", initials: "PN", role: "Research", placeholder: 3 },
  { id: "leo", name: "Leo Santos", initials: "LS", role: "Operations", placeholder: 4 },
];
export const person = (id: string): Person => PEOPLE.find((p) => p.id === id) ?? PEOPLE[0];
/** Props for `<Avatar {...avatarOf("maya")} />`. */
export const avatarOf = (id: string) => {
  const p = person(id);
  return { alt: p.name, fallback: p.initials, placeholder: p.placeholder } as const;
};
/** Items for `<AvatarGroup avatars={avatarsOf(["maya", "jonas"])} />`. */
export const avatarsOf = (ids: string[]) => ids.map(avatarOf);
export const PEOPLE_OPTIONS = PEOPLE.map((p) => ({ value: p.id, label: p.name }));

export type ProjectStatus = "On track" | "Review" | "Late" | "Done";
export interface Project {
  id: string;
  name: string;
  kicker: string;
  summary: string;
  owner: string;
  status: ProjectStatus;
  /** Percent complete. */
  done: number;
  /** GBP. */
  budget: number;
  due: string;
}

export const PROJECTS: Project[] = [
  { id: "harbour", name: "Harbour rebrand", kicker: "Brand", summary: "Identity, site and launch kit for the harbour trust.", owner: "maya", status: "On track", done: 84, budget: 48200, due: "24 Oct" },
  { id: "mobile", name: "Tideline mobile", kicker: "Product", summary: "Offline tasks and a quiet inbox for the crew.", owner: "jonas", status: "Review", done: 61, budget: 72900, due: "7 Nov" },
  { id: "interviews", name: "Crew interviews", kicker: "Research", summary: "Twelve calls, one clear pattern.", owner: "priya", status: "Late", done: 33, budget: 9400, due: "17 Oct" },
  { id: "rota", name: "Rota export", kicker: "Operations", summary: "Shifts out to payroll without the spreadsheet.", owner: "leo", status: "Done", done: 100, budget: 6150, due: "10 Oct" },
  { id: "signage", name: "Depot signage", kicker: "Brand", summary: "Wayfinding for the three northern depots.", owner: "maya", status: "Review", done: 48, budget: 21800, due: "21 Nov" },
];
export const project = (id: string): Project => PROJECTS.find((p) => p.id === id) ?? PROJECTS[0];
export const STATUS_TONE: Record<ProjectStatus, "success" | "info" | "error" | "default"> = { "On track": "success", Review: "info", Late: "error", Done: "default" };
export const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export type TaskColumn = "todo" | "doing" | "done";
export interface Task {
  id: string;
  title: string;
  tag: "Design" | "Eng" | "Research" | "Ops";
  assignee: string;
  project: string;
  column: TaskColumn;
  due?: string;
}

export const TASKS: Task[] = [
  { id: "checklist", title: "Draft launch checklist", tag: "Research", assignee: "priya", project: "harbour", column: "todo", due: "Fri" },
  { id: "book", title: "Book crew interviews", tag: "Ops", assignee: "leo", project: "interviews", column: "todo" },
  { id: "icons", title: "Icon audit", tag: "Design", assignee: "maya", project: "harbour", column: "todo" },
  { id: "sync", title: "Offline sync for tasks", tag: "Eng", assignee: "jonas", project: "mobile", column: "doing" },
  { id: "home", title: "Harbour homepage", tag: "Design", assignee: "maya", project: "harbour", column: "doing" },
  { id: "palette", title: "Brand palette", tag: "Design", assignee: "maya", project: "harbour", column: "done" },
  { id: "export", title: "Rota export", tag: "Ops", assignee: "leo", project: "rota", column: "done" },
];
export const COLUMN_TITLES: Record<TaskColumn, string> = { todo: "To do", doing: "In progress", done: "Done" };

/** The tasks as a Kanban board: `const [board, setBoard] = useState(kanbanBoard())`. */
export function kanbanBoard(): { columns: KanbanColumn[]; cards: Record<string, KanbanCard> } {
  const cards: Record<string, KanbanCard> = {};
  for (const t of TASKS) cards[t.id] = { id: t.id, title: t.title, tags: [t.tag] };
  const columns: KanbanColumn[] = (["todo", "doing", "done"] as TaskColumn[]).map((c) => ({
    id: c,
    title: COLUMN_TITLES[c],
    sections: [{ id: `${c}-main`, cardIds: TASKS.filter((t) => t.column === c).map((t) => t.id) }],
  }));
  return { columns, cards };
}

/** Tasks completed per week, 3 Aug to 19 Oct. */
export const WEEKLY_DONE = [14, 19, 16, 22, 20, 25, 23, 28, 25, 31, 29, 33];
export const WEEK_LABELS = ["3 Aug", "10 Aug", "17 Aug", "24 Aug", "31 Aug", "7 Sep", "14 Sep", "21 Sep", "28 Sep", "5 Oct", "12 Oct", "19 Oct"];
/** Hours logged this week, per person. */
export const HOURS_BY_PERSON = [
  { person: "maya", hours: 31 },
  { person: "jonas", hours: 36 },
  { person: "priya", hours: 18 },
  { person: "leo", hours: 24 },
];
export const KPIS = [
  { label: "Open tasks", value: 42, delta: "↓ 6 this week" },
  { label: "Due soon", value: 7, delta: "3 today" },
  { label: "Shipped", value: 18, delta: "↑ 4 vs last month" },
];

export interface File {
  id: string;
  name: string;
  size: string;
  kind: "pdf" | "image" | "video" | "sheet" | "svg";
  project: string;
}
export const FILES: File[] = [
  { id: "fascia", name: "depot-fascia-final.pdf", size: "1.4 MB", kind: "pdf", project: "signage" },
  { id: "livery", name: "van-livery-photos.zip", size: "48 MB", kind: "image", project: "harbour" },
  { id: "walkthrough", name: "interview-03-walkthrough.mp4", size: "212 MB", kind: "video", project: "interviews" },
  { id: "rota-csv", name: "rota-export-march.csv", size: "90 KB", kind: "sheet", project: "rota" },
  { id: "mark", name: "mark-stacked.svg", size: "8 KB", kind: "svg", project: "harbour" },
];

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  project: string;
}
export const EVENTS: Event[] = [
  { id: "launch", title: "Harbour launch", date: "24 Oct", time: "09:00", project: "harbour" },
  { id: "review", title: "Mobile design review", date: "22 Oct", time: "14:00", project: "mobile" },
  { id: "call-11", title: "Crew interview 11", date: "21 Oct", time: "11:30", project: "interviews" },
  { id: "payroll", title: "Payroll cut-off", date: "28 Oct", project: "rota" },
];

export interface Message {
  id: string;
  from: string | "assistant";
  text: string;
  time: string;
  citations?: string[];
}
export const CHAT: Message[] = [
  { id: "m1", from: "jonas", text: "What slipped on the mobile release this week?", time: "09:12" },
  { id: "m2", from: "assistant", text: "Two things. Offline sync is in review and the crew-interview notes are late.", time: "09:12", citations: ["Task · Offline sync", "Doc · Interview log"] },
  { id: "m3", from: "jonas", text: "Can you draft a note for the crew?", time: "09:14" },
];

export const TAGS = ["Design", "Eng", "Research", "Ops"] as const;
export const TAG_OPTIONS = TAGS.map((t) => ({ value: t.toLowerCase(), label: t }));
export const PROJECT_OPTIONS = PROJECTS.map((p) => ({ value: p.id, label: p.name }));

export interface CrewMember {
  id: string;
  name: string;
  /** Where they work on the harbour. */
  role: string;
  /** Interview slot, or "Booked" if not yet done. */
  interviewed: string;
}
/** The twelve harbour crew interviewed for the "Crew interviews" project: a long list, for directories and index rails. */
export const CREW: CrewMember[] = [
  { id: "aisha", name: "Aisha Bello", role: "Ferry deckhand", interviewed: "6 Oct" },
  { id: "ben", name: "Ben Okafor", role: "Pilot boat skipper", interviewed: "6 Oct" },
  { id: "carys", name: "Carys Hughes", role: "Harbour office", interviewed: "8 Oct" },
  { id: "dev", name: "Dev Patel", role: "Marine engineer", interviewed: "8 Oct" },
  { id: "erin", name: "Erin Walsh", role: "Ferry deckhand", interviewed: "9 Oct" },
  { id: "fatima", name: "Fatima Khan", role: "Dispatcher", interviewed: "13 Oct" },
  { id: "gareth", name: "Gareth Pryce", role: "Crane operator", interviewed: "13 Oct" },
  { id: "hana", name: "Hana Sato", role: "Ferry crew", interviewed: "15 Oct" },
  { id: "ivan", name: "Ivan Petrov", role: "Tug crew", interviewed: "15 Oct" },
  { id: "kwame", name: "Kwame Mensah", role: "Dock supervisor", interviewed: "20 Oct" },
  { id: "niamh", name: "Niamh Byrne", role: "Ferry crew", interviewed: "Booked, 21 Oct" },
  { id: "tomas", name: "Tomas Larsen", role: "Night watch", interviewed: "Booked, 21 Oct" },
];
export type InvoiceStatus = "Paid" | "Due" | "Overdue" | "Draft";
export interface Invoice {
  id: string;
  supplier: string;
  date: string;
  status: InvoiceStatus;
  /** GBP, with pence. */
  amount: number;
  project: string;
}
/** October's supplier invoices, for the plain tables. */
export const INVOICES: Invoice[] = [
  { id: "INV-1041", supplier: "Quay Marine Supplies", date: "22 Oct", status: "Paid", amount: 1240, project: "harbour" },
  { id: "INV-1042", supplier: "Northern Print Co.", date: "23 Oct", status: "Due", amount: 3860.5, project: "signage" },
  { id: "INV-1043", supplier: "Brightwater Studio", date: "24 Oct", status: "Overdue", amount: 980, project: "interviews" },
  { id: "INV-1044", supplier: "Harbour Cafe Catering", date: "24 Oct", status: "Draft", amount: 415.25, project: "harbour" },
];
export const INVOICE_TONE: Record<InvoiceStatus, "success" | "info" | "error" | "default"> = { Paid: "success", Due: "info", Overdue: "error", Draft: "default" };
/** GBP with pence: `gbpPence(3860.5)` is "£3,860.50". */
export const gbpPence = (n: number) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---- Wave G fixtures (candlestick and funnel pages) ---- */
/** Open-task count per day, 20 to 24 Oct, as open/high/low/close candles. */
export const OPEN_TASK_CANDLES = [
  { label: "Mon 20", open: 48, high: 50, low: 45, close: 47 },
  { label: "Tue 21", open: 47, high: 48, low: 43, close: 44 },
  { label: "Wed 22", open: 44, high: 47, low: 43, close: 46 },
  { label: "Thu 23", open: 46, high: 46, low: 41, close: 42 },
  { label: "Fri 24", open: 42, high: 44, low: 40, close: 43 },
];
/** The crew interview recruitment funnel for the "Crew interviews" project. */
export const CREW_FUNNEL = [
  { label: "Contacted", value: 48 },
  { label: "Replied", value: 31 },
  { label: "Booked", value: 18 },
  { label: "Interviewed", value: 12 },
];
// ---- wave-bc-j: chart sample data (self-contained block) ----
/** Tasks opened per week, aligned with WEEK_LABELS and WEEKLY_DONE. */
export const OPENED_PER_WEEK = [18, 20, 21, 24, 22, 27, 26, 29, 30, 30, 32, 31];
/** Days from start to done per person, as a five-number summary (min, q1, median, q3, max). */
export const CYCLE_DAYS = [
  { person: "maya", min: 1, q1: 2, median: 3, q3: 5, max: 9 },
  { person: "jonas", min: 2, q1: 4, median: 6, q3: 9, max: 15 },
  { person: "priya", min: 1, q1: 3, median: 4, q3: 6, max: 11 },
  { person: "leo", min: 1, q1: 2, median: 3, q3: 4, max: 7 },
];
/** Hours logged per project this quarter. */
export const PROJECT_HOURS: Record<string, number> = { harbour: 410, mobile: 760, interviews: 120, rota: 90, signage: 230 };
