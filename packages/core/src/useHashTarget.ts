import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface UseHashTargetOptions {
  /** Space (px) to keep clear above the target, applied as `scroll-margin-top`. `"auto"` reads
   * `--rebar-header-height` from the document root (which the `site-header` block sets) plus 20px of
   * breathing room; with no such variable it is 20. Default `"auto"`. */
  offset?: number | "auto";
  /** Default `"smooth"`; always instant under `prefers-reduced-motion`. */
  behavior?: "smooth" | "auto";
  /** Move focus to the target (given `tabindex="-1"` when it is not focusable) so screen readers announce it. Default `false`. */
  focus?: boolean;
  /** Ids open before any hash is read. */
  defaultOpen?: string[];
  /** Milliseconds `data-hash-target` stays on the target (a style hook for a short ring). Default 2400. */
  highlightMs?: number;
}

export interface UseHashTargetResult {
  /** The id named by `location.hash` when it is one of `ids`, else `null`. */
  target: string | null;
  /** Ids to open, for a multiple `Accordion` (`value={open}`). The target is added when the hash changes. */
  open: string[];
  /** Pass to the accordion's `onValueChange` so the user's own toggling is kept. */
  setOpen: Dispatch<SetStateAction<string[]>>;
}

const AUTO_GAP = 20;

function readHash(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function headerHeight(): number {
  if (typeof document === "undefined") return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue("--rebar-header-height").trim();
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Opens and scrolls to the section named in the URL hash, clear of a sticky header. Reads
 * `location.hash` on mount and on `hashchange`, ignores ids not in `ids`, sets `scroll-margin-top` on the
 * target, scrolls it into view, marks it `data-hash-target="true"` for a moment and optionally moves
 * focus to it. Give each section (or each `AccordionItem`, through its `id` prop) a matching `id`.
 */
export function useHashTarget(ids: readonly string[], options: UseHashTargetOptions = {}): UseHashTargetResult {
  const { offset = "auto", behavior = "smooth", focus = false, defaultOpen = [], highlightMs = 2400 } = options;
  const [target, setTarget] = useState<string | null>(null);
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const key = ids.join("\u0000");

  const sync = useCallback(() => {
    const id = readHash();
    const known = id !== null && key.split("\u0000").includes(id) ? id : null;
    setTarget(known);
    if (known) setOpen((prev) => (prev.includes(known) ? prev : [...prev, known]));
  }, [key]);

  useEffect(() => {
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sync]);

  useEffect(() => {
    if (!target) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame2 = 0;
    // Wait two frames: the accordion item named by the hash has to open and lay out first.
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (!el) return;
        const margin = offset === "auto" ? headerHeight() + AUTO_GAP : offset;
        el.style.scrollMarginTop = `${margin}px`;
        const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView?.({ behavior: reduced ? "auto" : behavior, block: "start" });
        document.querySelectorAll("[data-hash-target]").forEach((node) => node.removeAttribute("data-hash-target"));
        el.setAttribute("data-hash-target", "true");
        if (focus) {
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
        if (highlightMs > 0) timer = setTimeout(() => el.removeAttribute("data-hash-target"), highlightMs);
      });
    });
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      if (timer) clearTimeout(timer);
    };
  }, [target, offset, behavior, focus, highlightMs]);

  return { target, open, setOpen };
}
