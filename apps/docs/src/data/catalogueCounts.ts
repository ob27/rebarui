import { galleryEntries } from "@/components/docs/tierGallery";

/** The tiers whose constructs have reference pages (a Genesis is a whole app, not a construct). */
const LISTED_TIERS = ["imitation", "synthetic", "opinion", "order"] as const;

/**
 * How many constructs the site lists, across the four tiers. Every count shown in copy (the home page, the roadmap) comes from here,
 * which reads the same table as each tier page's "All N" heading and the sidebar (`galleryEntries`), so no number is typed into text.
 */
export function totalConstructs(): number {
  return LISTED_TIERS.reduce((n, t) => n + galleryEntries(t).length, 0);
}
