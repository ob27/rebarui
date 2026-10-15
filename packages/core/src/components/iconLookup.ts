import type { ComponentType } from "react";
import { ICON_REGISTRY } from "./iconRegistry";
import type { IconProps } from "./iconFactory";

let index: Map<string, ComponentType<IconProps>> | undefined;

/** Case-, dash-, underscore- and space-insensitive key: `"home-heart"` and `"HomeHeartIcon"` both reduce to prefixes of `"homehearticon"`. */
function key(name: string): string {
  return name.trim().toLowerCase().replace(/[-_\s]+/g, "");
}

function buildIndex() {
  const map = new Map<string, ComponentType<IconProps>>();
  // ICON_REGISTRY lists the curated set first, then RemixIcon, then Ant Design, so on a collision
  // the earlier (higher-priority) entry wins.
  for (const entry of ICON_REGISTRY) {
    const k = key(entry.name);
    if (!map.has(k)) map.set(k, entry.Icon);
  }
  return map;
}

/**
 * Looks an icon component up by name in the icon sets core ships (`ICON_REGISTRY`). Accepts the
 * exact export name (`"CalendarIcon"`, `"EnterOutlined"`) or a short form that is
 * case/dash/underscore-insensitive and may drop the suffix: `"calendar"`, `"home-heart"`, `"Lock"`.
 * Returns `undefined` for an unknown name, never throws.
 */
export function getIconByName(name: string | undefined): ComponentType<IconProps> | undefined {
  if (!name) return undefined;
  index ??= buildIndex();
  const k = key(name);
  return index.get(k) ?? index.get(`${k}icon`) ?? index.get(`${k}outlined`);
}
