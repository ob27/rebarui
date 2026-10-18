import { NEW_CONSTRUCTS } from "@/data/newConstructs";
import type { Tier } from "@/data/tier.types";
import { tierDocsShellSections } from "@/data/tierSections";

export interface GalleryEntry {
  /** Anchor id: the construct's kebab-case slug, e.g. "button" (so /imitations#button lands on its card). */
  slug: string;
  label: string;
  /** Its reference page. */
  href: string;
  category?: string;
  isNew: boolean;
  /** First letter, for the A-Z jump strip. */
  letter: string;
}

const kebab = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

/**
 * Sidebar entries whose own page does not exist (the "scroll-rail" block has no page of its own; the ScrollRail component it renders
 * is documented under Opinions). The card links to the page that does exist.
 */
const PAGE_OVERRIDES: Record<string, string> = { "/synthetics/scroll-rail": "/opinions/scroll-rail" };

/**
 * Every construct in a tier that has a reference page, in the sidebar's own order and from the same table, with a unique anchor
 * slug. Entries marked "No reference page" are left out (nothing to link to).
 */
export function galleryEntries(tier: Tier): GalleryEntry[] {
  const seen = new Set<string>();
  const out: GalleryEntry[] = [];
  for (const s of tierDocsShellSections(tier).slice(1)) {
    if (s.status === "No reference page") continue;
    const last = s.href.split("/").filter(Boolean).pop() ?? "";
    let slug = kebab(last || s.label);
    while (seen.has(slug)) slug = `${slug}-2`;
    seen.add(slug);
    out.push({ slug, label: s.label, href: PAGE_OVERRIDES[s.href] ?? s.href, category: s.category, isNew: NEW_CONSTRUCTS.has(s.label), letter: s.label.charAt(0).toUpperCase() });
  }
  return out;
}
