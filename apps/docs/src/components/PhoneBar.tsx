import type { CSSProperties, ReactNode } from "react";
import { MobileTabBar } from "rebar-ui";
import { DOT, TAB_BAR_STYLE } from "@/app/imitations/device-frame/TidelinePhone";

/**
 * Lets a `TopBar` stand in for the Tideline phone's own app bar: `TidelinePhone` pads its `bar` slot, so this
 * pulls the TopBar flush to the bezel and gives it a 28px status-bar strip, as on a real phone.
 */
export function PhoneBar({ children }: { children: ReactNode }) {
  return <div style={{ flex: 1, minWidth: 0, margin: "-4px -18px -8px", "--rebar-top-bar-safe-area": "28px" } as CSSProperties}>{children}</div>;
}

const ATHIC_TABS = ["Today", "Ask", "Library", "Me"] as const;
export type AthicTab = "today" | "ask" | "library" | "me";

/** The Athic tab bar for a `TidelinePhone` (`tabBar={athicTabs("ask")}`). */
export function athicTabs(active: AthicTab) {
  const index = ["today", "ask", "library", "me"].indexOf(active);
  return <MobileTabBar aria-label="Athic" items={ATHIC_TABS.map((label) => ({ label, icon: DOT }))} activeIndex={index} style={{ ...TAB_BAR_STYLE, position: "static" }} />;
}
