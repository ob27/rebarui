import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { Select } from "./Select";

export interface FilterPillOption {
  value: string;
  label: ReactNode;
  /** Number of results behind this option, shown small after the label. */
  count?: number;
}

export interface FilterPillsProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  options: FilterPillOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the group. Default `"Filter"`. */
  "aria-label"?: string;
  /** Keep the pills on one line and scroll sideways (phones). Default `false`: they wrap. */
  scroll?: boolean;
}

/**
 * Single-select pills with an optional count each. Imitation: reimplements a raw `<button aria-pressed>`
 * rather than importing `Button`, like `Pagination` and `SegmentedControl`.
 */
export const FilterPills = forwardRef<HTMLDivElement, FilterPillsProps>(function FilterPills(
  { options, value, defaultValue, onValueChange, scroll = false, className, "aria-label": ariaLabel = "Filter", ...props },
  ref,
) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const choose = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={clsx("rebar-filter-pills", className)}
      data-rebar-component="filter-pills"
      data-rebar-scroll={scroll ? "true" : "false"}
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="rebar-filter-pill"
          data-rebar-part="pill"
          data-rebar-state={option.value === current ? "selected" : "idle"}
          aria-pressed={option.value === current}
          onClick={() => choose(option.value)}
        >
          {option.label}
          {option.count !== undefined ? (
            <small className="rebar-filter-pill-count" data-rebar-part="count">
              {option.count}
            </small>
          ) : null}
        </button>
      ))}
    </div>
  );
});

export interface ResultCountProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  count: number;
  /** Singular noun. Default `"result"`; the plural adds an `s` unless `plural` is given. */
  noun?: string;
  plural?: string;
  /** The search text, quoted in the sentence. */
  query?: string;
  /** The active category label, appended as "in X". Leave undefined for "all". */
  filter?: string;
  /** Renders a "Clear filters" button when given and a query or filter is active. */
  onClear?: () => void;
  clearLabel?: string;
}

/** A polite live region saying how many results match, e.g. "9 Perspectives in Ethics", with a Clear filters button. Imitation. */
export const ResultCount = forwardRef<HTMLDivElement, ResultCountProps>(function ResultCount(
  { count, noun = "result", plural, query, filter, onClear, clearLabel = "Clear filters", className, ...props },
  ref,
) {
  const word = count === 1 ? noun : (plural ?? `${noun}s`);
  const active = Boolean(query) || Boolean(filter);
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={clsx("rebar-result-count", className)}
      data-rebar-component="result-count"
      {...props}
    >
      <span data-rebar-part="text">
        <b>{count}</b> {word}
        {query ? <> for &ldquo;{query}&rdquo;</> : null}
        {filter ? <> in {filter}</> : null}
      </span>
      {onClear && active ? (
        <button type="button" className="rebar-result-count-clear" data-rebar-part="clear" onClick={onClear}>
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
});

export interface FilterBarSortOption {
  value: string;
  label: string;
}

export interface FilterBarProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  /** Show the search field. On by default when `searchValue`, `defaultSearchValue` or `onSearchChange` is given. */
  search?: boolean;
  /** Search text (controlled). */
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Accessible name of the search field. Default `"Search"`. */
  searchLabel?: string;
  /** Filter pills. */
  options?: FilterPillOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the pill group. Default `"Filter"`. */
  filterLabel?: string;
  /** Scroll the pills sideways instead of wrapping. */
  scrollPills?: boolean;
  /** The sort slot. A pill-shaped `Select` with a muted label. */
  sortOptions?: FilterBarSortOption[];
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  /** Muted label before the sort value, also its accessible name. Default `"Sort"`. */
  sortLabel?: string;
  /** Number of results now shown. Renders a `ResultCount` under the bar. */
  count?: number;
  noun?: string;
  plural?: string;
  /** Right-aligned extra controls beside the sort (a view toggle, an Add button). */
  actions?: ReactNode;
  /** Called by "Clear filters". It should reset the search and the pills. The link shows only while a query or a non-first pill is active. */
  onClear?: () => void;
}

/**
 * Search pill, filter pills, sort and a result count in one bar. Synthetic: composes `Select` (sort) and
 * the `FilterPills`/`ResultCount` parts, and mirrors the search text into its clear button. Every value
 * is controlled or uncontrolled. Pair it with `Empty` when `count` is 0.
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    search: searchProp,
    searchValue,
    defaultSearchValue = "",
    onSearchChange,
    searchPlaceholder = "Search",
    searchLabel = "Search",
    options,
    value,
    defaultValue,
    onValueChange,
    filterLabel = "Filter",
    scrollPills = false,
    sortOptions,
    sortValue,
    defaultSortValue,
    onSortChange,
    sortLabel = "Sort",
    count,
    noun,
    plural,
    actions,
    onClear,
    className,
    ...props
  },
  ref,
) {
  const showSearch = searchProp ?? (searchValue !== undefined || onSearchChange !== undefined || defaultSearchValue !== "");
  const [innerSearch, setInnerSearch] = useState(defaultSearchValue);
  const searchText = searchValue ?? innerSearch;
  const [innerPill, setInnerPill] = useState(defaultValue ?? options?.[0]?.value);
  const pill = value ?? innerPill;
  const firstPill = options?.[0]?.value;
  const activeOption = options?.find((o) => o.value === pill);
  const filterActive = options && pill !== firstPill ? activeOption : undefined;
  const filterText = filterActive && typeof filterActive.label === "string" ? filterActive.label : undefined;

  const setSearch = (next: string) => {
    if (searchValue === undefined) setInnerSearch(next);
    onSearchChange?.(next);
  };
  const choosePill = (next: string) => {
    if (value === undefined) setInnerPill(next);
    onValueChange?.(next);
  };
  const clearAll = () => {
    setSearch("");
    if (firstPill !== undefined) choosePill(firstPill);
    onClear?.();
  };

  return (
    <div
      ref={ref}
      className={clsx("rebar-filter-bar", className)}
      data-rebar-component="filter-bar"
      {...props}
    >
      {showSearch || sortOptions || actions ? (
        <div className="rebar-filter-bar-row" data-rebar-part="row">
          {showSearch ? (
            <div className="rebar-filter-bar-search" data-rebar-part="search">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                type="search"
                value={searchText}
                placeholder={searchPlaceholder}
                aria-label={searchLabel}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && searchText) {
                    event.preventDefault();
                    setSearch("");
                  }
                }}
              />
              {searchText ? (
                <button
                  type="button"
                  className="rebar-filter-bar-clear"
                  data-rebar-part="clear-search"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <span aria-hidden="true">&#10005;</span>
                </button>
              ) : null}
            </div>
          ) : null}
          {sortOptions ? (
            <div className="rebar-filter-bar-sort" data-rebar-part="sort">
              <span aria-hidden="true">{sortLabel}</span>
              <Select
                aria-label={sortLabel}
                options={sortOptions}
                value={sortValue}
                defaultValue={sortValue === undefined ? (defaultSortValue ?? sortOptions[0]?.value) : undefined}
                onValueChange={onSortChange}
              />
            </div>
          ) : null}
          {actions}
        </div>
      ) : null}
      {options ? (
        <FilterPills
          aria-label={filterLabel}
          options={options}
          value={pill}
          onValueChange={choosePill}
          scroll={scrollPills}
        />
      ) : null}
      {count !== undefined ? (
        <ResultCount
          count={count}
          noun={noun}
          plural={plural}
          query={searchText || undefined}
          filter={filterText}
          onClear={clearAll}
        />
      ) : null}
    </div>
  );
});
