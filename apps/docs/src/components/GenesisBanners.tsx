const GENESES = [
  {
    name: "AI Hive",
    line: "A wall of AI agents and services. MIT.",
    href: "https://github.com/ob27/ai-hive",
    cta: "Open on GitHub",
    grain: "",
  },
  {
    name: "Athic",
    line: "The Catholic companion app and its marketing site. Closed source.",
    href: "https://athic.org",
    cta: "Visit athic.org",
    grain: " cs-grain--sand",
  },
];

/** Genesis cards as hero banners on the site's grain art: name, one line, one link. */
export function GenesisBanners() {
  return (
    <div className="cs-gen cs-gen--banners">
      {GENESES.map((g) => (
        <div key={g.name} className={`cs-grain${g.grain} cs-gen-banner`}>
          <span className="cs-tag cs-tag--genesis">100% Rebar UI</span>
          <h2 className="cs-h2">{g.name}</h2>
          <p className="cs-muted">{g.line}</p>
          <a className="cs-btn cs-btn--secondary cs-btn--sm" href={g.href}>{g.cta}</a>
        </div>
      ))}
    </div>
  );
}
