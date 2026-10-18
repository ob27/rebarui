"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input } from "rebar-ui";
import { LazyExample } from "@/components/docs/LazyExample";
import { TIER_EXAMPLES } from "@/components/docs/tierExamples";
import { galleryEntries } from "@/components/docs/tierGallery";
import type { Tier } from "@/data/tier.types";
import { TIER_CATEGORY_LABELS } from "@/data/tierSections";

const EAGER_CARDS = 4; // the first screen renders at once; the rest wait until they are near the viewport

/**
 * The top of a tier's index page: the tier's name and one line, then a scroll-and-browse gallery with one card per construct:
 * its name (the anchor, so /imitations#button lands on it), a live example from the Tideline fixtures, and a link to its docs.
 * It reads the same table as the sidebar, so it can never list something the sidebar does not. A construct with no example in
 * `tierExamples` gets a plain card (name, category, Docs link).
 */
export function TierIntro({ tier, title, lead }: { tier: Tier; title: string; lead: string }) {
  const all = useMemo(() => galleryEntries(tier), [tier]);
  const examples = TIER_EXAMPLES[tier];
  const cats = useMemo(() => [...new Set(all.map((s) => s.category).filter((c): c is string => Boolean(c)))], [all]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [target, setTarget] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = all.filter((s) => (cat === "all" || s.category === cat) && s.label.toLowerCase().includes(needle));
  const catLabel = (c?: string) => (c ? ((TIER_CATEGORY_LABELS as Record<string, string>)[c] ?? c) : null);
  const letters = useMemo(() => {
    const first = new Map<string, string>();
    for (const s of shown) if (!first.has(s.letter)) first.set(s.letter, s.slug);
    return [...first];
  }, [shown]);

  // Deep links: /imitations#button. The cards are in the static HTML, so the browser scrolls on load; this re-scrolls once lazy
  // cards above have settled, clears a filter that would hide the target, and renders the target card at once.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      let id = "";
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        id = "";
      }
      if (!id || !all.some((s) => s.slug === id)) return;
      setTarget(id);
      setQ("");
      setCat("all");
      const scroll = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
      requestAnimationFrame(scroll);
      clearTimeout(timer);
      timer = setTimeout(scroll, 450);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => {
      window.removeEventListener("hashchange", go);
      clearTimeout(timer);
    };
  }, [all]);

  return (
    <div className="cs-tier-intro">
      <header className="cs-page-head">
        <span className="cs-kicker">{tier}</span>
        <h1 className="cs-h1">{title}</h1>
        <p className="cs-lede">{lead}</p>
      </header>

      <div className="cs-sec-h cs-sec-h--tight">
        <h2 className="cs-h2">All {all.length}</h2>
        <span className="cs-count">{shown.length === all.length ? "Scroll to browse, or jump by letter" : `${shown.length} of ${all.length}`}</span>
      </div>
      <div className="cs-filters" role="group" aria-label={`Filter ${title}`}>
        <Input aria-label={`Filter ${all.length} ${title.toLowerCase()}`} placeholder={`Filter ${title.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="cs-pill" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All</button>
        {cats.map((c) => (
          <button key={c} type="button" className="cs-pill" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {catLabel(c)}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="cs-empty" role="status">
          <h3 className="cs-h3">No constructs match &ldquo;{q}&rdquo;</h3>
          <Button variant="secondary" onClick={() => { setQ(""); setCat("all"); }}>Clear filters</Button>
        </div>
      ) : (
        <>
          <nav className="cs-gal-strip" aria-label={`Jump to a letter in ${title}`}>
            {letters.map(([l, slug]) => (
              <a key={l} href={`#${slug}`}>{l}</a>
            ))}
          </nav>
          <div className="cs-gal" aria-label={title}>
            {shown.map((s, i) => {
              const example = examples[s.label];
              return (
                <article key={s.slug} id={s.slug} className="cs-gal-card" data-wide={example?.wide ? "true" : undefined} data-example={example ? "live" : "none"}>
                  <div className="cs-gal-head">
                    <h3 className="cs-gal-name">
                      <a href={`#${s.slug}`}>{s.label}</a>
                    </h3>
                    {s.isNew ? <span className="cs-tag cs-tag--new">new</span> : null}
                    {catLabel(s.category) ? <span className="cs-gal-cat">{catLabel(s.category)}</span> : null}
                    <Link className="cs-gal-docs" href={s.href} aria-label={`${s.label} docs`}>Docs</Link>
                  </div>
                  {example ? <LazyExample eager={i < EAGER_CARDS || s.slug === target}>{example.node}</LazyExample> : null}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
