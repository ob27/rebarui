import { useRef, useState } from "react";
import type { ComponentPropsWithoutRef, KeyboardEvent, PointerEvent, ReactNode } from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { Heading } from "./Heading";

export interface OnboardingSlide {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  /** `"tint-1"`..`"tint-4"` or any CSS colour, behind the icon. */
  tint?: string;
  /** A small chip under the description (for example "Independent, not an official Church product"). */
  note?: ReactNode;
}

export interface OnboardingLabels {
  next?: string;
  back?: string;
  done?: string;
  skip?: string;
}

export interface OnboardingProps extends Omit<ComponentPropsWithoutRef<"section">, "onChange"> {
  slides: OnboardingSlide[];
  /** Controlled or uncontrolled position. Swiping and the buttons share it. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Fires from the last slide's button and from Skip. */
  onDone?: () => void;
  /** Shows Skip on every slide except the last. Default true. */
  skippable?: boolean;
  /** Default Next, Back, Get started, Skip. */
  labels?: OnboardingLabels;
  /** Brand slot, top left. */
  logo?: ReactNode;
  /** Replaces the whole top row's left side when you need more than a logo. */
  header?: ReactNode;
  /** The last slide's button shows a spinner while the app finishes (saving, navigating). */
  finishing?: boolean;
  /** Fills the viewport with safe-area padding. */
  fullscreen?: boolean;
  /** `"classic"`: a 480px column with a round filled icon, a plain title and copy, small round dots and compact pill buttons (tokens:
   * `--rebar-onboarding-*`, `--rebar-classic-button-*`). Default `"default"`. */
  appearance?: "default" | "classic";
}

const SWIPE_THRESHOLD_PX = 48;

function tintColor(tint?: string): string | undefined {
  if (!tint) return undefined;
  return /^tint-[1-4]$/.test(tint) ? `var(--rebar-color-${tint})` : tint;
}

/**
 * Swipeable full-screen intro slides: one slide at a time, dots, Skip and Next/Back. Opinion: a
 * small state machine (current slide, swipe gesture, done) with the same position reachable by
 * swipe, buttons, dots and arrow keys. The swipe is a plain pointer track (same technique as
 * `SwipeActions`) and never the only way to move: every slide change also has a button.
 */
export function Onboarding({
  slides,
  index,
  defaultIndex = 0,
  onIndexChange,
  onDone,
  skippable = true,
  labels,
  logo,
  header,
  finishing = false,
  fullscreen = false,
  appearance,
  className,
  ...props
}: OnboardingProps) {
  const [internal, setInternal] = useState(defaultIndex);
  const isControlled = index !== undefined;
  const last = Math.max(0, slides.length - 1);
  const current = Math.min(Math.max(isControlled ? index : internal, 0), last);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const L = { next: "Next", back: "Back", done: "Get started", skip: "Skip", ...labels };

  const go = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), last);
    if (clamped === current) return;
    if (!isControlled) setInternal(clamped);
    onIndexChange?.(clamped);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    setDragX(e.clientX - startX.current);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    setDragX(0);
    if (dx <= -SWIPE_THRESHOLD_PX) go(current + 1);
    else if (dx >= SWIPE_THRESHOLD_PX) go(current - 1);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(current - 1);
    }
  };

  const isLast = current === last;
  const dragging = dragX !== 0;

  return (
    <section
      className={clsx("rebar-onboarding", className)}
      data-rebar-component="onboarding"
      data-rebar-fullscreen={fullscreen || undefined}
      data-rebar-appearance={appearance === "classic" ? "classic" : undefined}
      data-rebar-state={finishing ? "finishing" : undefined}
      aria-roledescription="carousel"
      aria-label="Introduction"
      tabIndex={0}
      onKeyDown={onKeyDown}
      {...props}
    >
      <div className="rebar-onboarding-top" data-rebar-part="top">
        <div className="rebar-onboarding-brand" data-rebar-part="logo">
          {header ?? logo}
        </div>
        {skippable && !isLast ? (
          <button type="button" className="rebar-onboarding-skip" data-rebar-part="skip" onClick={() => onDone?.()}>
            {L.skip}
          </button>
        ) : (
          <span className="rebar-onboarding-skip-spacer" aria-hidden="true" />
        )}
      </div>
      <div
        className="rebar-onboarding-viewport"
        data-rebar-part="viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="rebar-onboarding-track"
          data-rebar-part="track"
          data-rebar-dragging={dragging || undefined}
          style={{ transform: `translateX(calc(${-current * 100}% + ${dragX}px))` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="rebar-onboarding-slide"
              data-rebar-part="slide"
              data-rebar-active={i === current || undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i === current ? undefined : true}
            >
              {slide.icon ? (
                <span
                  className="rebar-onboarding-icon"
                  data-rebar-part="icon"
                  style={slide.tint ? { background: tintColor(slide.tint) } : undefined}
                >
                  {slide.icon}
                </span>
              ) : null}
              <Heading level={2} className="rebar-onboarding-title" data-rebar-part="title">
                {slide.title}
              </Heading>
              <p className="rebar-onboarding-description" data-rebar-part="description">
                {slide.description}
              </p>
              {slide.note ? (
                <span className="rebar-onboarding-note" data-rebar-part="note">
                  {slide.note}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="rebar-onboarding-footer" data-rebar-part="footer">
        <div className="rebar-onboarding-dots" data-rebar-part="dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className="rebar-onboarding-dot"
              data-rebar-part="dot"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              tabIndex={i === current ? 0 : -1}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="rebar-onboarding-buttons" data-rebar-part="buttons">
          {current > 0 && !finishing ? (
            <Button variant="secondary" appearance={appearance === "classic" ? "classic" : undefined} onClick={() => go(current - 1)}>
              {L.back}
            </Button>
          ) : null}
          <Button
            appearance={appearance === "classic" ? "classic" : undefined}
            loading={finishing && isLast}
            disabled={finishing && !isLast}
            onClick={() => (isLast ? onDone?.() : go(current + 1))}
          >
            {isLast ? L.done : L.next}
          </Button>
        </div>
      </div>
    </section>
  );
}
