"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Input, Puppet } from "rebar-ui";
import { CON, CON_CANVAS } from "@/data/conLayers";
import { NEW_CONSTRUCTS } from "@/data/newConstructs";
import type { Tier } from "@/data/tier.types";
import { TIER_CATEGORY_LABELS, tierDocsShellSections } from "@/data/tierSections";

const TILE = ["cs-tile--1", "cs-tile--2", "cs-tile--3", "cs-tile--4", "cs-tile--5"];

/**
 * The top of a tier's index page: the tier's name, a one-line description and Con, then a searchable, filterable grid of every
 * construct in the tier. It reads the same table as the sidebar, so it can never list something the sidebar does not.
 */
export function TierIntro({ tier, title, lead, lines }: { tier: Tier; title: string; lead: string; lines: string[] }) {
  const all = useMemo(() => tierDocsShellSections(tier).slice(1), [tier]); // drop the "All <tier>" entry
  const cats = useMemo(() => [...new Set(all.map((s) => s.category).filter((c): c is string => Boolean(c)))], [all]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const needle = q.trim().toLowerCase();
  const shown = all.filter((s) => (cat === "all" || s.category === cat) && s.label.toLowerCase().includes(needle));

  return (
    <div className="cs-tier-intro">
      <header className="cs-page-head">
        <div className="cs-page-head-text">
          <div className="cs-row">
            <h1 className="cs-h1 cs-h1--page">{title}</h1>
            <span className={`cs-tag cs-tag--${tier}`}>{tier}</span>
            <span className="cs-count">{all.length} constructs</span>
          </div>
          <p className="cs-lead">{lead}</p>
        </div>
        <div className="cs-mascot" aria-hidden="true">
          <Puppet layers={CON} canvas={CON_CANVAS} size={150} weight="heavy" says={lines} bubble="start" />
        </div>
      </header>

      <div className="cs-filters" role="group" aria-label={`Filter ${title}`}>
        <Input aria-label={`Filter ${all.length} ${title.toLowerCase()}`} placeholder={`Filter ${all.length} ${title.toLowerCase()}...`} value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="cs-pill" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All {all.length}</button>
        {cats.map((c) => (
          <button key={c} type="button" className="cs-pill" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {(TIER_CATEGORY_LABELS as Record<string, string>)[c] ?? c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="cs-empty" role="status">
          <span className="cs-empty-con" aria-hidden="true">
            <Puppet layers={CON} canvas={CON_CANVAS} size={110} weight="heavy" pose="half-blink" />
          </span>
          <div>
            <h2 className="cs-h3">No constructs match &ldquo;{q}&rdquo;</h2>
            <p className="cs-muted">Try a shorter word, or clear the filters. Con is squinting at your query.</p>
            <Button variant="secondary" onClick={() => { setQ(""); setCat("all"); }}>Clear filters</Button>
          </div>
        </div>
      ) : (
        <ul className="cs-grid" aria-label={title}>
          {shown.map((s, i) => {
            const noPage = s.status === "No reference page";
            const inner = (
              <>
                <span className={`cs-tile ${TILE[i % TILE.length]}`} aria-hidden="true">{s.label.charAt(0)}</span>
                <b>{s.label}</b>
                <span className="cs-ccard-meta">
                  <span className={`cs-tag cs-tag--${tier}`}>{tier}</span>
                  {NEW_CONSTRUCTS.has(s.label) ? <span className="cs-tag cs-tag--new">new</span> : null}
                  {noPage ? <span className="cs-tag cs-tag--none">no page yet</span> : null}
                </span>
              </>
            );
            return (
              <li key={`${s.href}-${s.label}`}>
                {noPage ? <div className="cs-ccard cs-ccard--static">{inner}</div> : <Link className="cs-ccard" href={s.href}>{inner}</Link>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
