import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import { DrawerPanel } from "./Drawer";
import { defaultRenderLink, useRenderLink } from "./linkAdapter";
import type { RenderLink } from "./linkAdapter";

export interface ActionSheetAction {
  /** Row text. */
  label: ReactNode;
  /** What the row is. `"item"` (default) is a button or link. `"info"` is a static, non-interactive line (muted, no hover). `"divider"` is a full-bleed band between groups (no label needed). */
  type?: "item" | "info" | "divider";
  /** Called when the row is chosen. If it returns a promise the row is `loading` until it settles (and the sheet cannot be dismissed meanwhile). */
  onSelect?: () => void | Promise<void>;
  destructive?: boolean;
  /** A 24px leading icon. */
  icon?: ReactNode;
  /** A link item: navigates (`target="_blank"` shows an external-link glyph) and closes the sheet. */
  href?: string;
  target?: string;
  /** Link adapter for `href` (`NavBar`'s `renderLink` shape). */
  renderLink?: RenderLink;
  /** A spinner replaces the icon, the label stays, other taps are ignored. */
  loading?: boolean;
  /** Dimmed and not focusable. */
  disabled?: boolean;
  /** Short text at the end of the row, e.g. why it is disabled ("Available on Plus"). */
  hint?: ReactNode;
}

export interface ActionSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: ReactNode;
  /** The rows of the sheet. `items` is an alias; give one of them. */
  actions?: ActionSheetAction[];
  /** Alias of `actions`. */
  items?: ActionSheetAction[];
  /** Label for the separate, visually-distinct dismiss button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Renders the sheet inside this (positioned) element instead of `document.body`, e.g. a `DeviceFrame` screen. See `DrawerProps.container`. */
  container?: HTMLElement | null;
  /** Close the sheet after a row is chosen. Default `true`; set `false` when a row opens follow-up UI that keeps the sheet (a confirm). A promise-returning `onSelect` closes it when settled. */
  closeOnSelect?: boolean;
  /** Set `false` to refuse mask tap, swipe and Cancel (it is `false` by itself while a row is loading). */
  dismissible?: boolean;
}

function ExternalGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
function RowSpinner() {
  return <span className="rebar-action-sheet-spinner" data-rebar-part="spinner" aria-hidden="true" />;
}

/**
 * `BottomSheet`-shaped, but its content is a fixed list of actions rather than arbitrary
 * children. Each action renders as a real, full-width, minimum-44px-tall button — destructive
 * ones reuse `Button`'s own `variant="destructive"` visual treatment — plus a separate,
 * visually-separated Cancel button. Rows can also be static info lines, dividers, links, or
 * loading while an async `onSelect` settles. Selecting an action (or Cancel) closes the sheet unless
 * `closeOnSelect` is off, so this component holds its own controlled/uncontrolled open state (the
 * same `isControlled`/`internalOpen`/`currentOpen`/`handleOpenChange` pattern every stateful rebar-ui
 * component uses) and always drives `DrawerPanel` in "controlled" mode underneath it.
 */
export function ActionSheet({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  actions,
  items,
  cancelLabel = "Cancel",
  container,
  closeOnSelect = true,
  dismissible = true,
}: ActionSheetProps) {
  const contextRenderLink = useRenderLink(undefined, defaultRenderLink);
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const [pending, setPending] = useState<number | null>(null);
  const currentOpen = isControlled ? open : internalOpen;
  const rows = actions ?? items ?? [];
  const busy = pending !== null || rows.some((r) => r.loading);

  const handleOpenChange = (next: boolean) => {
    if (!next && (!dismissible || busy)) return;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const forceClose = () => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  };

  const handleSelect = (action: ActionSheetAction, index: number) => {
    if (busy) return;
    const result = action.onSelect?.();
    if (result && typeof (result as Promise<void>).then === "function") {
      setPending(index);
      (result as Promise<void>).then(
        () => {
          setPending(null);
          if (closeOnSelect) forceClose();
        },
        () => setPending(null),
      );
      return;
    }
    if (closeOnSelect) forceClose();
  };

  return (
    <DrawerPanel
      open={currentOpen}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title={title}
      container={container}
      side="bottom"
      dataComponent="action-sheet"
      dragToDismiss
      handle={<div className="rebar-bottom-sheet-handle" data-rebar-part="handle" aria-hidden="true" />}
    >
      <div className="rebar-action-sheet-list" data-rebar-part="actions">
        {rows.map((action, i) => {
          const type = action.type ?? "item";
          if (type === "divider") {
            return <div key={`divider-${i}`} className="rebar-action-sheet-divider" data-rebar-part="divider" role="separator" />;
          }
          if (type === "info") {
            return (
              <div key={`info-${i}`} className="rebar-action-sheet-info" data-rebar-part="info">
                {action.icon ? <span className="rebar-action-sheet-icon" aria-hidden="true">{action.icon}</span> : null}
                <span className="rebar-action-sheet-label">{action.label}</span>
              </div>
            );
          }
          const loading = action.loading || pending === i;
          const disabled = action.disabled;
          const itemClass = clsx(
            "rebar-action-sheet-item",
            action.destructive && "rebar-action-sheet-item-destructive",
            loading && "rebar-action-sheet-item-loading",
          );
          const content = (
            <>
              {loading ? (
                <RowSpinner />
              ) : action.icon ? (
                <span className="rebar-action-sheet-icon" data-rebar-part="icon" aria-hidden="true">
                  {action.icon}
                </span>
              ) : null}
              <span className="rebar-action-sheet-label">{action.label}</span>
              {action.hint || (action.href && action.target === "_blank") ? (
                <span className="rebar-action-sheet-end" data-rebar-part="hint">
                  {action.hint}
                  {action.href && action.target === "_blank" ? <ExternalGlyph /> : null}
                </span>
              ) : null}
            </>
          );
          const marks = {
            className: itemClass,
            "data-rebar-part": "action",
            "data-rebar-state": loading ? "loading" : undefined,
            "aria-busy": loading || undefined,
          };
          if (action.href !== undefined && !disabled) {
            const render = action.renderLink ?? contextRenderLink;
            return (
              <span key={`${String(action.label)}-${i}`} className="rebar-action-sheet-link-wrap" style={{ display: "contents" }}>
                {render({
                  ...marks,
                  href: action.href,
                  target: action.target,
                  children: content,
                  onClick: () => {
                    action.onSelect?.();
                    if (closeOnSelect) forceClose();
                  },
                } as never)}
              </span>
            );
          }
          return (
            <button
              key={`${String(action.label)}-${i}`}
              type="button"
              {...marks}
              disabled={disabled}
              aria-disabled={loading || undefined}
              onClick={() => handleSelect(action, i)}
            >
              {content}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="rebar-action-sheet-cancel"
        data-rebar-part="cancel"
        disabled={busy}
        onClick={() => handleOpenChange(false)}
      >
        {cancelLabel}
      </button>
    </DrawerPanel>
  );
}
