import type { ReactNode } from "react";
import { DemoStage } from "@/components/DemoStage";

/**
 * The old demo wrapper, kept so the pages that use it need no edit: it is now the `DemoStage` frame. The theme is zero-config
 * (basilika applies to :root and follows `data-theme` on any ancestor), so the attribute mirroring it used to do is gone.
 */
export function LivePreview({ children }: { children: ReactNode }) {
  return <DemoStage>{children}</DemoStage>;
}
