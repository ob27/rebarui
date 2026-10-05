import { useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { AgentTile } from "./AgentTile";
import type { AgentStatus } from "./AgentTile";
import type { ModelFamily } from "./AgentTileMarks";
import type { OrbPersonaId } from "../orb-personas/personas";
import { Pagination } from "./Pagination";

export interface AgentWallMember {
  /** Stable id; used for selection and React keys. */
  id: string;
  name: string;
  kind?: "agent" | "service";
  project?: string;
  status?: AgentStatus;
  /** Overrides the default status text, e.g. `"Idle 30mins"`. */
  statusLabel?: string;
  /** Why it has this status, one sentence: shown on hover and read out by assistive tech. See `AgentTile`. */
  statusReason?: string;
  /** An agent's current line, or a service's description. */
  activity?: string;
  /** An agent's model family; see `AgentTile`. */
  modelFamily?: ModelFamily;
  /** The specific model, shown as the glyph's hover title; see `AgentTile`. */
  modelName?: string;
  /** Lifetime turns, drawn as honeycomb digits; see `AgentTile`. */
  turns?: number;
  /** Set while the agent is writing a reply to a human or another agent; see `AgentTile`. */
  composing?: "human" | "agent";
  /** Which orb persona this member wears; overrides the status rule (see `AgentTile`). */
  persona?: OrbPersonaId;
  /** Tints this member's orb by this many degrees (0-359); see `AgentTile`. */
  hue?: number;
  avatar?: number;
}

export type AgentWallStatusFilter = AgentStatus | "all";

export interface AgentWallProps extends Omit<ComponentPropsWithoutRef<"section">, "title" | "children"> {
  /** Everything on the wall. Re-render with new members as heartbeats and chirps arrive; the wall keeps its own page, filter and selection. */
  members: AgentWallMember[];
  /** The most tiles in a row, default 5. A narrow wall shows fewer (a tile is never narrower than 240px). Page size is `columns` x `rows`. */
  columns?: number;
  /** Rows per page. Default 4, so 20 tiles a page by default. */
  rows?: number;
  /** Header title, e.g. a logo or "AI Hive". */
  title?: ReactNode;
  /** Header action slot, e.g. a "Join this Hive" link. */
  actions?: ReactNode;
  /** What a status filter does to tiles that do not match: `"hide"` removes them, `"dim"` keeps their place and greys them. Default "hide". */
  filterMode?: "hide" | "dim";
  /** Passed to every tile: `"auto"` (default) real persona orbs where WebGL allows, `"css"` the plain look-alike. See `AgentTile`. */
  orb?: "auto" | "css";
  /** Passed to every tile: `"orb"` (default) or `"avatar"` (agents show Rebar's illustrated avatars; services keep their orbs). See `AgentTile`. */
  look?: "orb" | "avatar";
  /** Text shown when no member matches. Default "No agents match." */
  emptyText?: string;

  /** 1-indexed current page. Omit for uncontrolled use via `defaultPage`. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Status filter. Omit for uncontrolled use via `defaultStatusFilter`. */
  statusFilter?: AgentWallStatusFilter;
  defaultStatusFilter?: AgentWallStatusFilter;
  onStatusFilterChange?: (filter: AgentWallStatusFilter) => void;
  /** Search text, matched against name, project and activity. Omit for uncontrolled use via `defaultQuery`. */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Selected member id; `null` is "none selected" (controlled). Omit for uncontrolled use via `defaultSelectedId`. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null) => void;
}

const FILTER_ORDER: AgentStatus[] = ["active", "idle", "stalled", "failure", "ghost", "offline"];
const FILTER_LABEL: Record<AgentStatus, string> = { active: "Active", idle: "Idle", stalled: "Stalled", failure: "Failure", ghost: "Ghost", offline: "Offline" };

/** The caller-owned-or-internal value convention every stateful Rebar component follows. */
function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const set = (v: T) => {
    if (!controlled) setInner(v);
    onChange?.(v);
  };
  return [current, set];
}

const statusOf = (m: AgentWallMember): AgentStatus => m.status ?? "idle";

/**
 * A paged wall of `AgentTile`s with search, a status filter and a selected tile. Opinion: the wall owns several
 * interacting modes at once (search text, a status filter, the current page clamped to what is left after filtering,
 * a selected tile, and filter-by-hiding versus filter-by-dimming), the same filtered-list-plus-selection shape
 * `Combobox` is classed Opinion for. It is data-source agnostic: it renders whatever `members` it is given, so any
 * backend (a hook stream, heartbeats, a poll) can feed it. Page, filter, query and selection are each
 * controlled/uncontrolled.
 */
export function AgentWall({
  members,
  columns = 5,
  rows = 4,
  title,
  actions,
  filterMode = "hide",
  orb = "auto",
  look = "orb",
  emptyText = "No agents match.",
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  statusFilter: filterProp,
  defaultStatusFilter = "all",
  onStatusFilterChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelectedChange,
  className,
  style,
  ...rest
}: AgentWallProps) {
  const [page, setPage] = useControllable(pageProp, defaultPage, onPageChange);
  const [filter, setFilter] = useControllable<AgentWallStatusFilter>(filterProp, defaultStatusFilter, onStatusFilterChange);
  const [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
  const [selectedId, setSelectedId] = useControllable<string | null>(selectedProp, defaultSelectedId, onSelectedChange);

  const needle = query.trim().toLowerCase();
  const matchesQuery = (m: AgentWallMember) =>
    !needle || [m.name, m.project, m.activity].some((t) => t?.toLowerCase().includes(needle));
  const matchesFilter = (m: AgentWallMember) => filter === "all" || statusOf(m) === filter;
  const matches = (m: AgentWallMember) => matchesQuery(m) && matchesFilter(m);

  const counts = new Map<AgentStatus, number>();
  for (const m of members) if (matchesQuery(m)) counts.set(statusOf(m), (counts.get(statusOf(m)) ?? 0) + 1);

  // "dim" keeps every query match in place; "hide" drops the ones the filter excludes. A query always narrows the wall.
  const visible = filterMode === "dim" ? members.filter(matchesQuery) : members.filter(matches);
  const pageSize = Math.max(1, columns * rows);
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const shown = visible.slice((current - 1) * pageSize, current * pageSize);

  return (
    <section
      {...rest}
      className={clsx("rebar-agent-wall", className)}
      style={{ ...style, ["--rebar-agent-wall-columns" as string]: columns } as CSSProperties}
      data-rebar-component="agent-wall"
      data-rebar-filter-mode={filterMode}
    >
      {title || actions ? (
        <header className="rebar-agent-wall-header" data-rebar-part="header">
          <div className="rebar-agent-wall-title">{title}</div>
          <div className="rebar-agent-wall-actions">{actions}</div>
        </header>
      ) : null}

      <div className="rebar-agent-wall-toolbar" data-rebar-part="toolbar">
        <input
          type="search"
          className="rebar-agent-wall-search"
          aria-label="Search agents"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <div role="group" aria-label="Filter by status" className="rebar-agent-wall-filters">
          <button type="button" aria-pressed={filter === "all"} onClick={() => { setFilter("all"); setPage(1); }}>
            All {members.filter(matchesQuery).length}
          </button>
          {FILTER_ORDER.filter((s) => (counts.get(s) ?? 0) > 0 || filter === s).map((s) => (
            <button key={s} type="button" aria-pressed={filter === s} onClick={() => { setFilter(filter === s ? "all" : s); setPage(1); }}>
              {FILTER_LABEL[s]} {counts.get(s) ?? 0}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="rebar-agent-wall-empty" role="status" data-rebar-part="empty">
          {emptyText}
        </p>
      ) : (
        <div className="rebar-agent-wall-grid" role="list" data-rebar-part="grid">
          {shown.map((m) => (
            <div key={m.id} role="listitem">
              <AgentTile
                name={m.name}
                kind={m.kind}
                project={m.project}
                status={m.status}
                statusLabel={m.statusLabel}
                statusReason={m.statusReason}
                activity={m.activity}
                modelFamily={m.modelFamily}
                modelName={m.modelName}
                turns={m.turns}
                composing={m.composing}
                persona={m.persona}
                hue={m.hue}
                avatar={m.avatar}
                dimmed={filterMode === "dim" && !matchesFilter(m)}
                orb={orb}
                look={look}
                selected={selectedId === m.id}
                onSelect={() => setSelectedId(selectedId === m.id ? null : m.id)}
              />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="rebar-agent-wall-pages" data-rebar-part="pages">
          <Pagination current={current} total={totalPages} onChange={setPage} aria-label="Wall pages" />
        </div>
      ) : null}
    </section>
  );
}
