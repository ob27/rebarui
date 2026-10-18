"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Renders its children only once the card is near the viewport, so a cover page with a hundred live constructs stays light.
 * The server and the first client render both show the same sized placeholder, so hydration cannot mismatch; `eager` cards
 * (the first screen, a deep-linked card) render at once.
 */
export function LazyExample({ children, eager = false }: { children: ReactNode; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);
  const [clipped, setClipped] = useState(false);

  const show = ready || eager;

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  // A tall example is a framed preview: the body clips it, and a fade at the bottom says so.
  useEffect(() => {
    if (!show) return;
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setClipped(el.scrollHeight > el.clientHeight + 2);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [show]);

  return (
    <div ref={ref} className="cs-gal-body" data-ready={show ? "true" : "false"} data-clipped={clipped ? "true" : undefined}>
      {show ? children : <div className="cs-gal-skel" aria-hidden="true" />}
    </div>
  );
}
