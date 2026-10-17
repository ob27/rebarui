import { useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { Image } from "./Image";

export interface ImagePickerItem {
  id: string;
  src: string;
  /** Tiny placeholder; tiles blur up through `Image`. */
  thumbSrc?: string;
  alt: string;
  tags?: string[];
  /** This tile can't be chosen. */
  disabled?: boolean;
}

export interface ImagePickerProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  items: ImagePickerItem[];
  /** Controlled selection (`null` for none). Omit for uncontrolled with `defaultSelectedId`. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  /** Fires on tile press. Single select. */
  onSelect?: (item: ImagePickerItem) => void;
  /** This tile shows a spinner and every tile ignores presses until it clears. */
  busyId?: string | null;
  /** Default 3. */
  columns?: 3 | 4;
  /** Renders the tag chip row above the grid, with an "All" chip first. Omit for no filter. */
  tags?: string[];
  /** Controlled tag (`null` = all). Items are filtered to it. */
  activeTag?: string | null;
  defaultActiveTag?: string | null;
  onTagChange?: (tag: string | null) => void;
  /** Label of the first chip. Default "All". */
  allLabel?: string;
  /** `"icon"`: 22% superellipse tiles for app icons. */
  shape?: "square" | "icon";
  loading?: boolean;
  /** Tags toggle independently (several can be on at once) and the grid shows items that carry every active tag (or any of them with `tagMatch="any"`). "All" clears them. */
  multiTag?: boolean;
  /** Controlled active tags for `multiTag`. */
  activeTags?: string[];
  defaultActiveTags?: string[];
  onActiveTagsChange?: (tags: string[]) => void;
  /** How `multiTag` combines tags. Default `"all"`. */
  tagMatch?: "all" | "any";
  /** Every tile (and the tag chips) ignores presses and reads as disabled. */
  disabled?: boolean;
  /** Shown instead of the grid, with a retry button when `onRetry` is passed. */
  error?: ReactNode;
  onRetry?: () => void;
  /** Shown when no item matches. Defaults to a message plus a Clear filter button while a tag is active. */
  empty?: ReactNode;
}

/**
 * A grid of selectable image tiles with an optional tag filter; also the app-icon picker
 * (`shape="icon"`). Synthetic: composes `Image` (thumbSrc blur-up, lazy) into a static grid of
 * toggle buttons; selection and tag state only mirror a controlled/uncontrolled value.
 */
export function ImagePicker({
  items,
  selectedId,
  defaultSelectedId = null,
  onSelect,
  busyId = null,
  columns = 3,
  tags,
  activeTag,
  defaultActiveTag = null,
  onTagChange,
  allLabel = "All",
  multiTag = false,
  activeTags,
  defaultActiveTags = [],
  onActiveTagsChange,
  tagMatch = "all",
  disabled = false,
  shape = "square",
  loading,
  error,
  onRetry,
  empty,
  className,
  ...props
}: ImagePickerProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(defaultSelectedId);
  const [internalTag, setInternalTag] = useState<string | null>(defaultActiveTag);
  const selected = selectedId !== undefined ? selectedId : internalSelected;
  const tag = activeTag !== undefined ? activeTag : internalTag;

  const [internalTags, setInternalTags] = useState<string[]>(defaultActiveTags);
  const tagList = activeTags !== undefined ? activeTags : internalTags;
  const setTagList = (next: string[]) => {
    if (activeTags === undefined) setInternalTags(next);
    onActiveTagsChange?.(next);
  };
  const toggleTag = (t: string | null) => {
    if (disabled) return;
    if (t === null) return setTagList([]);
    setTagList(tagList.includes(t) ? tagList.filter((x) => x !== t) : [...tagList, t]);
  };
  const setTag = (next: string | null) => {
    if (activeTag === undefined) setInternalTag(next);
    onTagChange?.(next);
  };
  const choose = (item: ImagePickerItem) => {
    if (busyId || disabled || item.disabled) return;
    if (selectedId === undefined) setInternalSelected(item.id);
    onSelect?.(item);
  };

  const filtering = multiTag ? tagList.length > 0 : Boolean(tag);
  const visible =
    !tags || !filtering
      ? items
      : multiTag
        ? items.filter((i) =>
            tagMatch === "any" ? tagList.some((t) => i.tags?.includes(t)) : tagList.every((t) => i.tags?.includes(t)),
          )
        : items.filter((i) => i.tags?.includes(tag as string));
  const filterLabel = multiTag ? tagList.join(" + ") : tag;

  let body: ReactNode;
  if (error) {
    body = (
      <div className="rebar-image-picker-message" data-rebar-part="error" role="alert">
        <b>{error}</b>
        {onRetry ? (
          <button type="button" className="rebar-image-picker-action" onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </div>
    );
  } else if (loading) {
    body = (
      <div className="rebar-image-picker-grid" data-rebar-part="grid" data-rebar-loading="true" aria-busy="true">
        {Array.from({ length: columns * 3 }, (_, i) => (
          <span key={i} className="rebar-image-picker-tile" data-rebar-skeleton="true" aria-hidden="true" />
        ))}
      </div>
    );
  } else if (visible.length === 0) {
    body = (
      <div className="rebar-image-picker-message" data-rebar-part="empty">
        {empty ?? <b>{filtering ? `No images for “${filterLabel}”` : "No images"}</b>}
        {!empty && filtering ? (
          <button type="button" className="rebar-image-picker-action" onClick={() => (multiTag ? toggleTag(null) : setTag(null))}>
            Clear filter
          </button>
        ) : null}
      </div>
    );
  } else {
    body = (
      <div className="rebar-image-picker-grid" data-rebar-part="grid" role="group" aria-label="Images">
        {visible.map((item) => {
          const isSel = selected === item.id;
          const isBusy = busyId === item.id;
          const isOff = disabled || item.disabled;
          return (
            <button
              key={item.id}
              type="button"
              className="rebar-image-picker-tile"
              data-rebar-part="tile"
              data-rebar-state={isBusy ? "busy" : isSel ? "selected" : undefined}
              aria-pressed={isSel}
              aria-label={item.alt}
              aria-busy={isBusy || undefined}
              aria-disabled={(busyId && !isBusy) || isOff ? true : undefined}
              data-rebar-disabled={isOff ? "true" : undefined}
              onClick={() => choose(item)}
            >
              <Image src={item.src} thumbSrc={item.thumbSrc} alt="" fallbackColor="var(--rebar-color-tint-2)" />
              {isSel && !isBusy ? (
                <span className="rebar-image-picker-check" data-rebar-part="check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : null}
              {isBusy ? <span className="rebar-image-picker-busy" data-rebar-part="busy" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={clsx("rebar-image-picker", className)}
      data-rebar-component="image-picker"
      data-rebar-shape={shape}
      data-rebar-columns={columns}
      data-rebar-disabled={disabled ? "true" : undefined}
      {...props}
    >
      {tags ? (
        <div className="rebar-image-picker-tags" data-rebar-part="tags" role="group" aria-label="Filter by tag">
          {[null, ...tags].map((t) => (
            <button
              key={t ?? "__all"}
              type="button"
              className="rebar-image-picker-chip"
              data-rebar-part="chip"
              aria-pressed={multiTag ? (t === null ? tagList.length === 0 : tagList.includes(t)) : tag === t}
              aria-disabled={disabled || undefined}
              onClick={() => (disabled ? undefined : multiTag ? toggleTag(t) : setTag(t))}
            >
              {t ?? allLabel}
            </button>
          ))}
        </div>
      ) : null}
      {body}
    </div>
  );
}
