import Link from "next/link";

const FOOTER_LINKS = [
  { href: "https://github.com/ob27/rebarui", label: "GitHub" },
  { href: "/about/install", label: "Install" },
  { href: "/about/version-log", label: "Version log" },
  { href: "/heuristics", label: "Heuristics" },
  { href: "https://github.com/ob27/rebarui/blob/main/CONTRIBUTING.md", label: "Contributing" },
];

export function SiteFooter() {
  return (
    <footer className="cs-foot">
      <div className="cs-wrap">
        <span>Rebar UI 1.1 &middot; MIT</span>
        <span className="cs-sp" />
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
