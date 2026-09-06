export type CatalogCategory = "web" | "mobile" | "diagram";

export interface CatalogComponent {
  slug: string;
  name: string;
  category: CatalogCategory;
  description: string;
  sources: string[];
  /** A caveat the research pass itself flagged — thin evidence, or arguably not a new primitive. */
  note?: string;
}
