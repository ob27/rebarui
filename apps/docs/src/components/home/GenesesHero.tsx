"use client";

import { ConStage } from "@/components/mascot/ConStage";

/** The Geneses page hero: the same blue poster as the home page, shorter, with Con standing on the floor. */
export function GenesesHero() {
  return (
    <section className="cs-hero" style={{ ["--cs-floor" as string]: "72px" }}>
      <div className="cs-floor" />
      <div className="cs-wrap">
        <div className="cs-hero-copy" style={{ paddingTop: 64 }}>
          <div className="cs-kicker">Construct Library &middot; Geneses</div>
          <h1 className="cs-h1" style={{ fontSize: "clamp(56px, 7vw, 100px)" }}>Geneses</h1>
          <div className="cs-note">
            Seed projects grounded in the Rebar UI framework: complete, production-ready applications <strong>built 100% with Rebar UI</strong>, not individual constructs themselves.
          </div>
        </div>
        <ConStage size={300} minHeight={540} lines={["Whole apps. Not one-offs.", "Clone it. Make it yours."]} />
      </div>
    </section>
  );
}
