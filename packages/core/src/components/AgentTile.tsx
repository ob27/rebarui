import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef, KeyboardEvent } from "react";
import clsx from "clsx";
import { Avatar } from "./Avatar";
import { AssistantOrb } from "./AssistantOrb";
import { Badge } from "./Badge";
import type { BadgeTone } from "./Badge";
import { OrbSprite } from "./OrbSprite";
import { prefersReducedMotion, webglAvailable } from "./orbHub";
import type { OrbInteractionState, OrbPersonaId } from "../orb-personas/personas";
import { agentPersona } from "./agentPersona";
import { ComposingBubble, HoneycombCount, ModelIcon } from "./AgentTileMarks";
import type { ModelFamily } from "./AgentTileMarks";

/**
 * `failure` is an *active* failure: a heartbeat service reporting that it is probably leaking memory, or that it has
 * not responded and has likely failed. `ghost` is the opposite case, an agent that has gone quiet and is most likely
 * just not active; it is not a failure. A hosting server decides when an agent becomes a ghost and when it drops off
 * the board (the AI Hive host keeps a ghost for an hour). `offline` is a member known to be gone but still listed.
 */
export type AgentStatus = "active" | "idle" | "stalled" | "failure" | "ghost" | "offline";

export interface AgentTileProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "onSelect"> {
  /** The agent's or service's name. */
  name: string;
  /** An AI agent or a service posting heartbeats. Changes only the `data-rebar-kind` hook, so a theme can tell them apart. Default "agent". */
  kind?: "agent" | "service";
  /** Where it works, shown small under the name, e.g. `"Dm-Archive > Worker"`. */
  project?: string;
  /** Drives the status dot's tone and the default label. Default "idle". */
  status?: AgentStatus;
  /** Overrides the status text, e.g. `"Idle 30mins"`. Defaults to a plain label for `status`. */
  statusLabel?: string;
  /** Why it has this status, in a sentence ("Started a task 7 min ago and has not reported finishing since"). Shown as the status's hover title and read out by assistive tech, so a status is never a mystery. */
  statusReason?: string;
  /** What it is doing right now: an agent's current line, or a service's description. */
  activity?: string;
  /** Which orb persona the tile wears. Defaults to `agentPersona(kind, status)`: Strato for a failure, Spark for a service, Chorus for an LLM agent. */
  persona?: OrbPersonaId;
  /** Tints the orb (not an avatar): a CSS `hue-rotate(<hue>deg)` on the orb wrapper, so the real shader and the CSS look-alike shift together. Degrees, 0-359. Omit for the persona's own colour. */
  hue?: number;
  /** In `look="avatar"`, which illustrated portrait to show (an index into `AVATAR_PLACEHOLDERS`; see `AVATAR_PLACEHOLDER_KINDS` for who each one is). Omit and one is picked from the name. */
  avatar?: number;
  /**
   * `"auto"` (default): the orb is the real persona shader, drawn through a shared renderer (`OrbSprite`), so a wall of tiles
   * stays within the browser's WebGL limit. It falls back to a plain CSS look-alike where WebGL is unavailable, under
   * `prefers-reduced-motion`, and on the server. `"css"` always uses the look-alike.
   */
  orb?: "auto" | "css";
  /**
   * `"orb"` (default): the persona orb. `"avatar"`: an agent shows one of Rebar's illustrated `Avatar` portraits instead (the same
   * name always gets the same face). Only agents change: a `service` keeps its orb either way, since a service is not a person.
   */
  look?: "orb" | "avatar";
  /** An agent's model family; draws a small brand glyph after the name. Never drawn for a `service`. */
  modelFamily?: ModelFamily;
  /** The specific model (`"claude-haiku-4-5-20251001"`); the glyph's hover title. Defaults to the family label. */
  modelName?: string;
  /** The agent's lifetime turns, drawn as honey-yellow hexagon digits after the model glyph. Omit to hide. Never drawn for a `service`. */
  turns?: number;
  /** Present while the agent is writing a reply to a human or to another agent: a small blue "typing" bubble over the avatar. */
  composing?: "human" | "agent";
  /** Greys the tile out without removing it (an out-of-focus tile on a wall). */
  dimmed?: boolean;
  /** Marks the tile as the selected one. Only meaningful alongside `onSelect`. */
  selected?: boolean;
  /** Makes the whole tile a button: Enter/Space and click call this. Omitted → a plain, non-interactive tile (no dead control). */
  onSelect?: () => void;
}

const STATUS_LABEL: Record<AgentStatus, string> = {
  active: "Active Now",
  idle: "Idle",
  stalled: "Stalled",
  failure: "Failure",
  ghost: "Ghost",
  offline: "Offline",
};

const STATUS_TONE: Record<AgentStatus, BadgeTone> = {
  active: "info",
  idle: "default",
  stalled: "warning",
  failure: "error",
  ghost: "default",
  offline: "default",
};

/** A stable number from a name, so the CSS look-alike orbs also breathe out of step with each other. */
const nameHash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** A rich blue-to-anything colour for the metaball orb from a hue (degrees): fixed saturation and lightness so every hue reads well on the dark disc. */
function hueToRgb(h: number): string {
  const s = 0.72, l = 0.45;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
}

const ORB_STATE: Record<AgentStatus, OrbInteractionState> = { active: "thinking", idle: "idle", stalled: "idle", failure: "idle", ghost: "idle", offline: "idle" };

/**
 * One agent or service on a status wall: an orb, a name, `Project > Path`, a status dot with its label, and one line of
 * activity. Synthetic: a static composition (an orb, text, and a `Badge` dot) with no state of its own; `AgentWall` is the
 * Opinion that pages, filters and selects across many of these. The orb is the real persona shader (see `agentPersona`),
 * drawn through a shared renderer so any number of tiles stays within the browser's WebGL limit (`orb` below).
 * The tile is a fixed size: names, projects and activity are cut with an ellipsis (the full text is the hover title), so a
 * longer or shorter status never changes the card.
 */
export function AgentTile({
  name,
  kind = "agent",
  project,
  status = "idle",
  statusLabel,
  statusReason,
  activity,
  persona,
  hue,
  avatar: avatarIndex,
  orb = "auto",
  look = "orb",
  modelFamily,
  modelName,
  turns,
  composing,
  dimmed = false,
  selected = false,
  onSelect,
  className,
  ...rest
}: AgentTileProps) {
  const label = statusLabel ?? STATUS_LABEL[status];
  const orbPersona = persona ?? agentPersona(kind, status);
  // Decided after mount so the server render and first client render agree (both show the CSS look-alike).
  const avatar = look === "avatar" && kind === "agent";
  const [live, setLive] = useState(false);
  // Spark is the original 2D-canvas metaball orb (`AssistantOrb` without a persona), not a WebGL shader: it needs no WebGL context, so it is
  // drawn whenever the orb is allowed to move. Strato and Chorus are the shaders, drawn through the shared renderer.
  const classic = orbPersona === "spark";
  const [classicLive, setClassicLive] = useState(false);
  useEffect(() => {
    setLive(!avatar && !classic && orb === "auto" && webglAvailable() && !prefersReducedMotion());
    setClassicLive(!avatar && classic && !prefersReducedMotion());
  }, [orb, avatar, classic]);
  const isAgent = kind === "agent";
  const showModel = isAgent && (modelFamily !== undefined || modelName !== undefined);
  const showTurns = isAgent && typeof turns === "number";
  const interactive = typeof onSelect === "function";
  const onKeyDown = interactive
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }
    : undefined;

  return (
    <div
      {...rest}
      className={clsx("rebar-agent-tile", className)}
      data-rebar-component="agent-tile"
      data-rebar-kind={kind}
      data-rebar-status={status}
      data-rebar-persona={orbPersona}
      data-rebar-look={avatar ? "avatar" : "orb"}
      data-rebar-dimmed={dimmed || undefined}
      data-rebar-selected={selected || undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      aria-label={interactive ? `${name}, ${label}` : undefined}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={onKeyDown}
    >
      <span className="rebar-agent-tile-orb" data-rebar-part="orb" data-rebar-live={live || classicLive || undefined} data-rebar-look={avatar ? "avatar" : undefined} aria-hidden="true" style={{ ["--rebar-orb-delay" as string]: `${-(nameHash(name) % 32) / 10}s`, ...(typeof hue === "number" && !avatar && !classic ? { filter: `hue-rotate(${hue}deg)` } : {}) }}>
        {avatar ? <Avatar fallback={name} placeholder={avatarIndex ?? true} size="lg" /> : classicLive ? <AssistantOrb size={102} className="rebar-agent-tile-classic-orb" isActive={status === "active"} color={typeof hue === "number" ? hueToRgb(hue) : undefined} /> : live ? <OrbSprite persona={orbPersona} state={ORB_STATE[status]} size={56} /> : null}
        {isAgent && composing ? <ComposingBubble to={composing} className="rebar-agent-tile-composing" /> : null}
      </span>
      <div className="rebar-agent-tile-body">
        <div className="rebar-agent-tile-head">
          <span className="rebar-agent-tile-ident">
            <span className="rebar-agent-tile-name" data-rebar-part="name" title={name}>
              {name}
            </span>
            {showModel ? <ModelIcon family={modelFamily} modelName={modelName} /> : null}
            {showTurns ? <HoneycombCount value={turns} /> : null}
          </span>
          <span className="rebar-agent-tile-status" data-rebar-part="status" title={statusReason} aria-description={statusReason}>
            <span>{label}</span>
            <Badge dot tone={STATUS_TONE[status]} />
          </span>
        </div>
        {project ? (
          <div className="rebar-agent-tile-project" data-rebar-part="project" title={project}>
            {project}
          </div>
        ) : null}
        {activity ? (
          <div className="rebar-agent-tile-activity" data-rebar-part="activity" title={activity}>
            {activity}
          </div>
        ) : null}
      </div>
    </div>
  );
}
