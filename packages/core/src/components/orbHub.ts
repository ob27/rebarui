import type { OrbInteractionState, OrbPersonaId } from "../orb-personas/personas";
import { ORB_PERSONAS, resolveOrbPersonaState } from "../orb-personas/personas";
import type { OrbRendererHandle } from "../orb-shader/createOrbRenderer";

/**
 * Shares real orb shaders between many small orbs. `AssistantOrb persona` opens a WebGL context per orb, and browsers
 * allow only about 16 at once (the oldest is silently lost), so a wall of twenty tiles cannot each own one. Here there is
 * one hidden renderer per persona + state actually in use (three to six in practice, however many tiles there are), and
 * every tile is a 2D canvas that copies the middle of that renderer's frame each time it draws.
 *
 * Left alone, every tile with the same persona and state would show the same frame, in lockstep. So each renderer also keeps a
 * short history of its recent frames (about four seconds, in one atlas canvas), and each tile shows the frame from its own
 * moment in that history (`lagMs`, chosen at random per tile): the same animation, started at a different point for each.
 */

/** The longest a tile can lag behind the live frame, and so how much history each renderer keeps. */
export const ORB_MAX_LAG_MS = 4000;
const CAPTURE_MS = 33; // history is kept at ~30 frames a second
const SLOTS = Math.ceil(ORB_MAX_LAG_MS / CAPTURE_MS) + 2;
const COLS = 12;

/**
 * Which saved frame a tile should show: the one `lagMs` before the newest, clamped to what has been captured so far (a new
 * renderer has no history yet, so everyone shows its first frame until it fills). Pure, so it can be tested without WebGL.
 * `captured` is how many frames have been saved in total; returns the atlas slot, or null before the first frame.
 */
export function lagSlot(captured: number, lagMs: number, slots = SLOTS, captureMs = CAPTURE_MS): number | null {
  if (captured <= 0) return null;
  const want = captured - 1 - Math.round(lagMs / captureMs);
  const oldest = Math.max(0, captured - slots);
  return Math.max(oldest, Math.min(captured - 1, want)) % slots;
}

/** How much of the middle of a source frame a sprite shows. The shader draws its sphere well inside its halo; this crop is
 * the "lens" the docs' persona showcase cuts (an ~88px disc over a 160px canvas = 55%), so the sphere reads at full size. */
export const ORB_LENS_FRACTION = 0.55;

export interface OrbSpriteTarget {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** How far behind the live frame this tile shows, 0 to `ORB_MAX_LAG_MS`: what makes each tile animate out of step with the others. */
  lagMs: number;
}

interface Atlas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: number;
  captured: number;
  lastAt: number;
}

interface Source {
  canvas: HTMLCanvasElement;
  handle: OrbRendererHandle | null;
  sprites: Set<OrbSpriteTarget>;
  atlas: Atlas | null;
  disposeTimer: ReturnType<typeof setTimeout> | null;
  dead: boolean;
}

const sources = new Map<string, Source>();
let supported: boolean | null = null;

/** True when this browser can give us a WebGL context. False without a DOM, and in jsdom (no canvas contexts at all). */
export function webglAvailable(): boolean {
  if (supported !== null) return supported;
  if (typeof document === "undefined") return false;
  // jsdom has no canvas contexts and logs a "not implemented" error on every probe; it is never a real browser, so skip it.
  if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) return (supported = false);
  try {
    const c = document.createElement("canvas");
    supported = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    supported = false;
  }
  return supported;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function drawSource(source: Source) {
  const { canvas } = source;
  if (!canvas.width || !canvas.height) return;
  const w = canvas.width * ORB_LENS_FRACTION;
  const h = canvas.height * ORB_LENS_FRACTION;
  const sx = (canvas.width - w) / 2;
  const sy = (canvas.height - h) / 2;
  // Keep a short history of the lens, so tiles can show different moments of the same animation.
  const size = Math.max(1, ...[...source.sprites].map((t) => t.canvas.width));
  let atlas = source.atlas;
  if (!atlas || atlas.size !== size) {
    const c = document.createElement("canvas");
    c.width = COLS * size;
    c.height = Math.ceil(SLOTS / COLS) * size;
    const ctx = c.getContext("2d");
    atlas = ctx ? { canvas: c, ctx, size, captured: 0, lastAt: 0 } : null;
    source.atlas = atlas;
  }
  const now = performance.now();
  if (atlas && now - atlas.lastAt >= CAPTURE_MS) {
    const slot = atlas.captured % SLOTS;
    const x = (slot % COLS) * size;
    const y = Math.floor(slot / COLS) * size;
    atlas.ctx.clearRect(x, y, size, size);
    atlas.ctx.drawImage(canvas, sx, sy, w, h, x, y, size, size);
    atlas.captured++;
    atlas.lastAt = now;
  }
  for (const t of source.sprites) {
    t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
    const slot = atlas && t.lagMs > 0 ? lagSlot(atlas.captured, t.lagMs) : null;
    if (atlas && slot !== null) {
      t.ctx.drawImage(atlas.canvas, (slot % COLS) * size, Math.floor(slot / COLS) * size, size, size, 0, 0, t.canvas.width, t.canvas.height);
    } else {
      t.ctx.drawImage(canvas, sx, sy, w, h, 0, 0, t.canvas.width, t.canvas.height);
    }
  }
}

function createSource(persona: OrbPersonaId, state: OrbInteractionState): Source {
  const source: Source = { canvas: document.createElement("canvas"), handle: null, sprites: new Set(), atlas: null, disposeTimer: null, dead: false };
  const def = ORB_PERSONAS[persona];
  // `three` is only paid for by a page that actually shows an orb, same as AssistantOrb.
  import("../orb-shader/createOrbRenderer")
    .then(({ createOrbRenderer }) => {
      if (source.dead) return;
      try {
        const params = resolveOrbPersonaState(def, state);
        source.handle = createOrbRenderer(source.canvas, def.variant, params, { onFrame: () => drawSource(source) });
      } catch {
        // WebGL failed after all: the sprites keep their plain background rather than crash the page.
      }
    })
    .catch(() => undefined);
  return source;
}

/** Starts drawing `persona` in `state` into `target`. Returns the function that stops it. */
export function attachOrbSprite(persona: OrbPersonaId, state: OrbInteractionState, target: OrbSpriteTarget): () => void {
  const key = `${persona}:${state}`;
  let source = sources.get(key);
  if (!source) {
    source = createSource(persona, state);
    sources.set(key, source);
  }
  if (source.disposeTimer) clearTimeout(source.disposeTimer);
  source.disposeTimer = null;
  source.sprites.add(target);
  const mine = source;
  return () => {
    mine.sprites.delete(target);
    if (mine.sprites.size === 0 && !mine.disposeTimer) {
      // Keep an unused renderer a moment: a tile changing state and back should not rebuild a WebGL context.
      mine.disposeTimer = setTimeout(() => {
        if (mine.sprites.size) return;
        mine.dead = true;
        mine.handle?.dispose();
        sources.delete(key);
      }, 3000);
    }
  };
}

/** How many shared renderers exist right now (for tests and for checking a wall stays within the browser's context limit). */
export const orbHubSourceCount = () => sources.size;
