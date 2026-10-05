"use client";

import { useEffect, useState } from "react";
import { AgentTile, AgentWall, Button, Heading, Stack, Text } from "rebar-ui";
import type { AgentWallMember } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const ACTIVITY = [
  "I'm researching what a pile wall looks like.",
  "Reading the retaining wall drawings.",
  "Comparing two geotechnical reports.",
  "Drafting the site inspection summary.",
  "Waiting on the survey data.",
  "Checking the pile schedule against the plan.",
];
const NAMES = ["Barry", "Alice", "Cora", "Dev", "Esme", "Finn", "Gus", "Hana", "Ivo", "June", "Kit", "Lena", "Milo", "Nora", "Otto", "Pia", "Quin", "Rhys", "Sana", "Tess", "Uma", "Vic"];
const SERVICE_ID = "dsl";
const WORKER_ID = "idx";

function initialMembers(): AgentWallMember[] {
  const agents: AgentWallMember[] = NAMES.map((name, i) => ({
    id: `a${i}`,
    name,
    project: i % 3 === 0 ? "Reports > Salary" : "Dm-Archive > Piles",
    status: i === 7 ? "stalled" : i === 9 ? "idle" : "active",
    statusLabel: i === 9 ? "Idle 30mins" : undefined,
    activity: ACTIVITY[i % ACTIVITY.length],
  }));
  // Two quiet agents: ghosts, most likely just not active. They stay on the board for an hour, then drop off.
  agents[3] = { ...agents[3], status: "ghost", statusLabel: "Ghost", activity: undefined };
  agents[12] = { ...agents[12], status: "ghost", statusLabel: "Ghost", activity: undefined };
  return [
    ...agents,
    { id: SERVICE_ID, name: "DSL Service", kind: "service", project: "Dm-Archive", status: "active", activity: "DM-Archive DLS Worker Service: heartbeat ok" },
    { id: WORKER_ID, name: "Index Worker", kind: "service", project: "Reports", status: "active", activity: "Index Worker: heartbeat ok" },
  ];
}

const CODE = `<AgentWall
  members={members}        // { id, name, kind?, project?, status?, statusLabel?, activity? }[]
  title="AI Hive"
  actions={<a href="/join">Join this Hive</a>}
  columns={5}
  rows={4}
/>`;

const BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Code", body: [{ kind: "code", code: CODE }] },
  { type: "props-table", heading: "Props", rows: componentProps["AgentWall"] ?? [] },
  {
    type: "doc-section",
    heading: "Feed it anything",
    body: [
      {
        kind: "text",
        text: "`AgentWall` renders whatever `members` it is given and keeps its own page, filter, search text and selection, so any backend can drive it: a stream of hook events, service heartbeats, a poll. Re-render with new members as they arrive; a page that is left empty by members leaving is clamped back to the last real page. The demo above is fed by a timer that fakes agent activity and heartbeats from two services; one of them reports a suspected memory leak every so often.",
      },
      {
        kind: "text",
        text: "Page, status filter, query and selected id are each controlled/uncontrolled (`page`/`defaultPage`, `statusFilter`/`defaultStatusFilter`, `query`/`defaultQuery`, `selectedId`/`defaultSelectedId`). `filterMode=\"dim\"` keeps tiles that do not match the status filter in place and greys them out, instead of removing them.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Failure versus ghost",
    body: [
      {
        kind: "text",
        text: "Silence means different things. A **service** that reports trouble (\"I think I am leaking memory\") or stops answering has likely failed, so its tile is `failure`, an active failure state. An **agent** that has gone quiet is most likely just not active: its tile is `ghost`, faded and still, and it is not a failure. A hosting server decides when an agent becomes a ghost and drops it from `members` when it should leave; the AI Hive host keeps a ghost on the board for an hour first.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Personas",
    body: [
      {
        kind: "text",
        text: "Each tile wears one of Rebar's three orb personas, chosen by `agentPersona(kind, status)`: **Strato** for any failure, **Spark** for a service, **Chorus** for an LLM agent. Pass `persona` on a tile to override. The orbs are the real persona shaders, drawn through one shared renderer per persona and state (a handful of WebGL contexts however many tiles there are, where browsers allow about 16). Each tile copies the middle of that frame into a small canvas, the same lens the persona showcase uses. Where WebGL is unavailable, under `prefers-reduced-motion`, and on the server, a plain CSS look-alike is shown instead; pass `orb=\"css\"` to force it.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "AgentTile",
    body: [
      {
        kind: "text",
        text: "`AgentTile` is the single tile the wall repeats, and it is exported on its own: an orb, a name, `Project > Path`, a status dot with its label, and one line of activity. It is a Synthetic, a fixed composition with no state of its own; pass `onSelect` to make the whole tile a button. Its props are `name`, `kind` (`agent` or `service`), `project`, `status` (`active`, `idle`, `stalled`, `failure`, `ghost`, `offline`), `statusLabel`, `activity`, `persona`, `orb`, `look`, `dimmed`, `selected` and `onSelect`.",
      },
      {
        kind: "text",
        text: "The tile is a fixed size: a long name, project or status is cut with an ellipsis (the full text is the hover title), so changing the text never changes the card. Tiles with the same persona and state show the same frame of the shared animation, in step. `look=\"avatar\"` swaps an agent's orb for one of Rebar's illustrated `Avatar` portraits (the same name always gets the same face); a service keeps its orb, since a service is not a person. A thinking (active) orb is the persona's `thinking` state; every other status is `idle`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="agent-wall"` with `data-rebar-filter-mode`; parts `header`, `toolbar`, `grid`, `empty`, `pages`. Each tile is `data-rebar-component="agent-tile"` with `data-rebar-status`, `data-rebar-kind`, and `data-rebar-dimmed`/`data-rebar-selected` when set; its parts are `orb`, `name`, `status`, `project`, `activity`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. Ant Design has no status-wall component; compose its `Card`/`Avatar`/`Badge`/`Pagination` against the same members array.",
      },
    ],
  },
];

export default function AgentWallPage() {
  const [members, setMembers] = useState<AgentWallMember[]>(initialMembers);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<"hide" | "dim">("hide");
  const [look, setLook] = useState<"orb" | "avatar">("orb");

  // Fake backend: every couple of seconds a few agents change what they are doing, and the service sends a heartbeat.
  useEffect(() => {
    let beat = 0;
    const id = setInterval(() => {
      beat += 1;
      setMembers((prev) =>
        prev.map((m, i) => {
          if (m.id === SERVICE_ID) {
            return failed
              ? { ...m, status: "failure", statusLabel: "Not responding", activity: "DM-Archive DLS Worker Service: no heartbeat, likely failed" }
              : { ...m, status: "active", statusLabel: undefined, activity: `DM-Archive DLS Worker Service: heartbeat #${beat}` };
          }
          if (m.id === WORKER_ID) {
            // The service itself reports a suspected leak for a few beats, then recovers: an active failure, not silence.
            return beat % 9 >= 4 && beat % 9 <= 6
              ? { ...m, status: "failure", statusLabel: "Leaking memory?", activity: "Index Worker: memory climbing, may be leaking" }
              : { ...m, status: "active", statusLabel: undefined, activity: `Index Worker: heartbeat #${beat}` };
          }
          if (m.status === "ghost") return m;
          if ((i + beat) % 7 !== 0) return m;
          const active = m.status !== "active";
          return { ...m, status: active ? "active" : "idle", statusLabel: active ? undefined : "Idle 1min", activity: ACTIVITY[(i + beat) % ACTIVITY.length] };
        }),
      );
    }, 2500);
    return () => clearInterval(id);
  }, [failed]);

  return (
    <Stack gap="lg">
      <Heading level={1}>AgentWall</Heading>
      <Text color="secondary">
        A paged wall of agent and service tiles with search, a status filter and a selected tile. Each tile shows who or what it is, where it works, its status and what it is doing now. Services sit on the wall too: use the button to
        stop the service's heartbeat and watch its tile fail.
      </Text>

      <Stack direction="row" gap="sm">
        <Button variant="secondary" onClick={() => setFailed((f) => !f)}>
          {failed ? "Recover the service" : "Fail the service"}
        </Button>
        <Button variant="secondary" onClick={() => setMode((m) => (m === "hide" ? "dim" : "hide"))}>
          Filter mode: {mode}
        </Button>
        <Button variant="secondary" onClick={() => setLook((l) => (l === "orb" ? "avatar" : "orb"))}>
          Look: {look}
        </Button>
      </Stack>

      <div style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 12, padding: 16 }}>
        <AgentWall
          members={members}
          filterMode={mode}
          look={look}
          title={<img src="/brand/ai-hive/ai-hive-wordmark.svg" alt="AI Hive" style={{ height: 44, display: "block" }} />}
          actions={<a href="#join">Join this Hive</a>}
        />
      </div>

      <Heading level={2}>Tiles and personas</Heading>
      <Text color="secondary">The tile on its own, in the four situations that matter. Each wears the persona its kind and status call for.</Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8, border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 12, padding: 8 }}>
        <AgentTile name="Barry" project="Dm-Archive > Piles" status="active" activity="I'm researching what a pile wall looks like." />
        <AgentTile name="DSL Service" kind="service" project="Dm-Archive" status="active" activity="DM-Archive DLS Worker Service" />
        <AgentTile name="Index Worker" kind="service" project="Reports" status="failure" statusLabel="Leaking memory?" activity="Memory climbing; may be leaking." />
        <AgentTile name="Gus" project="Reports > Salary" status="ghost" />
      </div>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
