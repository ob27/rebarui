"use client";

import dynamic from "next/dynamic";

/**
 * The internal `NODE_ENV === 'development'` check inside RebarDevTools itself is not enough
 * to keep it out of production bundles — verified empirically (grepped .next/static/chunks
 * after a production build; the panel's strings and useComponentCounts logic were present).
 * Turbopack does not fold process.env.NODE_ENV checks inside bundled node_modules code the
 * way it does for app-owned source, so nothing gets eliminated there.
 *
 * The reliable pattern: evaluate the environment check here, in app code, and only issue the
 * dynamic import() when true. Since the condition is resolved in a module Next's own build
 * treats as first-party, the dead branch (and therefore the import) is actually eliminated.
 */
const RebarDevTools =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@rebar-ui/devtools").then((mod) => mod.RebarDevTools), {
        ssr: false,
      })
    : () => null;

export function DevToolsMount() {
  return <RebarDevTools />;
}
