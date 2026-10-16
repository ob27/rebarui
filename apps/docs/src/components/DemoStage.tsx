"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CodeBlock } from "rebar-ui";

export type DemoWidth = "full" | "tablet" | "phone";

export interface DemoState {
  /** Small-caps label under which the state is shown, e.g. "Empty", "Loading", "Error". */
  label: string;
  node: ReactNode;
}

export interface DemoStageProps {
  /** What the example is, in a word or two ("Project board"). */
  title?: string;
  /** What it demonstrates ("Drag, drop, keyboard move"). */
  caption?: string;
  /** Source shown behind a Code toggle in the bar. */
  code?: string;
  /** Width presets in the bar (Full, Tablet, Phone). Off for examples that only make sense at one width. */
  widths?: boolean;
  defaultWidth?: DemoWidth;
  /** A strip of the construct's states, each in its own cell under the main example. */
  states?: DemoState[];
  /** Padding around the example; "none" for examples that fill the stage (an app shell, a device frame). */
  padding?: "md" | "none";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const MAX: Record<DemoWidth, string | undefined> = { full: undefined, tablet: "768px", phone: "390px" };
const WIDTHS: { value: DemoWidth; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "tablet", label: "Tablet" },
  { value: "phone", label: "Phone" },
];

/**
 * The frame every live example sits in: a warm panel with a bar (title, caption, width presets, a Code toggle) and an optional
 * strip of the construct's states. The example itself is the children; narrowing it to a tablet or a phone just caps its width,
 * so a responsive construct shows its own breakpoints without the reader resizing the browser.
 */
export function DemoStage({ title, caption, code, widths = true, defaultWidth = "full", states, padding = "md", children, className, style }: DemoStageProps) {
  const [width, setWidth] = useState<DemoWidth>(defaultWidth);
  const [showCode, setShowCode] = useState(false);
  const hasBar = Boolean(title || caption || widths || code);
  return (
    <section className={["cs-stage", className].filter(Boolean).join(" ")} data-cs-width={width} style={style}>
      {hasBar ? (
        <div className="cs-stage-bar">
          {title ? <b>{title}</b> : null}
          {caption ? <span>{caption}</span> : null}
          <span className="cs-sp" />
          {widths ? (
            <div className="cs-seg" role="group" aria-label="Example width">
              {WIDTHS.map((w) => (
                <button key={w.value} type="button" aria-pressed={width === w.value} onClick={() => setWidth(w.value)}>
                  {w.label}
                </button>
              ))}
            </div>
          ) : null}
          {code ? (
            <button type="button" className="cs-stage-codebtn" aria-pressed={showCode} onClick={() => setShowCode((s) => !s)}>
              {showCode ? "Hide code" : "Code"}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="cs-stage-body" data-cs-padding={padding}>
        <div className="cs-stage-canvas" style={{ maxWidth: MAX[width] }}>
          {children}
        </div>
      </div>
      {showCode && code ? (
        <div className="cs-stage-code">
          <CodeBlock code={code} language="tsx" />
        </div>
      ) : null}
      {states && states.length > 0 ? (
        <div className="cs-stage-states">
          {states.map((s) => (
            <figure key={s.label}>
              <figcaption>{s.label}</figcaption>
              {s.node}
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
