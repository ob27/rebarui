import { useEffect, useState } from "react";

// Kept out of Avatar.tsx deliberately: react-docgen-typescript (which generates the docs site's
// props tables from every export in each COMPONENT_FILES entry) treats any exported function in
// that file as a potential component, which polluted the generated component list with these two
// plain helper functions. Exported here (not re-exported from index.ts) purely so tests can
// verify the selection logic directly — Radix's Avatar.Image never actually renders in jsdom (it
// defers to a real image load, which jsdom can't do), so there's no other way to observe which
// placeholder got picked.

export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolvePlaceholderSrc(
  placeholder: boolean | number | undefined,
  fallback: string,
  list: readonly string[],
): string | undefined {
  // Not a plain truthiness check: placeholder={0} must mean "index 0," not "unset" — 0 is falsy.
  if (placeholder === undefined || placeholder === false) return undefined;
  const index = typeof placeholder === "number" ? placeholder : hashString(fallback);
  return list[index % list.length];
}

// The portraits are ~650 KB of embedded images. They live in their own module and are fetched the
// first time a placeholder is actually asked for, so an app that never uses `placeholder` (or only
// renders real `src` images) never downloads them. Until they arrive the avatar shows its fallback.
let loaded: readonly string[] | undefined;
let loading: Promise<readonly string[]> | undefined;

function loadPlaceholders(): Promise<readonly string[]> {
  loading ??= import("../assets/avatarPlaceholders").then((m) => (loaded = m.AVATAR_PLACEHOLDERS));
  return loading;
}

export function useAvatarPlaceholderSrc(placeholder: boolean | number | undefined, fallback: string): string | undefined {
  const wanted = placeholder !== undefined && placeholder !== false;
  const [list, setList] = useState<readonly string[] | undefined>(loaded);

  useEffect(() => {
    if (!wanted || list) return;
    let live = true;
    void loadPlaceholders().then((l) => {
      if (live) setList(l);
    });
    return () => {
      live = false;
    };
  }, [wanted, list]);

  return wanted && list ? resolvePlaceholderSrc(placeholder, fallback, list) : undefined;
}
