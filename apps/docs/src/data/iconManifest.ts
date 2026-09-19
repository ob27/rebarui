/**
 * `/imitations/icon`'s own gallery data — re-exports `rebar-ui`'s real `ICON_REGISTRY` (built in
 * `packages/core/src/components/icons.tsx` from the curated set plus the two generated bulk files)
 * rather than hand-listing all 1,835 icons a second time here. `ICON_SOURCE_INFO` stays local since
 * it's pure docs-page presentation (license label + link), not something a consumer of the
 * published package needs.
 */
export { ICON_REGISTRY as ICON_MANIFEST } from "rebar-ui";
export type { IconSource, IconRegistryEntry as IconManifestEntry } from "rebar-ui";

import type { IconSource } from "rebar-ui";

export const ICON_SOURCE_INFO: Record<IconSource, { license: string; url: string }> = {
  RemixIcon: { license: "Apache License 2.0", url: "https://remixicon.com" },
  "Ant Design": { license: "MIT License", url: "https://ant-design.antgroup.com/components/icon" },
};
