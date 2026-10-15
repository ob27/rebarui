"use client";

import type { ReactNode } from "react";
import { Puppet } from "rebar-ui";
import { CON, CON_CANVAS, CON_LINES } from "@/data/conLayers";

/**
 * Con standing in a poster stage: the puppet (heavy, speaking in its deadpan voice) centred above the bottom edge, with anything passed as
 * children (stickers) absolutely positioned around it. The floor itself belongs to the surrounding section (`.cs-floor`) so it can run
 * the full width of the page. Decorative, so the puppet has no accessible name.
 */
export function ConStage({ size = 410, lines = CON_LINES, minHeight, children }: { size?: number; lines?: string[]; minHeight?: number; children?: ReactNode }) {
  return (
    <div className="cs-stage" style={minHeight ? { minHeight } : undefined}>
      <Puppet layers={CON} canvas={CON_CANVAS} size={size} weight="heavy" says={lines} bubble="start" />
      {children}
    </div>
  );
}
