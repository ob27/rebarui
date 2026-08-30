import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

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
  /** Force bionic reading on/off for the title/description, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
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
  bionic,
  bionicOptions,
  className,
}: DialogProps) {
  const descriptionContent = useBionicChildren(description, bionic, bionicOptions);
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
              <Heading level={2} data-rebar-part="title" bionic={bionic} bionicOptions={bionicOptions}>
                {title}
              </Heading>
            </RadixDialog.Title>
            <RadixDialog.Close
              className="rebar-dialog-close"
              data-rebar-part="close"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </RadixDialog.Close>
          </div>
          {description ? (
            <RadixDialog.Description data-rebar-part="description">
              {descriptionContent}
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
