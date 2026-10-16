export default function GenesesPage() {
  return (
    <main className="cs-wrap" style={{ paddingTop: 44 }}>
      <span className="cs-kicker">Genesis</span>
      <h1 className="cs-h1" style={{ margin: "10px 0 8px" }}>Geneses</h1>
      <p className="cs-lede" style={{ marginBottom: 28 }}>Whole apps built 100% with Rebar UI. Clone one.</p>
      <div className="cs-gen">
        <div>
          <div className="cs-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/geneses/ai-hive/wall-light.png" alt="The AI Hive wall in light mode: a grid of agent and service tiles with status filters, and the Hive Chat panel on the right" />
          </div>
          <div className="cs-cap">
            <h2 className="cs-h3">AI Hive</h2>
            <a className="cs-btn cs-btn--secondary cs-btn--sm" href="https://github.com/ob27/ai-hive">Open on GitHub</a>
          </div>
        </div>
        <div>
          <div className="cs-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/geneses/ai-hive/wall-detail-light.png" alt="AI Hive with one agent selected: a details banner shows its status, what it is working on and when it last reported" />
          </div>
          <div className="cs-cap">
            <span className="cs-muted">A wall of AI agents and services. MIT.</span>
            <span className="cs-tag cs-tag--genesis">100% Rebar UI</span>
          </div>
        </div>
        <div>
          <div className="cs-shot cs-grain cs-grain--sand cs-gen--soon"><span className="cs-kicker">Next</span></div>
          <div className="cs-cap"><h2 className="cs-h3">Tideline</h2><span className="cs-tag">Soon</span></div>
        </div>
      </div>
    </main>
  );
}
