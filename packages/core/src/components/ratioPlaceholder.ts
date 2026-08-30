import { RATIO_PLACEHOLDERS } from "../assets/ratioPlaceholders";

// Kept out of AspectRatio.tsx for the same reason avatarPlaceholder.ts is separate from
// Avatar.tsx: react-docgen-typescript (which generates the docs site's props tables from every
// export in each COMPONENT_FILES entry) treats any exported function in that file as a potential
// component. Exported here (not re-exported from index.ts) purely so tests can verify the
// selection logic directly.

/** Picks the embedded placeholder whose own ratio is numerically closest to the one requested. */
export function resolveRatioPlaceholder(ratio: number): string {
  let closestSrc = RATIO_PLACEHOLDERS[0]!.src;
  let closestDiff = Infinity;
  for (const candidate of RATIO_PLACEHOLDERS) {
    const diff = Math.abs(candidate.ratio - ratio);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestSrc = candidate.src;
    }
  }
  return closestSrc;
}
