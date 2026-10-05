import type { CSSProperties } from "react";
import clsx from "clsx";

/** The model families `ModelIcon` knows a glyph for; anything else draws the neutral chip. */
export type ModelFamily = "claude" | "qwen" | "gemini" | "gpt" | "cursor" | "copilot" | "other";

const FAMILY_LABEL: Record<ModelFamily, string> = { claude: "Claude", qwen: "Qwen", gemini: "Gemini", gpt: "GPT", cursor: "Cursor", copilot: "Copilot", other: "Other model" };

export interface ComposingBubbleProps {
  /** Who the reply is for; only changes the hover title. */
  to?: "human" | "agent";
  className?: string;
  style?: CSSProperties;
}

/** A small blue speech pill with three dots that pulse in turn. Position it over the corner of an avatar (`AgentTile` does). The pulse stops under `prefers-reduced-motion`. */
export function ComposingBubble({ to = "human", className, style }: ComposingBubbleProps) {
  const title = to === "agent" ? "Composing a reply to another agent" : "Composing a reply to a human";
  return (
    <span className={clsx("rebar-composing-bubble", className)} style={style} data-rebar-part="composing" data-rebar-composing={to} role="img" aria-label={title} title={title}>
      <i />
      <i />
      <i />
    </span>
  );
}

export interface ModelIconProps {
  /** Which family's glyph to draw. Unknown or omitted draws a neutral chip. */
  family?: ModelFamily;
  /** The specific model, e.g. `"claude-haiku-4-5-20251001"`. Becomes the hover title; defaults to the family's label. */
  modelName?: string;
  /** Pixel size, default 14. */
  size?: number;
  className?: string;
}

/** A tiny inline-SVG glyph for a model family, in brand colours (not `currentColor`) so it reads on light and dark. */
export function ModelIcon({ family = "other", modelName, size = 14, className }: ModelIconProps) {
  const fam: ModelFamily = family in FAMILY_LABEL ? family : "other";
  const title = modelName ?? FAMILY_LABEL[fam];
  let glyph;
  switch (fam) {
    case "claude":
      glyph = (
        <g stroke="#D97757" strokeWidth="1.7" strokeLinecap="round">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} x1="8" y1="8" x2="8" y2={i % 2 ? 2.6 : 1.2} transform={`rotate(${i * 36} 8 8)`} />
          ))}
        </g>
      );
      break;
    case "qwen":
      glyph = (
        <>
          <path d="M8 1 14 4.5v7L8 15 2 11.5v-7z" fill="#615CED" />
          <path d="M8 4.2 10.8 8 8 11.8 5.2 8z" fill="#fff" opacity=".92" />
          <path d="M8 6.4 9.1 8 8 9.6 6.9 8z" fill="#615CED" />
        </>
      );
      break;
    case "gemini":
      glyph = <path d="M8 .8C8.6 5 11 7.4 15.2 8 11 8.6 8.6 11 8 15.2 7.4 11 5 8.6.8 8 5 7.4 7.4 5 8 .8z" fill="#6C7CF5" />;
      break;
    case "gpt":
      glyph = (
        <>
          <circle cx="8" cy="8" r="7.2" fill="#111" stroke="#8a8f98" strokeWidth=".8" />
          <g fill="none" stroke="#fff" strokeWidth="1.1">
            {[0, 60, 120].map((r) => (
              <ellipse key={r} cx="8" cy="8" rx="2" ry="4.4" transform={`rotate(${r} 8 8)`} />
            ))}
          </g>
        </>
      );
      break;
    case "cursor":
      glyph = (
        <>
          <path d="M8 1 14 4.5 8 8 2 4.5z" fill="#c9c9c9" />
          <path d="M2 4.5 8 8v7L2 11.5z" fill="#6b6b6b" />
          <path d="M14 4.5 8 8v7l6-3.5z" fill="#3b3b3b" />
        </>
      );
      break;
    case "copilot":
      glyph = (
        <>
          <path d="M3 5.2C3 3.4 4.4 2 6.2 2h3.6C11.6 2 13 3.4 13 5.2V9c0 2.8-2.2 5-5 5S3 11.8 3 9z" fill="#8534F3" />
          <rect x="4.6" y="5.6" width="6.8" height="3.4" rx="1.7" fill="#1b1030" />
          <circle cx="6.4" cy="7.3" r=".9" fill="#fff" />
          <circle cx="9.6" cy="7.3" r=".9" fill="#fff" />
        </>
      );
      break;
    default:
      glyph = (
        <g fill="none" stroke="#8a8f98" strokeWidth="1.3" strokeLinecap="round">
          <rect x="4" y="4" width="8" height="8" rx="1.5" />
          <path d="M6.5 1.5v2.5M9.5 1.5v2.5M6.5 12v2.5M9.5 12v2.5M1.5 6.5H4M1.5 9.5H4M12 6.5h2.5M12 9.5h2.5" />
        </g>
      );
  }
  return (
    <span className={clsx("rebar-model-icon", className)} data-rebar-part="model" data-rebar-family={fam} title={title} role="img" aria-label={title} style={{ width: size, height: size }}>
      <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" focusable="false">
        {glyph}
      </svg>
    </span>
  );
}

export interface HoneycombCountProps {
  /** The number to show. The whole part is drawn as digit hexagons; a fraction of 0.05 or more adds one more hexagon, without a digit, filled with honey from the bottom by that fraction. Negatives clamp to 0. */
  value: number;
  /** Most digits shown; a bigger number shows all nines and a "+". Default 5. */
  maxDigits?: number;
  /** Hexagon height in px, default 16. */
  size?: number;
  /** Hover title. Default `"N.N production in the Hive"` (at most one decimal, no trailing .0). */
  title?: string;
  className?: string;
}

/** A number as an odometer of honey-yellow hexagons, one digit per hex. */
export function HoneycombCount({ value, maxDigits = 5, size = 16, title, className }: HoneycombCountProps) {
  const v = Math.max(0, Number.isFinite(value) ? value : 0);
  const n = Math.floor(v);
  const frac = v - n;
  const hasFrac = frac >= 0.05; // shown only in the tooltip: the hexagons count whole production
  const cap = 10 ** maxDigits - 1;
  const capped = n > cap;
  const digits = String(Math.min(n, cap)).split("");
  const w = Math.round(size * 0.9);
  const label = title ?? (hasFrac ? `${(Math.round(v * 10) / 10).toLocaleString("en-US", { maximumFractionDigits: 1 })} production in the Hive` : `${n.toLocaleString("en-US")} ${n === 1 ? "turn" : "turns"} in the Hive`);
  return (
    <span className={clsx("rebar-honeycomb", className)} data-rebar-part="turns" title={label} role="img" aria-label={label} style={{ height: size }}>
      {digits.map((d, i) => (
        <svg key={i} viewBox="0 0 18 20" width={w} height={size} aria-hidden="true" focusable="false">
          <path d="M9 .8 17 5.4v9.2L9 19.2 1 14.6V5.4z" fill="#F6BE5A" />
          <text x="9" y="14.2" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3a2a00" fontFamily="system-ui, sans-serif">
            {d}
          </text>
        </svg>
      ))}
      {capped ? <span className="rebar-honeycomb-plus">+</span> : null}
    </span>
  );
}
