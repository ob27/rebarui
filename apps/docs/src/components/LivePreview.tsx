"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

function readAmbientTheme(): "sketch" | "clean" {
  if (typeof document === "undefined") return "clean";
  return document.documentElement.getAttribute("data-rebar-theme") === "sketch" ? "sketch" : "clean";
}

/**
 * A small demo panel that mirrors whatever the page's real theme currently is (read from
 * <html data-rebar-theme>, kept in sync via a MutationObserver). No local Sketch/Clean toggle of
 * its own — DevTools' floating panel (🔧) already controls that attribute globally, and this
 * project's dev build always has it available, so a second, redundant toggle in the page body
 * only duplicated a control that already existed one click away.
 */
export function LivePreview({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"sketch" | "clean">(readAmbientTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readAmbientTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-rebar-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-rebar-theme={theme}
      style={{
        border: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
        borderRadius: 4,
        padding: "var(--rebar-space-lg, 24px)",
      }}
    >
      {children}
    </div>
  );
}
