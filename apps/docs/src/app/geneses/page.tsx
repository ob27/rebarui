import { DeviceFrame } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { GenesesHero } from "@/components/home/GenesesHero";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Philosophy",
    body: [
      {
        kind: "text",
        text: "Geneses are a different kind of thing from the other four tiers, not a fifth rung above Order. Imitation/Synthetic/Opinion/Order classify individual constructs — a component or a block. A genesis is a whole, complete, production-ready application built 100% with Rebar UI: not a piece you import, but a seed you clone. That's why a genesis is never a component or a block — `ConstructTier` (the type governing what a block is allowed to be) explicitly excludes Genesis, the same way it excludes Imitation, since a block is always at least a fixed composition and a genesis is always more than one.",
      },
      {
        kind: "text",
        text: "The point of a genesis isn't to demonstrate one construct in isolation — every other tier's own reference page already does that. It's to demonstrate a whole application built 100% with Rebar UI: every piece of the UI comes from the catalog, with no second component library alongside it, and project-specific constructs get added (and classified by the same tiers) only when the shipped catalog doesn't quite fit that domain. How the app is composed, hand-authored JSX against `rebar-ui` or pages printed through the placement layer's Packer, is the project's own call; a genesis isn't required to use the Packer.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When to reach for this tier",
    body: [
      {
        kind: "text",
        text: "You don't \"reach for\" a genesis the way you'd pick an Imitation or an Opinion for one new piece of UI — you clone one when you're starting a new project and want a working, opinionated foundation rather than an empty repo. Once you're inside a genesis, the tier question comes right back: any new piece of UI that project needs still gets classified the normal way (Imitation → Synthetic → Opinion → Order), same as it would in the main library.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Building your own",
    body: [
      {
        kind: "list",
        items: [
          "Build the whole UI from Rebar UI: reach for `rebar-ui` components (and the placement layer's Packer, if it suits the project) for everything, and don't bring in a second component library alongside it. Whether pages are hand-authored JSX or composed from `Construct[]` data is the project's call.",
          "Reach for the shipped catalog first; only add a project-specific component or block once a real requirement doesn't fit any existing tier's constructs.",
          "Keep any new project-specific construct classified honestly against the same four tiers, using the same tests described on the Imitations/Synthetics/Opinions/Orders pages — a genesis is not an excuse to skip that discipline.",
          "Document the project's own architecture decisions the way this repo documents its own (`ref/` for planning docs, a `CONTRIBUTING.md`-equivalent for anyone forking it further).",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Porting it back to the main repo",
    body: [
      {
        kind: "text",
        text: "A genesis isn't ported back the way a component or a block is — there's no single file to add to `packages/core` or `packages/placement`. If building one surfaces a construct that's genuinely reusable beyond that one project (not tied to its specific domain), that construct is what gets contributed back, through the normal Imitation/Synthetic/Opinion/Order pipeline described on this catalog's other tier pages — the genesis itself stays a separate, linked seed project, not a folder inside this repo. The same fork-first path applies either way: no write access to this repo is required to start — fork it, build there, then open an issue linking your fork or branch asking for the reusable piece to be adopted into the main project.",
      },
    ],
  },
];

export default function GenesesPage() {
  return (
    <main>
      <GenesesHero />
      <div className="cs-wrap" style={{ padding: "96px 32px", display: "grid", gap: 96 }}>
        <div className="cs-showcase">
          <div className="cs-showcase-copy">
            <div className="cs-kicker cs-kicker--accent">First genesis</div>
            <h2 className="cs-h2">AI Hive</h2>
            <p className="cs-muted" style={{ fontSize: 19, margin: 0 }}>
              A wall of AI agents and services, each tile showing who it is, where it is working, its status and what it is doing now, with its own keyed app server and command-line client. Open source under the MIT licence.
            </p>
            <div className="cs-cta">
              <a className="cs-btn" style={{ background: "var(--rebar-color-primary)", color: "var(--rebar-color-primary-text)" }} href="https://github.com/ob27/ai-hive">github.com/ob27/ai-hive</a>
            </div>
            <p className="cs-muted" style={{ fontSize: 15, margin: 0 }}>
              Rebar UI is not on npm yet, so the screen builds against a checkout of this repo next to it; the README has the steps.
            </p>
          </div>
          <DeviceFrame variant="browser" title="AI Hive · wall">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="rebar-theme-image-light" src="/geneses/ai-hive/wall-light.png" alt="The AI Hive wall in light mode: a grid of agent and service tiles with status filters, and the Hive Chat panel on the right" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="rebar-theme-image-dark" style={{ display: "none" }} src="/geneses/ai-hive/wall-dark.png" alt="The same AI Hive wall in dark mode" />
          </DeviceFrame>
        </div>

        <div className="cs-three">
          <DeviceFrame variant="browser" title="Agent selected">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/geneses/ai-hive/wall-detail-light.png" alt="AI Hive with one agent selected: a details banner shows its status, what it is working on and when it last reported" />
          </DeviceFrame>
          <div className="cs-card cs-card--concrete" style={{ alignContent: "center" }}>
            <div className="cs-num">100%</div>
            <h3 className="cs-h3">Rebar UI</h3>
            <p>Every piece of the screen comes from the catalog, with no second component library alongside it.</p>
          </div>
          <div className="cs-card cs-card--pink" style={{ alignContent: "center" }}>
            <div className="cs-num">MIT</div>
            <h3 className="cs-h3">Open source</h3>
            <p>Clone it, run its demo mode, and make it yours.</p>
          </div>
        </div>
        <p className="cs-muted" style={{ fontSize: 14, margin: "-72px 0 0" }}>Screenshots of AI Hive&apos;s built-in demo mode: every agent, service and chat message is simulated.</p>

        <div>
          <div className="cs-sec-head">
            <div className="cs-kicker cs-kicker--accent">Next up</div>
            <h2 className="cs-h2">More seeds to clone</h2>
          </div>
          <div className="cs-three">
            {[["Dashboard", "Charts, tables and filters, wired to live data."], ["Admin panel", "Forms, data grids and role-aware navigation."], ["Content site", "Pages, search and a docs shell."]].map(([t, d]) => (
              <div key={t} className="cs-card cs-card--dashed">
                <h3 className="cs-h3">{t}</h3>
                <p>{d}</p>
                <span className="cs-tag cs-tag--genesis">soon</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="cs-sec-head">
            <div className="cs-kicker cs-kicker--accent">The idea</div>
            <h2 className="cs-h2">How geneses work</h2>
          </div>
          <NextBlockRenderer blocks={BLOCKS} />
        </div>
      </div>
    </main>
  );
}
