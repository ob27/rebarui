import Link from "next/link";
import { ConStage } from "@/components/mascot/ConStage";

// The 404 page: the same blue poster as the home page, with Con unimpressed on the floor.
export default function NotFound() {
  return (
    <main>
      <section className="cs-hero">
        <div className="cs-floor" />
        <div className="cs-wrap">
          <div className="cs-hero-copy">
            <div className="cs-kicker">Error 404</div>
            <div className="cs-404" aria-hidden="true">404</div>
            <h1 className="cs-visually-hidden">Page not found</h1>
            <div className="cs-note">
              <strong>This page doesn&apos;t exist.</strong> Neither did the component you were about to build from scratch. Try the search, or pick a tier.
            </div>
            <div className="cs-cta">
              <Link className="cs-btn" href="/">Back to the library</Link>
              <Link className="cs-btn cs-btn--ink" href="/opinions">Browse the Opinions</Link>
            </div>
          </div>
          <ConStage size={330} lines={["Not here. Not anywhere.", "Page not found. Concrete is, though."]} />
        </div>
      </section>
    </main>
  );
}
