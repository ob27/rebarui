import * as RadixDialog from "@radix-ui/react-dialog";
import { useSchemeAttr } from "./ThemeScope";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";

// Popup sheets stack in the order they were opened (a menu keeps showing under the dialog or sheet it opened, each dimmed by the one
// above): every open popup takes the next level and its overlay and panel z-index rise with it. Opt-in: only `appearance="popup"` uses it.
let popupDepth = 0;
function usePopupLevel(active: boolean): number {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!active) return;
    popupDepth += 1;
    setLevel(popupDepth);
    return () => {
      popupDepth -= 1;
      setLevel(0);
    };
  }, [active]);
  return level;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Which screen edge the panel slides in from. Defaults to "right". */
  side?: DrawerSide;
  /** The panel's width in px for left/right, height in px for top/bottom. Defaults to 360. `"auto"`
   * fits the content (up to `maxHeight` for top/bottom, 85vw for left/right) and the body scrolls
   * past that. */
  size?: number | "auto";
  /** With `size="auto"` on top/bottom: the tallest the panel grows (a px number or any CSS length).
   * Defaults to `85vh`. Ignored for a fixed `size`. */
  maxHeight?: number | string;
  /** When `false` the panel can only be closed by your own controls: no close button, no grab bar,
   * no drag-to-dismiss, and Esc / a backdrop click do nothing. Defaults to `true`. */
  dismissible?: boolean;
  /** Renders the overlay and panel inside this element (forwarded to the Radix portal) instead of
   * `document.body` -- e.g. a `DeviceFrame` screen, so the sheet stays within the frame. The
   * element should be positioned (`position: relative`); the overlay and panel then lay out
   * `position: absolute` within it (`data-rebar-contained="true"`). */
  container?: HTMLElement | null;
  /** `"popup"` (bottom sheets): the flat mobile-UI popup. A plain panel (radius, fill and padding from the
   * `--rebar-popup-*` tokens), no close button (kept for assistive tech, visually hidden) and no grab bar unless
   * `showHandle`; the header is just the title (see `titleStyle`), the body scrolls between a fixed header and footer.
   * Default `"default"`: unchanged. */
  appearance?: "default" | "popup";
  /** With `appearance="popup"`: shows the grab bar above the title. Default `false`. */
  showHandle?: boolean;
  /** With `appearance="popup"`: `"eyebrow"` (default, small uppercase muted label) or `"heading"` (a serif display title). */
  titleStyle?: "eyebrow" | "heading";
  /** `false`: no focus trap and nothing outside the panel is made inert, so focus can live in a field outside the panel (an inline
   * rename in the page header opened from the sheet's menu). The dim layer is still drawn and still dismisses; moving focus out does
   * not. Default `true` (a modal dialog: focus is trapped). */
  modal?: boolean;
}

/**
 * Shared plumbing between `Drawer` and the components built directly on top of it
 * (`BottomSheet`, `ActionSheet`) — the exact same Radix wiring and controlled/uncontrolled
 * open-state pattern `Dialog` uses, just positioned/animated as a slide-in panel instead of a
 * centered box. Not part of the public component catalog itself (kept out of index.ts by
 * whoever wires that up) — a same-directory implementation detail so BottomSheet/ActionSheet can
 * reuse this without reimplementing it, each supplying their own `dataComponent` (so the DOM
 * still carries the correct, component-specific `data-rebar-component`) and optional extra
 * `handle` content (BottomSheet/ActionSheet's decorative drag handle).
 */
export interface DrawerPanelProps extends DrawerProps {
  dataComponent: string;
  /** Extra content rendered inside the panel, above the header — e.g. a drag handle. */
  handle?: ReactNode;
  /**
   * Makes `handle` a real drag-to-dismiss surface — `side="bottom"` only (the native bottom-sheet
   * gesture; dragging a left/right/top panel closed isn't a pattern this adds). Plain
   * pointerdown/pointermove/pointerup tracking (no new dependency), the same linear-track/clamp/
   * snap-past-a-threshold technique `SwipeActions`/`PullToRefresh`/`PickerWheel` already use —
   * past ~25% of the panel's own height, release closes it; otherwise it springs back via a CSS
   * transition (no real spring physics, same discipline as those three). Off by default: every
   * existing `Drawer`/`DrawerPanel` usage keeps its current (tap/Esc/backdrop-only) behavior
   * unless this is explicitly set. Dismissal always still works via the close button, Esc, and a
   * backdrop click regardless — this is an added path, never the only one (heuristic #38).
   */
  dragToDismiss?: boolean;
}

function defaultAccessibleLabel(dataComponent: string) {
  const spaced = dataComponent.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function DrawerPanel({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className,
  side = "right",
  size: sizeProp,
  maxHeight = "85vh",
  dismissible = true,
  dataComponent,
  handle,
  dragToDismiss,
  container,
  appearance,
  showHandle,
  titleStyle,
  modal = true,
}: DrawerPanelProps) {
  const schemeAttr = useSchemeAttr();
  // Same controlled/uncontrolled pattern as Dialog: internally managed regardless of whether the
  // caller passes `open`, so every consumer (a plain uncontrolled trigger, or ActionSheet forcing
  // itself closed after a selection) works the same way.
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  // A popup bottom sheet defaults to its content height; every other panel to 360px.
  const size = sizeProp ?? (appearance === "popup" && side === "bottom" ? "auto" : 360);
  const isHorizontal = side === "left" || side === "right";
  const isAuto = size === "auto";
  const sizeStyle = isAuto
    ? isHorizontal
      ? { maxWidth: "85vw" }
      : { maxHeight }
    : isHorizontal
      ? { width: size }
      : { height: size };
  const contentRef = useRef<HTMLDivElement>(null);
  const panelSize = () => (isAuto ? contentRef.current?.offsetHeight || 360 : (size as number));
  const popup = appearance === "popup";
  const popupLevel = usePopupLevel(popup && currentOpen);
  const hasVisibleTitle = title !== undefined && title !== null && title !== "";

  const dragEnabled = Boolean(dragToDismiss) && side === "bottom" && dismissible;
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);

  const handleHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragEnabled) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    draggingRef.current = true;
    startYRef.current = e.clientY;
    setIsDragging(true);
    setDragOffset(0);
    let latestDelta = 0;
    const extent = panelSize();

    const handleMove = (moveEvent: PointerEvent) => {
      if (!draggingRef.current) return;
      // Only downward drag moves the sheet — dragging up shouldn't pull it past its resting
      // (fully open) position.
      latestDelta = clamp(moveEvent.clientY - startYRef.current, 0, extent * 1.5);
      setDragOffset(latestDelta);
    };
    const handleUp = () => {
      draggingRef.current = false;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      setIsDragging(false);
      setDragOffset(null);
      if (latestDelta >= extent * 0.25) {
        handleOpenChange(false);
      }
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const dragStyle =
    dragEnabled && dragOffset !== null
      ? { transform: `translateY(${dragOffset}px)`, transition: isDragging ? "none" : "transform 0.2s ease" }
      : undefined;

  return (
    <RadixDialog.Root open={currentOpen} onOpenChange={handleOpenChange} modal={modal}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal container={container ?? undefined}>
        {modal ? (
          <RadixDialog.Overlay
              {...schemeAttr}
            className="rebar-dialog-overlay"
            data-rebar-part="overlay"
            data-rebar-appearance={popup ? "popup" : undefined}
            data-rebar-contained={container ? "true" : undefined}
            style={popupLevel ? { zIndex: 1000 + popupLevel * 10 } : undefined}
          />
        ) : (
          // A non-modal Radix dialog draws no overlay of its own: the same dim layer as a plain element (a pointer-down on it is
          // "outside the panel" and dismisses).
          currentOpen && (
            <div
              {...schemeAttr}
              className="rebar-dialog-overlay"
              data-rebar-part="overlay"
              data-rebar-appearance={popup ? "popup" : undefined}
              data-rebar-contained={container ? "true" : undefined}
              data-state="open"
              style={popupLevel ? { zIndex: 1000 + popupLevel * 10 } : undefined}
            />
          )
        )}
        <RadixDialog.Content
            {...schemeAttr}
          className={clsx("rebar-drawer-content", `rebar-drawer-content-${side}`, className)}
          data-rebar-component={dataComponent}
          data-rebar-side={side}
          data-rebar-appearance={popup ? "popup" : undefined}
          data-rebar-title-style={popup && titleStyle === "heading" ? "heading" : undefined}
          data-rebar-handle={popup && showHandle ? "true" : undefined}
          data-rebar-contained={container ? "true" : undefined}
          style={{ ...sizeStyle, ...dragStyle, ...(popupLevel ? { zIndex: 1001 + popupLevel * 10 } : null) }}
          aria-modal={modal ? "true" : undefined}
          ref={contentRef}
          data-rebar-size={isAuto ? "auto" : undefined}
          data-rebar-dismissible={dismissible ? undefined : "false"}
          onEscapeKeyDown={dismissible ? undefined : (e) => e.preventDefault()}
          onPointerDownOutside={dismissible ? undefined : (e) => e.preventDefault()}
          onInteractOutside={dismissible ? undefined : (e) => e.preventDefault()}
          onFocusOutside={modal ? undefined : (e) => e.preventDefault()}
        >
          {!dismissible ? null : dragEnabled ? (
            <div
              className="rebar-drawer-drag-handle"
              data-rebar-part="drag-handle"
              onPointerDown={handleHandlePointerDown}
              style={{ touchAction: "none" }}
            >
              {handle}
            </div>
          ) : (
            handle
          )}
          <div className="rebar-dialog-header" data-rebar-part="header">
            <RadixDialog.Title asChild>
              <Heading
                level={2}
                data-rebar-part="title"
                className={hasVisibleTitle ? undefined : "rebar-visually-hidden"}
              >
                {hasVisibleTitle ? title : defaultAccessibleLabel(dataComponent)}
              </Heading>
            </RadixDialog.Title>
            {dismissible ? (
            <RadixDialog.Close
              className="rebar-drawer-close"
              data-rebar-part="close"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </RadixDialog.Close>
            ) : null}
          </div>
          {description ? (
            <RadixDialog.Description data-rebar-part="description">
              {description}
            </RadixDialog.Description>
          ) : null}
          <div className="rebar-dialog-body" data-rebar-part="body">
            {children}
          </div>
          {footer ? (
            <div className="rebar-dialog-footer" data-rebar-part="footer">
              {footer}
            </div>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

/**
 * A panel that slides in from a screen edge — built on the same Radix Dialog primitive as
 * `Dialog` (same accessible modal semantics: focus trap, Esc to close, backdrop), just
 * positioned/animated as a slide-in panel instead of a centered box. Distinct from `Dialog`
 * (centered modal) the way a native app's side panel differs from an alert.
 *
 * Always includes a visible close button (the non-drag-to-dismiss fallback per
 * ref/HEURISTICS.md #38) in addition to Esc and backdrop-click dismissal.
 */
export function Drawer(props: DrawerProps) {
  return <DrawerPanel {...props} dataComponent="drawer" />;
}
