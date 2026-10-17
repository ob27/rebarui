import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { toast } from "./toaster";

export interface ConfirmOptions {
  /** A question, serif and centred: "Delete this discussion?". */
  title: ReactNode;
  /** A short muted line under the title: "This can't be undone." */
  content?: ReactNode;
  /** An optional quoted item (the title of the thing being deleted) in a tinted block. */
  description?: ReactNode;
  /** Default "Confirm", or "Delete" when `destructive` is set. Use the verb: "Remove", "Leave". */
  confirmText?: string;
  /** Default "Cancel". */
  cancelText?: string;
  /** The confirm button in the danger colour, and Cancel focused first. */
  destructive?: boolean;
  /** `"inline"`: two equal buttons. `"stacked"`: full width with confirm on top, for long labels. Default `"inline"`. */
  layout?: "inline" | "stacked";
  /** `"classic"`: the mobile-UI alert (a compact 8px-radius card, bold sans title, a split row of two text buttons under a hairline,
   * confirm bold on the right). Default `"default"`. */
  appearance?: "default" | "classic";
  /** `false`: a tap on the dim layer does not dismiss (Escape still cancels). Default `true`. */
  closeOnMaskClick?: boolean;
  /** Keeps the dialog open, confirm loading and cancel disabled, until this settles. A rejection shows an error toast and stays open. */
  onConfirm?: () => Promise<void> | void;
}

interface Pending {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

let queue: Pending[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => queue;

export type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

/**
 * Asks and waits: resolves `true` on confirm, `false` on cancel, mask tap, Escape or the back button.
 * One dialog at a time; further calls queue. Needs a `ToastProvider` at the app root, which hosts it.
 */
export const confirm: ConfirmFunction = (options) =>
  new Promise<boolean>((resolve) => {
    queue = [...queue, { options, resolve }];
    emit();
  });

/** The hook form of `confirm()`. */
export function useConfirm(): ConfirmFunction {
  return confirm;
}

/** @internal test helper: rejects nothing, resolves every queued call with `false`. */
export function __resetConfirm() {
  queue.forEach((p) => p.resolve(false));
  queue = [];
  emit();
}

function settle(value: boolean) {
  const [head, ...rest] = queue;
  queue = rest;
  emit();
  head?.resolve(value);
}

/** Renders the queued confirm dialog. Mounted by `ToastProvider`. */
export function ConfirmHost() {
  const list = useSyncExternalStore(subscribe, snapshot, snapshot);
  const current = list[0];
  const [busy, setBusy] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const options = current?.options;
  const destructive = options?.destructive;

  const onConfirm = async () => {
    if (!options) return;
    if (options.onConfirm) {
      setBusy(true);
      try {
        await options.onConfirm();
      } catch {
        setBusy(false);
        toast.error("Could not complete that. Try again.");
        return;
      }
      setBusy(false);
    }
    settle(true);
  };

  return (
    <RadixDialog.Root
      open={Boolean(current)}
      onOpenChange={(next) => {
        if (!next && !busy) settle(false);
      }}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="rebar-dialog-overlay" data-rebar-part="overlay" data-rebar-appearance={options?.appearance === "classic" ? "classic" : undefined} />
        <RadixDialog.Content
          className={clsx("rebar-confirm")}
          data-rebar-component="confirm"
          data-rebar-destructive={destructive ? "true" : undefined}
          data-rebar-layout={options?.layout === "stacked" ? "stacked" : "inline"}
          data-rebar-appearance={options?.appearance === "classic" ? "classic" : undefined}
          aria-busy={busy || undefined}
          onOpenAutoFocus={(event) => {
            if (destructive && cancelRef.current) {
              event.preventDefault();
              cancelRef.current.focus();
            }
          }}
          onEscapeKeyDown={(e) => busy && e.preventDefault()}
          onInteractOutside={(e) => (busy || options?.closeOnMaskClick === false) && e.preventDefault()}
        >
          <RadixDialog.Title className="rebar-confirm-title" data-rebar-part="title">
            {options?.title}
          </RadixDialog.Title>
          {options?.content ? (
            <RadixDialog.Description className="rebar-confirm-content" data-rebar-part="content">
              {options.content}
            </RadixDialog.Description>
          ) : (
            <RadixDialog.Description className="rebar-confirm-sr-only">{String(typeof options?.title === "string" ? options.title : "Confirm")}</RadixDialog.Description>
          )}
          {options?.description ? (
            <div className="rebar-confirm-quote" data-rebar-part="description">
              {options.description}
            </div>
          ) : null}
          <div className="rebar-confirm-actions" data-rebar-part="actions">
            <button
              type="button"
              className="rebar-button rebar-confirm-button"
              data-rebar-component="button"
              data-rebar-variant={destructive ? "destructive-solid" : "primary"}
              data-rebar-size="md"
              data-rebar-part="confirm"
              data-rebar-state={busy ? "loading" : "idle"}
              aria-busy={busy || undefined}
              disabled={busy}
              onClick={onConfirm}
            >
              {busy ? <span className="rebar-confirm-spinner" aria-hidden="true" /> : null}
              {options?.confirmText ?? (destructive ? "Delete" : "Confirm")}
            </button>
            <button
              ref={cancelRef}
              type="button"
              className="rebar-button rebar-confirm-button"
              data-rebar-component="button"
              data-rebar-variant="secondary"
              data-rebar-size="md"
              data-rebar-part="cancel"
              disabled={busy}
              onClick={() => settle(false)}
            >
              {options?.cancelText ?? "Cancel"}
            </button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
