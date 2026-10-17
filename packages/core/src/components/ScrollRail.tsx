import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, FocusEvent, ReactNode } from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export interface ScrollRailProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "aria-label"> {
  /** One rail item per child. */
  children: ReactNode;
  /** Required accessible name for the region. */
  "aria-label": string;
  /** Prev/next buttons. Default `true`; always hidden while the rail is auto-scrolling. */
  controls?: boolean;
  /** CSS scroll-snap on the x axis. Default `true` when the rail is not auto-scrolling. */
  snap?: boolean;
  /**
   * Continuous auto-scroll: `true` is 40 px/s, a number is px per second. Advances `scrollLeft` with
   * `requestAnimationFrame`. Pauses on pointer hover/press over the rail, focus inside it, and while
   * the tab is hidden, and never runs under `prefers-reduced-motion` (the rail then behaves as a
   * normal manual one). A visible Pause/Play button is rendered whenever auto-scroll is active.
   */
  autoScroll?: boolean | number;
  /** With `autoScroll`: render a second `aria-hidden`, inert copy of the items and wrap seamlessly. */
  loop?: boolean;
  /** Space between items: a token step, or any CSS length (`"12px"`). Default `"md"`. */
  gap?: "sm" | "md" | "lg" | (string & {});
  /**
   * Width of every item: a number is px, a string any CSS length. `{ base, md }` is responsive: `base`
   * on phones, `md` from 768px up (use a `base` narrower than the container so the next item peeks).
   * Replaces setting `--rebar-scroll-rail-item-width` by hand. Items stay equal height; push a card
   * footer to the bottom with `margin-top: auto`.
   */
  itemWidth?: number | string | { base: number | string; md?: number | string };
  /** A heading row above the rail (title, "See all" link). When set, the previous/next buttons move into this row, end aligned. */
  header?: ReactNode;
}

const toCssLength = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

const DEFAULT_SPEED = 40;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(query.matches);
    const onChange = (event: { matches: boolean }) => setReduced(event.matches);
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }
    query.addListener?.(onChange);
    return () => query.removeListener?.(onChange);
  }, []);
  return reduced;
}

export function ScrollRail({
  children,
  "aria-label": ariaLabel,
  controls = true,
  snap,
  autoScroll,
  loop = false,
  gap = "md",
  itemWidth,
  header,
  className,
  style,
  ...rest
}: ScrollRailProps) {
  const gapToken = gap === "sm" || gap === "md" || gap === "lg";
  const railStyle: CSSProperties = { ...style };
  if (itemWidth !== undefined) {
    const base = typeof itemWidth === "object" ? itemWidth.base : itemWidth;
    const md = typeof itemWidth === "object" ? (itemWidth.md ?? itemWidth.base) : itemWidth;
    (railStyle as Record<string, string>)["--rebar-scroll-rail-item-width"] = toCssLength(base);
    (railStyle as Record<string, string>)["--rebar-scroll-rail-item-width-md"] = toCssLength(md);
  }
  if (!gapToken) (railStyle as Record<string, string>)["--rebar-scroll-rail-gap"] = gap;
  const items = Children.toArray(children);
  const reducedMotion = useReducedMotion();
  const speed = autoScroll === true ? DEFAULT_SPEED : typeof autoScroll === "number" && autoScroll > 0 ? autoScroll : 0;
  const autoActive = speed > 0 && !reducedMotion;
  const showClone = autoActive && loop;
  const showControls = controls && !autoActive;
  const snapOn = snap ?? !autoActive;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const running = autoActive && !userPaused && !hovering && !pressed && !focused && !tabHidden;

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setCanScrollStart(el.scrollLeft > 1);
    setCanScrollEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    measure();
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, items.length]);

  // Tab visibility: never advance while the tab is in the background.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const sync = () => setTabHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  // A press that starts on the rail may end outside it.
  useEffect(() => {
    if (!pressed) return;
    const release = () => setPressed(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [pressed]);

  // The auto-scroll loop. Keeps its own fractional position because several engines round scrollLeft.
  useEffect(() => {
    if (!running) return;
    const el = viewportRef.current;
    if (!el) return;
    let position = el.scrollLeft;
    let last: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      if (Math.abs(el.scrollLeft - position) > 1) position = el.scrollLeft;
      position += speed * dt;
      if (loop) {
        const track = trackRef.current;
        const first = track?.children[0] as HTMLElement | undefined;
        const clone = track?.children[items.length] as HTMLElement | undefined;
        const period = first && clone ? clone.offsetLeft - first.offsetLeft : 0;
        if (period > 0 && position >= period) position -= period;
      }
      el.scrollLeft = position;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, speed, loop, items.length]);

  const scrollByItem = (direction: -1 | 1) => {
    const el = viewportRef.current;
    if (!el) return;
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const second = track?.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? 0);
    const left = direction * (step > 0 ? step : el.clientWidth);
    if (typeof el.scrollBy === "function") {
      el.scrollBy({ left, behavior: reducedMotion ? "auto" : "smooth" });
    } else {
      el.scrollLeft += left;
    }
  };

  const controlsNode = showControls ? (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        data-rebar-part="control"
        data-rebar-direction="prev"
        aria-label="Previous items"
        disabled={!canScrollStart}
        onClick={() => scrollByItem(-1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        data-rebar-part="control"
        data-rebar-direction="next"
        aria-label="Next items"
        disabled={!canScrollEnd}
        onClick={() => scrollByItem(1)}
      >
        <ChevronRightIcon />
      </Button>
    </>
  ) : null;
  const controlsInHeader = Boolean(header) && showControls;

  const state = !autoActive ? "static" : running ? "scrolling" : "paused";

  return (
    <div
      className={clsx("rebar-scroll-rail", className)}
      data-rebar-component="scroll-rail"
      data-rebar-state={state}
      data-rebar-gap={gapToken ? gap : "custom"}
      data-rebar-item-width={itemWidth !== undefined ? "set" : undefined}
      style={railStyle}
      data-rebar-snap={snapOn ? "true" : "false"}
      data-rebar-can-scroll-start={canScrollStart ? "true" : "false"}
      data-rebar-can-scroll-end={canScrollEnd ? "true" : "false"}
      role="region"
      aria-label={ariaLabel}
      {...rest}
    >
      {header ? (
        <div className="rebar-scroll-rail-header" data-rebar-part="header">
          <div className="rebar-scroll-rail-header-content">{header}</div>
          {controlsInHeader ? (
            <div className="rebar-scroll-rail-header-controls" data-rebar-part="header-controls">
              {controlsNode}
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        ref={viewportRef}
        className="rebar-scroll-rail-viewport"
        data-rebar-part="viewport"
        tabIndex={0}
        onScroll={measure}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onPointerDown={() => setPressed(true)}
        onFocus={() => setFocused(true)}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <div ref={trackRef} className="rebar-scroll-rail-track" data-rebar-part="track" role="list">
          {items.map((item, i) => (
            <div key={i} className="rebar-scroll-rail-item" data-rebar-part="item" role="listitem">
              {item}
            </div>
          ))}
          {showClone
            ? items.map((item, i) => (
                <div
                  key={`clone-${i}`}
                  className="rebar-scroll-rail-item"
                  data-rebar-part="item"
                  data-rebar-clone="true"
                  aria-hidden="true"
                  ref={(node) => node?.setAttribute("inert", "")}
                >
                  {item}
                </div>
              ))
            : null}
        </div>
      </div>

      {showControls && !controlsInHeader || autoActive ? (
        <div className="rebar-scroll-rail-bar">
          {controlsInHeader ? null : controlsNode}
          {autoActive ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              data-rebar-part="toggle"
              onClick={() => setUserPaused((value) => !value)}
            >
              {userPaused ? "Play" : "Pause"}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
