import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="rebar-dialog-overlay" data-rebar-part="overlay" />
        <RadixDialog.Content
          className={clsx("rebar-dialog-content", className)}
          data-rebar-component="dialog"
          aria-modal="true"
        >
          <div className="rebar-dialog-header">
            <RadixDialog.Title asChild>
              <Heading level={2} data-rebar-part="title">
                {title}
              </Heading>
            </RadixDialog.Title>
            <RadixDialog.Close
              className="rebar-dialog-close"
              data-rebar-part="close"
              aria-label="Close"
            >
              ×
            </RadixDialog.Close>
          </div>
          {description ? (
            <RadixDialog.Description data-rebar-part="description">
              {description}
            </RadixDialog.Description>
          ) : null}
          <div className="rebar-dialog-body" data-rebar-part="body">
            {children}
          </div>
          {footer ? (
            <div className="rebar-dialog-footer" data-rebar-part="footer">
              {footer}
            </div>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
