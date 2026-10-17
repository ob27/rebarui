import { forwardRef, useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Box, Button, FilterBar } from "rebar-ui";

/**
 * A `<header>` that publishes its own rendered height as `--rebar-header-height` on `<html>`, so a page
 * can clear it: `useHashTarget({ offset: "auto" })` reads it for `scroll-margin-top`, and a sticky
 * sub-nav can sit under it. Kept current with a ResizeObserver and removed on unmount.
 */
export const HeaderHeightBox = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div"> & { as?: ElementType }>(
  function HeaderHeightBox(props, outerRef) {
    const innerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const root = document.documentElement;
      const publish = () => root.style.setProperty("--rebar-header-height", `${Math.round(el.getBoundingClientRect().height)}px`);
      publish();
      if (typeof ResizeObserver === "undefined") return () => root.style.removeProperty("--rebar-header-height");
      const observer = new ResizeObserver(publish);
      observer.observe(el);
      return () => {
        observer.disconnect();
        root.style.removeProperty("--rebar-header-height");
      };
    }, []);
    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          innerRef.current = node;
          if (typeof outerRef === "function") outerRef(node);
          else if (outerRef) outerRef.current = node;
        }}
        {...props}
      />
    );
  },
);

export interface FilterBarBlockProps {
  searchPlaceholder?: string;
  pills?: string[];
  pillsLabel?: string;
  sortOptions?: string[];
  sortLabel?: string;
  resultCount?: { count: number; noun?: string; plural?: string };
  actionLabel?: string;
  path: string;
}

/** The new-style `filter-bar` block: search pill, filter pills, sort and a result count (see `FilterBar`). */
export function FilterBarBlock({
  searchPlaceholder,
  pills,
  pillsLabel,
  sortOptions,
  sortLabel,
  resultCount,
  actionLabel,
  path,
}: FilterBarBlockProps): ReactNode {
  return (
    <FilterBar
      search
      searchPlaceholder={searchPlaceholder ?? "Search"}
      options={pills?.map((label) => ({ value: label, label }))}
      filterLabel={pillsLabel}
      sortOptions={sortOptions?.map((label) => ({ value: label, label }))}
      sortLabel={sortLabel}
      count={resultCount?.count}
      noun={resultCount?.noun}
      plural={resultCount?.plural}
      actions={actionLabel ? <Button variant="primary">{actionLabel}</Button> : undefined}
      data-rebar-placement-block="filter-bar"
      data-rebar-block-path={path}
    />
  );
}
