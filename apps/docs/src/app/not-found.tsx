import Link from "next/link";

export default function NotFound() {
  return (
    <main className="cs-wrap cs-404">
      <div>
        <span className="cs-kicker">404</span>
        <h1 className="cs-h1">Nothing here</h1>
        <Link className="cs-btn cs-btn--lg" href="/opinions">Back to constructs</Link>
      </div>
    </main>
  );
}
