import type { ReactNode } from "react";
import { DocsShell } from "@/components/DocsShell";

const COMPONENT_SECTIONS = [
  { href: "/components", label: "All components" },
  { href: "/components/aspect-ratio", label: "AspectRatio" },
  { href: "/components/avatar", label: "Avatar" },
  { href: "/components/badge", label: "Badge" },
  { href: "/components/breadcrumb", label: "Breadcrumb" },
  { href: "/components/button", label: "Button" },
  { href: "/components/carousel", label: "Carousel" },
  { href: "/components/descriptions", label: "Descriptions" },
  { href: "/components/dialog", label: "Dialog" },
  { href: "/components/divider", label: "Divider" },
  { href: "/components/empty", label: "Empty" },
  { href: "/components/form", label: "Form" },
  { href: "/components/rate", label: "Rate" },
  { href: "/components/result", label: "Result" },
  { href: "/components/skeleton", label: "Skeleton" },
  { href: "/components/spin", label: "Spin" },
  { href: "/components/statistic", label: "Statistic" },
  { href: "/components/steps", label: "Steps" },
  { href: "/components/tag", label: "Tag" },
  { href: "/components/timeline", label: "Timeline" },
];

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return <DocsShell sections={COMPONENT_SECTIONS}>{children}</DocsShell>;
}
