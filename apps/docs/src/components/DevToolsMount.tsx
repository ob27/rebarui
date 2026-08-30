"use client";

import dynamic from "next/dynamic";

/**
 * Deliberately mounted in production too, on this site only — this is the marketing/docs site
 * for the panel itself, so the panel stays visible as part of the pitch (component counts,
 * theme/dark toggle, migration-effort and token-estimate numbers, ComponentInspector). This is
 * NOT the general guidance: see /docs/devtools, which still tells a real consuming app to gate
 * this behind `NODE_ENV === 'development'` in its own app code (RebarDevTools's own internal
 * NODE_ENV check isn't enough on its own to keep it out of a production bundle — Turbopack
 * doesn't fold that check inside bundled node_modules code the way it does for app-owned source
 * — verified empirically by grepping .next/static/chunks after a production build).
 */
const RebarDevTools = dynamic(
  () => import("@rebar-ui/devtools").then((mod) => mod.RebarDevTools),
  { ssr: false },
);

export function DevToolsMount() {
  return <RebarDevTools />;
}
