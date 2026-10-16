"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input } from "rebar-ui";
import { TierFeatured } from "@/components/docs/TierFeatured";
import { NEW_CONSTRUCTS } from "@/data/newConstructs";
import type { Tier } from "@/data/tier.types";
import { TIER_CATEGORY_LABELS, tierDocsShellSections } from "@/data/tierSections";

/**
 * The top of a tier's index page: the tier's name and one line, three of its constructs live, then every construct in the tier as a
 * plain filterable list. It reads the same table as the sidebar, so it can never list something the sidebar does not.
 */
export function TierIntro({ tier, title, lead }: { tier: Tier; title: string; lead: string }) {
  const all = useMemo(() => tierDocsShellSections(tier).slice(1), [tier]); // drop the "All <tier>" entry
  const cats = useMemo(() => [...new Set(all.map((s) => s.category).filter((c): c is string => Boolean(c)))], [all]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const needle = q.trim().toLowerCase();
  const shown = all.filter((s) => (cat === "all" || s.category === cat) && s.label.toLowerCase().includes(needle));
  const catLabel = (c?: string) => (c ? ((TIER_CATEGORY_LABELS as Record<string, string>)[c] ?? c) : null);

  return (
    <div className="cs-tier-intro">
      <header className="cs-page-head">
        <span className="cs-kicker">{tier}</span>
        <h1 className="cs-h1">{title}</h1>
        <p className="cs-lede">{lead}</p>
      </header>

      <TierFeatured tier={tier} />

      <div className="cs-sec-h cs-sec-h--tight">
        <h2 className="cs-h2">All {all.length}</h2>
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
        <ul className="cs-list" aria-label={title}>
          {shown.map((s) => {
            const noPage = s.status === "No reference page";
            const inner = (
              <>
                <b>{s.label}</b>
                <span className="cs-list-meta">
                  {NEW_CONSTRUCTS.has(s.label) ? <span className="cs-tag cs-tag--new">new</span> : null}
                  {noPage ? <span className="cs-tag cs-tag--none">no page yet</span> : catLabel(s.category) ? <span className="cs-list-cat">{catLabel(s.category)}</span> : null}
                  {noPage ? null : <span className="cs-chev" aria-hidden="true" />}
                </span>
              </>
            );
            return (
              <li key={`${s.href}-${s.label}`}>
                {noPage ? <div className="cs-list-row cs-list-row--static">{inner}</div> : <Link className="cs-list-row" href={s.href}>{inner}</Link>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
