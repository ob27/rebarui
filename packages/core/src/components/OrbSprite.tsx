import { useEffect, useRef, useState } from "react";
import type { OrbInteractionState, OrbPersonaId } from "../orb-personas/personas";
import { ORB_MAX_LAG_MS, attachOrbSprite } from "./orbHub";

export interface OrbSpriteProps {
  persona: OrbPersonaId;
  state?: OrbInteractionState;
  /** Width and height in CSS px. */
  size?: number;
  className?: string;
}

/**
 * A small orb that shows the real persona shader without owning a WebGL context: a 2D canvas fed by the shared renderer
 * in `orbHub.ts`. Use this wherever many orbs share a page; use `AssistantOrb` for the one big orb. Draws nothing, and
 * stays transparent, until the shader has loaded and produced its first frame.
 */
export function OrbSprite({ persona, state = "idle", size = 56, className }: OrbSpriteProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  // Each orb starts at its own point in the shared animation, so a wall of them does not move in lockstep.
  const [lagMs] = useState(() => Math.random() * ORB_MAX_LAG_MS);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(size * dpr);
    return attachOrbSprite(persona, state, { canvas, ctx, lagMs });
  }, [persona, state, size, lagMs]);
  return <canvas ref={ref} className={className} style={{ width: size, height: size, display: "block" }} aria-hidden="true" />;
}
