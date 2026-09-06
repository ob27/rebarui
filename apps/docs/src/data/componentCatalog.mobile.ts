import type { CatalogComponent } from "./componentCatalog.types";

// See componentCatalog.web.ts for sourcing methodology. General mobile ports of web components
// (mobile Button, Switch, Card, etc.) are deliberately excluded — they appeared constantly across
// the surveyed libraries but add no new interaction pattern beyond what rebar-ui already has.
//
// Every entry originally catalogued here has shipped as a real `packages/core` component:
// Action Sheet, Bottom Sheet, Tab Bar, Pull-to-Refresh, Picker Wheel, and Swipe Actions — see
// /components/action-sheet, /components/bottom-sheet, /components/mobile-tab-bar,
// /components/pull-to-refresh, /components/picker-wheel, and /components/swipe-actions.
export const MOBILE_CATALOG: CatalogComponent[] = [];
