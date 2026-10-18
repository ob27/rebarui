/** Page hero: the site's grain art as a plain colour band (replaces the old catalogue illustrations). */
export function GrainHero({ tone = "dawn" }: { tone?: "dawn" | "sand" }) {
  return <div aria-hidden="true" className={`cs-grain${tone === "sand" ? " cs-grain--sand" : ""} cs-grain-hero`} />;
}
