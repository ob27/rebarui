import { forwardRef, isValidElement, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from "react";
import clsx from "clsx";

export interface TopBarEditableTitle {
  editable: true;
  value: string;
  /** Called with the new text when Enter or the check button saves. Escape cancels without calling it. */
  onSave: (value: string) => void;
  /** Hint shown when the title is empty. */
  placeholder?: string;
  /** Accessible name of the title field. Default "Title". */
  label?: string;
}

export interface TopBarProps extends Omit<ComponentPropsWithoutRef<"header">, "title"> {
  /** The left control: `"back"` (calls `onBack`, defaulting to history back), `"menu"` (calls `onMenu`), a node of your own, or `"none"` on a tab root. Default `"none"`. */
  leading?: "back" | "menu" | "none" | ReactNode;
  /** Handler of the built-in back button. Defaults to `history.back()`. */
  onBack?: () => void;
  /** Handler of the built-in menu button. */
  onMenu?: () => void;
  /** The title: serif, one line, ellipsis. Pass `{ editable: true, value, onSave }` for an inline rename field (Enter or the check saves, Escape cancels). */
  title?: ReactNode | TopBarEditableTitle;
  /** A brand mark shown in place of the title (the home screen). */
  logo?: ReactNode;
  /** Title alignment. Centre keeps a 44px spacer so the title stays optically centred. Default `"start"`. */
  align?: "start" | "center";
  /** Icon buttons, a text action or an `ActionSheet` trigger. Up to three 44px items. */
  trailing?: ReactNode;
  /** `"solid"` is the inverse (navy) bar. `"overlay"` floats over a banner image with a scrim and round translucent buttons. Default `"solid"`. */
  tone?: "solid" | "overlay";
  /** Renders the status-bar strip (`env(safe-area-inset-top)`, or `--rebar-top-bar-safe-area`). Default `true`; `false` leaves it out. The strip is part of the bar: there is no separate safe-area component. */
  safeArea?: boolean | "top";
  /** Sticks to the top of the scroll container. Default `true` for solid. */
  sticky?: boolean;
  /** A dot on the trailing buttons (unread, offline). */
  badge?: boolean;
  /** Accessible name of the badge dot. Default "New activity". */
  badgeLabel?: string;
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function isEditableTitle(t: unknown): t is TopBarEditableTitle {
  return typeof t === "object" && t !== null && !isValidElement(t) && (t as TopBarEditableTitle).editable === true;
}

function EditableTitle({ config }: { config: TopBarEditableTitle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(config.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const label = config.label ?? "Title";

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const save = () => {
    setEditing(false);
    if (draft !== config.value) config.onSave(draft);
  };
  const cancel = () => {
    setDraft(config.value);
    setEditing(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  if (!editing) {
    return (
      <h1 className="rebar-top-bar-title" data-rebar-part="title" data-rebar-editable="true">
        <button
          type="button"
          className="rebar-top-bar-title-button"
          aria-label={`${label}: ${config.value || config.placeholder || ""}. Edit`}
          onClick={() => {
            setDraft(config.value);
            setEditing(true);
          }}
        >
          {config.value || <span className="rebar-top-bar-title-placeholder">{config.placeholder}</span>}
        </button>
      </h1>
    );
  }
  return (
    <div className="rebar-top-bar-edit" data-rebar-part="edit">
      <input
        ref={inputRef}
        className="rebar-top-bar-edit-input"
        aria-label={label}
        value={draft}
        autoFocus
        placeholder={config.placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button type="button" className="rebar-top-bar-edit-save" aria-label="Save title" onMouseDown={(e) => e.preventDefault()} onClick={save}>
        <CheckMark />
      </button>
    </div>
  );
}

/**
 * The screen header for a phone: back or menu, a title (or logo), trailing actions, and the status-bar
 * strip. Synthetic: a static composition of a leading control, a title slot and a trailing slot; the
 * only state is the inline-rename field of an editable title.
 */
export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  {
    leading = "none",
    onBack,
    onMenu,
    title,
    logo,
    align = "start",
    trailing,
    tone = "solid",
    safeArea = true,
    sticky,
    badge,
    badgeLabel = "New activity",
    className,
    ...props
  },
  ref,
) {
  const stickyOn = sticky ?? tone === "solid";
  const editable = isEditableTitle(title);

  let lead: ReactNode = null;
  if (leading === "back") {
    lead = (
      <button type="button" className="rebar-top-bar-button" data-rebar-part="leading" aria-label="Back" onClick={onBack ?? (() => window.history.back())}>
        <BackIcon />
      </button>
    );
  } else if (leading === "menu") {
    lead = (
      <button type="button" className="rebar-top-bar-button" data-rebar-part="leading" aria-label="Menu" onClick={onMenu}>
        <MenuIcon />
      </button>
    );
  } else if (leading !== "none" && leading) {
    lead = (
      <span className="rebar-top-bar-leading" data-rebar-part="leading">
        {leading}
      </span>
    );
  }
  const spacerStart = !lead && align === "center";

  return (
    <header
      ref={ref}
      className={clsx("rebar-top-bar", className)}
      data-rebar-component="top-bar"
      data-rebar-tone={tone}
      data-rebar-align={align}
      data-rebar-sticky={stickyOn ? "true" : undefined}
      {...props}
    >
      {safeArea !== false ? <div className="rebar-top-bar-safe-area" data-rebar-part="safe-area" aria-hidden="true" /> : null}
      <div className="rebar-top-bar-bar" data-rebar-part="bar">
        {lead}
        {spacerStart ? <span className="rebar-top-bar-spacer" aria-hidden="true" /> : null}
        {logo ? (
          <span className="rebar-top-bar-logo" data-rebar-part="logo">
            {logo}
          </span>
        ) : editable ? (
          <EditableTitle config={title as TopBarEditableTitle} />
        ) : title ? (
          <h1 className="rebar-top-bar-title" data-rebar-part="title">
            {title as ReactNode}
          </h1>
        ) : (
          <span className="rebar-top-bar-title" aria-hidden="true" />
        )}
        {trailing ? (
          <span className="rebar-top-bar-trailing" data-rebar-part="trailing">
            {trailing}
            {badge ? <span className="rebar-top-bar-badge" data-rebar-part="badge" role="img" aria-label={badgeLabel} /> : null}
          </span>
        ) : align === "center" ? (
          <span className="rebar-top-bar-spacer" aria-hidden="true" />
        ) : null}
      </div>
    </header>
  );
});
