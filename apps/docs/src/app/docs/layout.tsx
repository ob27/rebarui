import type { ReactNode } from "react";
import { DocsShell } from "@/components/DocsShell";

const DOCS_SECTIONS = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/design-philosophy", label: "Design Philosophy" },
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/heuristics", label: "Design Heuristics" },
  { href: "/docs/mobile-skew", label: "Mobile skew (planned)" },
  { href: "/docs/robot-md", label: "robot.md (agent context)" },
  { href: "/docs/theming", label: "Theming & Defaults" },
  { href: "/docs/migration", label: "Migration" },
  { href: "/docs/packer-coverage", label: "Auditing Packer coverage" },
  { href: "/docs/devtools", label: "DevTools" },
  { href: "/docs/token-estimate", label: "Token estimate methodology" },
  { href: "/docs/contributing", label: "Contributing" },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsShell sections={DOCS_SECTIONS}>{children}</DocsShell>;
}
