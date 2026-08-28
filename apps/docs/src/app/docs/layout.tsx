import type { ReactNode } from "react";
import { DocsShell } from "@/components/DocsShell";

const DOCS_SECTIONS = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/theming", label: "Theming & Defaults" },
  { href: "/docs/migration", label: "Migration" },
  { href: "/docs/devtools", label: "DevTools" },
  { href: "/docs/contributing", label: "Contributing" },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsShell sections={DOCS_SECTIONS}>{children}</DocsShell>;
}
