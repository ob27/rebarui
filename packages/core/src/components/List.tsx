import { Children, createContext, forwardRef, useContext, useEffect, useId, useState } from "react";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import clsx from "clsx";
import { Text } from "./Text";
import { defaultRenderLink } from "./linkAdapter";
import type { RenderLink } from "./linkAdapter";

export type ListVariant = "cards" | "grouped" | "plain";

const ListContext = createContext<ListVariant>("cards");

export interface ListProps extends Omit<ComponentPropsWithoutRef<"ul">, "children"> {
  /** `"cards"`: each row its own rounded card with a gap. `"grouped"`: one rounded container with hairline dividers (settings). `"plain"`: no container. Default `"cards"`. */
  variant?: ListVariant;
  /** Shown instead of the rows when there are no children (and `loading` is off). */
  empty?: ReactNode;
  /** Shows four skeleton rows. */
  loading?: boolean;
  children?: ReactNode;
}

/**
 * The row family for phone screens: thumbnail rows, settings rows and navigation cards. Synthetic: a static
 * composition of rows, with no state of its own. The rows are `ListItem`s in a real `<ul>`.
 */
export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { variant = "cards", empty, loading, className, children, ...props },
  ref,
) {
  const hasRows = Children.toArray(children).length > 0;
  if (!loading && !hasRows && empty !== undefined) {
    return (
      <div className={clsx("rebar-list-empty", className)} data-rebar-component="list" data-rebar-variant={variant} data-rebar-state="empty">
        {empty}
      </div>
    );
  }
  return (
    <ListContext.Provider value={variant}>
      <ul
        ref={ref}
        className={clsx("rebar-list", className)}
        data-rebar-component="list"
        data-rebar-variant={variant}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading
          ? [0, 1, 2, 3].map((i) => <ListItem key={i} skeleton title="" />)
          : children}
      </ul>
    </ListContext.Provider>
  );
});

export interface ListSectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** The uppercase tracked eyebrow above the group (`Text variant="eyebrow"`). */
  title?: ReactNode;
  /** A helper paragraph under the group. */
  footer?: ReactNode;
  children?: ReactNode;
}

/** A titled group of rows: an eyebrow, a `List`, an optional footer paragraph. */
export function ListSection({ title, footer, className, children, ...props }: ListSectionProps) {
  const uid = useId();
  return (
    <section
      className={clsx("rebar-list-section", className)}
      data-rebar-component="list-section"
      aria-labelledby={title ? `${uid}-title` : undefined}
      {...props}
    >
      {title ? (
        <Text as="h3" variant="eyebrow" id={`${uid}-title`} data-rebar-part="title" className="rebar-list-section-title">
          {title}
        </Text>
      ) : null}
      {children}
      {footer ? (
        <Text as="p" size="sm" color="secondary" data-rebar-part="footer" className="rebar-list-section-footer">
          {footer}
        </Text>
      ) : null}
    </section>
  );
}

export interface ListItemProps extends Omit<ComponentPropsWithoutRef<"li">, "title" | "onClick"> {
  /** Primary text; wraps up to three lines. */
  title: ReactNode;
  /** Serif in cards, sans in grouped rows. Default serif when `media` is present, sans otherwise. */
  titleStyle?: "serif" | "sans";
  /** Secondary line (a hint, helper text). Wraps. */
  description?: ReactNode;
  /** Another secondary line (a date). Wraps. */
  meta?: ReactNode;
  /** A 56px thumbnail, avatar or icon slot. Use `Image` with `thumbSrc` and `fallbackColor`. */
  media?: ReactNode;
  /** An icon tile (a navigation card) when you do not need a thumbnail: a node, or `{ icon, tone }` with a tint 1 to 4. */
  leading?: ReactNode | { icon: ReactNode; tone?: 1 | 2 | 3 | 4 };
  /** `"chevron"`, `"more"` (a round ••• button, handled by `onMore`), or any node: a `Switch`, a `RadioGroup` item, a value pill, an `ActionSheet` trigger. A trailing control never triggers the row. */
  trailing?: ReactNode | "chevron" | "more";
  /** Called by the `"more"` trailing button. */
  onMore?: () => void;
  /** Accessible name of the `"more"` button. Default "More actions". */
  moreLabel?: string;
  /** The whole row is a link. Standard link adapter shared with `Card`, `Button` and `ActionSheet` items. */
  href?: string;
  /** Anchor `target`, with `href`. */
  target?: string;
  /** Link adapter for `href` (`NavBar`'s `renderLink` shape). */
  renderLink?: RenderLink;
  /** The whole row is a button. Mutually exclusive with `href`. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Primary outline: the open item in a master list. */
  selected?: boolean;
  /** Outline plus tint and, for `"new"`, a New chip: "just added". Clears itself after 4 seconds unless `highlightPinned`. */
  highlight?: boolean | "new";
  /** Keeps the highlight until `highlight` goes false. */
  highlightPinned?: boolean;
  /** Called when an unpinned highlight clears itself. */
  onHighlightEnd?: () => void;
  /** Busy: dimmed, a trailing spinner, pointer events off, `aria-busy`. */
  loading?: boolean;
  /** Placeholder bars in the row shape. */
  skeleton?: boolean;
  /** Dimmed and not focusable. */
  disabled?: boolean;
}

const HIGHLIGHT_MS = 4000;

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function MoreDots() {
  return (
    <svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="currentColor" aria-hidden="true" focusable="false">
      <circle cx="5.5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="18.5" cy="12" r="1.8" />
    </svg>
  );
}

function isTile(v: unknown): v is { icon: ReactNode; tone?: 1 | 2 | 3 | 4 } {
  return typeof v === "object" && v !== null && !Array.isArray(v) && "icon" in v && !("$$typeof" in v);
}

/**
 * One row. The row's own area (media, text) is the link or button; trailing controls sit beside it,
 * never inside it, so a `Switch` or a menu button is never nested in an interactive element.
 */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  {
    title,
    titleStyle,
    description,
    meta,
    media,
    leading,
    trailing,
    onMore,
    moreLabel = "More actions",
    href,
    target,
    renderLink = defaultRenderLink,
    onClick,
    selected,
    highlight,
    highlightPinned,
    onHighlightEnd,
    loading,
    skeleton,
    disabled,
    className,
    ...props
  },
  ref,
) {
  const variant = useContext(ListContext);
  const [highlightOn, setHighlightOn] = useState(Boolean(highlight));
  useEffect(() => {
    setHighlightOn(Boolean(highlight));
    if (!highlight || highlightPinned) return;
    const timer = setTimeout(() => {
      setHighlightOn(false);
      onHighlightEnd?.();
    }, HIGHLIGHT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight, highlightPinned]);

  const style = titleStyle ?? (media ? "serif" : "sans");
  const interactive = !skeleton && !disabled && !loading && (href !== undefined || onClick !== undefined);
  const rootMarks = {
    "data-rebar-component": "list-item",
    "data-rebar-variant": variant,
    "data-rebar-title-style": style,
    "data-rebar-selected": selected ? "true" : undefined,
    "data-rebar-highlight": highlightOn ? "true" : undefined,
    "data-rebar-state": skeleton ? "skeleton" : loading ? "loading" : disabled ? "disabled" : undefined,
    "aria-busy": loading || undefined,
  };

  if (skeleton) {
    return (
      <li ref={ref} className={clsx("rebar-list-item", className)} aria-hidden="true" {...rootMarks} {...props}>
        <span className="rebar-list-item-main">
          <span className="rebar-list-item-thumb rebar-list-item-bar" data-rebar-part="media" />
          <span className="rebar-list-item-body" data-rebar-part="body">
            <span className="rebar-list-item-bar" style={{ width: "88%" }} />
            <span className="rebar-list-item-bar" style={{ width: "52%" }} />
          </span>
        </span>
      </li>
    );
  }

  const tile = isTile(leading) ? leading : undefined;
  const lead = tile ? (
    <span className="rebar-list-item-tile" data-rebar-part="leading" data-rebar-tone={tile.tone ?? 1} aria-hidden="true">
      {tile.icon}
    </span>
  ) : leading ? (
    <span className="rebar-list-item-tile" data-rebar-part="leading" data-rebar-tone="1">
      {leading as ReactNode}
    </span>
  ) : null;

  const chevron = trailing === "chevron";
  const mainChildren = (
    <>
      {media ? (
        <span className="rebar-list-item-thumb" data-rebar-part="media">
          {media}
        </span>
      ) : null}
      {lead}
      <span className="rebar-list-item-body" data-rebar-part="body">
        <span className="rebar-list-item-title" data-rebar-part="title">
          {title}
          {highlightOn && highlight === "new" ? (
            <span className="rebar-list-item-chip" data-rebar-part="chip">
              New
            </span>
          ) : null}
        </span>
        {description ? (
          <span className="rebar-list-item-description" data-rebar-part="description">
            {description}
          </span>
        ) : null}
        {meta ? (
          <span className="rebar-list-item-meta" data-rebar-part="meta">
            {meta}
          </span>
        ) : null}
      </span>
      {chevron ? (
        <span className="rebar-list-item-chevron" data-rebar-part="chevron" aria-hidden="true">
          <Chevron />
        </span>
      ) : null}
    </>
  );

  const mainProps = {
    className: "rebar-list-item-main",
    "data-rebar-part": "main",
    "aria-current": selected ? ("true" as const) : undefined,
  };
  let main: ReactNode;
  if (interactive && href !== undefined) {
    main = renderLink({ ...mainProps, href, target, children: mainChildren, onClick } as never);
  } else if (interactive) {
    main = (
      <button type="button" {...mainProps} onClick={onClick}>
        {mainChildren}
      </button>
    );
  } else {
    main = (
      <div {...mainProps} aria-disabled={disabled || undefined}>
        {mainChildren}
      </div>
    );
  }

  let end: ReactNode = null;
  if (loading) {
    end = (
      <span className="rebar-list-item-trailing" data-rebar-part="trailing">
        <span className="rebar-list-item-spinner" role="status" aria-label="Working" />
      </span>
    );
  } else if (trailing === "more") {
    end = (
      <span className="rebar-list-item-trailing" data-rebar-part="trailing">
        <button type="button" className="rebar-list-item-more" aria-label={moreLabel} disabled={disabled} onClick={onMore}>
          <MoreDots />
        </button>
      </span>
    );
  } else if (trailing && !chevron) {
    end = (
      <span className="rebar-list-item-trailing" data-rebar-part="trailing">
        {trailing as ReactNode}
      </span>
    );
  }

  return (
    <li ref={ref} className={clsx("rebar-list-item", className)} {...rootMarks} {...props}>
      {main}
      {end}
    </li>
  );
});
