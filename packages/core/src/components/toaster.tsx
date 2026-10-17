import { createContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

export type ToastKind = "info" | "success" | "error" | "loading";
export type ToastPosition = "top" | "center" | "bottom";
/** `"classic"`: the mobile-UI toast: a compact dark pill centred on the screen, text only (no icon, no tint per type), one at a time, 2s. */
export type ToastAppearance = "default" | "classic";

export interface ToastOptions {
  /** Icon and colour. Default `"info"` (the shortcuts set it for you). */
  type?: ToastKind;
  /** Milliseconds before it goes. Default 2500 (4000 for an error). `null` persists; a `loading` toast persists until dismissed or updated. */
  duration?: number | null;
  /** `"bottom"` (default, above the tab bar), `"top"` (under the top bar) or `"center"` (the compact square used for loading). */
  position?: ToastPosition;
  /** A text button at the end (Undo, View, See plans): a 44px target. */
  action?: { label: string; onClick: () => void };
  /** The same id replaces the toast instead of stacking a new one. */
  id?: string;
  /** `"classic"` draws the plain centred pill (see `ToastAppearance`); `position` is ignored. Default `"default"`. */
  appearance?: ToastAppearance;
}

interface ToastEntry {
  id: string;
  message: ReactNode;
  type: ToastKind;
  duration: number | null;
  position: ToastPosition;
  appearance: ToastAppearance;
  action?: { label: string; onClick: () => void };
  /** Bumped when an entry is replaced, to restart its timer. */
  version: number;
}

let entries: ToastEntry[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => entries;

const defaultDuration = (type: ToastKind, given: number | null | undefined, appearance?: ToastAppearance): number | null => {
  if (given !== undefined) return given;
  if (type === "loading") return null;
  if (appearance === "classic") return 2000;
  return type === "error" ? 4000 : 2500;
};

function show(message: ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `rebar-toast-${++counter}`;
  const type = options.type ?? "info";
  const existing = entries.find((e) => e.id === id);
  const next: ToastEntry = {
    id,
    message,
    type,
    duration: defaultDuration(type, options.duration, options.appearance),
    position: options.position ?? "bottom",
    appearance: options.appearance ?? "default",
    action: options.action,
    version: (existing?.version ?? 0) + 1,
  };
  entries = existing ? entries.map((e) => (e.id === id ? next : e)) : [...entries, next];
  emit();
  return id;
}

function dismiss(id?: string) {
  entries = id === undefined ? [] : entries.filter((e) => e.id !== id);
  emit();
}

type Shortcut = (message: ReactNode, options?: Omit<ToastOptions, "type">) => string;

export interface ToastFunction {
  (message: ReactNode, options?: ToastOptions): string;
  success: Shortcut;
  error: Shortcut;
  info: Shortcut;
  loading: Shortcut;
  /** Shows `loading`, then swaps the same toast to success or error with the message the callbacks return. */
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: ReactNode; success: ReactNode | ((value: T) => ReactNode); error: ReactNode | ((error: unknown) => ReactNode) },
    options?: Omit<ToastOptions, "type" | "id">,
  ) => Promise<T>;
  /** Dismiss one toast, or all of them. */
  dismiss: (id?: string) => void;
}

/**
 * Imperative toasts: call from anywhere (an event handler, a data layer), no local state. Needs one
 * `ToastProvider` at the app root, which hosts them. Opinion: it holds a store with timers, stacking
 * and replacement.
 */
export const toast: ToastFunction = Object.assign((message: ReactNode, options?: ToastOptions) => show(message, options), {
  success: ((message, options) => show(message, { ...options, type: "success" })) as Shortcut,
  error: ((message, options) => show(message, { ...options, type: "error" })) as Shortcut,
  info: ((message, options) => show(message, { ...options, type: "info" })) as Shortcut,
  loading: ((message, options) => show(message, { ...options, type: "loading" })) as Shortcut,
  dismiss,
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: ReactNode; success: ReactNode | ((value: T) => ReactNode); error: ReactNode | ((error: unknown) => ReactNode) },
    options?: Omit<ToastOptions, "type" | "id">,
  ) => {
    const id = show(messages.loading, { ...options, type: "loading" });
    promise.then(
      (value) => {
        show(typeof messages.success === "function" ? (messages.success as (v: T) => ReactNode)(value) : messages.success, { ...options, id, type: "success" });
      },
      (error) => {
        show(typeof messages.error === "function" ? (messages.error as (e: unknown) => ReactNode)(error) : messages.error, { ...options, id, type: "error" });
      },
    );
    return promise;
  },
});

/** The hook form of `toast()`, for components: the same functions. */
export function useToast(): ToastFunction {
  return toast;
}

/** @internal test helper: clears the store. */
export function __resetToasts() {
  entries = [];
  emit();
}

function ToastGlyph({ type, appearance }: { type: ToastKind; appearance?: ToastAppearance }) {
  if (appearance === "classic") {
    // Text only, except loading: a 48px ring above the text.
    return type === "loading" ? (
      <svg className="rebar-toaster-ring" data-rebar-part="spinner" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="15" fill="transparent" strokeWidth="2" strokeLinecap="square" />
      </svg>
    ) : null;
  }
  if (type === "loading") return <span className="rebar-toaster-spinner" data-rebar-part="spinner" aria-hidden="true" />;
  return (
    <span className="rebar-toaster-icon" data-rebar-part="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {type === "success" ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : type === "error" ? <path d="M12 6v7M12 17.5v.5" /> : <path d="M12 11v6M12 7v.5" />}
      </svg>
    </span>
  );
}

export interface ToastViewProps {
  message: ReactNode;
  type?: ToastKind;
  action?: { label: string; onClick: () => void };
  /** `"center"` lays the toast out as the compact square. */
  position?: ToastPosition;
  /** Draws the toast as an older one in a stack (smaller, faded). */
  stacked?: boolean;
  appearance?: ToastAppearance;
  className?: string;
}

/** One toast, drawn. The provider renders these; use it directly for static illustrations and tests. */
export function ToastView({ message, type = "info", action, position = "bottom", stacked, appearance, className }: ToastViewProps) {
  return (
    <div
      className={clsx("rebar-toaster-toast", className)}
      data-rebar-component="toaster-toast"
      data-rebar-type={type}
      data-rebar-position={position}
      data-rebar-stacked={stacked ? "true" : undefined}
      data-rebar-appearance={appearance === "classic" ? "classic" : undefined}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <ToastGlyph type={type} appearance={appearance} />
      <span className="rebar-toaster-message" data-rebar-part="message">
        {message}
      </span>
      {action ? (
        <button type="button" className="rebar-toaster-action" data-rebar-part="action" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

function TimedToast({ entry, stacked }: { entry: ToastEntry; stacked: boolean }) {
  const [paused, setPaused] = useState(false);
  const idRef = useRef(entry.id);
  idRef.current = entry.id;
  useEffect(() => {
    if (entry.duration === null || paused) return;
    const timer = setTimeout(() => dismiss(idRef.current), entry.duration);
    return () => clearTimeout(timer);
  }, [entry.duration, entry.version, paused]);
  return (
    <div
      className="rebar-toaster-item"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ToastView
        message={entry.message}
        type={entry.type}
        position={entry.position}
        appearance={entry.appearance}
        stacked={stacked}
        action={
          entry.action
            ? {
                label: entry.action.label,
                onClick: () => {
                  entry.action?.onClick();
                  dismiss(entry.id);
                },
              }
            : undefined
        }
      />
    </div>
  );
}

/** Set by a mounted `ToastProvider` so a nested provider does not host a second copy of every toast. */
export const ToasterHostedContext = createContext(false);

/** Renders the stack for every position. Mounted by `ToastProvider`. */
export function ToasterHost({ max = 3 }: { max?: number }) {
  const list = useSyncExternalStore(subscribe, snapshot, snapshot);
  const positions: ToastPosition[] = ["top", "center", "bottom"];
  const classic = list.filter((e) => e.appearance === "classic").slice(-1);
  return (
    <>
      {positions.map((position) => {
        const inPosition = list.filter((e) => e.position === position && e.appearance !== "classic");
        if (inPosition.length === 0) return null;
        const visible = inPosition.slice(-max);
        return (
          <div key={position} className="rebar-toaster" data-rebar-component="toaster" data-rebar-position={position} role="region" aria-label="Notifications">
            {visible.map((entry, i) => (
              <TimedToast key={entry.id} entry={entry} stacked={i < visible.length - 1} />
            ))}
          </div>
        );
      })}
      {classic.length ? (
        <div key="classic" className="rebar-toaster" data-rebar-component="toaster" data-rebar-position="center" data-rebar-appearance="classic" role="region" aria-label="Notifications">
          {classic.map((entry) => (
            <TimedToast key={entry.id} entry={entry} stacked={false} />
          ))}
        </div>
      ) : null}
    </>
  );
}
