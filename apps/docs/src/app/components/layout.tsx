import type { ReactNode } from "react";
import { DocsShell } from "@/components/DocsShell";

const COMPONENT_SECTIONS = [
  { href: "/components", label: "All components" },
  { href: "/components/aspect-ratio", label: "AspectRatio" },
  { href: "/components/avatar", label: "Avatar" },
  { href: "/components/button", label: "Button" },
  { href: "/components/dialog", label: "Dialog" },
  { href: "/components/form", label: "Form" },
];

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return <DocsShell sections={COMPONENT_SECTIONS}>{children}</DocsShell>;
}
