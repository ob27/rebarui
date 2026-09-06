import { WEB_CATALOG } from "./componentCatalog.web";
import { MOBILE_CATALOG } from "./componentCatalog.mobile";
import { DIAGRAM_CATALOG } from "./componentCatalog.diagrams";

export type { CatalogCategory, CatalogComponent } from "./componentCatalog.types";

export const CATALOG_COMPONENTS = [...WEB_CATALOG, ...MOBILE_CATALOG, ...DIAGRAM_CATALOG];

export const CATALOG_BY_SLUG = new Map(CATALOG_COMPONENTS.map((c) => [c.slug, c]));
