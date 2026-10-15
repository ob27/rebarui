import { useEffect, useId, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import clsx from "clsx";

/** A piece of the character that swings on its own, a beat behind the body (antennae, a tail, a lolling tongue). Drawn behind the body. */
export interface PuppetWobblePart {
  /** A transparent image on the same canvas as the body, so it lines up 1:1. */
  src: string;
  /** Where it pivots, as `[x, y]` percentages of the canvas. */
  pivot: [number, number];
  /** How far it swings each way, in degrees. Default 3.2. */
  sway?: number;
  /** Seconds after the body's own sway before this part follows. Default `0.34 + 0.12 * index`. */
  delay?: number;
}

/**
 * The art, cut into transparent layers that all share one canvas (so every layer lines up 1:1). Only `body` is required; each
 * optional layer switches on one behaviour.
 */
export interface PuppetLayers {
  /** The character, with its sticker outline baked in. */
  body: string;
  /** Parts that wobble independently of the body, drawn behind it. */
  wobble?: PuppetWobblePart[];
  /** The pupils on their own, black on transparent. Needs `eyesMask` to be clipped inside the eyes. */
  pupils?: string;
  /** The white of the eyes as an alpha mask: the pupils (and lids) are clipped to it, so they can never leave the eye. */
  eyesMask?: string;
  /** The lids, drawn over the pupils and dropped from the lid line to blink. */
  lids?: string;
}

/** Fixed expressions for places the puppet should not move (an empty state, an avatar, a screenshot). A pose also stops all motion. */
export type PuppetPose = "rest" | "glance-left" | "glance-right" | "blink" | "half-blink" | "eye-roll" | "wobble";

export interface PuppetProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** The layered art. */
  layers: PuppetLayers;
  /** The canvas the layers share, `[width, height]` in any unit: only the ratio is used. Default `[1, 1]`. */
  canvas?: [number, number];
  /** Rendered width in px; the height follows `canvas`. Default 240. */
  size?: number;
  /**
   * `"idle"` (default): rises in, sways, flops, glances and blinks. `"hop"`: a celebration, three hops, then idle. `"still"`: no
   * body motion (the eyes still blink and glance unless a `pose` is set).
   */
  motion?: "idle" | "hop" | "still";
  /**
   * How heavy the character feels. `"light"` (a paper book): big loose swings, a springy pop-up. `"heavy"` (a concrete block): small,
   * slow swings and a thud when it lands. Default `"light"`.
   */
  weight?: "light" | "heavy";
  /** How far below the puppet it pivots, in px: as if held on an unseen stick. 0 pivots at the feet. Default `0.15 * size`. */
  pivot?: number;
  /** Seconds added to every animation delay, so several puppets on one screen stay out of step. Default: derived from the element's id, so it is stable on the server and on the client. */
  phase?: number;
  /** Hold one expression and stop all motion. */
  pose?: PuppetPose;
  /** Where the lids start, as a percentage down the canvas (the lid line across the eyes). Default 35. */
  lidLine?: number;
  /** How far the pupils glance each way, as a percentage of the canvas width. Default 1.7. */
  lookRange?: number;
  /** An accessible name. Omit and the puppet is decorative (`aria-hidden`), which is right when it only decorates a page. */
  label?: string;
  /** Lines the puppet says in a speech bubble, in order, looping. The bubble is flavour and hidden from assistive tech. */
  says?: string[];
  /** Milliseconds between lines. Default 7000. Paused while the tab is hidden. */
  sayEvery?: number;
  /** Which side of the puppet the bubble sits on. Default `"start"`. */
  bubble?: "start" | "end";
  /** Called when the puppet is poked (pointer down on it). Poking also advances the speech bubble. */
  onPoke?: () => void;
}

function phaseFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return -(Math.abs(h) % 40) / 10; // 0 to -3.9 s
}

/**
 * A character as a rigid paper cut-out on an unseen stick: it never squashes, it pivots from below its feet, its eyes glance
 * around and blink under a mask, and parts like antennae wobble a beat behind the body. Poking it wiggles it and skips to its next
 * line. Layers are plain transparent images on one shared canvas, so any character that is cut into layers can be a puppet.
 *
 * Opinion tier: real internal state, not just a held value. A poke state machine (wiggling for a short while, then settling)
 * and the index of the line being said are both state that changes what renders, the same kind of mode-switching `Tour` and
 * `Wizard` have. All the motion itself is CSS keyframes, switched off under `prefers-reduced-motion`.
 */
export function Puppet({
  layers,
  canvas = [1, 1],
  size = 240,
  motion = "idle",
  weight = "light",
  pivot,
  phase,
  pose,
  lidLine = 35,
  lookRange = 1.7,
  label,
  says,
  sayEvery = 7000,
  bubble = "start",
  onPoke,
  className,
  style,
  onPointerDown,
  ...props
}: PuppetProps) {
  const id = useId();
  const [poked, setPoked] = useState(false);
  const [line, setLine] = useState(0);
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lineCount = says?.length ?? 0;

  useEffect(() => () => clearTimeout(pokeTimer.current), []);

  useEffect(() => {
    if (lineCount < 2) return undefined;
    const tick = setInterval(() => {
      if (typeof document === "undefined" || !document.hidden) setLine((n) => (n + 1) % lineCount);
    }, sayEvery);
    return () => clearInterval(tick);
  }, [lineCount, sayEvery, line]);

  const handlePointerDown: NonNullable<PuppetProps["onPointerDown"]> = (e) => {
    onPointerDown?.(e);
    setPoked(true);
    clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPoked(false), 650);
    if (lineCount > 1) setLine((n) => (n + 1) % lineCount);
    onPoke?.();
  };

  const [cw, ch] = canvas;
  const effectiveMotion = pose ? "still" : motion;
  const vars = {
    "--rebar-puppet-w": `${size}px`,
    "--rebar-puppet-pivot": `${pivot ?? Math.round(size * 0.15)}px`,
    "--rebar-puppet-phase": `${phase ?? phaseFromId(id)}s`,
    "--rebar-puppet-lid-line": `${lidLine}%`,
    "--rebar-puppet-look": `${lookRange}%`,
    aspectRatio: `${cw} / ${ch}`,
    ...style,
  } as CSSProperties;

  const mask = layers.eyesMask ? `url(${layers.eyesMask})` : undefined;
  const eyes = layers.pupils && mask;

  return (
    <span
      {...props}
      className={clsx("rebar-puppet", className)}
      style={vars}
      data-rebar-component="puppet"
      data-rebar-motion={effectiveMotion}
      data-rebar-weight={weight}
      data-rebar-pose={pose}
      data-rebar-poked={poked ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onPointerDown={handlePointerDown}
    >
      <span className="rebar-puppet-rise" data-rebar-part="rise">
        <span className="rebar-puppet-sway" data-rebar-part="sway">
          <span className="rebar-puppet-paper" data-rebar-part="paper">
            {layers.wobble?.map((part, i) => (
              <img
                key={part.src}
                className="rebar-puppet-layer rebar-puppet-wobble"
                data-rebar-part="wobble"
                src={part.src}
                alt=""
                draggable={false}
                style={
                  {
                    "--rebar-puppet-ox": `${part.pivot[0]}%`,
                    "--rebar-puppet-oy": `${part.pivot[1]}%`,
                    "--rebar-puppet-wobble": `${part.sway ?? 3.2}deg`,
                    "--rebar-puppet-wobble-delay": `${part.delay ?? 0.34 + i * 0.12}s`,
                  } as CSSProperties
                }
              />
            ))}
            <img className="rebar-puppet-layer" data-rebar-part="body" src={layers.body} alt="" draggable={false} />
            {eyes ? (
              <span className="rebar-puppet-eyes" data-rebar-part="eyes" style={{ WebkitMaskImage: mask, maskImage: mask } as CSSProperties}>
                <img className="rebar-puppet-layer rebar-puppet-pupils" data-rebar-part="pupils" src={layers.pupils} alt="" draggable={false} />
                {layers.lids ? <img className="rebar-puppet-layer rebar-puppet-lids" data-rebar-part="lids" src={layers.lids} alt="" draggable={false} /> : null}
              </span>
            ) : null}
          </span>
        </span>
      </span>
      {says && says.length > 0 ? (
        <span key={line} className="rebar-puppet-bubble" data-rebar-part="bubble" data-rebar-side={bubble} aria-hidden="true">
          {says[line % says.length]}
        </span>
      ) : null}
    </span>
  );
}
