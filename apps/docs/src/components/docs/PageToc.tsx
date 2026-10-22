"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

/**
 * "On this page": a right-hand rail built from the page's own `h2` headings, so every reference page gets one without declaring
 * anything. Headings without an id are given one. Hidden under three headings and on narrow screens (CSS).
 */
export function PageToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    let io: IntersectionObserver | undefined;
    // The headings are read from the DOM (an external system) one frame after mount, so the state is set in a callback, not
    // synchronously in the effect body.
    const frame = requestAnimationFrame(() => {
      const root = document.querySelector("[data-cs-doc]");
      if (!root) return;
      const heads = [...root.querySelectorAll("h2")];
      const used = new Set<string>();
      const found = heads.map((h) => {
        let id = h.id;
        if (!id) {
          const base = slugify(h.textContent ?? "");
          id = base;
          let n = 2;
          while (used.has(id) || document.getElementById(id)) id = `${base}-${n++}`;
          h.id = id;
        }
        used.add(id);
        return { id, text: h.textContent ?? "" };
      });
      setItems(found);
      setActive(found[0]?.id ?? "");
      if (typeof IntersectionObserver === "undefined") return;
      io = new IntersectionObserver(
        (entries) => {
          const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (hit) setActive(hit.target.id);
        },
        { rootMargin: "-96px 0px -70% 0px" },
      );
      heads.forEach((h) => io?.observe(h));
    });
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, [pathname]);

  if (items.length < 3) return <div className="cs-toc-slot" aria-hidden="true" />;
  return (
    <nav className="cs-toc" aria-label="On this page">
      <b>On this page</b>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} aria-current={it.id === active ? "true" : undefined}>
          {it.text}
        </a>
      ))}
    </nav>
  );
}
