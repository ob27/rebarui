import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { FloatCard } from "./FloatCard";

export interface DeviceStageFloat {
  id: string;
  side: "start" | "end";
  /** Any CSS length or percentage, measured down the device. Default `"20%"` (`"62%"` for a second
   * float on the same side). Ignored in compact mode. */
  top?: string;
  content: ReactNode;
  /** Optional small heading for the float's card; also names its group. */
  label?: string;
  tone?: "default" | "accent";
}

export interface DeviceStageProps extends ComponentPropsWithoutRef<"div"> {
  /** The device, usually a `DeviceFrame`. */
  children: ReactNode;
  /** Up to four floating cards placed around the device. Extra entries are ignored. */
  floats?: DeviceStageFloat[];
  /** A soft radial tint behind the device, coloured by `--rebar-device-stage-glow`. */
  glow?: boolean;
}

const MAX_FLOATS = 4;
/** Below this stage width (px) the floats become compact chips. Mirrors the container query in style.css. */
const COMPACT_BELOW = 480;

export function DeviceStage({ children, floats = [], glow = false, className, ...props }: DeviceStageProps) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  // Mirrors the CSS container query as a data attribute, for styling hooks and tests. The layout
  // itself never waits on this: the CSS decides on its own, so there is no flash before hydration.
  useEffect(() => {
    const el = layoutRef.current;
    if (!el) return;
    const measure = () => setCompact(el.clientWidth < COMPACT_BELOW);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shown = floats.slice(0, MAX_FLOATS);
  const perSide = { start: 0, end: 0 };

  return (
    <div
      className={clsx("rebar-device-stage", className)}
      data-rebar-component="device-stage"
      data-rebar-glow={glow ? "true" : undefined}
      data-rebar-compact={compact ? "true" : undefined}
      {...props}
    >
      <div className="rebar-device-stage-container" ref={layoutRef}>
        <div className="rebar-device-stage-layout">
          <div className="rebar-device-stage-area" data-rebar-part="area">
            <div className="rebar-device-stage-device" data-rebar-part="device">
              {children}
            </div>
            {shown.map((float) => {
              const n = perSide[float.side]++;
              const top = float.top ?? (n === 0 ? "20%" : "62%");
              // Compact chips: the end side fills top then bottom, the start side bottom then top.
              const vertical = (float.side === "end") === (n % 2 === 0) ? "top" : "bottom";
              return (
                <div
                  key={float.id}
                  className="rebar-device-stage-float"
                  data-rebar-part="float"
                  data-rebar-side={float.side}
                  data-rebar-slot={`${vertical}-${float.side}`}
                  data-rebar-compact={compact ? "true" : undefined}
                  role="group"
                  aria-label={float.label ?? "Related detail"}
                  style={{ "--rebar-device-stage-float-top": top } as CSSProperties}
                >
                  <FloatCard tone={float.tone}>{float.content}</FloatCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
