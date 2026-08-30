"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Box, Stack, Text } from "rebar-ui";
import { LivePreview } from "./LivePreview";

/**
 * The homepage's "build in Rebar, migrate to real antd" side-by-side comparison. A plain fixed
 * iframe height would drift out of sync with the Rebar side any time either side's content,
 * theme, or viewport width changes — instead this measures the live Rebar preview's actual
 * rendered height (ResizeObserver, so it re-measures on theme toggle and window resize too) and
 * matches the antd iframe's box to it, so the two panels are always visually the same height.
 */
function readAmbientDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export function MigrationComparison({
  rebar,
  iframeSrc,
  iframeTitle,
}: {
  rebar: ReactNode;
  iframeSrc: string;
  iframeTitle: string;
}) {
  const rebarRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  // The antd iframe is a separate document — DevTools' dark-mode toggle on the parent page can't
  // reach into it directly, so the theme is passed in via a query param instead (read by
  // bench/antd-composite-demo/src/main.tsx). Changing an iframe's src reloads it; a brief reload
  // on theme toggle is an acceptable, honest cost for a genuinely separate embedded app.
  const [dark, setDark] = useState(readAmbientDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(readAmbientDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = rebarRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setHeight(Math.round(rect.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
      <Stack gap="xs" style={{ flex: "1 1 380px", minWidth: 0 }}>
        <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)", textAlign: "center" }}>
          Rebar (live — toggle the theme via 🔧 DevTools)
        </Text>
        <div ref={rebarRef}>
          <LivePreview>{rebar}</LivePreview>
        </div>
      </Stack>
      <Stack gap="xs" style={{ flex: "1 1 380px", minWidth: 0 }}>
        <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)", textAlign: "center" }}>
          → migrated to Ant Design (live — a real, separate build)
        </Text>
        <Box style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 4, overflow: "hidden" }}>
          <iframe
            src={`${iframeSrc}?theme=${dark ? "dark" : "light"}`}
            title={iframeTitle}
            style={{ width: "100%", height: height ?? 300, border: "none", display: "block" }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
