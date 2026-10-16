"use client";

import { useState } from "react";
import Link from "next/link";
import { ConstructSearch, ThemeToggle } from "rebar-ui";
import { CONSTRUCT_SEARCH_INDEX } from "@/data/constructSearchIndex";
import { REBAR_MARK_PATH, REBAR_MARK_VIEWBOX } from "@/data/rebarMark";

const GROUPS: { label: string; links: [string, string][] }[] = [
  { label: "Constructs", links: [["Imitations", "/imitations"], ["Synthetics", "/synthetics"], ["Opinions", "/opinions"], ["Orders", "/orders"], ["Archetypes", "/archetypes"], ["Geneses", "/geneses"]] },
  { label: "Docs", links: [["For agents", "/about/agent"], ["Heuristics", "/heuristics"], ["Benchmarks", "/about/benchmarks"], ["Roadmap", "/roadmap"], ["Version log", "/about/version-log"], ["About", "/about"]] },
];

/** The site header on a phone: the logo and a Menu button; the menu holds search, every link group and the theme controls. */
export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="cs-mobile-header" data-open={open ? "true" : "false"}>
      <div className="cs-mobile-bar">
        <Link href="/" className="cs-mobile-logo" onClick={close}>
          <svg viewBox={REBAR_MARK_VIEWBOX} width="24" height="26" aria-hidden="true"><path d={REBAR_MARK_PATH} fill="currentColor" /></svg>
          Rebar UI
        </Link>
        <button type="button" className="cs-mobile-menubtn" aria-expanded={open} aria-controls="cs-mobile-menu" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="cs-mobile-menu" className="cs-mobile-menu" aria-label="Main">
          <ConstructSearch
            results={CONSTRUCT_SEARCH_INDEX}
            placeholder="Search constructs"
            aria-label="Search constructs"
            renderLink={({ href, children, className }) => (
              <Link href={href} className={className} onClick={close}>{children}</Link>
            )}
          />
          {GROUPS.map((g) => (
            <div key={g.label} className="cs-mobile-group">
              <h2>{g.label}</h2>
              {g.links.map(([label, href]) => (
                <Link key={href} href={href} onClick={close}>{label}</Link>
              ))}
            </div>
          ))}
          <div className="cs-mobile-group">
            <h2>Appearance</h2>
            <ThemeToggle sections={["mode", "bionic"]} />
          </div>
          <a className="cs-mobile-gh" href="https://github.com/ob27/rebarui">Source on GitHub</a>
        </nav>
      ) : null}
    </header>
  );
}
